'use client'
import { MOCK_AGENDA } from '@/data/mock'
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui'
import { useState } from 'react'

const TYPE_MAP = {
  call:      { label: 'Llamada',     variant: 'info' as const },
  meeting:   { label: 'Reunión',     variant: 'warning' as const },
  followup:  { label: 'Seguimiento', variant: 'default' as const },
  task:      { label: 'Tarea',       variant: 'default' as const },
  llamada:   { label: 'Llamada',     variant: 'info' as const },
  reunion:   { label: 'Reunión',     variant: 'warning' as const },
  seguimiento: { label: 'Seguimiento', variant: 'default' as const },
  expediente:  { label: 'Expediente', variant: 'default' as const },
}

export default function AgendaPage() {
  const [today] = useState(new Date())
  const dayName = today.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Agenda</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5 capitalize">{dayName}</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
          <Plus size={15} />
          Nuevo evento
        </button>
      </div>

      <div className="flex gap-4">
        {/* Timeline */}
        <div className="flex-1 flex flex-col gap-3">
          {MOCK_AGENDA.map((item, i) => {
            const type = TYPE_MAP[item.type as keyof typeof TYPE_MAP] || { label: item.type, variant: 'default' as const }
            return (
              <div key={item.id} className="flex gap-4 items-start">
                {/* Time + line */}
                <div className="flex flex-col items-center gap-1 w-14 shrink-0">
                  <span className="text-[12px] text-[#F7941D] whitespace-nowrap">{item.time}</span>
                  {i < MOCK_AGENDA.length - 1 && (
                    <div className="w-px h-12 bg-gradient-to-b from-[#F7941D]/30 to-transparent" />
                  )}
                </div>
                {/* Card */}
                <div className="flex-1 bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] cursor-pointer hover:scale-[1.01] transition-transform duration-150">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] text-[#1A1F2B] leading-snug">{item.title}</p>
                    <Badge label={type.label} variant={type.variant} size="sm" />
                  </div>
                  {item.client && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-5 h-5 rounded-lg bg-[#F7941D]/15 flex items-center justify-center">
                        <span className="text-[9px] text-[#F7941D]">{item.client[0]}</span>
                      </div>
                      <p className="text-[12px] text-[#9CA3AF]">{item.client}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Mini calendar placeholder */}
        <div className="hidden xl:flex flex-col w-64 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] h-fit">
          <div className="flex items-center justify-between mb-4">
            <button className="w-7 h-7 rounded-lg bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] flex items-center justify-center text-[#6B7280]">
              <ChevronLeft size={12} />
            </button>
            <span className="text-[13px] text-[#1A1F2B] capitalize">
              {today.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
            </span>
            <button className="w-7 h-7 rounded-lg bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] flex items-center justify-center text-[#6B7280]">
              <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['L','M','X','J','V','S','D'].map(d => (
              <span key={d} className="text-[10px] text-[#9CA3AF] pb-1">{d}</span>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <button key={day}
                className={`text-[12px] h-7 w-7 rounded-lg transition-all duration-150 mx-auto flex items-center justify-center
                  ${day === today.getDate() ? 'bg-[#F7941D] text-white shadow-[0_2px_8px_rgba(247,148,29,0.35)]' : 'text-[#6B7280] hover:bg-[#EFF2F9] hover:shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.1)]'}`}>
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
