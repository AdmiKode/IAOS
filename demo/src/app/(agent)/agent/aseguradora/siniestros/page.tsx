'use client'
import { useState } from 'react'
import { ArrowLeft, Search, Download, ChevronRight, X, Check, AlertTriangle, Clock, Eye, FileText, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { exportCSV } from '@/lib/exportCSV'

type ClaimStatus = 'nuevo' | 'en_investigacion' | 'documentacion' | 'aprobado' | 'pagado' | 'rechazado'

const MOCK_CLAIMS = [
  { id: 'SIN-2026-0041', poliza: 'POL-2026-0101', asegurado: 'Carlos Méndez Ruiz', agente: 'Valeria Castillo', ramo: 'GMM Individual', tipo: 'Cirugía de urgencia', fecha: '14 Mar 2026', reserva: '$85,000', status: 'nuevo' as ClaimStatus },
  { id: 'SIN-2026-0040', poliza: 'POL-2026-0100', asegurado: 'Empresa Textil S.A.', agente: 'Diego Pacheco', ramo: 'GMM Colectivo', tipo: 'Hospitalización — empleado', fecha: '13 Mar 2026', reserva: '$42,000', status: 'en_investigacion' as ClaimStatus },
  { id: 'SIN-2026-0039', poliza: 'POL-2025-0076', asegurado: 'Roberto Sánchez', agente: 'Ana Domínguez', ramo: 'Vida Individual', tipo: 'Fallecimiento', fecha: '11 Mar 2026', reserva: '$500,000', status: 'documentacion' as ClaimStatus },
  { id: 'SIN-2026-0038', poliza: 'POL-2025-0070', asegurado: 'Grupo Comercial Norte', agente: 'Diego Pacheco', ramo: 'GMM Colectivo', tipo: 'Hospitalización — empleado', fecha: '09 Mar 2026', reserva: '$28,000', status: 'aprobado' as ClaimStatus },
  { id: 'SIN-2026-0037', poliza: 'POL-2026-0099', asegurado: 'Sofía Torres García', agente: 'Luis Ramírez', ramo: 'GMM Individual', tipo: 'Consulta especialista + estudios', fecha: '07 Mar 2026', reserva: '$12,500', status: 'pagado' as ClaimStatus },
  { id: 'SIN-2026-0036', poliza: 'POL-2025-0088', asegurado: 'Patricia Leal', agente: 'Héctor Ríos', ramo: 'GMM Individual', tipo: 'Medicamentos especializados', fecha: '05 Mar 2026', reserva: '$9,800', status: 'rechazado' as ClaimStatus },
]

const STATUS_MAP: Record<ClaimStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  nuevo:            { label: 'Nuevo',            color: '#F7941D', bg: 'rgba(247,148,29,0.10)',  icon: AlertTriangle },
  en_investigacion: { label: 'Investigando',     color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  icon: Eye },
  documentacion:    { label: 'Documentación',    color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)', icon: FileText },
  aprobado:         { label: 'Aprobado',         color: '#69A481', bg: 'rgba(105,164,129,0.10)', icon: Check },
  pagado:           { label: 'Pagado',           color: '#69A481', bg: 'rgba(105,164,129,0.12)', icon: Check },
  rechazado:        { label: 'Rechazado',        color: '#7C1F31', bg: 'rgba(124,31,49,0.10)',   icon: X },
}

const FLUJO: ClaimStatus[] = ['nuevo', 'en_investigacion', 'documentacion', 'aprobado', 'pagado']

