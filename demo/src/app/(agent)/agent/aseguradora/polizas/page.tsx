'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Search, FileText, ChevronRight, Download, ArrowLeft, Bot,
  CheckCircle, RefreshCw, AlertCircle, X, Plus, Edit3, Shield
} from 'lucide-react'
import { exportCSV } from '@/lib/exportCSV'

type PolizaStatus = 'vigente' | 'por_renovar' | 'cancelada' | 'suspendida'

const POLIZAS = [
  { id: 'GNP-GMM-2026-00841', asegurado: 'Carlos Méndez Ruiz', ramo: 'GMM Individual', agente: 'Valeria Castillo', promotoria: 'Promotoria Vidal Grupo', inicio: '01 Abr 2026', fin: '01 Abr 2027', prima: '$8,400', suma: '$5,000,000', status: 'vigente' as PolizaStatus, endosos: 0 },
  { id: 'GNP-GMM-2026-00840', asegurado: 'Grupo Comercial Norte', ramo: 'GMM Colectivo', agente: 'Diego Pacheco', promotoria: 'Seguros Premier Norte', inicio: '01 Feb 2026', fin: '01 Feb 2027', prima: '$78,000', suma: '$2,000,000', status: 'vigente' as PolizaStatus, endosos: 2 },
  { id: 'GNP-VIDA-2025-00399', asegurado: 'Sofía Torres García', ramo: 'Vida Individual', agente: 'Luis Ramírez', promotoria: 'Promotoria Vidal Grupo', inicio: '15 Ene 2026', fin: '15 Ene 2027', prima: '$6,100', suma: '$3,000,000', status: 'por_renovar' as PolizaStatus, endosos: 1 },
  { id: 'GNP-GMM-2025-00312', asegurado: 'Empresa Textil S.A.', ramo: 'GMM Colectivo', agente: 'Diego Pacheco', promotoria: 'Seguros Premier Norte', inicio: '01 Mar 2025', fin: '01 Mar 2026', prima: '$42,000', suma: '$2,000,000', status: 'por_renovar' as PolizaStatus, endosos: 3 },
  { id: 'GNP-GMM-2025-00280', asegurado: 'Constructora Omega', ramo: 'GMM Colectivo', agente: 'Ana Domínguez', promotoria: 'Alianza Seguros GDL', inicio: '01 Feb 2025', fin: '01 Feb 2026', prima: '$55,000', suma: '$1,000,000', status: 'vigente' as PolizaStatus, endosos: 0 },
  { id: 'GNP-GMM-2025-00201', asegurado: 'Patricia Leal', ramo: 'GMM Individual', agente: 'Héctor Ríos', promotoria: 'Grupo Asegurador Sur', inicio: '10 Dic 2024', fin: '10 Dic 2025', prima: '$9,200', suma: '$5,000,000', status: 'suspendida' as PolizaStatus, endosos: 0 },
  { id: 'GNP-VIDA-2024-00155', asegurado: 'Roberto Sánchez', ramo: 'Vida Individual', agente: 'Ana Domínguez', promotoria: 'Alianza Seguros GDL', inicio: '20 Nov 2024', fin: '20 Nov 2025', prima: '$3,200', suma: '$1,000,000', status: 'cancelada' as PolizaStatus, endosos: 0 },
]

const STATUS_MAP: Record<PolizaStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  vigente:     { label: 'Vigente',       color: '#69A481', bg: 'rgba(105,164,129,0.10)', icon: CheckCircle },
  por_renovar: { label: 'Por renovar',   color: '#F7941D', bg: 'rgba(247,148,29,0.10)',  icon: RefreshCw },
  cancelada:   { label: 'Cancelada',     color: '#7C1F31', bg: 'rgba(124,31,49,0.10)',   icon: X },
  suspendida:  { label: 'Suspendida',    color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)', icon: AlertCircle },
}

const ENDOSO_TIPOS = ['Inclusión de beneficiario', 'Cambio de suma asegurada', 'Cambio de coaseguro', 'Inclusión de dependiente', 'Cambio de domicilio fiscal']

