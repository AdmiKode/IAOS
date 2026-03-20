'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Bot, Download, Search, ChevronRight, X,
  AlertTriangle, Clock, CheckCircle, FileText, User, Phone, DollarSign
} from 'lucide-react'
import { exportCSV } from '@/lib/exportCSV'

type SiniestroStatus = 'reportado' | 'en_investigacion' | 'en_proceso' | 'pagado' | 'rechazado'

const SINIESTROS = [
  { id: 'SIN-2026-0018', poliza: 'GNP-GMM-2026-00841', asegurado: 'Carlos Méndez Ruiz', agente: 'Valeria Castillo', ramo: 'GMM Individual', tipo: 'Hospitalización', fecha: '10 Mar 2026', monto: '$42,500', ajustador: 'Ing. Martínez', status: 'en_proceso' as SiniestroStatus, descripcion: 'Hospitalización por apendicitis aguda. Requiere cirugía. Urgencia nivel 2.', diasAbierto: 5 },
  { id: 'SIN-2026-0017', poliza: 'GNP-GMM-2026-00840', asegurado: 'Grupo Comercial Norte', agente: 'Diego Pacheco', ramo: 'GMM Colectivo', tipo: 'Urgencia médica', fecha: '08 Mar 2026', monto: '$18,000', ajustador: 'Lic. Fuentes', status: 'en_investigacion' as SiniestroStatus, descripcion: 'Colaborador presentó urgencia en jornada laboral. Atención en clínica convenida.', diasAbierto: 7 },
  { id: 'SIN-2026-0016', poliza: 'GNP-GMM-2025-00280', asegurado: 'Constructora Omega', agente: 'Ana Domínguez', ramo: 'GMM Colectivo', tipo: 'Maternidad', fecha: '05 Mar 2026', monto: '$28,000', ajustador: 'Dra. Solís', status: 'pagado' as SiniestroStatus, descripcion: 'Parto normal en hospital convenido. Todos los documentos en orden.', diasAbierto: 12 },
  { id: 'SIN-2026-0015', poliza: 'GNP-VIDA-2025-00399', asegurado: 'Sofía Torres García', agente: 'Luis Ramírez', ramo: 'Vida Individual', tipo: 'Invalidez parcial', fecha: '02 Mar 2026', monto: '$85,000', ajustador: 'Ing. Barrera', status: 'en_investigacion' as SiniestroStatus, descripcion: 'Reclamación por invalidez parcial permanente. Requiere dictamen médico especializado.', diasAbierto: 13 },
  { id: 'SIN-2026-0014', poliza: 'GNP-GMM-2025-00312', asegurado: 'Empresa Textil S.A.', agente: 'Diego Pacheco', ramo: 'GMM Colectivo', tipo: 'Urgencia médica', fecha: '28 Feb 2026', monto: '$9,400', ajustador: 'Lic. Fuentes', status: 'pagado' as SiniestroStatus, descripcion: 'Urgencia renal. Atendido en red de hospitales GNP. Documentación completa.', diasAbierto: 0 },
  { id: 'SIN-2026-0013', poliza: 'GNP-GMM-2025-00201', asegurado: 'Patricia Leal', agente: 'Héctor Ríos', ramo: 'GMM Individual', tipo: 'Consulta especialista', fecha: '25 Feb 2026', monto: '$2,800', ajustador: '—', status: 'reportado' as SiniestroStatus, descripcion: 'Consulta con cardiólogo. Pendiente de asignación de ajustador.', diasAbierto: 20 },
  { id: 'SIN-2026-0012', poliza: 'GNP-VIDA-2024-00155', asegurado: 'Roberto Sánchez', agente: 'Ana Domínguez', ramo: 'Vida Individual', tipo: 'Reclamación fallecimiento', fecha: '15 Feb 2026', monto: '$500,000', ajustador: 'Lic. Herrera', status: 'rechazado' as SiniestroStatus, descripcion: 'Reclamación rechazada: causa de muerte no cubierta por la póliza según cláusula de exclusiones.', diasAbierto: 0 },
]

const STATUS_MAP: Record<SiniestroStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  reportado:        { label: 'Reportado',        color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)', icon: FileText },
  en_investigacion: { label: 'En investigación', color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  icon: Search },
  en_proceso:       { label: 'En proceso',       color: '#F7941D', bg: 'rgba(247,148,29,0.10)',  icon: Clock },
  pagado:           { label: 'Pagado',           color: '#69A481', bg: 'rgba(105,164,129,0.10)', icon: CheckCircle },
  rechazado:        { label: 'Rechazado',        color: '#7C1F31', bg: 'rgba(124,31,49,0.10)',   icon: X },
}

