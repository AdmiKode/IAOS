import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    // Intentar ALEON API primero
    const aleonUrl = process.env.ALEON_API_URL
    const aleonToken = process.env.SERVICE_TOKEN_ALEON

    if (aleonUrl && aleonToken && aleonToken !== 'your-aleon-token') {
      try {
        const res = await fetch(`${aleonUrl}/v1/xoria/chat`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${aleonToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages, context }),
          signal: AbortSignal.timeout(10000),
        })
        if (res.ok) {
          const data = await res.json()
          return NextResponse.json({ reply: data.reply || data.content || data.message })
        }
      } catch {
        // ALEON no disponible — fallback a OpenAI
      }
    }

    // Fallback: OpenAI GPT-4o
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey) {
      const systemPrompt = `Eres XORIA, el copiloto de inteligencia artificial del Insurance Agent OS.
Eres especialista en seguros, ventas, gestión de clientes y análisis de carteras.
Respondes en español, de forma clara, concisa y profesional.
NUNCA uses asteriscos dobles (**) ni markdown — responde con texto plano y saltos de línea normales.
Tienes acceso completo al workspace del agente con los siguientes datos:
- Clientes (clients): nombre, correo, teléfono, score, etiquetas, notas
- Pólizas (policies): cliente, tipo, aseguradora, estado, fechas inicio/vencimiento, prima, suma asegurada, número de póliza
- Tickets (tickets): cliente, asunto, estado, prioridad, fecha
- Siniestros (siniestros): cliente, tipo, descripción, fecha, estado, monto, aseguradora
- Pagos (payments): cliente, concepto, monto, fecha vencimiento, estado
- Agenda (agenda): título, hora, tipo, cliente
- KPIs y pipeline de ventas

Contexto actual del agente: ${JSON.stringify(context || {})}

Cuando el agente pregunte por un cliente específico, usa los datos del contexto para responder con información real.
Cuando pregunten por pólizas por vencer, busca en policies las que tienen endDate próxima.
Cuando pregunten por siniestros o evidencia, usa los datos de siniestros del contexto.
Ayuda al agente a tomar decisiones, analizar prospectos, redactar propuestas y optimizar su operación.`

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(15000),
      })

      if (res.ok) {
        const data = await res.json()
        const reply = data.choices?.[0]?.message?.content || 'Sin respuesta.'
        return NextResponse.json({ reply })
      }
    }

    // Demo fallback sin API
    const demoReplies = [
      'Basándome en tu pipeline actual, recomiendo priorizar los 3 prospectos en etapa de propuesta. La ventana de cierre óptima es esta semana.',
      'Tu tasa de conversión del 24% está por encima del promedio sectorial. El producto de mayor rentabilidad en tu cartera es Vida Temporal.',
      'He analizado tu agenda. Tienes 4 compromisos hoy. Te sugiero preparar la propuesta para González & Asociados antes de las 15:00.',
      'El cliente Ana López tiene su póliza de Auto por renovar en 18 días. Es una oportunidad de upsell hacia el paquete Premium.',
    ]
    const reply = demoReplies[Math.floor(Math.random() * demoReplies.length)]
    return NextResponse.json({ reply, demo: true })

  } catch (error) {
    console.error('XORIA API error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