export default function CoreSiniestrosPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ClaimStatus | 'todos'>('todos')
  const [selected, setSelected] = useState<typeof MOCK_CLAIMS[0] | null>(null)
  const [statusLocal, setStatusLocal] = useState<Record<string, ClaimStatus>>({})
  const [nota, setNota] = useState('')
  const [showNota, setShowNota] = useState(false)

  const filtered = MOCK_CLAIMS.filter(c => {
    const stLocal = statusLocal[c.id] ?? c.status
    const matchStatus = filterStatus === 'todos' || stLocal === filterStatus
    const matchSearch = !search || c.asegurado.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.agente.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totales = {
    nuevo: MOCK_CLAIMS.filter(c => (statusLocal[c.id] ?? c.status) === 'nuevo').length,
    en_investigacion: MOCK_CLAIMS.filter(c => (statusLocal[c.id] ?? c.status) === 'en_investigacion').length,
    aprobado: MOCK_CLAIMS.filter(c => (statusLocal[c.id] ?? c.status) === 'aprobado').length,
    pagado: MOCK_CLAIMS.filter(c => (statusLocal[c.id] ?? c.status) === 'pagado').length,
  }

  const reservaTotal = MOCK_CLAIMS.reduce((s, c) => s + parseFloat(c.reserva.replace(/[$,]/g, '')), 0)

  function avanzarStatus(claim: typeof MOCK_CLAIMS[0]) {
    const stLocal = statusLocal[claim.id] ?? claim.status
    const idx = FLUJO.indexOf(stLocal)
    if (idx < FLUJO.length - 1) {
      setStatusLocal(prev => ({ ...prev, [claim.id]: FLUJO[idx + 1] }))
    }
    setSelected(null)
    setNota('')
    setShowNota(false)
  }

  function rechazarClaim(claim: typeof MOCK_CLAIMS[0]) {
    setStatusLocal(prev => ({ ...prev, [claim.id]: 'rechazado' }))
    setSelected(null)
    setNota('')
    setShowNota(false)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/agent/dashboard')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] text-[#F7941D] font-semibold tracking-[0.2em] uppercase">Core Asegurador</span>
            <span className="text-[10px] text-[#D1D5DB]">·</span>
            <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">Claims</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Gestión de siniestros</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Registro, investigación y resolución de reclamaciones</p>
        </div>
        <div className="ml-auto">
          <button onClick={() => exportCSV(MOCK_CLAIMS.map(c => ({ ID: c.id, Póliza: c.poliza, Asegurado: c.asegurado, Agente: c.agente, Ramo: c.ramo, Tipo: c.tipo, Fecha: c.fecha, Reserva: c.reserva, Estatus: statusLocal[c.id] ?? c.status })), 'claims')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Nuevos', val: totales.nuevo, color: '#F7941D' },
          { label: 'Investigando', val: totales.en_investigacion, color: '#3B82F6' },
          { label: 'Aprobados', val: totales.aprobado, color: '#69A481' },
          { label: 'Pagados', val: totales.pagado, color: '#69A481' },
          { label: 'Reserva total', val: `$${reservaTotal.toLocaleString('es-MX')}`, color: '#7C1F31' },
        ].map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl px-4 py-3 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex flex-col gap-1">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider leading-tight">{k.label}</p>
            <p className="text-[20px] font-bold leading-none mt-0.5 truncate" style={{ color: k.color }}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#EFF2F9] rounded-xl px-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.08)]">
          <Search size={14} className="text-[#9CA3AF] shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar asegurado, agente o ID..."
            className="flex-1 bg-transparent py-2.5 text-[13px] text-[#1A1F2B] outline-none placeholder:text-[#9CA3AF]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['todos', 'nuevo', 'en_investigacion', 'documentacion', 'aprobado', 'pagado', 'rechazado'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn('px-3 py-2 rounded-xl text-[11px] font-semibold transition-all', filterStatus === s
                ? 'text-white'
                : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B]')}
              style={filterStatus === s ? { background: s === 'todos' ? '#F7941D' : STATUS_MAP[s as ClaimStatus].color } : {}}>
              {s === 'todos' ? 'Todos' : STATUS_MAP[s as ClaimStatus].label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de siniestros */}
      <div className="bg-[#EFF2F9] rounded-2xl shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)] overflow-hidden">
        <div className="grid grid-cols-[1fr_1.2fr_1fr_1fr_90px_110px_40px] gap-x-3 px-5 py-3 border-b border-[#D1D5DB]/20">
          {['ID / Fecha', 'Asegurado', 'Agente', 'Tipo de siniestro', 'Reserva', 'Estatus', ''].map(h => (
            <span key={h} className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-[#9CA3AF]">Sin siniestros para los filtros seleccionados</div>
        ) : (
          filtered.map(c => {
            const stLocal = statusLocal[c.id] ?? c.status
            const st = STATUS_MAP[stLocal]
            const StIcon = st.icon
            return (
              <div key={c.id} onClick={() => setSelected(c)}
                className="grid grid-cols-[1fr_1.2fr_1fr_1fr_90px_110px_40px] gap-x-3 px-5 py-3.5 border-b border-[#D1D5DB]/10 hover:bg-white/40 transition-colors cursor-pointer items-center">
                <div>
                  <p className="text-[12px] text-[#1A1F2B] font-semibold">{c.id}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{c.fecha}</p>
                </div>
                <p className="text-[12px] text-[#1A1F2B] truncate">{c.asegurado}</p>
                <p className="text-[11px] text-[#6B7280] truncate">{c.agente}</p>
                <p className="text-[11px] text-[#6B7280] truncate">{c.tipo}</p>
                <p className="text-[12px] text-[#7C1F31] font-semibold">{c.reserva}</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold w-fit" style={{ color: st.color, background: st.bg }}>
                  <StIcon size={10} />{st.label}
                </span>
                <ChevronRight size={13} className="text-[#D1D5DB] justify-self-end" />
              </div>
            )
          })
        )}
      </div>

      {/* Modal detalle siniestro */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-lg shadow-[-20px_-20px_50px_#FAFBFF,20px_20px_50px_rgba(22,27,29,0.25)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[16px] text-[#1A1F2B] font-bold">{selected.id}</p>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold"
                    style={{ color: STATUS_MAP[statusLocal[selected.id] ?? selected.status].color, background: STATUS_MAP[statusLocal[selected.id] ?? selected.status].bg }}>
                    {STATUS_MAP[statusLocal[selected.id] ?? selected.status].label}
                  </span>
                </div>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{selected.fecha} · {selected.poliza}</p>
              </div>
              <button onClick={() => { setSelected(null); setShowNota(false); setNota('') }}
                className="w-8 h-8 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] flex items-center justify-center text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Datos clave */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Asegurado', val: selected.asegurado },
                  { label: 'Agente', val: selected.agente },
                  { label: 'Ramo / tipo', val: `${selected.ramo} · ${selected.tipo}` },
                  { label: 'Reserva estimada', val: selected.reserva, color: '#7C1F31' },
                ].map(item => (
                  <div key={item.label} className="bg-white/50 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-[13px] font-semibold" style={{ color: item.color ?? '#1A1F2B' }}>{item.val}</p>
                  </div>
                ))}
              </div>

              {/* Flujo de estatus */}
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-2">Flujo del siniestro</p>
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {FLUJO.map((step, idx) => {
                    const stLocal = statusLocal[selected.id] ?? selected.status
                    const currentIdx = FLUJO.indexOf(stLocal)
                    const isDone = idx <= currentIdx
                    const st = STATUS_MAP[step]
                    return (
                      <div key={step} className="flex items-center shrink-0">
                        <div className={cn('flex flex-col items-center gap-0.5 px-2')}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                            style={{ background: isDone ? st.color : '#EFF2F9', color: isDone ? 'white' : '#9CA3AF', boxShadow: isDone ? '0 2px 8px rgba(0,0,0,0.15)' : 'none' }}>
                            {isDone ? <Check size={9} /> : idx + 1}
                          </div>
                          <span className="text-[9px] text-center whitespace-nowrap" style={{ color: isDone ? st.color : '#9CA3AF' }}>{st.label}</span>
                        </div>
                        {idx < FLUJO.length - 1 && <div className="w-4 h-px" style={{ background: idx < (FLUJO.indexOf(statusLocal[selected.id] ?? selected.status)) ? '#69A481' : '#D1D5DB' }} />}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Nota ajustador */}
              {showNota && (
                <div>
                  <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-1 block">Nota del ajustador</label>
                  <textarea rows={2} value={nota} onChange={e => setNota(e.target.value)}
                    placeholder="Agrega una nota de seguimiento para el expediente..."
                    className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[12px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-2">
                <button onClick={() => setShowNota(v => !v)}
                  className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-all flex items-center justify-center gap-1.5">
                  <MessageCircle size={13} /> Nota
                </button>
                <button onClick={() => rechazarClaim(selected)}
                  className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-[#7C1F31] bg-[#7C1F31]/8 border border-[#7C1F31]/20 hover:bg-[#7C1F31]/15 transition-all flex items-center justify-center gap-1.5">
                  <X size={13} /> Rechazar
                </button>
                {(statusLocal[selected.id] ?? selected.status) !== 'pagado' && (statusLocal[selected.id] ?? selected.status) !== 'rechazado' && (
                  <button onClick={() => avanzarClaim(selected)}
                    className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-white transition-all flex items-center justify-center gap-1.5"
                    style={{ background: '#69A481', boxShadow: '0 4px 14px rgba(105,164,129,0.35)' }}>
                    <ChevronRight size={13} /> Avanzar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  function avanzarClaim(claim: typeof MOCK_CLAIMS[0]) {
    avanzarStatus(claim)
  }
}
