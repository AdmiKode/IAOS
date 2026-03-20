'use client'

import { useMemo, useState } from 'react'
import { Bot, Mic, MicOff, Send, Volume2 } from 'lucide-react'
import {
  agentPerformance,
  billingRecords,
  claimsCases,
  executiveKpis,
  policyRecords,
  promotoriaPerformance,
  underwritingCases,
  xoriaCorporatePrompts,
} from '@/data/carrier-core'
import { Panel } from '@/components/insurance/CarrierUi'
import { exportCsvReport } from '@/lib/exportReports'
import { useVoiceIO } from '@/lib/useVoiceIO'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function CarrierXoriaPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId('assistant'),
      role: 'assistant',
      content:
        'Xoria corporativa lista. Puedo analizar underwriting, polizas, cobranza, siniestros y red comercial. Indica la accion operativa.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const pendingBillingRows = useMemo(
    () => billingRecords.filter((row) => row.status === 'pendiente' || row.status === 'fallido'),
    [],
  )

  const { isListening, toggleListen, supported, speak } = useVoiceIO({
    lang: 'es-MX',
    onTranscript: (text, isFinal) => {
      if (!isFinal) return
      setInput(text)
    },
  })

  async function handleSend(raw?: string) {
    const message = (raw ?? input).trim()
    if (!message || loading) return

    const userMessage: ChatMessage = { id: createId('user'), role: 'user', content: message }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    if (message.toLowerCase().includes('exporta cobranza pendiente')) {
      exportCsvReport(
        pendingBillingRows.map((row) => ({
          cobranza_id: row.id,
          poliza: row.policyId,
          asegurado: row.insuredName,
          prima_esperada: row.expectedAmount,
          estatus: row.status,
        })),
        'cobranza_pendiente_semana',
      )

      const reply = 'Cobranza pendiente exportada en CSV. Incluye pendientes y fallidos de la semana operativa.'
      const assistantMessage: ChatMessage = { id: createId('assistant'), role: 'assistant', content: reply }
      setMessages((prev) => [...prev, assistantMessage])
      speak(reply)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/xoria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: {
            perfil: 'aseguradora_core',
            kpis: executiveKpis,
            underwriting: underwritingCases,
            polizas: policyRecords,
            cobranza: billingRecords,
            siniestros: claimsCases,
            promotorias: promotoriaPerformance,
            agentes: agentPerformance,
          },
        }),
      })

      const payload = await response.json()
      const reply = payload.response || payload.reply || 'Sin respuesta operativa.'
      const assistantMessage: ChatMessage = { id: createId('assistant'), role: 'assistant', content: reply }
      setMessages((prev) => [...prev, assistantMessage])
      speak(reply)
    } catch {
      const reply = 'Xoria no pudo completar la consulta en este momento. Intenta de nuevo.'
      const assistantMessage: ChatMessage = { id: createId('assistant'), role: 'assistant', content: reply }
      setMessages((prev) => [...prev, assistantMessage])
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <Panel title="Xoria corporativa" subtitle="Copiloto operativo para expedientes, cartera, siniestros criticos, red comercial y cobranza.">
        <div className="flex flex-wrap gap-2">
          {xoriaCorporatePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="rounded-full bg-white/35 px-3 py-1.5 text-[11px] text-[#1A1F2B] hover:bg-white/50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Centro de conversacion" subtitle="Texto y voz con respuesta operativa y trazable.">
        <div className="space-y-2">
          <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-2xl bg-white/35 p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-3 text-[12px] ${
                  message.role === 'user'
                    ? 'ml-8 bg-[#F7941D]/18 text-[#1A1F2B]'
                    : 'mr-8 bg-[#1A1F2B]/8 text-[#1A1F2B]'
                }`}
              >
                <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">
                  {message.role === 'user' ? 'Usuario' : 'Xoria'}
                </p>
                <p>{message.content}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white/35 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Ingreso de consulta</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleListen}
                  disabled={!supported}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#1A1F2B] px-2 py-1 text-[10px] text-white disabled:opacity-40"
                >
                  {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                  {isListening ? 'Detener voz' : 'Modo voz'}
                </button>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#6E7F8D]">
                  <Volume2 size={11} /> respuesta por voz
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSend()
                  }
                }}
                rows={3}
                placeholder="Ejemplo: muestrame siniestros abiertos con SLA critico"
                className="w-full resize-none rounded-xl bg-[#EFF2F9] px-3 py-2 text-[12px] text-[#1A1F2B] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)] outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading}
                className="inline-flex h-fit items-center gap-1 rounded-xl bg-[#F7941D] px-3 py-2 text-[12px] text-white disabled:opacity-40"
              >
                <Send size={13} />
                {loading ? '...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Capacidades corporativas" subtitle="Consultas disponibles para operacion aseguradora.">
        <div className="grid gap-2 sm:grid-cols-2">
          <p className="rounded-2xl bg-white/35 p-3 text-[11px] text-[#1A1F2B] inline-flex items-center gap-1.5">
            <Bot size={12} className="text-[#F7941D]" /> Buscar expedientes y resumir polizas.
          </p>
          <p className="rounded-2xl bg-white/35 p-3 text-[11px] text-[#1A1F2B] inline-flex items-center gap-1.5">
            <Bot size={12} className="text-[#F7941D]" /> Explicar siniestros criticos y ajustadores en ruta.
          </p>
          <p className="rounded-2xl bg-white/35 p-3 text-[11px] text-[#1A1F2B] inline-flex items-center gap-1.5">
            <Bot size={12} className="text-[#F7941D]" /> Detectar caidas de cobranza y sugerir acciones.
          </p>
          <p className="rounded-2xl bg-white/35 p-3 text-[11px] text-[#1A1F2B] inline-flex items-center gap-1.5">
            <Bot size={12} className="text-[#F7941D]" /> Generar resumen ejecutivo y reporte descargable.
          </p>
        </div>
      </Panel>
    </div>
  )
}
