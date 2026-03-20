'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Sparkles, User, Plus, Clock, Trash2, MessageSquare, Mail, CalendarDays, FileText, Users } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { MOCK_KPIS, MOCK_LEADS, MOCK_CLIENTS, MOCK_POLICIES, MOCK_TICKETS, MOCK_SINIESTROS, MOCK_PAYMENTS, MOCK_AGENDA } from '@/data/mock'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  date: string
}

const QUICK_ACTIONS = [
  { label: 'Resumen del día', prompt: 'Dame un resumen ejecutivo de mi día, agenda y correos pendientes.' },
  { label: 'Leer correos', prompt: '¿Cuál es el último correo que tengo? Léelo y propón una respuesta.' },
  { label: 'Mi agenda de hoy', prompt: '¿Qué reuniones o citas tengo hoy? Organízame el día.' },
  { label: 'Analizar pipeline', prompt: 'Analiza mi pipeline actual y dime qué prospectos debo priorizar hoy.' },
  { label: 'Redactar propuesta', prompt: 'Ayúdame a redactar una propuesta de seguro de Vida para un prospecto corporativo.' },
  { label: 'Métricas clave', prompt: '¿Cuáles son mis métricas clave este mes y cómo están mis ventas?' },
]

// Mock de correos para el contexto de XORIA
const MOCK_EMAILS_FOR_XORIA = [
  { id: 'e1', from: 'Ana López', fromEmail: 'ana.lopez@email.com', subject: 'RE: Aclaración de cobro duplicado — Marzo 2026', body: 'Hola Carlos, muchas gracias por la gestión tan rápida. Entiendo que la devolución del cargo duplicado se hará en 3 a 5 días hábiles por parte de GNP. ¿Recibiré una confirmación cuando esté acreditado en mi cuenta? Saludos, Ana López', date: '2026-03-17', time: '11:02', read: false, folder: 'inbox', starred: true },
  { id: 'e2', from: 'GNP Seguros — Soporte Agentes', fromEmail: 'agentes@gnp.com.mx', subject: 'Confirmación carta aval — Folio SA-2026-3412', body: 'Estimado agente Mendoza, le confirmamos la aprobación de la carta aval. Asegurada: Ana López. Póliza: GNP-2025-001234. Hospital: Ángeles Lomas. Monto autorizado: $85,000 MXN. Folio: SA-2026-3412.', date: '2026-03-18', time: '10:15', read: false, folder: 'inbox', starred: false },
  { id: 'e3', from: 'Empresa XYZ — RH', fromEmail: 'rh@empresaxyz.com', subject: 'Bajas de empleados — Colectivo AXA', body: 'Carlos, te enviamos los datos de 3 empleados a dar de baja en el colectivo AXA: Luis Mora, Patricia Salas, Raúl Gómez. Baja efectiva: 31/03/2026.', date: '2026-03-18', time: '09:30', read: true, folder: 'inbox', starred: false },
  { id: 'e4', from: 'Roberto Sánchez', fromEmail: 'rsanchez@email.com', subject: '¿Cuándo me llega la póliza de vida?', body: 'Hola Carlos, quería preguntarte si ya tienes noticias de Metlife sobre mi póliza de Vida Temporal. Llevo dos semanas esperando.', date: '2026-03-17', time: '18:45', read: true, folder: 'inbox', starred: false },
]

// Mock directorio de contactos personales con fechas importantes
const MOCK_CONTACTS = [
  { nombre: 'María Elena Garza', relacion: 'Esposa', telefono: '33-1234-5678', email: 'mgarza@personal.com', cumpleaños: '15 de julio', aniversario: '23 de septiembre' },
  { nombre: 'Dr. Ramírez', relacion: 'Médico familiar', telefono: '33-9876-5432', email: 'drrm@clinica.com' },
  { nombre: 'Jorge Mendoza (papá)', relacion: 'Familia', telefono: '33-5555-1234', cumpleaños: '3 de mayo' },
  { nombre: 'Lic. Patricia Torres', relacion: 'Abogada fiscal', telefono: '33-7890-1234', email: 'ptorres@despacho.mx' },
  { nombre: 'Gerente GNP — Zona Occidente', relacion: 'Aseguradora', telefono: '33-4567-8901', email: 'zona.occ@gnp.com.mx' },
]

const STORAGE_KEY = 'xoria-history'
const MAX_HISTORY = 20

function newConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function titleFromMessages(messages: Message[]): string {
  const first = messages.find(m => m.role === 'user')
  if (!first) return 'Nueva conversación'
  return first.content.length > 40 ? first.content.slice(0, 40) + '…' : first.content
}

