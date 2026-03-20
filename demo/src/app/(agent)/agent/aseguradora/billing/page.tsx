'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Bot, Download, Search, ChevronRight, X,
  CheckCircle, AlertCircle, Clock, TrendingUp, DollarSign, Users
} from 'lucide-react'
import { exportCSV } from '@/lib/exportCSV'

type PagoStatus = 'al_corriente' | 'pendiente' | 'vencido' | 'fallido'

const PAGOS = [
  { id: 'PAG-2026-0041', poliza: 'GNP-GMM-2026-00841', asegurado: 'Carlos Méndez Ruiz', agente: 'Valeria Castillo', promotoria: 'Promotoria Vidal Grupo', ramo: 'GMM Individual', prima: 8400, comisionAgente: 1680, comisionProm: 420, status: 'al_corriente' as PagoStatus, fechaPago: '01 Mar 2026', metodo: 'Tarjeta' },
  { id: 'PAG-2026-0040', poliza: 'GNP-GMM-2026-00840', asegurado: 'Grupo Comercial Norte', agente: 'Diego Pacheco', promotoria: 'Seguros Premier Norte', ramo: 'GMM Colectivo', prima: 78000, comisionAgente: 15600, comisionProm: 3900, status: 'al_corriente' as PagoStatus, fechaPago: '01 Mar 2026', metodo: 'Transferencia' },
  { id: 'PAG-2026-0039', poliza: 'GNP-VIDA-2025-00399', asegurado: 'Sofía Torres García', agente: 'Luis Ramírez', promotoria: 'Promotoria Vidal Grupo', ramo: 'Vida Individual', prima: 6100, comisionAgente: 1220, comisionProm: 305, status: 'pendiente' as PagoStatus, fechaPago: '—', metodo: '—' },
  { id: 'PAG-2026-0038', poliza: 'GNP-GMM-2025-00312', asegurado: 'Empresa Textil S.A.', agente: 'Diego Pacheco', promotoria: 'Seguros Premier Norte', ramo: 'GMM Colectivo', prima: 42000, comisionAgente: 8400, comisionProm: 2100, status: 'vencido' as PagoStatus, fechaPago: '—', metodo: '—' },
  { id: 'PAG-2026-0037', poliza: 'GNP-GMM-2025-00280', asegurado: 'Constructora Omega', agente: 'Ana Domínguez', promotoria: 'Alianza Seguros GDL', ramo: 'GMM Colectivo', prima: 55000, comisionAgente: 11000, comisionProm: 2750, status: 'al_corriente' as PagoStatus, fechaPago: '03 Mar 2026', metodo: 'Domiciliación' },
  { id: 'PAG-2026-0036', poliza: 'GNP-GMM-2025-00201', asegurado: 'Patricia Leal', agente: 'Héctor Ríos', promotoria: 'Grupo Asegurador Sur', ramo: 'GMM Individual', prima: 9200, comisionAgente: 1840, comisionProm: 460, status: 'fallido' as PagoStatus, fechaPago: '—', metodo: 'Tarjeta' },
  { id: 'PAG-2026-0035', poliza: 'GNP-GMM-2025-00280', asegurado: 'Patricia Leal', agente: 'Héctor Ríos', promotoria: 'Grupo Asegurador Sur', ramo: 'GMM Individual', prima: 3200, comisionAgente: 640, comisionProm: 160, status: 'al_corriente' as PagoStatus, fechaPago: '05 Mar 2026', metodo: 'Transferencia' },
]

const STATUS_MAP: Record<PagoStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  al_corriente: { label: 'Al corriente', color: '#69A481', bg: 'rgba(105,164,129,0.10)', icon: CheckCircle },
  pendiente:    { label: 'Pendiente',    color: '#F7941D', bg: 'rgba(247,148,29,0.10)',  icon: Clock },
  vencido:      { label: 'Vencido',      color: '#7C1F31', bg: 'rgba(124,31,49,0.15)',   icon: AlertCircle },
  fallido:      { label: 'Pago fallido', color: '#7C1F31', bg: 'rgba(124,31,49,0.08)',   icon: X },
}

