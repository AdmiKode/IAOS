'use client'
import { useState } from 'react'
import { MOCK_SINIESTROS } from '@/data/mock'
import { AlertTriangle, CheckCircle, Clock, FileText, Upload, X, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_COLOR: Record<string, string> = {
  en_proceso: '#F7941D', cerrado: '#69A481', abierto: '#7C1F31'
}

const TIPO_COLOR: Record<string, string> = {
  'Robo de vehículo': '#7C1F31',
  'Daño a terceros': '#F7941D',
  'Muerte accidental': '#7C1F31',
  'Incendio': '#F7941D',
  'Responsabilidad civil': '#6B7280',
  default: '#6B7280'
}

export default function SiniestrosPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filtered = filterStatus ? MOCK_SINIESTROS.filter(s => s.status === filterStatus) : MOCK_SINIESTROS
  const selectedSiniestro = selected ? MOCK_SINIESTROS.find(s => s.id === selected) : null

  const kpis = [
    { label: 'Total', val: MOCK_SINIESTROS.length, color: '#6B7280' },
    { label: 'En proceso', val: MOCK_SINIESTROS.filter(s => s.status === 'en_proceso').length, color: '#F7941D' },
    { label: 'Cerrados', val: MOCK_SINIESTROS.filter(s => s.status === 'cerrado').length, color: '#69A481' },
    { label: 'Monto total', val: '$' + MOCK_SINIESTROS.reduce((acc, s) => acc + parseInt(s.monto.replace(/\D/g, '') || '0'), 0).toLocaleString(), color: '#7C1F31' },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.color}15` }}>
              <AlertTriangle size={14} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-[18px] leading-tight font-medium" style={{ color: k.color }}>{k.val}</p>
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros + acción */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {[null, 'en_proceso', 'cerrado'].map(s => (
            <button key={String(s)} onClick={() => setFilterStatus(s)}
              className="text-[12px] px-3 py-1.5 rounded-xl transition-all"
              style={{
                background: filterStatus === s ? `${STATUS_COLOR[s || ''] || '#6B7280'}15` : 'transparent',
                color: filterStatus === s ? STATUS_COLOR[s || ''] || '#1A1F2B' : '#9CA3AF',
                border: `1px solid ${filterStatus === s ? STATUS_COLOR[s || ''] || '#D1D5DB' : '#D1D5DB'}`
              }}>
              {s === null ? 'Todos' : s === 'en_proceso' ? 'En proceso' : 'Cerrados'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_3px_10px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-all">
          <Plus size={13} />
          Nuevo siniestro
        </button>
      </div>

      {/* Layout: lista + ficha */}
      <div className="flex gap-4">
        {/* Lista */}
        <div className={cn('flex flex-col gap-3', selectedSiniestro ? 'hidden md:flex md:w-[45%]' : 'w-full')}>
          {filtered.map(s => {
            const tipoColor = TIPO_COLOR[s.tipo] || TIPO_COLOR.default
            const isActive = selected === s.id
            return (
              <button key={s.id} onClick={() => setSelected(isActive ? null : s.id)}
                className={cn('w-full text-left bg-[#EFF2F9] rounded-2xl p-5 transition-all',
                  isActive ? 'shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)]' : 'shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] hover:shadow-[-7px_-7px_16px_#FAFBFF,7px_7px_16px_rgba(22,27,29,0.18)]')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${tipoColor}15` }}>
                      <AlertTriangle size={16} style={{ color: tipoColor }} />
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] text-[#1A1F2B]">{s.tipo}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{s.clientName} · {s.aseguradora}</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-xl shrink-0"
                    style={{ background: `${STATUS_COLOR[s.status] || '#9CA3AF'}15`, color: STATUS_COLOR[s.status] || '#9CA3AF' }}>
                    {s.status === 'en_proceso' ? 'En proceso' : s.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 text-[11px] text-[#9CA3AF]">
                  <span>Póliza: {s.policyNumber}</span>
                  <span className="text-[#F7941D]">{s.monto}</span>
                </div>
                {/* Mini timeline */}
                <div className="mt-3 flex gap-1.5">
                  {(s.timeline as any[])?.slice(0, 4).map((ev: any, i: number) => (
                    <div key={i} className="flex-1 h-1 rounded-full"
                      style={{ background: STATUS_COLOR[ev.status] || '#D1D5DB' }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Ficha siniestro */}
        {selectedSiniestro && (
          <div className="flex-1 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex flex-col gap-4 md:max-h-[calc(100vh-160px)] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] text-[#1A1F2B]">{selectedSiniestro.tipo}</p>
                <p className="text-[12px] text-[#9CA3AF]">{selectedSiniestro.clientName} · {(selectedSiniestro as any).fechaOcurrencia || selectedSiniestro.fecha}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>

            {/* Datos clave */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Aseguradora', val: selectedSiniestro.aseguradora },
                { label: 'Póliza', val: selectedSiniestro.policyNumber },
                { label: 'Monto reclamado', val: selectedSiniestro.monto },
                { label: 'Estado', val: selectedSiniestro.status === 'en_proceso' ? 'En proceso' : selectedSiniestro.status },
              ].map(item => (
                <div key={item.label} className="bg-white/40 rounded-xl p-3">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{item.label}</p>
                  <p className="text-[13px] text-[#1A1F2B]">{item.val}</p>
                </div>
              ))}
            </div>

            {/* Descripción */}
            <div className="bg-white/40 rounded-xl p-3">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1">Descripción</p>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">{selectedSiniestro.descripcion}</p>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-[12px] text-[#1A1F2B] mb-3">Seguimiento del siniestro</p>
              <div className="relative flex flex-col">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#D1D5DB]/50" />
                {((selectedSiniestro.timeline as any[]) || []).map((ev: any, i: number) => {
                  const evColor = STATUS_COLOR[ev.status] || '#9CA3AF'
                  return (
                    <div key={ev.id || i} className="flex items-start gap-3 pl-6 pb-4 relative">
                      <div className="absolute left-0 w-[19px] h-[19px] rounded-full flex items-center justify-center"
                        style={{ background: `${evColor}20`, border: `2px solid ${evColor}` }}>
                        {ev.status === 'cerrado' ? <CheckCircle size={9} style={{ color: evColor }} /> : <Clock size={9} style={{ color: evColor }} />}
                      </div>
                      <div>
                        <p className="text-[12px] text-[#1A1F2B]">{ev.label}</p>
                        {ev.nota && <p className="text-[11px] text-[#6B7280]">{ev.nota}</p>}
                        <p className="text-[10px] text-[#9CA3AF]">{ev.fecha}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Documentos */}
            <div>
              <p className="text-[12px] text-[#1A1F2B] mb-2">Documentos adjuntos</p>
              <div className="flex flex-col gap-2">
                {['Acta de siniestro.pdf', 'Fotos del incidente.zip', 'Dictamen aseguradora.pdf'].map(doc => (
                  <div key={doc} className="flex items-center gap-2 bg-white/40 rounded-xl p-2.5">
                    <FileText size={13} className="text-[#9CA3AF]" />
                    <p className="text-[12px] text-[#6B7280] flex-1">{doc}</p>
                    <button className="text-[10px] text-[#F7941D] hover:underline">Ver</button>
                  </div>
                ))}
                <button className="flex items-center gap-2 text-[12px] text-[#9CA3AF] hover:text-[#F7941D] transition-colors mt-1">
                  <Upload size={13} />
                  Subir documento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal nuevo siniestro */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(26,31,43,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl p-6 w-full max-w-md shadow-[-12px_-12px_24px_#FAFBFF,12px_12px_24px_rgba(22,27,29,0.20)]">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[15px] text-[#1A1F2B]">Apertura de siniestro</p>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31]">
                <X size={13} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Cliente', placeholder: 'Nombre del cliente' },
                { label: 'Número de póliza', placeholder: 'POL-00000' },
                { label: 'Tipo de siniestro', placeholder: 'Robo, daño, accidente...' },
                { label: 'Monto estimado', placeholder: '$0.00' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[11px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">{f.label}</label>
                  <input placeholder={f.placeholder}
                    className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                </div>
              ))}
              <div>
                <label className="text-[11px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Descripción</label>
                <textarea rows={3} placeholder="Descripción del siniestro..."
                  className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-full py-3 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-all">
                Registrar siniestro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
