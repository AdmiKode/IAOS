'use client'
import { useState } from 'react'
import { ArrowLeft, Search, Filter, Check, X, AlertCircle, Clock, FileText, ChevronRight, Download, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { exportCSV } from '@/lib/exportCSV'

type UWStatus = 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'info_adicional'

const MOCK_SOLICITUDES = [
  { id: 'SOL-2026-0041', agente: 'Valeria Castillo', asegurado: 'Carlos Méndez Ruiz', ramo: 'GMM Individual', prima: '$8,400', riesgo: 'Bajo', status: 'pendiente' as UWStatus, fecha: '14 Mar 2026', agencia: 'Seguros Plus GDL' },
  { id: 'SOL-2026-0040', agente: 'Diego Pacheco', asegurado: 'Empresa Textil S.A.', ramo: 'GMM Colectivo', prima: '$42,000', riesgo: 'Medio', status: 'en_revision' as UWStatus, fecha: '13 Mar 2026', agencia: 'Seguros Plus MTY' },
  { id: 'SOL-2026-0039', agente: 'Ana Domínguez', asegurado: 'Roberto Sánchez', ramo: 'Vida Individual', prima: '$3,200', riesgo: 'Alto', status: 'info_adicional' as UWStatus, fecha: '12 Mar 2026', agencia: 'Seguros Plus CDMX' },
  { id: 'SOL-2026-0038', agente: 'Luis Ramírez', asegurado: 'Sofía Torres García', ramo: 'GMM Individual', prima: '$6,100', riesgo: 'Bajo', status: 'aprobada' as UWStatus, fecha: '11 Mar 2026', agencia: 'Seguros Plus GDL' },
  { id: 'SOL-2026-0037', agente: 'Valeria Castillo', asegurado: 'Juan Pablo Reyes', ramo: 'Vida Individual', prima: '$5,500', riesgo: 'Alto', status: 'rechazada' as UWStatus, fecha: '10 Mar 2026', agencia: 'Seguros Plus GDL' },
  { id: 'SOL-2026-0036', agente: 'Diego Pacheco', asegurado: 'Grupo Comercial Norte', ramo: 'GMM Colectivo', prima: '$78,000', riesgo: 'Bajo', status: 'aprobada' as UWStatus, fecha: '09 Mar 2026', agencia: 'Seguros Plus MTY' },
  { id: 'SOL-2026-0035', agente: 'Héctor Ríos', asegurado: 'Patricia Leal', ramo: 'GMM Individual', prima: '$9,200', riesgo: 'Medio', status: 'pendiente' as UWStatus, fecha: '08 Mar 2026', agencia: 'Seguros Plus GDL' },
  { id: 'SOL-2026-0034', agente: 'Ana Domínguez', asegurado: 'Constructora Omega', ramo: 'GMM Colectivo', prima: '$55,000', riesgo: 'Medio', status: 'en_revision' as UWStatus, fecha: '07 Mar 2026', agencia: 'Seguros Plus CDMX' },
]

const STATUS_MAP: Record<UWStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pendiente:      { label: 'Pendiente',        color: '#F7941D', bg: 'rgba(247,148,29,0.10)',  icon: Clock },
  en_revision:    { label: 'En revisión',      color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  icon: Eye },
  aprobada:       { label: 'Aprobada',         color: '#69A481', bg: 'rgba(105,164,129,0.10)', icon: Check },
  rechazada:      { label: 'Rechazada',        color: '#7C1F31', bg: 'rgba(124,31,49,0.10)',   icon: X },
  info_adicional: { label: 'Info. adicional',  color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)', icon: AlertCircle },
}

const RIESGO_COLOR: Record<string, string> = {
  Bajo:  '#69A481',
  Medio: '#F7941D',
  Alto:  '#7C1F31',
}

