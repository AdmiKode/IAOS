'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Search, Check, X, AlertCircle, Clock, FileText,
  ChevronRight, Download, Eye, Shield, ArrowLeft, Bot
} from 'lucide-react'
import { exportCSV } from '@/lib/exportCSV'

type UWStatus = 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'info_adicional'
type Riesgo = 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto'

const SOLICITUDES = [
  { id: 'SOL-2026-0041', agente: 'Valeria Castillo', promotoria: 'Promotoria Vidal Grupo', asegurado: 'Carlos Méndez Ruiz', ramo: 'GMM Individual', prima: '$8,400', riesgo: 'Bajo' as Riesgo, status: 'pendiente' as UWStatus, fecha: '14 Mar 2026', scoreIA: 88, docs: 6, docsFaltantes: 0, edad: 38, suma: '$5,000,000', deducible: '$10,000' },
  { id: 'SOL-2026-0040', agente: 'Diego Pacheco', promotoria: 'Seguros Premier Norte', asegurado: 'Empresa Textil S.A.', ramo: 'GMM Colectivo', prima: '$42,000', riesgo: 'Medio' as Riesgo, status: 'en_revision' as UWStatus, fecha: '13 Mar 2026', scoreIA: 71, docs: 8, docsFaltantes: 1, edad: 0, suma: '$2,000,000', deducible: '$5,000' },
  { id: 'SOL-2026-0039', agente: 'Ana Domínguez', promotoria: 'Alianza Seguros GDL', asegurado: 'Roberto Sánchez', ramo: 'Vida Individual', prima: '$3,200', riesgo: 'Alto' as Riesgo, status: 'info_adicional' as UWStatus, fecha: '12 Mar 2026', scoreIA: 52, docs: 5, docsFaltantes: 2, edad: 54, suma: '$1,000,000', deducible: '$0' },
  { id: 'SOL-2026-0038', agente: 'Luis Ramírez', promotoria: 'Promotoria Vidal Grupo', asegurado: 'Sofía Torres García', ramo: 'GMM Individual', prima: '$6,100', riesgo: 'Bajo' as Riesgo, status: 'aprobada' as UWStatus, fecha: '11 Mar 2026', scoreIA: 92, docs: 6, docsFaltantes: 0, edad: 31, suma: '$3,000,000', deducible: '$14,000' },
  { id: 'SOL-2026-0037', agente: 'Valeria Castillo', promotoria: 'Promotoria Vidal Grupo', asegurado: 'Juan Pablo Reyes', ramo: 'Vida Individual', prima: '$5,500', riesgo: 'Muy Alto' as Riesgo, status: 'rechazada' as UWStatus, fecha: '10 Mar 2026', scoreIA: 28, docs: 4, docsFaltantes: 3, edad: 61, suma: '$500,000', deducible: '$0' },
  { id: 'SOL-2026-0036', agente: 'Diego Pacheco', promotoria: 'Seguros Premier Norte', asegurado: 'Grupo Comercial Norte', ramo: 'GMM Colectivo', prima: '$78,000', riesgo: 'Bajo' as Riesgo, status: 'aprobada' as UWStatus, fecha: '09 Mar 2026', scoreIA: 95, docs: 10, docsFaltantes: 0, edad: 0, suma: '$2,000,000', deducible: '$5,000' },
  { id: 'SOL-2026-0035', agente: 'Héctor Ríos', promotoria: 'Grupo Asegurador Sur', asegurado: 'Patricia Leal', ramo: 'GMM Individual', prima: '$9,200', riesgo: 'Medio' as Riesgo, status: 'pendiente' as UWStatus, fecha: '08 Mar 2026', scoreIA: 67, docs: 5, docsFaltantes: 1, edad: 47, suma: '$5,000,000', deducible: '$17,000' },
  { id: 'SOL-2026-0034', agente: 'Ana Domínguez', promotoria: 'Alianza Seguros GDL', asegurado: 'Constructora Omega', ramo: 'GMM Colectivo', prima: '$55,000', riesgo: 'Medio' as Riesgo, status: 'en_revision' as UWStatus, fecha: '07 Mar 2026', scoreIA: 74, docs: 8, docsFaltantes: 0, edad: 0, suma: '$1,000,000', deducible: '$3,000' },
]

const STATUS_MAP: Record<UWStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pendiente:      { label: 'Pendiente',       color: '#F7941D', bg: 'rgba(247,148,29,0.10)',  icon: Clock },
  en_revision:    { label: 'En revisión',     color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  icon: Eye },
  aprobada:       { label: 'Aprobada',        color: '#69A481', bg: 'rgba(105,164,129,0.10)', icon: Check },
  rechazada:      { label: 'Rechazada',       color: '#7C1F31', bg: 'rgba(124,31,49,0.10)',   icon: X },
  info_adicional: { label: 'Info. adicional', color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)', icon: AlertCircle },
}

