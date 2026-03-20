import { NextRequest, NextResponse } from 'next/server'

// ──────────────────────────────────────────────────────────────────────────────
// XORIA Chat API — Multi-model routing + Tavily external search
// Routing: Groq → rápido/clasificación | Anthropic → análisis | OpenAI → default
// ──────────────────────────────────────────────────────────────────────────────

type ModelProvider = 'groq' | 'anthropic' | 'openai'

function selectModel(message: string, context: Record<string, unknown>): ModelProvider {
  const msg = message.toLowerCase()
  const perfil = (context?.perfil as string) || ''

  // Groq: clasificación, consultas rápidas, respuestas cortas
  if (
    msg.includes('cuántos') || msg.includes('cuántas') || msg.includes('total de') ||
    msg.includes('lista de') || msg.includes('resumen rápido') || msg.includes('status') ||
    msg.length < 60
  ) return 'groq'

  // Anthropic: análisis complejos, siniestros, underwriting, reportes
  if (
    perfil.includes('_claims') || perfil.includes('_uw') || perfil.includes('financiero') ||
    msg.includes('analiza') || msg.includes('compara') || msg.includes('riesgo') ||
    msg.includes('dictamen') || msg.includes('recomendación') || msg.includes('estrategia')
  ) return 'anthropic'

  // OpenAI default (XORIA principal)
  return 'openai'
}

async function searchTavily(query: string): Promise<string> {
  const tavilyKey = process.env.TAVILY_API_KEY
  if (!tavilyKey) return ''
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: `seguros México ${query}`,
        search_depth: 'basic',
        max_results: 3,
        include_answer: true,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ''
    const data = await res.json()
    const answer = data.answer || ''
    const snippets = (data.results || []).slice(0, 2).map((r: { content: string; url: string }) => `• ${r.content?.slice(0, 150)}…`).join('\n')
    return answer ? `Información actualizada:\n${answer}\n${snippets}` : snippets
  } catch {
    return ''
  }
}

function needsExternalSearch(message: string): boolean {
  const msg = message.toLowerCase()
  return (
    msg.includes('regulación') || msg.includes('cnsf') || msg.includes('circular') ||
    msg.includes('amis') || msg.includes('solvencia') || msg.includes('normativa') ||
    msg.includes('tasa') || msg.includes('tarifa') || msg.includes('mercado') ||
    msg.includes('competencia') || msg.includes('gnp') || msg.includes('axxa') ||
    msg.includes('metlife') || msg.includes('mapfre') || msg.includes('boletín')
  )
}

function buildSystemPrompt(context: Record<string, unknown>, externalInfo: string): string {
  const perfil = (context?.perfil as string) || 'agente'

  const perfilInstrucciones: Record<string, string> = {
    aseguradora_uw: 'Eres experto en suscripción de seguros. Analiza solicitudes, scores de riesgo, expedientes y recomienda decisiones de aprobación/rechazo basadas en los datos del contexto.',
    aseguradora_polizas: 'Eres experto en administración de pólizas. Ayudas con endosos, renovaciones, cancelaciones y seguimiento de cartera.',
    aseguradora_billing: 'Eres experto en cobranza y comisiones de seguros. Analiza primas cobradas, vencidas, comisiones y eficiencia de cobro.',
    aseguradora_claims: 'Eres experto en siniestros. Analiza reclamaciones, reservas técnicas, tiempos de resolución y recomienda acciones a los ajustadores.',
    aseguradora_red: 'Eres experto en redes de distribución de seguros. Analiza el desempeño de promotorias y agentes, rankings, cumplimiento de metas y estrategias de crecimiento.',
    agente: 'Eres copiloto ejecutivo del agente. Ayudas con cartera, clientes, renovaciones, correos y agenda.',
    promotoria: 'Eres asistente de la promotoria. Ayudas con gestión de agentes, producción, comisiones y reportes.',
  }

  const instruccion = perfilInstrucciones[perfil] || perfilInstrucciones['agente']

  return `Eres XORIA, copiloto de inteligencia artificial del Insurance Agent OS (IAOS) para GNP Seguros México.
${instruccion}

REGLAS:
- Siempre en español, profesional y conciso.
- Sin asteriscos dobles (**) ni markdown. Solo texto plano con saltos de línea.
- Usa los datos del contexto. Si la respuesta está ahí, cítala con precisión (nombres, montos, fechas reales).
- Máximo 200 palabras a menos que se pida documento completo.
- Cuando propongas acciones, termina con "¿Confirmas?" o "¿Lo hago?"

${externalInfo ? `\nINFORMACIÓN EXTERNA ACTUALIZADA (Tavily):\n${externalInfo}\n` : ''}

CONTEXTO DEL SISTEMA:
${JSON.stringify(context || {})}`
}

