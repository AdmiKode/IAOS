'use client'
import { MessageSquare, Send } from 'lucide-react'
import { useState } from 'react'

const INITIAL_MESSAGES = [
  { from: 'agent', text: 'Hola Ana, ¿en qué puedo ayudarte hoy?', time: '09:15' },
  { from: 'client', text: 'Hola Carlos, tengo una duda sobre mi póliza de auto.', time: '09:16' },
  { from: 'agent', text: 'Claro, dime ¿qué necesitas saber?', time: '09:17' },
]

export default function ClientMensajesPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  function send() {
    if (!input.trim()) return
    setMessages(prev => [...prev, { from: 'client', text: input, time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) }])
    setInput('')
    // Simular respuesta del agente
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'agent', text: 'Gracias por tu mensaje. Te responderé a la brevedad.', time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) }])
    }, 1500)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#69A481]/15 flex items-center justify-center">
          <MessageSquare size={16} className="text-[#69A481]" />
        </div>
        <div>
          <p className="text-[15px] text-[#1A1F2B]">Carlos Ramírez</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#69A481]" />
            <p className="text-[11px] text-[#69A481]">Disponible</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto bg-[#EFF2F9] rounded-2xl p-4 shadow-[inset_-4px_-4px_10px_#FAFBFF,inset_4px_4px_10px_rgba(22,27,29,0.12)] mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed
              ${msg.from === 'client'
                ? 'bg-[#F7941D] text-white rounded-tr-sm'
                : 'bg-[#EFF2F9] text-[#1A1F2B] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.13)] rounded-tl-sm'}`}>
              {msg.text}
              <p className={`text-[10px] mt-1 ${msg.from === 'client' ? 'text-white/60' : 'text-[#9CA3AF]'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 bg-[#EFF2F9] rounded-2xl shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.14)] px-4">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-transparent py-4 text-[13px] text-[#1A1F2B] outline-none placeholder:text-[#9CA3AF]" />
        <button onClick={send}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F7941D] text-white hover:bg-[#E8820A] transition-colors active:scale-95">
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
