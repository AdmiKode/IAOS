'use client'
import { MOCK_LEADS, PIPELINE_STAGES } from '@/data/mock'
import { Badge } from '@/components/ui'
import { Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const STAGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  nuevo:         { bg: 'bg-[#9CA3AF]/12', text: 'text-[#9CA3AF]', dot: '#9CA3AF' },
  contactado:    { bg: 'bg-[#60A5FA]/12', text: 'text-[#60A5FA]', dot: '#60A5FA' },
  perfilamiento: { bg: 'bg-[#A78BFA]/12', text: 'text-[#A78BFA]', dot: '#A78BFA' },
  expediente:    { bg: 'bg-[#F59E0B]/12', text: 'text-[#F59E0B]', dot: '#F59E0B' },
  cotizacion:    { bg: 'bg-[#F7941D]/12', text: 'text-[#F7941D]', dot: '#F7941D' },
  negociacion:   { bg: 'bg-[#10B981]/12', text: 'text-[#10B981]', dot: '#10B981' },
  aceptacion:    { bg: 'bg-[#69A481]/12', text: 'text-[#69A481]', dot: '#69A481' },
  emision:       { bg: 'bg-[#3B82F6]/12', text: 'text-[#3B82F6]', dot: '#3B82F6' },
}

export default function PipelinePage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_LEADS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.product || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Pipeline de ventas</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">{MOCK_LEADS.length} prospectos activos</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
          <Plus size={15} />
          Nuevo prospecto
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar prospecto..."
          className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.15)] placeholder:text-[#9CA3AF]"
        />
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {PIPELINE_STAGES.map(stage => {
          const leads = filtered.filter(l => l.stage === stage.id)
          const color = STAGE_COLORS[stage.id] || { bg: 'bg-[#9CA3AF]/12', text: 'text-[#9CA3AF]', dot: '#9CA3AF' }
          return (
            <div key={stage.id} className="flex flex-col min-w-[200px] w-[200px]">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.dot }} />
                <span className="text-[11px] text-[#6B7280] tracking-wide flex-1 truncate">{stage.label}</span>
                <span className="text-[10px] bg-[#EFF2F9] rounded-full px-2 py-0.5 shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.12)] text-[#9CA3AF]">
                  {leads.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2.5 flex-1">
                {leads.map(lead => (
                  <div key={lead.id}
                    className="bg-[#EFF2F9] rounded-xl p-3.5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)] cursor-pointer hover:scale-[1.02] transition-transform duration-150 group">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] text-[#1A1F2B] leading-tight group-hover:text-[#F7941D] transition-colors">{lead.name}</p>
                      <span className={cn('text-[9px] px-1.5 py-0.5 rounded-lg shrink-0', color.bg, color.text)}>{lead.score}%</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] mt-1 truncate">{lead.product || lead.ramo}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[12px] text-[#F7941D]">{lead.value || '—'}</span>
                      <span className="text-[10px] text-[#B5BFC6]">{lead.lastContact}</span>
                    </div>
                  </div>
                ))}
                {leads.length === 0 && (
                  <div className="h-20 rounded-xl border-2 border-dashed border-[#E5E7EB] flex items-center justify-center">
                    <span className="text-[11px] text-[#D1D5DB]">Sin prospectos</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