async function callGroq(systemPrompt: string, messages: { role: string; content: string }[]): Promise<string | null> {
  const key = process.env.GROQ_API_KEY
  if (!key) return null
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 500,
        temperature: 0.5,
      }),
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch { return null }
}

async function callAnthropic(systemPrompt: string, messages: { role: string; content: string }[]): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
        max_tokens: 600,
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.content?.[0]?.text || null
  } catch { return null }
}

async function callOpenAI(systemPrompt: string, messages: { role: string; content: string }[]): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 600,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch { return null }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Support both {messages, context} and {message, context} shapes
    const context: Record<string, unknown> = body.context || {}
    const messages: { role: string; content: string }[] = body.messages ||
      (body.message ? [{ role: 'user', content: body.message }] : [])

    if (!messages.length) {
      return NextResponse.json({ reply: 'Sin mensaje recibido.', response: 'Sin mensaje recibido.' })
    }

    const lastMessage = messages[messages.length - 1]?.content || ''

    // 1. Tavily external search if needed
    let externalInfo = ''
    if (needsExternalSearch(lastMessage)) {
      externalInfo = await searchTavily(lastMessage)
    }

    // 2. Build system prompt
    const systemPrompt = buildSystemPrompt(context, externalInfo)

    // 3. Route to best model
    const provider = selectModel(lastMessage, context)

    let reply: string | null = null

    if (provider === 'groq') {
      reply = await callGroq(systemPrompt, messages)
      if (!reply) reply = await callOpenAI(systemPrompt, messages)
    } else if (provider === 'anthropic') {
      reply = await callAnthropic(systemPrompt, messages)
      if (!reply) reply = await callOpenAI(systemPrompt, messages)
    } else {
      reply = await callOpenAI(systemPrompt, messages)
      if (!reply) reply = await callGroq(systemPrompt, messages)
      if (!reply) reply = await callAnthropic(systemPrompt, messages)
    }

    if (reply) {
      return NextResponse.json({ reply, response: reply, model: provider })
    }

    // 4. Demo fallback sin APIs
    const msg = lastMessage.toLowerCase()
    let fallback = ''
    if (msg.includes('solicitud') || msg.includes('riesgo') || msg.includes('score')) {
      fallback = 'Tienes 2 solicitudes pendientes de alta prioridad: SOL-2026-0041 (Carlos Méndez, score 88, Bajo riesgo) y SOL-2026-0035 (Patricia Leal, score 67, Medio riesgo). Ambas están completas en documentación. ¿Las proceso?'
    } else if (msg.includes('poliza') || msg.includes('póliza') || msg.includes('venc')) {
      fallback = 'Cartera activa: 5 pólizas vigentes, 2 por renovar (Sofía Torres → 15 Ene 2027, Empresa Textil → 01 Mar 2026). La más urgente es Empresa Textil S.A. ¿Iniciamos renovación?'
    } else if (msg.includes('cobr') || msg.includes('prima') || msg.includes('pago')) {
      fallback = 'Efectividad de cobranza actual: 80%. Primas cobradas: $149,700 de $202,900. Cuentas vencidas: Empresa Textil ($42,000) y Patricia Leal ($9,200). ¿Notifico a los agentes?'
    } else if (msg.includes('siniest')) {
      fallback = 'ClaimCenter activo: 7 siniestros. Reserva técnica estimada: $685,700. 2 casos con más de 10 días abiertos: SIN-2026-0015 (Sofía Torres, 13 días) y SIN-2026-0013 (Patricia Leal, 20 días). ¿Los priorizo?'
    } else if (msg.includes('agente') || msg.includes('promotoria') || msg.includes('red')) {
      fallback = 'Red activa: 5 promotorias, 7 agentes. Top productor: Valeria Castillo ($284,000, 114% de meta). Promotoria líder: Promotoria Vidal Grupo ($842,000). ¿Quieres el reporte completo?'
    } else {
      fallback = 'XORIA conectada. Módulo activo: Aseguradora GNP. Tengo visibilidad de Underwriting, PolicyCenter, BillingCenter, ClaimCenter y Red de Distribución. ¿En qué área trabajamos?'
    }

    return NextResponse.json({ reply: fallback, response: fallback, demo: true })

  } catch (error) {
    console.error('XORIA API error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
