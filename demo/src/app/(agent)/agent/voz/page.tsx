'use client'
import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Phone, PhoneOff, Volume2, Send, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import {
  MOCK_KPIS, MOCK_LEADS, MOCK_CLIENTS, MOCK_POLICIES,
  MOCK_TICKETS, MOCK_SINIESTROS, MOCK_PAYMENTS, MOCK_AGENDA
} from '@/data/mock'

const QUICK = [
  { label: 'Resumen del día', prompt: 'Dame un resumen ejecutivo de mi día y mis prioridades más urgentes.' },
  { label: 'Clientes con pagos vencidos', prompt: '¿Qué clientes tienen pagos vencidos y cuánto deben?' },
  { label: 'Pipeline activo', prompt: 'Analiza mi pipeline actual. ¿Qué prospectos debo priorizar hoy?' },
  { label: 'Renovaciones próximas', prompt: '¿Qué pólizas vencen en los próximos 30 días y cómo las renuevo?' },
  { label: 'Tickets abiertos', prompt: '¿Qué tickets están pendientes de atención y cuáles son urgentes?' },
  { label: 'Cómo cotizar GMM', prompt: 'Explícame paso a paso cómo cotizar un seguro de Gastos Médicos Mayores individual en este sistema.' },
]

interface Message { role: 'user' | 'assistant'; content: string; ts: string }

