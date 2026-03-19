'use client'
import { MOCK_LEADS, PIPELINE_STAGES } from '@/data/mock'
import { Plus, Search, X, Mail, Phone, Calendar, TrendingUp, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const STAGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  nuevo:         { bg: 'bg-[#9CA3AF]/12', text: 'text-[#9CA3AF]', dot: '#9CA3AF' },
  contactado:    { bg: 'bg-[#6B7280]/12', text: 'text-[#6B7280]', dot: '#6B7280' },
  perfilamiento: { bg: 'bg-[#F7941D]/12', text: 'text-[#F7941D]', dot: '#F7941D' },
  expediente:    { bg: 'bg-[#F7941D]/12', text: 'text-[#F7941D]', dot: '#F7941D' },
  cotizacion:    { bg: 'bg-[#69A481]/12', text: 'text-[#69A481]', dot: '#69A481' },
  negociacion:   { bg: 'bg-[#69A481]/12', text: 'text-[#69A481]', dot: '#69A481' },
  aceptacion:    { bg: 'bg-[#7C1F31]/12', text: 'text-[#7C1F31]', dot: '#7C1F31' },
  emision:       { bg: 'bg-[#7C1F31]/12', text: 'text-[#7C1F31]', dot: '#7C1F31' },
}

export default function PipelinePage() {
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<typeof MOCK_LEADS[0] | null>(null)

  const filtered = MOCK_LEADS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.product || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.ramo || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[#9CA3AF]">{MOCK_LEADS.length} prospectos activos</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar prospecto..."
              className="w-[200px] bg-[#EFF2F9] rounded-xl pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#9CA3AF]" />
          </div>
          <button className="flex items-center gap-2 h-9 px-4 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
            <Plus size={13} />
            Nuevo
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Kanban */}
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
          {PIPELINE_STAGES.map(stage => {
            const leads = filtered.filter(l => l.stage === stage.id)
            const color = STAGE_COLORS[stage.id] || { bg: 'bg-[#9CA3AF]/12', text: 'text-[#9CA3AF]', dot: '#9CA3AF' }
            return (
              <div key={stage.id} className="flex flex-col min-w-[185px] w-[185px]">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.dot }} />
                  <span className="text-[11px] text-[#6B7280] tracking-wide flex-1 truncate">{stage.label}</span>
                  <span className="text-[10px] bg-[#EFF2F9] rounded-full px-2 py-0.5 shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.12)] text-[#9CA3AF]">{leads.length}</span>
                </div>
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                  {leads.map(lead => (
                    <button key={lead.id} onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                      className={cn('w-full text-left bg-[#EFF2F9] rounded-xl p-3 transition-all',
                        selectedLead?.id === lead.id ? 'shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] border-l-2 border-[#F7941D]' : 'shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)] hover:shadow-[-6px_-6px_12px_#FAFBFF,6px_6px_12px_rgba(22,27,29,0.18)]')}>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <p className="text-[12px] text-[#1A1F2B] leading-tight">{lead.name}</p>
                        <span className={cn('text-[9px] px-1.5 py-0.5 rounded-md shrink-0', color.bg, color.text)}>{lead.score}%</span>
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] truncate">{lead.product || lead.ramo}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-[#F7941D]">{lead.value || '—'}</span>
                        <span className="text-[10px] text-[#B5BFC6]">{lead.lastContact}</span>
                      </div>
                    </button>
                  ))}
                  {leads.length === 0 && (
                    <div className="h-16 rounded-xl border border-dashed border-[#E5E7EB] flex items-center justify-center">
                      <span className="text-[10px] text-[#D1D5DB]">Sin prospectos</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Panel lateral del lead */}
        {selectedLead && (
          <div className="w-[280px] shrink-0 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] text-[#1A1F2B]">{selectedLead.name}</p>
                <p className="text-[11px] text-[#9CA3AF]">{selectedLead.email || 'Sin email'}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#7C1F31] transition-colors shrink-0">
                <X size={12} />
              </button>
            </div>

            {/* Score */}
            <div className="bg-white/40 rounded-xl p-3 flex items-center gap-3">
              <Star size={14} className="text-[#F7941D]" />
              <div className="flex-1">
                <p className="text-[11px] text-[#9CA3AF]">Score de cierre</p>
                <div className="w-full h-1.5 bg-[#EFF2F9] rounded-full shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.10)] mt-1">
                  <div className="h-full rounded-full bg-[#F7941D]" style={{ width: `${selectedLead.score}%` }} />
                </div>
              </div>
              <p className="text-[14px] text-[#F7941D] shrink-0">{selectedLead.score}%</p>
            </div>

            {/* Datos */}
            <div className="flex flex-col gap-2">
              {[
                { icon: TrendingUp, label: 'Producto', val: selectedLead.product || selectedLead.ramo || '—' },
                { icon: Calendar, label: 'Ultimo contacto', val: selectedLead.lastContact },
                { icon: Phone, label: 'Telefono', val: selectedLead.phone || 'N/A' },
                { icon: Mail, label: 'Email', val: selectedLead.email || 'N/A' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <item.icon size={12} className="text-[#9CA3AF] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#9CA3AF]">{item.label}</p>
                    <p className="text-[12px] text-[#1A1F2B] truncate">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Valor */}
            {selectedLead.value && (
              <div className="bg-[#F7941D]/10 rounded-xl p-3">
                <p className="text-[10px] text-[#9CA3AF]">Valor estimado</p>
                <p className="text-[18px] text-[#F7941D]">{selectedLead.value}</p>
              </div>
            )}

            {/* Notas */}
            {(selectedLead as any).notas && (selectedLead as any).notas.length > 0 && (
              <div>
                <p className="text-[11px] text-[#9CA3AF] mb-2">Notas</p>
                {((selectedLead as any).notas as string[]).map((n: string, i: number) => (
                  <p key={i} className="text-[11px] text-[#6B7280] bg-white/40 rounded-xl p-2 mb-1.5">{n}</p>
                ))}
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col gap-2 mt-auto">
              <button className="w-full py-2.5 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_3px_10px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-all">
                Avanzar etapa
              </button>
              <button className="w-full py-2.5 bg-[#EFF2F9] rounded-xl text-[#6B7280] text-[12px] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-all">
                Agregar nota
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
