'use client'
import { MOCK_LEADS, PIPELINE_STAGES, MOCK_ASEGURADORAS, MOCK_RAMOS } from '@/data/mock'
import { Plus, Search, X, Mail, Phone, Calendar, TrendingUp, Star, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ClientLink, NeuSelect } from '@/components/ui'

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
  const [showNewLead, setShowNewLead] = useState(false)
  const [leadSaved, setLeadSaved] = useState(false)
  const [newLead, setNewLead] = useState({ nombre: '', telefono: '', email: '', ramo: '', aseguradora: '', etapa: 'nuevo', valor: '' })
  const [showAdvance, setShowAdvance] = useState(false)
  const [advanceSaved, setAdvanceSaved] = useState(false)
  const [advanceTarget, setAdvanceTarget] = useState('')
  const [showNote, setShowNote] = useState(false)
  const [notaSaved, setNotaSaved] = useState(false)
  const [notaText, setNotaText] = useState('')

  function openNewLead() {
    setShowNewLead(true); setLeadSaved(false)
    setNewLead({ nombre: '', telefono: '', email: '', ramo: '', aseguradora: '', etapa: 'nuevo', valor: '' })
  }
  function handleSaveLead() {
    setLeadSaved(true)
    setTimeout(() => setShowNewLead(false), 1800)
  }

  function handleAdvance() {
    setAdvanceSaved(true)
    setTimeout(() => { setShowAdvance(false); setAdvanceSaved(false); setAdvanceTarget('') }, 1800)
  }

  function handleSaveNote() {
    setNotaSaved(true)
    setTimeout(() => { setShowNote(false); setNotaSaved(false); setNotaText('') }, 1800)
  }

  const filtered = MOCK_LEADS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.product || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.ramo || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
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
          <button onClick={openNewLead} className="flex items-center gap-2 h-9 px-4 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
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
                        <ClientLink name={lead.name} plain className="text-[12px] leading-tight" />
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
                <ClientLink name={selectedLead.name} plain className="text-[14px]" />
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
              <button
                onClick={() => { setShowAdvance(true); setAdvanceSaved(false); setAdvanceTarget('') }}
                className="w-full py-2.5 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_3px_10px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-all">
                Avanzar etapa
              </button>
              <button
                onClick={() => { setShowNote(true); setNotaSaved(false); setNotaText('') }}
                className="w-full py-2.5 bg-[#EFF2F9] rounded-xl text-[#6B7280] text-[12px] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-all">
                Agregar nota
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal nuevo prospecto */}
      {showNewLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md p-6 shadow-[−20px_−20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowNewLead(false)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
              <X size={16} />
            </button>
            <div>
              <h2 className="text-[16px] text-[#1A1F2B]">Nuevo prospecto</h2>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">Captura los datos del prospecto</p>
            </div>

            {leadSaved ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle size={40} className="text-[#69A481]" />
                <p className="text-[14px] text-[#1A1F2B]">Prospecto registrado</p>
                <p className="text-[12px] text-[#9CA3AF]">Se agrego al pipeline en la etapa seleccionada</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] text-[#9CA3AF] mb-1 block">Nombre completo *</label>
                    <input value={newLead.nombre} onChange={e => setNewLead(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej. Maria Lopez"
                      className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#9CA3AF] mb-1 block">Telefono</label>
                      <input value={newLead.telefono} onChange={e => setNewLead(p => ({ ...p, telefono: e.target.value }))} placeholder="55 1234 5678"
                        className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6]" />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9CA3AF] mb-1 block">Email</label>
                      <input value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} placeholder="correo@ejemplo.com"
                        className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#9CA3AF] mb-1 block">Ramo</label>
                      <NeuSelect
                        value={newLead.ramo}
                        onChange={v => setNewLead(p => ({ ...p, ramo: v }))}
                        placeholder="Seleccionar"
                        options={MOCK_RAMOS.map(r => ({ value: r.nombre, label: r.nombre }))}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9CA3AF] mb-1 block">Aseguradora</label>
                      <NeuSelect
                        value={newLead.aseguradora}
                        onChange={v => setNewLead(p => ({ ...p, aseguradora: v }))}
                        placeholder="Seleccionar"
                        options={MOCK_ASEGURADORAS.map(a => ({ value: a.nombre, label: a.nombre }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9CA3AF] mb-1 block">Etapa inicial</label>
                    <div className="flex flex-wrap gap-2">
                      {PIPELINE_STAGES.map(s => (
                        <button key={s.id} onClick={() => setNewLead(p => ({ ...p, etapa: s.id }))}
                          className="px-3 py-1.5 rounded-xl text-[11px] transition-all"
                          style={{ background: newLead.etapa === s.id ? STAGE_COLORS[s.id]?.dot + '22' : '#EFF2F9', color: newLead.etapa === s.id ? STAGE_COLORS[s.id]?.dot : '#9CA3AF', boxShadow: newLead.etapa === s.id ? `0 0 0 1.5px ${STAGE_COLORS[s.id]?.dot}40` : 'none' }}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9CA3AF] mb-1 block">Valor estimado (MXN)</label>
                    <input value={newLead.valor} onChange={e => setNewLead(p => ({ ...p, valor: e.target.value }))} placeholder="Ej. 12,000"
                      className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6]" />
                  </div>
                </div>
                <button onClick={handleSaveLead} disabled={!newLead.nombre}
                  className="w-full py-3 rounded-2xl text-white text-[13px] transition-all disabled:opacity-40 shadow-[0_4px_14px_rgba(247,148,29,0.3)] hover:brightness-110"
                  style={{ background: '#F7941D' }}>
                  Agregar prospecto
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>

      {/* Modal — Avanzar etapa */}
      {showAdvance && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm p-6 shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4">
            <button onClick={() => setShowAdvance(false)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
              <X size={16} />
            </button>
            <div>
              <h2 className="text-[16px] text-[#1A1F2B]">Avanzar etapa</h2>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">{selectedLead.name}</p>
            </div>

            {advanceSaved ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle size={40} className="text-[#69A481]" />
                <p className="text-[14px] text-[#1A1F2B]">Etapa actualizada</p>
                <p className="text-[12px] text-[#9CA3AF]">El prospecto avanzó correctamente</p>
              </div>
            ) : (
              <>
                {/* Etapa actual */}
                <div className="flex items-center gap-3 bg-white/40 rounded-xl p-3">
                  <div className="flex flex-col gap-0.5 flex-1">
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Etapa actual</p>
                    <p className="text-[13px] text-[#1A1F2B]">
                      {PIPELINE_STAGES.find(s => s.id === selectedLead.stage)?.label || selectedLead.stage}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-[#9CA3AF]" />
                </div>

                {/* Selector de nueva etapa */}
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-2">Selecciona la nueva etapa</p>
                  <div className="flex flex-col gap-2">
                    {PIPELINE_STAGES.filter(s => s.id !== selectedLead.stage).map(s => {
                      const sc = STAGE_COLORS[s.id]
                      const isSelected = advanceTarget === s.id
                      return (
                        <button
                          key={s.id}
                          onClick={() => setAdvanceTarget(s.id)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] transition-all text-left"
                          style={{
                            background: isSelected ? (sc?.dot + '18') : '#EFF2F9',
                            color: isSelected ? sc?.dot : '#6B7280',
                            boxShadow: isSelected
                              ? `0 0 0 1.5px ${sc?.dot}50, -2px -2px 5px #FAFBFF, 2px 2px 5px rgba(22,27,29,0.10)`
                              : '-2px -2px 5px #FAFBFF, 2px 2px 5px rgba(22,27,29,0.10)',
                          }}>
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: sc?.dot || '#9CA3AF' }} />
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  onClick={handleAdvance}
                  disabled={!advanceTarget}
                  className="w-full py-3 rounded-2xl text-white text-[13px] transition-all disabled:opacity-40 shadow-[0_4px_14px_rgba(247,148,29,0.3)] hover:brightness-110"
                  style={{ background: '#F7941D' }}>
                  Confirmar avance
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal — Agregar nota */}
      {showNote && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm p-6 shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4">
            <button onClick={() => setShowNote(false)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
              <X size={16} />
            </button>
            <div>
              <h2 className="text-[16px] text-[#1A1F2B]">Agregar nota</h2>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">{selectedLead.name}</p>
            </div>

            {notaSaved ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle size={40} className="text-[#69A481]" />
                <p className="text-[14px] text-[#1A1F2B]">Nota guardada</p>
                <p className="text-[12px] text-[#9CA3AF]">La nota fue registrada en el expediente</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF] bg-white/40 rounded-xl px-3 py-2">
                  <MessageSquare size={12} />
                  <span>{new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div>
                  <label className="text-[11px] text-[#9CA3AF] mb-1 block">Contenido de la nota *</label>
                  <textarea
                    value={notaText}
                    onChange={e => setNotaText(e.target.value)}
                    rows={4}
                    placeholder="Escribe aquí tus observaciones, acuerdos o próximos pasos con el prospecto..."
                    className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6] resize-none leading-relaxed"
                  />
                </div>
                <button
                  onClick={handleSaveNote}
                  disabled={!notaText.trim()}
                  className="w-full py-3 rounded-2xl text-white text-[13px] transition-all disabled:opacity-40 shadow-[0_4px_14px_rgba(247,148,29,0.3)] hover:brightness-110"
                  style={{ background: '#F7941D' }}>
                  Guardar nota
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
