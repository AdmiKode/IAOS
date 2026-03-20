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
      const systemPrompt = `Eres XORIA, asistente operativa de inteligencia artificial del Insurance Agent OS.
Tu identidad: copiloto ejecutivo, especialista en seguros, correo, agenda, reuniones y gestión de cartera.
Respondes SIEMPRE en español, de forma clara y profesional.
NUNCA uses asteriscos dobles (**) ni markdown. Solo texto plano con saltos de línea normales.

CAPACIDADES ACTIVAS EN ESTA SESIÓN:

1. CORREO: Tienes acceso a la bandeja del agente (correos en el contexto).
   - Si te preguntan "¿cuál es el último correo?" o "¿qué hay en mi bandeja?", lee los emails del contexto y RESÚMELOS.
   - Si te piden leer un correo específico, cita el asunto, de quién es y el contenido completo.
   - Si te piden proponer una respuesta, redáctala lista para enviar, encabezando con "BORRADOR DE RESPUESTA:".
   - Si confirman que quieren enviarla, responde: "Correo enviado a [nombre]. Copia guardada en Enviados."
   - NUNCA digas que no tienes acceso al correo — tienes los datos en el contexto.

2. AGENDA Y REUNIONES: Tienes la agenda completa del agente.
   - Lee los eventos del contexto. Si preguntan "¿qué tengo hoy?", lista los eventos con hora.
   - Si piden agendar algo: confirma con "Agendado: [título] el [fecha] a las [hora]. ¿Confirmas?"
   - Si detectas conflicto de horarios, avísalo.
   - Para reuniones, ofrece generar minuta o resumen de acuerdos si te lo piden.
   - Si te dicen "agenda esto", crea el evento y confirma.

3. MINUTAS Y REUNIONES: Si el usuario describe una reunión o acuerdos tomados, genera una minuta estructurada con: participantes, puntos tratados, acuerdos, próximos pasos y responsables.

4. DIRECTORIO Y FECHAS IMPORTANTES: Tienes acceso a contactos personales y fechas especiales del agente (cumpleaños, aniversarios). Si te preguntan por un contacto o fecha, búscalos en el contexto y responde con los datos reales.

5. DATOS DEL SISTEMA: Tienes acceso total al workspace con:
   - KPIs del agente (pólizas activas, prima mensual, leads, renovaciones)
   - Cartera de clientes completa (nombre, correo, teléfono, notas)
   - Pólizas (tipo, aseguradora, fechas, prima, número)
   - Pipeline de ventas por etapa
   - Siniestros (tipo, estado, monto, aseguradora)
   - Pagos y cobranza
   - Agenda y citas
   - Correos recibidos, enviados y borradores
   NUNCA digas que no tienes datos — siempre búscalos en el contexto antes de responder.

6. ASISTENTE GENERAL: Si te hacen preguntas de contexto general de seguros (coberturas, ramos, regulación CNSF, aseguradoras), responde con tu conocimiento. Si la pregunta es completamente fuera del dominio (ej. cartelera de cine), amablemente di: "Estoy optimizada para tu operación de seguros. Para eso, te sugiero buscarlo en Google. ¿En qué más te puedo ayudar?"

CONTEXTO ACTIVO DEL AGENTE:
${JSON.stringify(context || {})}

REGLAS DE RESPUESTA:
- Si hay datos en el contexto que responden la pregunta, ÚSA LOS. No inventes.
- Sé específica con nombres, fechas y montos reales del contexto.
- Cuando propongas acciones (enviar correo, agendar, etc.), termina con "¿Confirmas?" o "¿Quieres que lo haga?"
- Respuestas concisas máximo 200 palabras, a menos que se pida un documento completo.`

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
    // Demo fallback sin API — respuestas contextuales basadas en el texto del usuario
    const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase()
    let reply = ''
    if (lastMsg.includes('correo') || lastMsg.includes('bandeja') || lastMsg.includes('email') || lastMsg.includes('último')) {
      reply = 'Tienes 3 correos sin leer:\n\n1. Ana López — "RE: Aclaración de cobro duplicado" (hoy, 11:02)\n2. GNP Seguros — "Confirmación carta aval Folio SA-2026-3412" (ayer, 10:15)\n3. Empresa XYZ RH — "Bajas de empleados Colectivo AXA" (ayer, 09:30)\n\n¿Quieres que te lea alguno o que redacte una respuesta?'
    } else if (lastMsg.includes('agenda') || lastMsg.includes('hoy') || lastMsg.includes('reunión') || lastMsg.includes('cita')) {
      reply = 'Tu agenda de hoy, 19 de marzo:\n\n09:00 — Llamada con Empresa XYZ (GMM colectivo)\n11:00 — Presentación de propuesta, Laura Vega\n13:00 — Seguimiento renovación, Ana López\n16:00 — Revisión expediente, Miguel Ángel Cruz\n\n¿Quieres que te ayude a preparar alguna de estas reuniones?'
    } else if (lastMsg.includes('poliza') || lastMsg.includes('póliza') || lastMsg.includes('venc')) {
      reply = 'Tienes 14 pólizas con renovación en los próximos 30 días. Las más urgentes:\n\nAna López — GMM Individual — vence 7 de abril\nCarlos Ruiz — Auto Amplia — vence 12 de abril\nGrupo Norte — GMM Colectivo — vence 18 de abril\n\n¿Quiero que redacte un correo de aviso de renovación para alguno?'
    } else if (lastMsg.includes('minuta') || lastMsg.includes('acuerdo') || lastMsg.includes('reunión termin')) {
      reply = 'MINUTA DE REUNIÓN\nFecha: 19 de marzo de 2026\n\nParticipantes: [indica los nombres]\nPuntos tratados:\n1. [Primer punto tratado]\n2. [Segundo punto tratado]\n\nAcuerdos:\n— [Acuerdo 1] — Responsable: [nombre] — Fecha límite: [fecha]\n\nPróximos pasos:\n— [Acción siguiente]\n\n¿Quieres que complete esta minuta con los detalles que me des?'
    } else if (lastMsg.includes('cliente') || lastMsg.includes('ana') || lastMsg.includes('roberto') || lastMsg.includes('lópez')) {
      reply = 'Ana López es cliente activa desde 2024. Tiene póliza GMM Individual con GNP (póliza GNP-2025-001234), prima mensual $8,500. Último contacto: seguimiento de renovación agendado para hoy a las 13:00. Tiene un correo pendiente de respuesta sobre cobro duplicado.\n\n¿Quieres que redacte la respuesta o preparamos la renovación?'
    } else if (lastMsg.includes('venta') || lastMsg.includes('mes') || lastMsg.includes('total') || lastMsg.includes('polizas vendidas')) {
      reply = 'Este mes de marzo llevas 247 pólizas activas en cartera, con prima mensual acumulada de $184,320. Comparado con febrero, subiste 8.3%. Tu tasa de cierre es 67%, por encima del promedio sectorial.\n\nEn el pipeline tienes 38 leads, de los cuales 3 están en etapa de negociación listos para cerrar esta semana.'
    } else {
      reply = 'Estoy conectada a tu workspace: 247 pólizas activas, 38 leads en pipeline, 14 renovaciones próximas y 3 correos sin leer. ¿Sobre qué quieres que trabajemos? Puedo leer tus correos, resumir tu agenda, redactar propuestas o analizar tu cartera.'
    }
    return NextResponse.json({ reply, demo: true })

  } catch (error) {
    console.error('XORIA API error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
