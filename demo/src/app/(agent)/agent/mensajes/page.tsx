'use client'
import { useState, useRef, useEffect } from 'react'
import { MOCK_CONVERSATIONS } from '@/data/mock'
import { Search, Send, Paperclip, Smartphone, Mail, MessageSquare, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

const CANAL_ICON: Record<string, string> = {
  whatsapp: 'Smartphone',
  email: 'Mail',
  app: 'MessageSquare',
}
const CANAL_COLOR: Record<string, string> = {
  whatsapp: '#69A481',
  email: '#F7941D',
  app: '#6B7280',
}

export default function MensajesPage() {
  const [selected, setSelected] = useState<string>(MOCK_CONVERSATIONS[0]?.id || '')
  const [search, setSearch] = useState('')
  const [text, setText] = useState('')
  const [extraMsgs, setExtraMsgs] = useState<Record<string, { id: string; from: string; text: string; time: string }[]>>({})
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected, extraMsgs])

  const filtered = MOCK_CONVERSATIONS.filter(c =>
    c.clientName.toLowerCase().includes(search.toLowerCase()) ||
    c.canal.includes(search.toLowerCase())
  )

  const conv = MOCK_CONVERSATIONS.find(c => c.id === selected)
  const msgs = [...(conv?.messages || []), ...(extraMsgs[selected] || [])]

  const total = MOCK_CONVERSATIONS.length
  const unread = MOCK_CONVERSATIONS.reduce((acc, c) => acc + (c.unread || 0), 0)

  const send = () => {
    if (!text.trim() || !selected) return
    const msg = { id: Date.now().toString(), from: 'agent', text: text.trim(), time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) }
    setExtraMsgs(prev => ({ ...prev, [selected]: [...(prev[selected] || []), msg] }))
    setText('')
  }

  const CanalIcon = ({ canal }: { canal: string }) => {
    const color = CANAL_COLOR[canal] || '#6B7280'
    if (canal === 'whatsapp') return <Smartphone size={14} style={{ color }} />
    if (canal === 'email') return <Mail size={14} style={{ color }} />
    return <MessageSquare size={14} style={{ color }} />
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-120px)]">
      {/* Bandeja */}
      <div className="w-[290px] shrink-0 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#EFF2F9] rounded-2xl p-3 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <p className="text-[18px] text-[#1A1F2B]">{total}</p>
            <p className="text-[11px] text-[#9CA3AF]">Conversaciones</p>
          </div>
          <div className="bg-[#EFF2F9] rounded-2xl p-3 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <p className="text-[18px] text-[#F7941D]">{unread}</p>
            <p className="text-[11px] text-[#9CA3AF]">Sin leer</p>
          </div>
        </div>

        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
            className="w-full bg-[#EFF2F9] pl-8 pr-3 py-2.5 text-[12px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
          {filtered.map(c => {
            const color = CANAL_COLOR[c.canal] || '#6B7280'
            const lastMsg = [...c.messages, ...(extraMsgs[c.id] || [])].slice(-1)[0]
            const isActive = selected === c.id
            return (
              <button key={c.id} onClick={() => setSelected(c.id)}
                className={cn('w-full text-left bg-[#EFF2F9] rounded-2xl p-3 transition-all',
                  isActive ? 'shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)]' : 'shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] hover:shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]')}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                    <CanalIcon canal={c.canal} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[12px] text-[#1A1F2B] truncate">{c.clientName}</p>
                      {(c.unread || 0) > 0 && (
                        <span className="text-[10px] text-white px-1.5 py-0.5 rounded-full shrink-0 bg-[#F7941D]">{c.unread}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] truncate">{lastMsg?.text || 'Sin mensajes'}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Panel chat */}
      <div className="flex-1 bg-[#EFF2F9] rounded-2xl shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex flex-col overflow-hidden">
        {conv ? (
          <>
            <div className="p-4 border-b border-[#D1D5DB]/20 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${CANAL_COLOR[conv.canal] || '#6B7280'}15` }}>
                <CanalIcon canal={conv.canal} />
              </div>
              <div>
                <p className="text-[13px] text-[#1A1F2B]">{conv.clientName}</p>
                <div className="flex items-center gap-1.5">
                  <Circle size={6} className="fill-[#69A481] text-[#69A481]" />
                  <p className="text-[11px] text-[#9CA3AF]">En linea · {conv.canal}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {msgs.map(m => (
                <div key={m.id} className={cn('flex', m.from === 'agent' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px]',
                    m.from === 'agent' ? 'bg-[#F7941D] text-white rounded-tr-sm' : 'bg-white/60 text-[#1A1F2B] shadow-[0_2px_8px_rgba(22,27,29,0.08)] rounded-tl-sm')}>
                    {m.text}
                    <p className={cn('text-[10px] mt-1', m.from === 'agent' ? 'text-white/70 text-right' : 'text-[#9CA3AF]')}>{m.time}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-[#D1D5DB]/20 shrink-0">
              <div className="flex items-end gap-3">
                <div className="flex-1 bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
                  <textarea value={text} onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                    placeholder="Escribe un mensaje..."
                    rows={1}
                    className="w-full bg-transparent text-[13px] text-[#1A1F2B] outline-none resize-none placeholder:text-[#9CA3AF]" />
                </div>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
                  <Paperclip size={14} />
                </button>
                <button onClick={send} disabled={!text.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F7941D] text-white shadow-[0_3px_10px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-all disabled:opacity-40">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-[13px] text-[#9CA3AF]">Selecciona una conversacion</p>
          </div>
        )}
      </div>
    </div>
  )
}
