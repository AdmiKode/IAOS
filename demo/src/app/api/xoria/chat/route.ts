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
    perfil.includes('aseguradora_core') || perfil.includes('_core') ||
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
    aseguradora_core: 'Eres copiloto corporativo de aseguradora. Priorizas operación de core asegurador: suscripción, administración de pólizas, cobranza, siniestros, SLA de ajustadores, red comercial y reportes exportables.',
    aseguradora_uw: 'Eres experto en suscripción de seguros. Analiza solicitudes, scores de riesgo, expedientes y recomienda decisiones de aprobación/rechazo basadas en los datos del contexto.',
    aseguradora_polizas: 'Eres experto en administración de pólizas. Ayudas con endosos, renovaciones, cancelaciones y seguimiento de cartera.',
    aseguradora_billing: 'Eres experto en cobranza y comisiones de seguros. Analiza primas cobradas, vencidas, comisiones y eficiencia de cobro.',
    aseguradora_claims: 'Eres experto en siniestros. Analiza reclamaciones, reservas técnicas, tiempos de resolución y recomienda acciones a los ajustadores.',
    aseguradora_red: 'Eres experto en redes de distribución de seguros. Analiza el desempeño de promotorias y agentes, rankings, cumplimiento de metas y estrategias de crecimiento.',
    agente: 'Eres copiloto ejecutivo del agente de seguros. Ayudas con cartera, clientes, renovaciones, cotizaciones, correos y agenda.',
    promotoria: 'Eres asistente de la promotoria. Ayudas con gestión de agentes, producción, comisiones y reportes.',
  }

  const instruccion = perfilInstrucciones[perfil] || perfilInstrucciones['agente']

  return `Eres XORIA, copiloto de inteligencia artificial del Insurance Agent OS (IAOS) para el mercado de seguros en México.
${instruccion}

PERSONALIDAD:
- Hablas como un colega experto en seguros, no como un robot corporativo.
- Eres directo, cálido y útil. Usas lenguaje natural en español mexicano.
- Cuando alguien pide ayuda para redactar algo, LO REDACTAS completo, no preguntas si quieres que lo hagas.
- Cuando alguien pide información de su agenda o reuniones, das una respuesta honesta basada en el contexto disponible.
- Si no tienes un dato específico, lo dices claramente: "No tengo ese dato en tu sistema ahora mismo".
- Nunca inventas datos concretos (nombres de clientes, montos exactos, fechas) que no estén en el contexto.
- Eres conciso: máximo 180 palabras salvo que pidan un documento completo.

FORMATO:
- Sin asteriscos (**), sin markdown, sin headers con #. Solo texto plano con saltos de línea.
- No termines con "¿Lo hago?" ni "¿Confirmas?" — actúa directamente.
- Si el usuario pide redactar un correo, propuesta o documento, escríbelo completo y listo para usar.

${externalInfo ? `\nINFORMACIÓN EXTERNA (Tavily):\n${externalInfo}\n` : ''}

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

// Strip markdown formatting from AI responses
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold** → bold
    .replace(/\*(.+?)\*/g, '$1')        // *italic* → italic
    .replace(/#{1,6} (.+)/g, '$1')      // ## Heading → Heading
    .replace(/`([^`]+)`/g, '$1')            // `code` → code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // [link](url) → link
    .replace(/^\s*[-*+] /gm, '• ')      // - item → • item
    .trim()
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
      const clean = stripMarkdown(reply)
      return NextResponse.json({ reply: clean, response: clean, model: provider })
    }

    // 4. Demo fallback sin APIs — responde coherentemente según la pregunta real
    const msg = lastMessage.toLowerCase()
    let fallback = ''

    if (msg.includes('reun') || msg.includes('cita') || msg.includes('agenda') || msg.includes('hoy') || msg.includes('mañana')) {
      fallback = 'No tengo acceso a tu calendario en este momento — las integraciones con Google Calendar y Outlook se activan en la versión conectada. Lo que sí puedo ver es que tienes 2 renovaciones próximas esta semana y 38 leads activos en pipeline. ¿Te ayudo con algo de eso?'
    } else if (msg.includes('propuesta') || msg.includes('redact') || msg.includes('correo') || msg.includes('carta')) {
      const ramo = msg.includes('vida') ? 'Vida' : msg.includes('gmm') || msg.includes('médico') ? 'GMM' : msg.includes('auto') ? 'Auto' : 'Seguros'
      fallback = `Aquí está tu propuesta de ${ramo}:\n\nEstimado cliente,\n\nEs un gusto presentarle nuestra propuesta de seguro de ${ramo} diseñada especialmente para sus necesidades.\n\n[Complementa con los datos del prospecto y la suma asegurada para personalizar]\n\nQuedamos a sus órdenes para cualquier aclaración.\n\nSaludos,\n${context?.agente || 'Tu agente de seguros'}`
    } else if (msg.includes('poliza') || msg.includes('póliza') || msg.includes('venc') || msg.includes('renov')) {
      fallback = 'Tienes pólizas próximas a vencer este mes. Para ver el detalle exacto con nombres y fechas, conecta XORIA con tu CRM desde Configuración. Por ahora puedes revisar el módulo de Renovaciones en el menú lateral.'
    } else if (msg.includes('cobr') || msg.includes('prima') || msg.includes('pago') || msg.includes('vencid')) {
      fallback = 'El módulo de Cobranza tiene tu cartera completa con los saldos pendientes. Para que XORIA te dé los montos exactos necesita estar conectada a tu base de datos — configúralo en Ajustes → Integraciones.'
    } else if (msg.includes('siniest') || msg.includes('reclamac') || msg.includes('claim')) {
      fallback = 'Los siniestros activos están en el módulo de Siniestros. Sin conexión al sistema central no puedo darte los números exactos, pero puedo ayudarte a redactar comunicaciones, analizar coberturas o preparar documentación.'
    } else if (msg.includes('cliente') || msg.includes('prospecto') || msg.includes('contacto')) {
      fallback = 'Puedo ayudarte a buscar clientes, preparar propuestas o redactar correos de seguimiento. ¿Tienes el nombre o datos del cliente con quien quieres trabajar?'
    } else if (msg.includes('cotiz') || msg.includes('prima') || msg.includes('precio') || msg.includes('costo')) {
      fallback = 'Para cotizar usa el módulo de Nueva Venta — tienes el cotizador de Auto con cálculo actuarial en tiempo real. También puedo ayudarte a estimar coberturas si me das los datos del riesgo.'
    } else if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buen dia') || msg.includes('buen día')) {
      fallback = `Hola, ¿cómo estás? Soy XORIA, tu copiloto de seguros. Puedo ayudarte a cotizar, redactar propuestas, revisar tu cartera o preparar correos para clientes. ¿Por dónde empezamos?`
    } else {
      fallback = 'Entendido. Para darte una respuesta precisa necesito estar conectada a tu sistema — configura las integraciones en Ajustes. Mientras tanto, puedo ayudarte a redactar documentos, analizar coberturas o preparar comunicaciones con clientes. ¿Qué necesitas?'
    }

    return NextResponse.json({ reply: stripMarkdown(fallback), response: stripMarkdown(fallback), demo: true })

  } catch (error) {
    console.error('XORIA API error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
