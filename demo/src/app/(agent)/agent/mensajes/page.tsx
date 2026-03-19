'use client'
import { MOCK_TICKETS } from '@/data/mock'
import { Badge } from '@/components/ui'
import { MessageSquare, Plus } from 'lucide-react'

const STATUS_MAP = {
  abierto:    { label: 'Abierto',     variant: 'warning' as const },
  en_proceso: { label: 'En proceso',  variant: 'info' as const },
  cerrado:    { label: 'Cerrado',     variant: 'success' as const },
}
const PRIORITY_MAP = {
  alta:  { label: 'Alta',  variant: 'danger' as const },
  media: { label: 'Media', variant: 'warning' as const },
  baja:  { label: 'Baja',  variant: 'default' as const },
}

export default function MensajesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Mensajes y tickets</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">{MOCK_TICKETS.filter(t => t.status !== 'cerrado').length} tickets abiertos</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
          <Plus size={15} />
          Nuevo ticket
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_TICKETS.map(ticket => {
          const st = STATUS_MAP[ticket.status]
          const pr = PRIORITY_MAP[ticket.priority]
          return (
            <div key={ticket.id}
              className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex items-start gap-4 cursor-pointer hover:scale-[1.005] transition-transform duration-150">
              <div className="w-10 h-10 rounded-xl bg-[#F7941D]/12 flex items-center justify-center shrink-0">
                <MessageSquare size={16} className="text-[#F7941D]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#1A1F2B] mb-1">{ticket.subject}</p>
                <p className="text-[12px] text-[#9CA3AF]">{ticket.clientName} · {ticket.createdAt}</p>
              </div>
              <div className="flex flex-col gap-1.5 items-end shrink-0">
                <Badge label={st.label} variant={st.variant} size="sm" />
                <Badge label={pr.label} variant={pr.variant} size="sm" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