export default function VozPage() {
  const { user } = useAuth()
  const [connected, setConnected] = useState(false)
  const [muted, setMuted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const context = {
    agent: user?.name,
    role: user?.role,
    kpis: MOCK_KPIS.map(k => ({ label: k.label, value: k.value })),
    clients: MOCK_CLIENTS.map(c => ({ name: c.name, email: c.email, score: c.score, tags: c.tags })),
    policies: MOCK_POLICIES.map(p => ({ clientName: p.clientName, type: p.type, status: p.status, premium: p.premium, endDate: p.endDate })),
    leads: MOCK_LEADS.map(l => ({ name: l.name, stage: l.stage, ramo: l.ramo, value: l.value, score: l.score })),
    tickets: MOCK_TICKETS.map(t => ({ clientName: t.clientName, subject: t.subject, status: t.status, priority: t.priority })),
    siniestros: MOCK_SINIESTROS.map(s => ({ clientName: s.clientName, tipo: s.tipo, status: s.status, monto: s.monto })),
    payments: MOCK_PAYMENTS.map(p => ({ clientName: p.clientName, concept: p.concept, amount: p.amount, status: p.status, dueDate: p.dueDate })),
    agenda: MOCK_AGENDA.map(a => ({ time: a.time, title: a.title, type: a.type, client: a.client })),
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    if (!text.trim() || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: text, ts: new Date().toISOString() }
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
      const reply = data.reply || 'No pude procesar esa solicitud.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: new Date().toISOString() }])
      // TTS
      if ('speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(reply.replace(/\*\*(.*?)\*\*/g, '$1').slice(0, 500))
        utt.lang = 'es-MX'; utt.rate = 0.95; utt.pitch = 1.1
        const voices = window.speechSynthesis.getVoices()
        const mxVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Paulina') || v.name.includes('Monica') || v.name.includes('Conchita') || v.name.includes('es')))
        if (mxVoice) utt.voice = mxVoice
        window.speechSynthesis.speak(utt)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión. Verifica tu red.', ts: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  function toggleCall() {
    if (!connected) {
      setConnected(true)
      const welcome = `Hola ${user?.name?.split(' ')[0] || 'agente'}, soy XORIA, tu asistente de inteligencia artificial. Tengo acceso a toda tu información del sistema: clientes, pólizas, pipeline, siniestros, cobranza y agenda. ¿En qué puedo ayudarte?`
      setMessages([{ role: 'assistant', content: welcome, ts: new Date().toISOString() }])
      if ('speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(welcome)
        utt.lang = 'es-MX'; utt.rate = 0.95; utt.pitch = 1.1
        window.speechSynthesis.speak(utt)
      }
    } else {
      setConnected(false)
      window.speechSynthesis?.cancel()
      setMessages([])
    }
  }

  function handleVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome.')
      return
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'es-MX'; rec.interimResults = false
    setListening(true)
    rec.start()
    rec.onresult = (e: any) => { const t = e.results[0][0].transcript; setInput(t); setListening(false); setTimeout(() => send(t), 100) }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
  }

  return (
    <div className="flex flex-col gap-5" style={{ height: 'calc(100vh - 90px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-[0_4px_14px_rgba(247,148,29,0.3)]">
            <Image src="/Icono xoria.png" alt="XORIA" width={40} height={40} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="text-[10px] text-[#F7941D] font-bold tracking-[0.18em] uppercase mb-0.5">Asistente inteligente</p>
            <h1 className="text-[20px] text-[#1A1F2B] font-bold">XORIA Consultor</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF]">
          <Sparkles size={13} className="text-[#F7941D]" />
          GPT-4o · Contexto completo del sistema
        </div>
      </div>

      {/* Área principal: orb + chat */}
      <div className="flex gap-5 flex-1 min-h-0">

        {/* Panel izquierdo — orb + controles */}
        <div className="flex flex-col items-center gap-5 shrink-0 w-56">
          {/* Orb */}
          <div className={cn(
            'w-44 h-44 rounded-full transition-all duration-500 flex items-center justify-center mt-4',
            connected
              ? 'bg-[#EFF2F9] shadow-[-20px_-20px_40px_#FAFBFF,20px_20px_40px_rgba(22,27,29,0.23)]'
              : 'bg-[#EFF2F9] shadow-[-20px_-20px_40px_#FAFBFF,20px_20px_40px_rgba(22,27,29,0.23)]'
          )}>
            <div className={cn(
              'w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300',
              connected ? 'bg-[#F7941D]/15' : 'bg-[#EFF2F9] shadow-[-10px_-10px_20px_#FAFBFF,10px_10px_20px_rgba(22,27,29,0.18)]'
            )}>
              {connected
                ? <Volume2 size={36} className={cn('text-[#F7941D]', loading && 'animate-pulse')} />
                : <Mic size={36} className="text-[#9CA3AF]" />}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', connected ? 'bg-[#69A481] animate-pulse' : 'bg-[#9CA3AF]')} />
            <span className="text-[12px] text-[#6B7280]">
              {connected ? (loading ? 'Procesando...' : 'Conectada · Escuchando') : 'Desconectada'}
            </span>
          </div>

          {/* Controles */}
          <div className="flex gap-3">
            {connected && (
              <button onClick={() => setMuted(v => !v)}
                className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200',
                  muted ? 'bg-[#7C1F31]/15 text-[#7C1F31] shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.3),inset_4px_4px_8px_rgba(22,27,29,0.2)]'
                        : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-5px_-5px_10px_#FAFBFF,5px_5px_10px_rgba(22,27,29,0.15)]')}>
                {muted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            <button onClick={toggleCall}
              className={cn('w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95',
                connected ? 'bg-[#7C1F31] text-white shadow-[0_6px_20px_rgba(124,31,49,0.4)]'
                          : 'bg-[#F7941D] text-white shadow-[0_6px_20px_rgba(247,148,29,0.4)]')}>
              {connected ? <PhoneOff size={22} /> : <Phone size={22} />}
            </button>
          </div>

          {/* Acciones rápidas */}
          {connected && (
            <div className="w-full flex flex-col gap-1.5">
              <p className="text-[9px] text-[#9CA3AF] uppercase tracking-widest text-center mb-1">Preguntas rápidas</p>
              {QUICK.map(q => (
                <button key={q.label} onClick={() => send(q.prompt)} disabled={loading}
                  className="w-full text-left text-[10px] text-[#6B7280] px-3 py-2 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#F7941D] disabled:opacity-40 transition-colors leading-tight">
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Panel derecho — chat XORIA */}
        <div className="flex-1 flex flex-col bg-[#EFF2F9] rounded-2xl shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] overflow-hidden min-h-0">
          {!connected ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-[0_8px_24px_rgba(247,148,29,0.3)]">
                <Image src="/Icono xoria.png" alt="XORIA" width={64} height={64} className="object-cover w-full h-full" />
              </div>
              <div>
                <h2 className="text-[16px] text-[#1A1F2B] font-bold mb-1">XORIA está lista</h2>
                <p className="text-[12px] text-[#9CA3AF] leading-relaxed max-w-xs">
                  Conéctate para consultar cualquier información del sistema, pedir análisis, redactar documentos o resolver dudas sobre tus clientes y pólizas.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-w-sm w-full">
                {QUICK.slice(0, 4).map(q => (
                  <div key={q.label} className="bg-[#EFF2F9] rounded-xl p-2.5 shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.08)]">
                    <p className="text-[10px] text-[#9CA3AF]">{q.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={toggleCall}
                className="px-8 py-3 rounded-2xl text-white text-[13px] font-semibold hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 6px 20px rgba(247,148,29,0.4)' }}>
                Iniciar sesión con XORIA
              </button>
            </div>
          ) : (
            <>
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 min-h-0">
                {messages.map((msg, i) => (
                  <div key={i} className={cn('flex gap-3 max-w-[85%]', msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start')}>
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden',
                      msg.role === 'assistant' ? 'shadow-[0_2px_6px_rgba(247,148,29,0.2)]' : 'bg-[#F7941D]/10')}>
                      {msg.role === 'assistant'
                        ? <Image src="/Icono xoria.png" alt="X" width={32} height={32} className="object-cover w-full h-full" />
                        : <Mic size={13} className="text-[#F7941D]" />}
                    </div>
                    <div className={cn('rounded-2xl px-4 py-3 text-[13px] leading-relaxed',
                      msg.role === 'assistant'
                        ? 'bg-white/60 backdrop-blur-sm border border-white/50 text-[#1A1F2B] shadow-[0_4px_16px_rgba(22,27,29,0.08)] rounded-tl-sm'
                        : 'bg-[#EFF2F9] text-[#1A1F2B] shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] rounded-tr-sm')}>
                      <span dangerouslySetInnerHTML={{ __html: msg.content
                        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                        .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
                        .replace(/\n/g,'<br/>')
                      }} />
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3 self-start">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0"><Image src="/Icono xoria.png" alt="X" width={32} height={32} className="object-cover w-full h-full" /></div>
                    <div className="bg-white/60 border border-white/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                      {[0,150,300].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-[#F7941D]" style={{ animation: `typing-dot 1s ${d}ms ease infinite` }} />)}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-5 pb-5 pt-3 shrink-0">
                <div className="flex items-center gap-3 bg-[#EFF2F9] rounded-2xl shadow-[inset_-4px_-4px_10px_#FAFBFF,inset_4px_4px_10px_rgba(22,27,29,0.15)] px-4">
                  <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                    placeholder="Escribe o usa el micrófono para preguntar algo..."
                    disabled={loading}
                    className="flex-1 bg-transparent py-4 text-[13px] text-[#1A1F2B] outline-none placeholder:text-[#9CA3AF] disabled:opacity-60" />
                  <button onClick={handleVoice} disabled={loading}
                    className={cn('w-8 h-8 flex items-center justify-center rounded-xl transition-all', listening ? 'bg-[#F7941D] text-white' : 'text-[#9CA3AF] hover:text-[#6B7280]')}>
                    {listening ? <MicOff size={15} /> : <Mic size={15} />}
                  </button>
                  <button onClick={() => send(input)} disabled={loading || !input.trim()}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)] hover:bg-[#E8820A] disabled:opacity-40 transition-all active:scale-95">
                    <Send size={14} />
                  </button>
                </div>
                <p className="text-[10px] text-[#B5BFC6] text-center mt-2">XORIA tiene acceso completo a tu sistema · Pregunta lo que necesites</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