export default function PolizasPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<PolizaStatus | 'todas'>('todas')
  const [selected, setSelected] = useState<typeof POLIZAS[0] | null>(null)
  const [tab, setTab] = useState<'detalle' | 'endosos' | 'renovar'>('detalle')
  const [xoriaQ, setXoriaQ] = useState('')
  const [xoriaR, setXoriaR] = useState('')
  const [xoriaLoading, setXoriaLoading] = useState(false)

  const filtered = POLIZAS.filter(p => {
    const matchStatus = filterStatus === 'todas' || p.status === filterStatus
    const matchSearch = !search || p.asegurado.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) || p.agente.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totales = {
    vigente: POLIZAS.filter(p => p.status === 'vigente').length,
    por_renovar: POLIZAS.filter(p => p.status === 'por_renovar').length,
    cancelada: POLIZAS.filter(p => p.status === 'cancelada').length,
    suspendida: POLIZAS.filter(p => p.status === 'suspendida').length,
  }

  async function askXoria() {
    if (!xoriaQ.trim()) return
    setXoriaLoading(true)
    try {
      const res = await fetch('/api/xoria/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: xoriaQ, context: { perfil: 'aseguradora_polizas', polizas: POLIZAS, totales } }),
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
            <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">PolicyCenter</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Administración de pólizas</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Cartera activa GNP · Endosos · Renovaciones · Cancelaciones</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
            <Plus size={12} /> Nueva póliza
          </button>
          <button onClick={() => exportCSV(POLIZAS.map(p => ({ ID: p.id, Asegurado: p.asegurado, Ramo: p.ramo, Prima: p.prima, Agente: p.agente, Estatus: p.status })), 'polizas')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B]">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {([
          { label: 'Vigentes', key: 'vigente' as const, color: '#69A481', icon: CheckCircle },
          { label: 'Por renovar', key: 'por_renovar' as const, color: '#F7941D', icon: RefreshCw },
          { label: 'Suspendidas', key: 'suspendida' as const, color: '#9CA3AF', icon: AlertCircle },
          { label: 'Canceladas', key: 'cancelada' as const, color: '#7C1F31', icon: X },
        ]).map(k => {
          const Icon = k.icon
          return (
            <button key={k.key} onClick={() => setFilterStatus(filterStatus === k.key ? 'todas' : k.key)}
              className={cn('bg-[#EFF2F9] rounded-2xl p-4 text-left transition-all shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]',
                filterStatus === k.key ? 'shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.15)]' : 'hover:scale-[1.02]')}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={13} style={{ color: k.color }} />
                <span className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{k.label}</span>
              </div>
              <p className="text-[26px] font-bold" style={{ color: k.color }}>{totales[k.key]}</p>
            </button>
          )
        })}
      </div>

      {/* XORIA */}
      <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={14} className="text-[#F7941D]" />
          <span className="text-[11px] text-white/60 font-semibold">XORIA · PolicyCenter</span>
        </div>
        {xoriaR && (
          <div className="mb-3 p-2.5 rounded-xl bg-white/8 border border-white/10">
            <p className="text-[11px] text-white/80 leading-relaxed">{xoriaR}</p>
          </div>
        )}
        <div className="flex gap-2">
          <input value={xoriaQ} onChange={e => setXoriaQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askXoria()}
            placeholder="¿Cuántas pólizas vencen este mes? · ¿Cuál agente tiene más renovaciones pendientes?"
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
          placeholder="Buscar por asegurado, no. de póliza o agente..."
          className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.12)] placeholder-[#9CA3AF]" />
      </div>

      {/* Tabla */}
      <div className="bg-[#EFF2F9] rounded-2xl overflow-hidden shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                {['No. de póliza', 'Asegurado', 'Agente / Promotoria', 'Ramo', 'Prima', 'Vigencia', 'Endosos', 'Estatus', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const stMap = STATUS_MAP[p.status]
                const StIcon = stMap.icon
                return (
                  <tr key={p.id}
                    className={cn('border-b border-[#F0F0F0] hover:bg-white/40 transition-colors cursor-pointer', i % 2 === 0 ? 'bg-white/10' : 'bg-white/5')}
                    onClick={() => { setSelected(p); setTab('detalle') }}>
                    <td className="px-4 py-3">
                      <p className="text-[10px] font-bold text-[#F7941D] font-mono">{p.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-semibold text-[#1A1F2B] max-w-[130px] truncate">{p.asegurado}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[11px] text-[#1A1F2B] max-w-[110px] truncate">{p.agente}</p>
                      <p className="text-[9px] text-[#9CA3AF] max-w-[110px] truncate">{p.promotoria}</p>
                    </td>
                    <td className="px-4 py-3"><span className="text-[10px] font-semibold text-[#6B7280]">{p.ramo}</span></td>
                    <td className="px-4 py-3"><span className="text-[12px] font-bold text-[#1A1F2B]">{p.prima}</span></td>
                    <td className="px-4 py-3">
                      <p className="text-[10px] text-[#1A1F2B]">{p.inicio}</p>
                      <p className="text-[9px] text-[#9CA3AF]">→ {p.fin}</p>
                    </td>
                    <td className="px-4 py-3">
                      {p.endosos > 0 ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#3B82F6]">
                          <Edit3 size={9} />{p.endosos}
                        </span>
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
          <div className="w-full max-w-2xl bg-[#EFF2F9] rounded-3xl shadow-[0_32px_80px_rgba(26,31,43,0.5)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-6 py-4 flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">GNP Seguros · PolicyCenter</p>
                <h2 className="text-[17px] text-white font-bold font-mono">{selected.id}</h2>
                <p className="text-[12px] text-white/50 mt-0.5">{selected.asegurado} · {selected.ramo}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all mt-1">
                <X size={14} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E5E7EB] bg-white/20">
              {[
                { key: 'detalle' as const, label: 'Detalle póliza' },
                { key: 'endosos' as const, label: `Endosos (${selected.endosos})` },
                { key: 'renovar' as const, label: 'Renovar / Cancelar' },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={cn('px-5 py-3 text-[11px] font-bold transition-colors',
                    tab === t.key ? 'text-[#F7941D] border-b-2 border-[#F7941D]' : 'text-[#9CA3AF] hover:text-[#1A1F2B]')}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {tab === 'detalle' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['No. de póliza', selected.id],
                    ['Asegurado', selected.asegurado],
                    ['Ramo', selected.ramo],
                    ['Agente', selected.agente],
                    ['Promotoria', selected.promotoria],
                    ['Prima mensual', selected.prima],
                    ['Suma asegurada', selected.suma],
                    ['Inicio de vigencia', selected.inicio],
                    ['Fin de vigencia', selected.fin],
                    ['Estatus', STATUS_MAP[selected.status].label],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white/30 rounded-xl px-3 py-2.5">
                      <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">{label}</p>
                      <p className="text-[12px] text-[#1A1F2B] font-semibold mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'endosos' && (
                <div className="flex flex-col gap-3">
                  {selected.endosos === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-[#9CA3AF]">
                      <Shield size={32} className="mb-2 opacity-30" />
                      <p className="text-[13px] font-semibold">Sin endosos registrados</p>
                      <p className="text-[11px] mt-1">Esta póliza no tiene modificaciones</p>
                    </div>
                  ) : (
                    Array.from({ length: selected.endosos }, (_, i) => (
                      <div key={i} className="bg-white/30 rounded-xl px-4 py-3 flex items-center gap-3">
                        <Edit3 size={14} className="text-[#3B82F6] shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-[#1A1F2B]">Endoso #{i + 1} — {ENDOSO_TIPOS[i % ENDOSO_TIPOS.length]}</p>
                          <p className="text-[9px] text-[#9CA3AF]">Procesado · {selected.inicio}</p>
                        </div>
                        <span className="ml-auto text-[10px] font-bold text-[#69A481] bg-[#69A481]/10 px-2 py-1 rounded-full">Aplicado</span>
                      </div>
                    ))
                  )}
                  <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold border-2 border-dashed border-[#F7941D]/30 text-[#F7941D] hover:bg-[#F7941D]/5 transition-colors">
                    <Plus size={13} /> Agregar endoso
                  </button>
                </div>
              )}

              {tab === 'renovar' && (
                <div className="flex flex-col gap-4">
                  {selected.status === 'por_renovar' && (
                    <div className="p-3 rounded-xl bg-[#F7941D]/10 border border-[#F7941D]/20">
                      <div className="flex items-center gap-2">
                        <RefreshCw size={14} className="text-[#F7941D]" />
                        <p className="text-[12px] font-semibold text-[#F7941D]">Esta póliza vence pronto. Se recomienda renovar.</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-4 rounded-xl text-white text-[12px] font-bold"
                      style={{ background: 'linear-gradient(135deg,#69A481,#4a7a5d)' }}>
                      <RefreshCw size={14} /> Renovar póliza
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 rounded-xl text-[12px] font-bold"
                      style={{ background: 'rgba(124,31,49,0.10)', color: '#7C1F31', border: '1px solid rgba(124,31,49,0.20)' }}>
                      <X size={14} /> Cancelar póliza
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold text-[#9CA3AF] bg-white/20">
                    <AlertCircle size={12} /> Suspender temporalmente
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