export default function SiniestrosPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<SiniestroStatus | 'todos'>('todos')
  const [selected, setSelected] = useState<typeof SINIESTROS[0] | null>(null)
  const [xoriaQ, setXoriaQ] = useState('')
  const [xoriaR, setXoriaR] = useState('')
  const [xoriaLoading, setXoriaLoading] = useState(false)

  const filtered = SINIESTROS.filter(s => {
    const matchStatus = filterStatus === 'todos' || s.status === filterStatus
    const matchSearch = !search || s.asegurado.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) || s.tipo.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totales: Record<SiniestroStatus, number> = {
    reportado: SINIESTROS.filter(s => s.status === 'reportado').length,
    en_investigacion: SINIESTROS.filter(s => s.status === 'en_investigacion').length,
    en_proceso: SINIESTROS.filter(s => s.status === 'en_proceso').length,
    pagado: SINIESTROS.filter(s => s.status === 'pagado').length,
    rechazado: SINIESTROS.filter(s => s.status === 'rechazado').length,
  }

  const montoTotal = SINIESTROS.reduce((sum, s) => {
    const n = parseInt(s.monto.replace(/[$,]/g, ''))
    return sum + n
  }, 0)

  async function askXoria() {
    if (!xoriaQ.trim()) return
    setXoriaLoading(true)
    try {
      const res = await fetch('/api/xoria/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: xoriaQ, context: { perfil: 'aseguradora_claims', siniestros: SINIESTROS, totales, montoTotal } }),
      })
      const d = await res.json()
      setXoriaR(d.response || d.reply || 'Sin respuesta.')
    } catch { setXoriaR('XORIA no disponible.') }
    setXoriaLoading(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/agent/aseguradora')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] text-[#F7941D] font-bold tracking-[0.2em] uppercase">GNP Seguros</span>
            <span className="text-[10px] text-[#D1D5DB]">·</span>
            <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">ClaimCenter</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Gestión de siniestros</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Reclamaciones · Ajustadores · Dictámenes · Indemnizaciones</p>
        </div>
        <div className="ml-auto">
          <button onClick={() => exportCSV(SINIESTROS.map(s => ({ ID: s.id, Asegurado: s.asegurado, Tipo: s.tipo, Monto: s.monto, Estatus: s.status })), 'siniestros')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B]">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-3">
        {(Object.keys(STATUS_MAP) as SiniestroStatus[]).map(k => {
          const stMap = STATUS_MAP[k]
          const Icon = stMap.icon
          return (
            <button key={k} onClick={() => setFilterStatus(filterStatus === k ? 'todos' : k)}
              className={cn('bg-[#EFF2F9] rounded-2xl p-3 text-left transition-all shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]',
                filterStatus === k ? 'shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.15)]' : 'hover:scale-[1.02]')}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={11} style={{ color: stMap.color }} />
                <span className="text-[9px] text-[#9CA3AF] font-semibold uppercase tracking-wider leading-tight">{stMap.label}</span>
              </div>
              <p className="text-[22px] font-bold" style={{ color: stMap.color }}>{totales[k]}</p>
            </button>
          )
        })}
      </div>

      {/* Monto total en reserva */}
      <div className="bg-gradient-to-r from-[#7C1F31] to-[#5a1523] rounded-2xl p-4 flex items-center gap-6">
        <div>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Reserva técnica estimada</p>
          <p className="text-[28px] font-bold text-white">${montoTotal.toLocaleString('es-MX')}</p>
          <p className="text-[10px] text-white/40 mt-0.5">Total acumulado en siniestros activos + pagados</p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F7941D]" />
            <span className="text-[10px] text-white/60">En proceso / investigación</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#69A481]" />
            <span className="text-[10px] text-white/60">Pagados</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/30" />
            <span className="text-[10px] text-white/60">Rechazados / reportados</span>
          </div>
        </div>
      </div>

      {/* XORIA */}
      <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={14} className="text-[#F7941D]" />
          <span className="text-[11px] text-white/60 font-semibold">XORIA · ClaimCenter</span>
        </div>
        {xoriaR && (
          <div className="mb-3 p-2.5 rounded-xl bg-white/8 border border-white/10">
            <p className="text-[11px] text-white/80 leading-relaxed">{xoriaR}</p>
          </div>
        )}
        <div className="flex gap-2">
          <input value={xoriaQ} onChange={e => setXoriaQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askXoria()}
            placeholder="¿Cuál siniestro lleva más días abierto? · ¿Cuánto se ha pagado en indemnizaciones?"
            className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#F7941D]/50" />
          <button onClick={askXoria} disabled={xoriaLoading}
            className="px-3 py-2 rounded-xl text-white text-[11px] font-bold disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
            {xoriaLoading ? '...' : 'Preguntar'}
          </button>
        </div>
      </div>

      {/* Buscar */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por asegurado, folio o tipo de siniestro..."
          className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.12)] placeholder-[#9CA3AF]" />
      </div>

      {/* Tabla */}
      <div className="bg-[#EFF2F9] rounded-2xl overflow-hidden shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                {['Folio / Fecha', 'Asegurado', 'Ramo / Tipo', 'Monto', 'Ajustador', 'Días', 'Estatus', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const stMap = STATUS_MAP[s.status]
                const StIcon = stMap.icon
                return (
                  <tr key={s.id}
                    className={cn('border-b border-[#F0F0F0] hover:bg-white/40 transition-colors cursor-pointer', i % 2 === 0 ? 'bg-white/10' : 'bg-white/5')}
                    onClick={() => setSelected(s)}>
                    <td className="px-4 py-3">
                      <p className="text-[10px] font-bold text-[#F7941D] font-mono">{s.id}</p>
                      <p className="text-[9px] text-[#9CA3AF]">{s.fecha}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-semibold text-[#1A1F2B] max-w-[130px] truncate">{s.asegurado}</p>
                      <p className="text-[9px] text-[#9CA3AF]">{s.agente}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[10px] font-semibold text-[#6B7280]">{s.ramo}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{s.tipo}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-bold text-[#1A1F2B]">{s.monto}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] text-[#6B7280]">{s.ajustador}</span>
                    </td>
                    <td className="px-4 py-3">
                      {s.diasAbierto > 0 ? (
                        <span className={cn('text-[11px] font-bold', s.diasAbierto > 10 ? 'text-[#7C1F31]' : 'text-[#F7941D]')}>{s.diasAbierto}d</span>
                      ) : <span className="text-[10px] text-[#D1D5DB]">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-full whitespace-nowrap"
                        style={{ color: stMap.color, background: stMap.bg }}>
                        <StIcon size={10} />{stMap.label}
                      </span>
                    </td>
                    <td className="px-4 py-3"><ChevronRight size={13} className="text-[#D1D5DB]" /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F2B]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-[#EFF2F9] rounded-3xl shadow-[0_32px_80px_rgba(26,31,43,0.5)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#7C1F31] to-[#5a1523] px-6 py-4 flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">GNP Seguros · ClaimCenter</p>
                <h2 className="text-[17px] text-white font-bold font-mono">{selected.id}</h2>
                <p className="text-[12px] text-white/50 mt-0.5">{selected.asegurado} · {selected.tipo}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all mt-1">
                <X size={14} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
              <div className="p-3 rounded-xl bg-[#1A1F2B]/5 border border-[#1A1F2B]/10">
                <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1">Descripción del siniestro</p>
                <p className="text-[12px] text-[#1A1F2B] leading-relaxed">{selected.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ['No. póliza', selected.poliza],
                  ['Ramo', selected.ramo],
                  ['Tipo de siniestro', selected.tipo],
                  ['Monto reclamado', selected.monto],
                  ['Ajustador asignado', selected.ajustador],
                  ['Fecha de reporte', selected.fecha],
                  ['Agente', selected.agente],
                  ['Días abierto', selected.diasAbierto > 0 ? `${selected.diasAbierto} días` : 'Cerrado'],
                ].map(([l, v]) => (
                  <div key={l} className="bg-white/30 rounded-xl px-3 py-2.5">
                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">{l}</p>
                    <p className="text-[12px] text-[#1A1F2B] font-semibold mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              {(selected.status === 'reportado' || selected.status === 'en_investigacion' || selected.status === 'en_proceso') && (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[12px] font-bold"
                      style={{ background: 'linear-gradient(135deg,#69A481,#4a7a5d)' }}>
                      <CheckCircle size={13} /> Aprobar y pagar
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold"
                      style={{ background: 'rgba(124,31,49,0.10)', color: '#7C1F31', border: '1px solid rgba(124,31,49,0.20)' }}>
                      <X size={13} /> Rechazar reclamación
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold text-[#3B82F6]"
                      style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                      <User size={12} /> Asignar ajustador
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold text-[#6B7280]"
                      style={{ background: 'rgba(156,163,175,0.10)', border: '1px solid rgba(156,163,175,0.15)' }}>
                      <Phone size={12} /> Contactar asegurado
                    </button>
                  </div>
                </div>
              )}

              {selected.status === 'pagado' && (
                <div className="p-3 rounded-xl bg-[#69A481]/10 border border-[#69A481]/20 flex items-center gap-3">
                  <CheckCircle size={16} className="text-[#69A481] shrink-0" />
                  <div>
                    <p className="text-[12px] font-bold text-[#69A481]">Indemnización pagada</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">Monto: {selected.monto} · Siniestro cerrado</p>
                  </div>
                </div>
              )}

              {selected.status === 'rechazado' && (
                <div className="p-3 rounded-xl bg-[#7C1F31]/10 border border-[#7C1F31]/20 flex items-center gap-3">
                  <AlertTriangle size={16} className="text-[#7C1F31] shrink-0" />
                  <p className="text-[12px] font-bold text-[#7C1F31]">Reclamación rechazada · Asegurado notificado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