function loadHistory(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(history: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
  } catch {}
}

export default function XoriaPage() {
  const { user } = useAuth()

  const buildWelcome = (): Message => ({
    role: 'assistant',
    content: `Hola ${user?.name?.split(' ')[0] || 'agente'}, soy XORIA, tu copiloto de inteligencia artificial. Estoy conectada a tu workspace y lista para ayudarte. ¿En qué trabajamos hoy?`,
    timestamp: new Date().toISOString(),
  })

  const [history, setHistory] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([buildWelcome()])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Persist current conversation on each message change (only if user sent at least 1 message)
  useEffect(() => {
    const userMsgs = messages.filter(m => m.role === 'user')
    if (userMsgs.length === 0) return

    setHistory(prev => {
      const id = activeId || newConversationId()
      if (!activeId) setActiveId(id)
      const conv: Conversation = {
        id,
        title: titleFromMessages(messages),
        messages,
        date: new Date().toISOString(),
      }
      const filtered = prev.filter(c => c.id !== id)
      const next = [conv, ...filtered]
      saveHistory(next)
      return next
    })
  }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps

  const context = {
    agent: user?.name,
    fecha_hoy: '19 de marzo de 2026',
    kpis: MOCK_KPIS.map(k => ({ label: k.label, value: k.value })),
    pipeline_count: MOCK_LEADS.length,
    pipeline_by_stage: MOCK_LEADS.reduce((acc, l) => {
      acc[l.stage] = (acc[l.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    clients: MOCK_CLIENTS.map(c => ({
      id: c.id, name: c.name, email: c.email, phone: c.phone, score: c.score, tags: c.tags,
      notas: c.notas?.map(n => ({ text: n.text, date: n.date })) || [],
    })),
    policies: MOCK_POLICIES.map(p => ({
      id: p.id, clientName: p.clientName, type: p.type, insurer: p.insurer,
      status: p.status, startDate: p.startDate, endDate: p.endDate,
      premium: p.premium, coverage: p.coverage, policyNumber: p.policyNumber,
    })),
    tickets: MOCK_TICKETS.map(t => ({
      id: t.id, clientName: t.clientName, subject: t.subject,
      status: t.status, priority: t.priority, createdAt: t.createdAt,
    })),
    siniestros: MOCK_SINIESTROS.map(s => ({
      id: s.id, clientName: s.clientName, tipo: s.tipo, descripcion: s.descripcion,
      fecha: s.fecha, status: s.status, monto: s.monto, aseguradora: s.aseguradora,
    })),
    payments: MOCK_PAYMENTS.map(p => ({
      id: p.id, clientName: p.clientName, concept: p.concept,
      amount: p.amount, dueDate: p.dueDate, status: p.status,
    })),
    agenda: MOCK_AGENDA.map(a => ({
      id: a.id, time: a.time, title: a.title, type: a.type, client: a.client,
    })),
    emails: MOCK_EMAILS_FOR_XORIA,
    contacts: MOCK_CONTACTS,
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date().toISOString() }
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
        timestamp: new Date().toISOString(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error de conexión. Verifica tu conexión e intenta de nuevo.',
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  function startNewConversation() {
    setActiveId(null)
    setMessages([buildWelcome()])
    setInput('')
    inputRef.current?.focus()
  }

  function loadConversation(conv: Conversation) {
    setActiveId(conv.id)
    setMessages(conv.messages)
    setInput('')
  }

  function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setHistory(prev => {
      const next = prev.filter(c => c.id !== id)
      saveHistory(next)
      return next
    })
    if (activeId === id) startNewConversation()
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

  function formatDate(iso: string) {
    const d = new Date(iso)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return 'Hoy'
    if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="flex h-full gap-4" style={{ maxHeight: 'calc(100vh - 120px)' }}>

      {/* Sidebar */}
      <div className="hidden xl:flex flex-col w-[230px] shrink-0 gap-3 overflow-hidden">

        {/* New conversation button */}
        <button
          onClick={startNewConversation}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#F7941D] text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.35)] hover:bg-[#E8820A] transition-all duration-150 active:scale-95"
        >
          <Plus size={15} />
          Nueva conversación
        </button>

        {/* Quick actions */}
        <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-[#F7941D]" />
            <p className="text-[12px] text-[#1A1F2B] tracking-wide">Acciones rápidas</p>
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Resumen del día', icon: Sparkles, prompt: 'Dame un resumen ejecutivo de mi día, agenda y correos pendientes.' },
              { label: 'Leer correos', icon: Mail, prompt: '¿Cuál es el último correo que tengo? Léelo y propón una respuesta.' },
              { label: 'Mi agenda de hoy', icon: CalendarDays, prompt: '¿Qué reuniones o citas tengo hoy? Organízame el día.' },
              { label: 'Analizar pipeline', icon: Users, prompt: 'Analiza mi pipeline y dime qué prospectos priorizar hoy.' },
              { label: 'Redactar propuesta', icon: FileText, prompt: 'Ayúdame a redactar una propuesta de seguro de Vida para un prospecto.' },
              { label: 'Métricas clave', icon: Sparkles, prompt: '¿Cuáles son mis métricas clave este mes?' },
            ].map(action => {
              const AIcon = action.icon
              return (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  disabled={loading}
                  className="text-left flex items-center gap-2 text-[11px] text-[#6B7280] px-3 py-2 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#F7941D] hover:shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.16)] transition-all duration-150 disabled:opacity-40"
                >
                  <AIcon size={11} className="shrink-0 opacity-60" />{action.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* History */}
        <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)] flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={13} className="text-[#9CA3AF]" />
            <p className="text-[11px] text-[#9CA3AF] tracking-widest uppercase">Historial</p>
          </div>

          {history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
              <MessageSquare size={22} className="text-[#D1D5DB]" />
              <p className="text-[11px] text-[#B5BFC6] leading-relaxed">
                Tus conversaciones aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto -mr-1 pr-1 flex flex-col gap-1">
              {history.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv)}
                  className={cn(
                    'group w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 flex items-start gap-2',
                    activeId === conv.id
                      ? 'bg-[#F7941D]/10 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]'
                      : 'hover:bg-[#F7941D]/5'
                  )}
                >
                  <MessageSquare size={11} className={cn('mt-0.5 shrink-0', activeId === conv.id ? 'text-[#F7941D]' : 'text-[#9CA3AF]')} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-[11px] leading-snug truncate', activeId === conv.id ? 'text-[#F7941D]' : 'text-[#6B7280]')}>
                      {conv.title}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{formatDate(conv.date)}</p>
                  </div>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-[#B5BFC6] hover:text-[#7C1F31] transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Context */}
        <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]">
          <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase mb-2.5">Contexto activo</p>
          <div className="flex flex-col gap-1.5">
            {MOCK_KPIS.slice(0, 4).map(kpi => (
              <div key={kpi.id} className="flex items-center justify-between">
                <span className="text-[10px] text-[#6B7280] truncate">{kpi.label}</span>
                <span className="text-[10px] text-[#F7941D] font-medium">{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col bg-[#EFF2F9] rounded-2xl shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#D1D5DB]/30">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 shadow-[0_2px_8px_rgba(247,148,29,0.25)]">
            <Image src="/Icono xoria.png" alt="XORIA" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] text-[#1A1F2B] tracking-wide">XORIA</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#69A481] animate-pulse" />
              <p className="text-[11px] text-[#69A481]">Conectada · GPT-4o</p>
            </div>
          </div>
          {/* New conversation (mobile) */}
          <button
            onClick={startNewConversation}
            className="xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F7941D]/10 text-[#F7941D] text-[12px] hover:bg-[#F7941D]/20 transition-colors"
          >
            <Plus size={13} />
            Nueva
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-3 max-w-[85%]', msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start')}>
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden',
                msg.role === 'assistant'
                  ? 'shadow-[0_2px_6px_rgba(247,148,29,0.2)]'
                  : 'bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.15)]')}>
                {msg.role === 'assistant'
                  ? <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
                  : <User size={14} className="text-[#6B7280]" />}
              </div>

              <div className={cn(
                'rounded-2xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap',
                msg.role === 'assistant'
                  ? 'bg-white/40 backdrop-blur-sm border border-white/50 text-[#1A1F2B] shadow-[0_4px_16px_rgba(22,27,29,0.08)] rounded-tl-sm'
                  : 'bg-[#EFF2F9] text-[#1A1F2B] shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] rounded-tr-sm'
              )}>
                {msg.content
                  .replace(/\*\*(.+?)\*\*/g, '$1')
                  .replace(/\*(.+?)\*/g, '$1')
                  .replace(/#{1,3} (.+)/g, '$1')
                  .replace(/`(.+?)`/g, '$1')
                }
                <p className="text-[10px] text-[#9CA3AF] mt-1.5">
                  {new Date(msg.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 self-start">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-[0_2px_6px_rgba(247,148,29,0.2)]">
                <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
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

        {/* Input */}
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