const RIESGO_MAP: Record<Riesgo, { color: string; bg: string }> = {
  'Bajo':     { color: '#69A481', bg: 'rgba(105,164,129,0.12)' },
  'Medio':    { color: '#F7941D', bg: 'rgba(247,148,29,0.12)' },
  'Alto':     { color: '#7C1F31', bg: 'rgba(124,31,49,0.12)' },
  'Muy Alto': { color: '#7C1F31', bg: 'rgba(124,31,49,0.22)' },
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#69A481' : score >= 60 ? '#F7941D' : '#7C1F31'
  const r = 20, circ = 2 * Math.PI * r, dash = (score / 100) * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="#E5E7EB" strokeWidth="5" />
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
          strokeLinecap="round" transform="rotate(-90 26 26)" />
        <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fill={color}>{score}</text>
      </svg>
    </div>
  )
}

export default function UnderwritingPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<UWStatus | 'todos'>('todos')
  const [selected, setSelected] = useState<typeof SOLICITUDES[0] | null>(null)
  const [accion, setAccion] = useState<'aprobar' | 'rechazar' | 'info' | null>(null)
  const [nota, setNota] = useState('')
  const [statusLocal, setStatusLocal] = useState<Record<string, UWStatus>>({})
  const [xoriaQ, setXoriaQ] = useState('')
  const [xoriaR, setXoriaR] = useState('')
  const [xoriaLoading, setXoriaLoading] = useState(false)

  const filtered = SOLICITUDES.filter(s => {
    const st = statusLocal[s.id] ?? s.status
    const matchStatus = filterStatus === 'todos' || st === filterStatus
    const matchSearch = !search || s.asegurado.toLowerCase().includes(search.toLowerCase()) ||
      s.agente.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totales = {
    pendiente: SOLICITUDES.filter(s => (statusLocal[s.id] ?? s.status) === 'pendiente').length,
    en_revision: SOLICITUDES.filter(s => (statusLocal[s.id] ?? s.status) === 'en_revision').length,
    aprobada: SOLICITUDES.filter(s => (statusLocal[s.id] ?? s.status) === 'aprobada').length,
    rechazada: SOLICITUDES.filter(s => (statusLocal[s.id] ?? s.status) === 'rechazada').length,
    info_adicional: SOLICITUDES.filter(s => (statusLocal[s.id] ?? s.status) === 'info_adicional').length,
  }

  function aplicarDecision(sol: typeof SOLICITUDES[0], decision: UWStatus) {
    setStatusLocal(prev => ({ ...prev, [sol.id]: decision }))
    setSelected(null); setAccion(null); setNota('')
  }

  async function askXoria() {
    if (!xoriaQ.trim()) return
    setXoriaLoading(true)
    try {
      const res = await fetch('/api/xoria/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: xoriaQ, context: { perfil: 'aseguradora_uw', solicitudes: SOLICITUDES, totales } }),
      })
      const d = await res.json()
      setXoriaR(d.response || d.reply || 'Sin respuesta.')
    } catch { setXoriaR('XORIA no disponible.') }
    setXoriaLoading(false)
  }

  const selStatus = selected ? (statusLocal[selected.id] ?? selected.status) as UWStatus : null

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
            <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">Underwriting</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Bandeja de suscripción</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Solicitudes originadas en IAOS · Score de riesgo IA · Motor de decisión</p>
        </div>
        <div className="ml-auto">
          <button onClick={() => exportCSV(SOLICITUDES.map(s => ({ ID: s.id, Asegurado: s.asegurado, Agente: s.agente, Ramo: s.ramo, Prima: s.prima, Score: s.scoreIA, Estatus: statusLocal[s.id] ?? s.status })), 'uw')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-3">
        {([
          { label: 'Pendientes', key: 'pendiente' as const, color: '#F7941D', icon: Clock },
          { label: 'En revisión', key: 'en_revision' as const, color: '#3B82F6', icon: Eye },
          { label: 'Aprobadas', key: 'aprobada' as const, color: '#69A481', icon: Check },
          { label: 'Rechazadas', key: 'rechazada' as const, color: '#7C1F31', icon: X },
          { label: 'Info. adicional', key: 'info_adicional' as const, color: '#9CA3AF', icon: AlertCircle },
        ]).map(k => {
          const Icon = k.icon
          return (
            <button key={k.key} onClick={() => setFilterStatus(filterStatus === k.key ? 'todos' : k.key)}
              className={cn('bg-[#EFF2F9] rounded-2xl p-3 text-left transition-all shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]',
                filterStatus === k.key ? 'shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.15)]' : 'hover:scale-[1.02]')}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={12} style={{ color: k.color }} />
                <span className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{k.label}</span>
              </div>
              <p className="text-[22px] font-bold" style={{ color: k.color }}>{totales[k.key]}</p>
            </button>
          )
        })}
      </div>

      {/* XORIA */}
      <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={14} className="text-[#F7941D]" />
          <span className="text-[11px] text-white/60 font-semibold">XORIA · Asistente de suscripción</span>
        </div>
        {xoriaR && (
          <div className="mb-3 p-2.5 rounded-xl bg-white/8 border border-white/10">
            <p className="text-[11px] text-white/80 leading-relaxed">{xoriaR}</p>
          </div>
        )}
        <div className="flex gap-2">
          <input value={xoriaQ} onChange={e => setXoriaQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askXoria()}
            placeholder="¿Cuántas solicitudes de riesgo alto? · ¿Cuál agente tiene más rechazos?"
            className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#F7941D]/50" />
          <button onClick={askXoria} disabled={xoriaLoading}
            className="px-3 py-2 rounded-xl text-white text-[11px] font-bold disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
            {xoriaLoading ? '...' : 'Preguntar'}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por asegurado, agente o folio..."
            className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.12)] placeholder-[#9CA3AF]" />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-[#EFF2F9] rounded-2xl overflow-hidden shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                {['Folio / Fecha', 'Asegurado', 'Agente / Promotoria', 'Ramo', 'Prima', 'Score IA', 'Riesgo', 'Docs', 'Estatus', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const st = (statusLocal[s.id] ?? s.status) as UWStatus
                const stMap = STATUS_MAP[st]
                const StIcon = stMap.icon
                const rMap = RIESGO_MAP[s.riesgo]
                return (
                  <tr key={s.id}
                    className={cn('border-b border-[#F0F0F0] hover:bg-white/40 transition-colors cursor-pointer', i % 2 === 0 ? 'bg-white/10' : 'bg-white/5')}
                    onClick={() => setSelected(s)}>
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-bold text-[#F7941D] font-mono">{s.id}</p>
                      <p className="text-[9px] text-[#9CA3AF]">{s.fecha}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-semibold text-[#1A1F2B] max-w-[130px] truncate">{s.asegurado}</p>
                      {s.edad > 0 && <p className="text-[9px] text-[#9CA3AF]">{s.edad} años</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[11px] text-[#1A1F2B] max-w-[110px] truncate">{s.agente}</p>
                      <p className="text-[9px] text-[#9CA3AF] max-w-[110px] truncate">{s.promotoria}</p>
                    </td>
                    <td className="px-4 py-3"><span className="text-[10px] font-semibold text-[#6B7280]">{s.ramo}</span></td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-bold text-[#1A1F2B]">{s.prima}</span>
                      <p className="text-[9px] text-[#9CA3AF]">/ mes</p>
                    </td>
                    <td className="px-4 py-3"><ScoreRing score={s.scoreIA} /></td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ color: rMap.color, background: rMap.bg }}>{s.riesgo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FileText size={11} className={s.docsFaltantes > 0 ? 'text-[#F7941D]' : 'text-[#69A481]'} />
                        <span className={cn('text-[10px] font-semibold', s.docsFaltantes > 0 ? 'text-[#F7941D]' : 'text-[#69A481]')}>
                          {s.docs - s.docsFaltantes}/{s.docs}
                        </span>
                      </div>
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
          <div className="w-full max-w-2xl bg-[#EFF2F9] rounded-3xl shadow-[0_32px_80px_rgba(26,31,43,0.5)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-6 py-4 flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Expediente IAOS</p>
                <h2 className="text-[18px] text-white font-bold">{selected.asegurado}</h2>
                <p className="text-[12px] text-white/50 mt-0.5">{selected.id} · {selected.ramo}</p>
              </div>
              <div className="flex items-center gap-3">
                <ScoreRing score={selected.scoreIA} />
                <button onClick={() => { setSelected(null); setAccion(null); setNota('') }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Agente', selected.agente],
                  ['Promotoria', selected.promotoria],
                  ['Suma asegurada', selected.suma],
                  ['Deducible', selected.deducible],
                  ['Prima mensual', selected.prima],
                  ['Ramo', selected.ramo],
                  ['Riesgo IA', selected.riesgo],
                  ['Fecha solicitud', selected.fecha],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white/30 rounded-xl px-3 py-2.5">
                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-[12px] text-[#1A1F2B] font-semibold mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Documentos */}
              <div>
                <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">Expediente digital</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { doc: 'Identificación oficial', ok: true },
                    { doc: 'Comprobante de domicilio', ok: true },
                    { doc: 'RFC / CURP', ok: true },
                    { doc: 'Solicitud firmada IAOS', ok: selected.docsFaltantes < 2 },
                    { doc: 'Consentimiento ARCO', ok: selected.docsFaltantes < 1 },
                    { doc: 'Declaración de salud', ok: selected.riesgo !== 'Muy Alto' },
                  ].map(d => (
                    <div key={d.doc} className={cn('flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-medium',
                      d.ok ? 'bg-[#69A481]/10 text-[#69A481]' : 'bg-[#F7941D]/10 text-[#F7941D]')}>
                      {d.ok ? <Check size={10} /> : <AlertCircle size={10} />}
                      <span className="truncate">{d.doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score bars */}
              <div>
                <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">Indicadores de riesgo</p>
                {[
                  { label: 'Score de riesgo global', val: selected.scoreIA, color: selected.scoreIA >= 80 ? '#69A481' : selected.scoreIA >= 60 ? '#F7941D' : '#7C1F31' },
                  { label: 'Completitud expediente', val: Math.round(((selected.docs - selected.docsFaltantes) / selected.docs) * 100), color: '#3B82F6' },
                  { label: 'Historial promotoria', val: 88, color: '#69A481' },
                ].map(ind => (
                  <div key={ind.label} className="mb-2">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[10px] text-[#6B7280]">{ind.label}</span>
                      <span className="text-[10px] font-bold" style={{ color: ind.color }}>{ind.val}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${ind.val}%`, background: ind.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {accion && (
                <div>
                  <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1.5">
                    {accion === 'aprobar' ? 'Nota de aprobación (opcional)' : accion === 'rechazar' ? 'Motivo de rechazo (requerido)' : 'Info. adicional requerida'}
                  </p>
                  <textarea value={nota} onChange={e => setNota(e.target.value)} rows={3}
                    placeholder={accion === 'aprobar' ? 'Condiciones especiales...' : accion === 'rechazar' ? 'Motivo del rechazo...' : 'Documentos o información adicional requerida...'}
                    className="w-full bg-white/50 border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-[11px] text-[#1A1F2B] outline-none resize-none placeholder-[#D1D5DB] focus:border-[#F7941D]/50" />
                </div>
              )}

              {selStatus !== 'aprobada' && selStatus !== 'rechazada' && (
                <div className="flex gap-2 pt-1">
                  {accion !== 'aprobar' ? (
                    <button onClick={() => setAccion('aprobar')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[12px] font-bold"
                      style={{ background: 'linear-gradient(135deg,#69A481,#4a7a5d)' }}>
                      <Check size={14} /> Aprobar solicitud
                    </button>
                  ) : (
                    <button onClick={() => aplicarDecision(selected, 'aprobada')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[12px] font-bold"
                      style={{ background: 'linear-gradient(135deg,#69A481,#4a7a5d)' }}>
                      <Check size={14} /> Confirmar aprobación
                    </button>
                  )}
                  {accion !== 'rechazar' ? (
                    <button onClick={() => setAccion('rechazar')}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[12px] font-bold"
                      style={{ background: 'rgba(124,31,49,0.10)', color: '#7C1F31', border: '1px solid rgba(124,31,49,0.20)' }}>
                      <X size={14} /> Rechazar
                    </button>
                  ) : (
                    <button onClick={() => aplicarDecision(selected, 'rechazada')} disabled={!nota.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-[12px] font-bold disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg,#7C1F31,#5a1523)' }}>
                      <X size={14} /> Confirmar rechazo
                    </button>
                  )}
                  <button onClick={() => aplicarDecision(selected, 'info_adicional')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[12px] font-bold"
                    style={{ background: 'rgba(156,163,175,0.12)', color: '#6B7280', border: '1px solid rgba(156,163,175,0.20)' }}>
                    <AlertCircle size={14} /> Pedir info
                  </button>
                </div>
              )}

              {(selStatus === 'aprobada' || selStatus === 'rechazada') && (
                <div className={cn('p-3 rounded-xl flex items-center gap-3', selStatus === 'aprobada' ? 'bg-[#69A481]/10 border border-[#69A481]/20' : 'bg-[#7C1F31]/10 border border-[#7C1F31]/20')}>
                  {selStatus === 'aprobada' ? <Check size={16} className="text-[#69A481] shrink-0" /> : <X size={16} className="text-[#7C1F31] shrink-0" />}
                  <p className="text-[12px] font-semibold" style={{ color: selStatus === 'aprobada' ? '#69A481' : '#7C1F31' }}>
                    {selStatus === 'aprobada' ? 'Solicitud aprobada. Lista para emisión de póliza.' : 'Solicitud rechazada. Se notificará al agente y promotoria.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