export default function UnderwritingPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<UWStatus | 'todos'>('todos')
  const [selected, setSelected] = useState<typeof MOCK_SOLICITUDES[0] | null>(null)
  const [accionModal, setAccionModal] = useState<'aprobar' | 'rechazar' | 'info' | null>(null)
  const [nota, setNota] = useState('')
  const [statusLocal, setStatusLocal] = useState<Record<string, UWStatus>>({})

  const filtered = MOCK_SOLICITUDES.filter(s => {
    const stLocal = statusLocal[s.id] ?? s.status
    const matchStatus = filterStatus === 'todos' || stLocal === filterStatus
    const matchSearch = !search || s.asegurado.toLowerCase().includes(search.toLowerCase()) || s.agente.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totales = {
    pendiente: MOCK_SOLICITUDES.filter(s => (statusLocal[s.id] ?? s.status) === 'pendiente').length,
    en_revision: MOCK_SOLICITUDES.filter(s => (statusLocal[s.id] ?? s.status) === 'en_revision').length,
    aprobada: MOCK_SOLICITUDES.filter(s => (statusLocal[s.id] ?? s.status) === 'aprobada').length,
    rechazada: MOCK_SOLICITUDES.filter(s => (statusLocal[s.id] ?? s.status) === 'rechazada').length,
  }

  function ejecutarAccion(accion: 'aprobar' | 'rechazar' | 'info') {
    if (!selected) return
    const nuevoStatus: UWStatus = accion === 'aprobar' ? 'aprobada' : accion === 'rechazar' ? 'rechazada' : 'info_adicional'
    setStatusLocal(prev => ({ ...prev, [selected.id]: nuevoStatus }))
    setAccionModal(null)
    setSelected(null)
    setNota('')
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
            <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">Underwriting</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Bandeja de suscripción</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Evalúa y resuelve solicitudes de emisión de tus agentes</p>
        </div>
        <div className="ml-auto">
          <button onClick={() => exportCSV(MOCK_SOLICITUDES.map(s => ({ ID: s.id, Agente: s.agente, Asegurado: s.asegurado, Ramo: s.ramo, Prima: s.prima, Riesgo: s.riesgo, Estatus: statusLocal[s.id] ?? s.status, Fecha: s.fecha })), 'underwriting')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
            <Download size={13} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI rápidos */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Pendientes', val: totales.pendiente, color: '#F7941D' },
          { label: 'En revisión', val: totales.en_revision, color: '#3B82F6' },
          { label: 'Aprobadas', val: totales.aprobada, color: '#69A481' },
          { label: 'Rechazadas', val: totales.rechazada, color: '#7C1F31' },
        ].map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl px-4 py-3 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex flex-col gap-1">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">{k.label}</p>
            <p className="text-[24px] font-bold leading-none" style={{ color: k.color }}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#EFF2F9] rounded-xl px-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.08)]">
          <Search size={14} className="text-[#9CA3AF] shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por asegurado, agente o ID..."
            className="flex-1 bg-transparent py-2.5 text-[13px] text-[#1A1F2B] outline-none placeholder:text-[#9CA3AF]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['todos', 'pendiente', 'en_revision', 'aprobada', 'rechazada', 'info_adicional'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn('px-3 py-2 rounded-xl text-[11px] font-semibold transition-all', filterStatus === s
                ? 'text-white shadow-[0_3px_10px_rgba(247,148,29,0.35)]'
                : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B]')}
              style={filterStatus === s ? { background: s === 'todos' ? '#F7941D' : (STATUS_MAP[s as UWStatus]?.color ?? '#F7941D') } : {}}>
              {s === 'todos' ? 'Todas' : STATUS_MAP[s as UWStatus]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <div className="bg-[#EFF2F9] rounded-2xl shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)] overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_80px_100px_110px_40px] gap-x-3 px-5 py-3 border-b border-[#D1D5DB]/20">
          {['ID / Fecha', 'Asegurado', 'Agente', 'Ramo', 'Prima', 'Estatus', ''].map(h => (
            <span key={h} className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-[#9CA3AF]">Sin solicitudes para los filtros seleccionados</div>
        ) : (
          filtered.map(s => {
            const stLocal = statusLocal[s.id] ?? s.status
            const st = STATUS_MAP[stLocal]
            const StIcon = st.icon
            return (
              <div key={s.id} onClick={() => setSelected(s)}
                className="grid grid-cols-[1fr_1fr_1fr_80px_100px_110px_40px] gap-x-3 px-5 py-3.5 border-b border-[#D1D5DB]/10 hover:bg-white/40 transition-colors cursor-pointer items-center">
                <div>
                  <p className="text-[12px] text-[#1A1F2B] font-semibold">{s.id}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{s.fecha}</p>
                </div>
                <p className="text-[12px] text-[#1A1F2B] truncate">{s.asegurado}</p>
                <p className="text-[12px] text-[#6B7280] truncate">{s.agente}</p>
                <p className="text-[11px] text-[#6B7280] truncate">{s.ramo.replace(' Individual', ' Ind.').replace(' Colectivo', ' Col.')}</p>
                <p className="text-[12px] text-[#F7941D] font-semibold">{s.prima}</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold w-fit" style={{ color: st.color, background: st.bg }}>
                  <StIcon size={10} />{st.label}
                </span>
                <ChevronRight size={13} className="text-[#D1D5DB] justify-self-end" />
              </div>
            )
          })
        )}
      </div>

      {/* Panel detalle / acciones */}
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
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{selected.fecha} · {selected.agencia}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] flex items-center justify-center text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Datos clave */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Asegurado', val: selected.asegurado },
                  { label: 'Agente', val: selected.agente },
                  { label: 'Ramo', val: selected.ramo },
                  { label: 'Prima anual', val: selected.prima },
                  { label: 'Nivel de riesgo', val: selected.riesgo, color: RIESGO_COLOR[selected.riesgo] },
                  { label: 'Agencia', val: selected.agencia },
                ].map(item => (
                  <div key={item.label} className="bg-white/50 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-[13px] font-semibold" style={{ color: item.color ?? '#1A1F2B' }}>{item.val}</p>
                  </div>
                ))}
              </div>

              {/* Nota del suscriptor */}
              {accionModal ? (
                <div className="flex flex-col gap-3">
                  <p className="text-[12px] text-[#6B7280]">
                    {accionModal === 'aprobar' ? 'Agrega una nota de aprobación (opcional):' :
                     accionModal === 'rechazar' ? 'Indica el motivo de rechazo:' :
                     'Especifica qué información adicional se requiere:'}
                  </p>
                  <textarea rows={3} value={nota} onChange={e => setNota(e.target.value)}
                    placeholder={accionModal === 'aprobar' ? 'Ej. Aprobada sin restricciones. Riesgo dentro de parámetros.' :
                      accionModal === 'rechazar' ? 'Ej. Riesgo médico preexistente no cubierto según art. 45 condiciones generales.' :
                      'Ej. Solicitar carta de buen estado de salud y estudios de laboratorio recientes.'}
                    className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[12px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  <div className="flex gap-2">
                    <button onClick={() => setAccionModal(null)}
                      className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
                      Cancelar
                    </button>
                    <button onClick={() => ejecutarAccion(accionModal)}
                      className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all"
                      style={{ background: accionModal === 'aprobar' ? '#69A481' : accionModal === 'rechazar' ? '#7C1F31' : '#3B82F6', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
                      Confirmar {accionModal === 'aprobar' ? 'aprobación' : accionModal === 'rechazar' ? 'rechazo' : 'solicitud de info'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setAccionModal('rechazar')}
                    className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-[#7C1F31] bg-[#7C1F31]/8 border border-[#7C1F31]/20 hover:bg-[#7C1F31]/15 transition-all flex items-center justify-center gap-1.5">
                    <X size={13} /> Rechazar
                  </button>
                  <button onClick={() => setAccionModal('info')}
                    className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-[#3B82F6] bg-[#3B82F6]/8 border border-[#3B82F6]/20 hover:bg-[#3B82F6]/15 transition-all flex items-center justify-center gap-1.5">
                    <AlertCircle size={13} /> Pedir info
                  </button>
                  <button onClick={() => setAccionModal('aprobar')}
                    className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-white transition-all flex items-center justify-center gap-1.5"
                    style={{ background: '#69A481', boxShadow: '0 4px 14px rgba(105,164,129,0.35)' }}>
                    <Check size={13} /> Aprobar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