const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`

export default function BillingPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<PagoStatus | 'todos'>('todos')
  const [selected, setSelected] = useState<typeof PAGOS[0] | null>(null)
  const [xoriaQ, setXoriaQ] = useState('')
  const [xoriaR, setXoriaR] = useState('')
  const [xoriaLoading, setXoriaLoading] = useState(false)
  const [tabVista, setTabVista] = useState<'primas' | 'comisiones'>('primas')

  const filtered = PAGOS.filter(p => {
    const matchStatus = filterStatus === 'todos' || p.status === filterStatus
    const matchSearch = !search || p.asegurado.toLowerCase().includes(search.toLowerCase()) ||
      p.agente.toLowerCase().includes(search.toLowerCase()) || p.poliza.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const primasTotal = PAGOS.reduce((s, p) => s + p.prima, 0)
  const primasCobradas = PAGOS.filter(p => p.status === 'al_corriente').reduce((s, p) => s + p.prima, 0)
  const comisionesTotales = PAGOS.reduce((s, p) => s + p.comisionAgente + p.comisionProm, 0)
  const pendientes = PAGOS.filter(p => p.status === 'pendiente' || p.status === 'vencido' || p.status === 'fallido').reduce((s, p) => s + p.prima, 0)

  const totalesStatus = {
    al_corriente: PAGOS.filter(p => p.status === 'al_corriente').length,
    pendiente: PAGOS.filter(p => p.status === 'pendiente').length,
    vencido: PAGOS.filter(p => p.status === 'vencido').length,
    fallido: PAGOS.filter(p => p.status === 'fallido').length,
  }

  async function askXoria() {
    if (!xoriaQ.trim()) return
    setXoriaLoading(true)
    try {
      const res = await fetch('/api/xoria/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: xoriaQ, context: { perfil: 'aseguradora_billing', primasTotal, primasCobradas, pendientes, comisionesTotales } }),
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
            <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">BillingCenter</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Cobranza y comisiones</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Primas cobradas · Pagos pendientes · Comisiones a red de agentes</p>
        </div>
        <div className="ml-auto">
          <button onClick={() => exportCSV(PAGOS.map(p => ({ ID: p.id, Asegurado: p.asegurado, Prima: p.prima, Agente: p.agente, Estatus: p.status })), 'billing')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B]">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* KPIs financieros */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Prima total cartera', value: fmt(primasTotal), icon: DollarSign, color: '#1A1F2B', sub: 'Mensual' },
          { label: 'Primas cobradas', value: fmt(primasCobradas), icon: CheckCircle, color: '#69A481', sub: `${Math.round((primasCobradas / primasTotal) * 100)}% de eficiencia` },
          { label: 'Por cobrar / vencidas', value: fmt(pendientes), icon: AlertCircle, color: '#7C1F31', sub: 'Requieren gestión' },
          { label: 'Comisiones pagadas', value: fmt(comisionesTotales), icon: TrendingUp, color: '#F7941D', sub: 'Red de distribución' },
        ].map(k => {
          const Icon = k.icon
          return (
            <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={13} style={{ color: k.color }} />
                <span className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{k.label}</span>
              </div>
              <p className="text-[20px] font-bold" style={{ color: k.color }}>{k.value}</p>
              <p className="text-[9px] text-[#9CA3AF] mt-1">{k.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Barra de cobro visual */}
      <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]">
        <div className="flex justify-between mb-2">
          <span className="text-[11px] font-bold text-[#1A1F2B]">Efectividad de cobranza</span>
          <span className="text-[11px] font-bold text-[#69A481]">{Math.round((primasCobradas / primasTotal) * 100)}%</span>
        </div>
        <div className="h-3 rounded-full bg-[#E5E7EB] overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.round((primasCobradas / primasTotal) * 100)}%`, background: 'linear-gradient(90deg,#69A481,#4a7a5d)' }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-[#9CA3AF]">Cobrado: {fmt(primasCobradas)}</span>
          <span className="text-[9px] text-[#7C1F31]">Pendiente: {fmt(pendientes)}</span>
        </div>
      </div>

      {/* XORIA */}
      <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={14} className="text-[#F7941D]" />
          <span className="text-[11px] text-white/60 font-semibold">XORIA · BillingCenter</span>
        </div>
        {xoriaR && (
          <div className="mb-3 p-2.5 rounded-xl bg-white/8 border border-white/10">
            <p className="text-[11px] text-white/80 leading-relaxed">{xoriaR}</p>
          </div>
        )}
        <div className="flex gap-2">
          <input value={xoriaQ} onChange={e => setXoriaQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askXoria()}
            placeholder="¿Cuánto se cobró este mes? · ¿Cuáles cuentas están vencidas?"
            className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#F7941D]/50" />
          <button onClick={askXoria} disabled={xoriaLoading}
            className="px-3 py-2 rounded-xl text-white text-[11px] font-bold disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
            {xoriaLoading ? '...' : 'Preguntar'}
          </button>
        </div>
      </div>

      {/* Tabs + filtros */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-[#EFF2F9] rounded-xl p-1 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
          {[{ key: 'primas' as const, label: 'Primas' }, { key: 'comisiones' as const, label: 'Comisiones' }].map(t => (
            <button key={t.key} onClick={() => setTabVista(t.key)}
              className={cn('px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all',
                tabVista === t.key ? 'bg-[#1A1F2B] text-white shadow-md' : 'text-[#9CA3AF] hover:text-[#1A1F2B]')}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['todos', 'al_corriente', 'pendiente', 'vencido', 'fallido'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn('px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all',
                filterStatus === s ? 'bg-[#1A1F2B] text-white' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]')}>
              {s === 'todos' ? 'Todos' : STATUS_MAP[s].label}
              {s !== 'todos' && <span className="ml-1 opacity-70">({totalesStatus[s]})</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por asegurado, agente o no. de póliza..."
          className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.12)] placeholder-[#9CA3AF]" />
      </div>

      {/* Tabla */}
      <div className="bg-[#EFF2F9] rounded-2xl overflow-hidden shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                {tabVista === 'primas'
                  ? ['Póliza', 'Asegurado', 'Agente / Promotoria', 'Ramo', 'Prima', 'Método', 'Fecha de pago', 'Estatus', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                    ))
                  : ['Agente', 'Promotoria', 'Primas cobradas', 'Com. agente (20%)', 'Com. promotoria (5%)', 'Total comisión', 'Estatus'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                    ))
                }
              </tr>
            </thead>
            <tbody>
              {tabVista === 'primas' && filtered.map((p, i) => {
                const stMap = STATUS_MAP[p.status]
                const StIcon = stMap.icon
                return (
                  <tr key={p.id}
                    className={cn('border-b border-[#F0F0F0] hover:bg-white/40 transition-colors cursor-pointer', i % 2 === 0 ? 'bg-white/10' : 'bg-white/5')}
                    onClick={() => setSelected(p)}>
                    <td className="px-4 py-3"><p className="text-[10px] font-bold text-[#F7941D] font-mono">{p.poliza}</p></td>
                    <td className="px-4 py-3"><p className="text-[11px] font-semibold text-[#1A1F2B] max-w-[120px] truncate">{p.asegurado}</p></td>
                    <td className="px-4 py-3">
                      <p className="text-[11px] text-[#1A1F2B] max-w-[100px] truncate">{p.agente}</p>
                      <p className="text-[9px] text-[#9CA3AF] max-w-[100px] truncate">{p.promotoria}</p>
                    </td>
                    <td className="px-4 py-3"><span className="text-[10px] font-semibold text-[#6B7280]">{p.ramo}</span></td>
                    <td className="px-4 py-3"><span className="text-[12px] font-bold text-[#1A1F2B]">{fmt(p.prima)}</span></td>
                    <td className="px-4 py-3"><span className="text-[10px] text-[#6B7280]">{p.metodo}</span></td>
                    <td className="px-4 py-3"><span className="text-[10px] text-[#6B7280]">{p.fechaPago}</span></td>
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
              {tabVista === 'comisiones' && (() => {
                const byAgent: Record<string, { agente: string; promotoria: string; prima: number; comA: number; comP: number; cobradas: number }> = {}
                PAGOS.forEach(p => {
                  if (!byAgent[p.agente]) byAgent[p.agente] = { agente: p.agente, promotoria: p.promotoria, prima: 0, comA: 0, comP: 0, cobradas: 0 }
                  byAgent[p.agente].prima += p.prima
                  byAgent[p.agente].comA += p.comisionAgente
                  byAgent[p.agente].comP += p.comisionProm
                  if (p.status === 'al_corriente') byAgent[p.agente].cobradas += p.prima
                })
                return Object.values(byAgent).map((a, i) => (
                  <tr key={a.agente} className={cn('border-b border-[#F0F0F0]', i % 2 === 0 ? 'bg-white/10' : 'bg-white/5')}>
                    <td className="px-4 py-3"><p className="text-[11px] font-semibold text-[#1A1F2B]">{a.agente}</p></td>
                    <td className="px-4 py-3"><p className="text-[10px] text-[#6B7280] max-w-[110px] truncate">{a.promotoria}</p></td>
                    <td className="px-4 py-3"><span className="text-[11px] font-bold text-[#1A1F2B]">{fmt(a.cobradas)}</span></td>
                    <td className="px-4 py-3"><span className="text-[11px] font-bold text-[#F7941D]">{fmt(a.comA)}</span></td>
                    <td className="px-4 py-3"><span className="text-[11px] font-bold text-[#69A481]">{fmt(a.comP)}</span></td>
                    <td className="px-4 py-3"><span className="text-[12px] font-bold text-[#1A1F2B]">{fmt(a.comA + a.comP)}</span></td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#69A481]/10 text-[#69A481]">Liquidado</span>
                    </td>
                  </tr>
                ))
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalle pago */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F2B]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#EFF2F9] rounded-3xl shadow-[0_32px_80px_rgba(26,31,43,0.5)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-6 py-4 flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">GNP Seguros · BillingCenter</p>
                <h2 className="text-[16px] text-white font-bold">{selected.asegurado}</h2>
                <p className="text-[12px] text-white/50 mt-0.5">{selected.poliza}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all mt-1">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Prima mensual', fmt(selected.prima)],
                  ['Comisión agente (20%)', fmt(selected.comisionAgente)],
                  ['Comisión promotoria (5%)', fmt(selected.comisionProm)],
                  ['Neto GNP', fmt(selected.prima - selected.comisionAgente - selected.comisionProm)],
                  ['Método de pago', selected.metodo],
                  ['Fecha de pago', selected.fechaPago],
                  ['Agente', selected.agente],
                  ['Promotoria', selected.promotoria],
                ].map(([l, v]) => (
                  <div key={l} className="bg-white/30 rounded-xl px-3 py-2.5">
                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">{l}</p>
                    <p className="text-[12px] text-[#1A1F2B] font-semibold mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              {(selected.status === 'pendiente' || selected.status === 'vencido' || selected.status === 'fallido') && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[12px] font-bold"
                    style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
                    <DollarSign size={13} /> Registrar pago
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold text-[#6B7280]"
                    style={{ background: 'rgba(156,163,175,0.12)', border: '1px solid rgba(156,163,175,0.20)' }}>
                    <Users size={13} /> Notificar agente
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
