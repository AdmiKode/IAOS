'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Mic, MicOff, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { MOCK_KPIS, MOCK_LEADS } from '@/data/mock'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_ACTIONS = [
  { label: 'Resumen del día', prompt: 'Dame un resumen ejecutivo de mi día y prioridades.' },
  { label: 'Analizar pipeline', prompt: 'Analiza mi pipeline actual y dime qué prospectos debo priorizar.' },
  { label: 'Redactar propuesta', prompt: 'Ayúdame a redactar una propuesta de seguro de Vida para un prospecto corporativo.' },
  { label: 'Métricas clave', prompt: '¿Cuáles son mis métricas clave este mes y cómo las mejoro?' },
]

export default function XoriaPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hola ${user?.name?.split(' ')[0] || 'agente'}, soy XORIA, tu copiloto de inteligencia artificial. Estoy conectada a tu workspace y lista para ayudarte. ¿En qué trabajamos hoy?`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const context = {
    agent: user?.name,
    kpis: MOCK_KPIS.map(k => ({ label: k.label, value: k.value })),
    pipeline_count: MOCK_LEADS.length,
    pipeline_by_stage: MOCK_LEADS.reduce((acc, l) => {
      acc[l.stage] = (acc[l.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = [...messages, userMsg].slice(-10).map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/xoria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, context }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || 'Lo siento, no pude procesar esa solicitud.',
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error de conexión. Verifica tu conexión e intenta de nuevo.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz.')
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'es-MX'
    recognition.interimResults = false
    setListening(true)
    recognition.start()
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
  }

  return (
    <div className="flex h-full gap-4" style={{ maxHeight: 'calc(100vh - 120px)' }}>
      {/* Sidebar historial */}
      <div className="hidden xl:flex flex-col w-[220px] shrink-0 gap-3">
        <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#F7941D]" />
            <p className="text-[13px] text-[#1A1F2B] tracking-wide">Acciones rápidas</p>
          </div>
          <div className="flex flex-col gap-2">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.prompt)}
                disabled={loading}
                className="text-left text-[12px] text-[#6B7280] px-3 py-2 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#F7941D] hover:shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.16)] transition-all duration-150 disabled:opacity-40"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)] flex-1">
          <p className="text-[11px] text-[#9CA3AF] tracking-widest uppercase mb-3">Contexto activo</p>
          <div className="flex flex-col gap-2">
            {MOCK_KPIS.slice(0, 4).map(kpi => (
              <div key={kpi.id} className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B7280] truncate">{kpi.label}</span>
                <span className="text-[11px] text-[#F7941D] font-medium">{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col bg-[#EFF2F9] rounded-2xl shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#D1D5DB]/30">
          <div className="w-9 h-9 rounded-xl bg-[#F7941D]/15 flex items-center justify-center">
            <Bot size={18} className="text-[#F7941D]" />
          </div>
          <div>
            <p className="text-[14px] text-[#1A1F2B] tracking-wide">XORIA</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#69A481] animate-pulse" />
              <p className="text-[11px] text-[#69A481]">Conectada · GPT-4o</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-3 max-w-[85%]', msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start')}>
              {/* Avatar */}
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                msg.role === 'assistant'
                  ? 'bg-[#F7941D]/15'
                  : 'bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.15)]')}>
                {msg.role === 'assistant'
                  ? <Bot size={14} className="text-[#F7941D]" />
                  : <User size={14} className="text-[#6B7280]" />}
              </div>

              {/* Bubble */}
              <div className={cn(
                'rounded-2xl px-4 py-3 text-[13px] leading-relaxed',
                msg.role === 'assistant'
                  ? 'bg-white/40 backdrop-blur-sm border border-white/50 text-[#1A1F2B] shadow-[0_4px_16px_rgba(22,27,29,0.08)] rounded-tl-sm'
                  : 'bg-[#EFF2F9] text-[#1A1F2B] shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] rounded-tr-sm'
              )}>
                {msg.content}
                <p className="text-[10px] text-[#9CA3AF] mt-1.5">
                  {msg.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 self-start">
              <div className="w-8 h-8 rounded-xl bg-[#F7941D]/15 flex items-center justify-center">
                <Bot size={14} className="text-[#F7941D]" />
              </div>
              <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 150, 300].map(delay => (
                  <div key={delay} className="w-1.5 h-1.5 rounded-full bg-[#F7941D]"
                    style={{ animation: `typing-dot 1s ${delay}ms ease infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick actions mobile */}
        <div className="flex xl:hidden gap-2 px-5 overflow-x-auto pb-0 pt-2">
          {QUICK_ACTIONS.map(a => (
            <button key={a.label} onClick={() => sendMessage(a.prompt)} disabled={loading}
              className="shrink-0 text-[11px] text-[#F7941D] px-3 py-1.5 rounded-xl bg-[#F7941D]/10 hover:bg-[#F7941D]/20 transition-colors disabled:opacity-40 whitespace-nowrap">
              {a.label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="px-5 pb-5 pt-3">
          <div className="flex items-center gap-3 bg-[#EFF2F9] rounded-2xl shadow-[inset_-4px_-4px_10px_#FAFBFF,inset_4px_4px_10px_rgba(22,27,29,0.15)] px-4">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Pregunta algo a XORIA..."
              disabled={loading}
              className="flex-1 bg-transparent py-4 text-[13px] text-[#1A1F2B] outline-none placeholder:text-[#9CA3AF] disabled:opacity-60"
            />
            <button onClick={handleVoice} disabled={loading}
              className={cn('w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200',
                listening ? 'bg-[#F7941D] text-white' : 'text-[#9CA3AF] hover:text-[#6B7280]')}>
              {listening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)] hover:bg-[#E8820A] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95">
              <Send size={14} />
            </button>
          </div>
          <p className="text-[10px] text-[#B5BFC6] text-center mt-2 tracking-wide">
            XORIA puede cometer errores. Verifica información importante.
          </p>
        </div>
      </div>
    </div>
  )
}
