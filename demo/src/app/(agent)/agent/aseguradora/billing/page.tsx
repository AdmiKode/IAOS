'use client'
import { useState } from 'react'
import { ArrowLeft, Search, Download, ChevronRight, X, Check, CreditCard, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { exportCSV } from '@/lib/exportCSV'

type BillingStatus = 'pagado' | 'pendiente' | 'vencido' | 'parcial'
type Tab = 'primas' | 'comisiones'

const MOCK_PRIMAS = [
  { id: 'FAC-2026-0201', poliza: 'POL-2026-0101', asegurado: 'Carlos Méndez Ruiz', agente: 'Valeria Castillo', ramo: 'GMM Individual', monto: '$700', vence: '01 Abr 2026', status: 'pendiente' as BillingStatus },
  { id: 'FAC-2026-0200', poliza: 'POL-2026-0100', asegurado: 'Empresa Textil S.A.', agente: 'Diego Pacheco', ramo: 'GMM Colectivo', monto: '$3,500', vence: '01 Abr 2026', status: 'pagado' as BillingStatus },
  { id: 'FAC-2026-0199', poliza: 'POL-2026-0099', asegurado: 'Sofía Torres García', agente: 'Luis Ramírez', ramo: 'GMM Individual', monto: '$508', vence: '15 Mar 2026', status: 'vencido' as BillingStatus },
  { id: 'FAC-2026-0198', poliza: 'POL-2025-0088', asegurado: 'Patricia Leal', agente: 'Héctor Ríos', ramo: 'GMM Individual', monto: '$767', vence: '01 Mar 2026', status: 'pagado' as BillingStatus },
  { id: 'FAC-2026-0197', poliza: 'POL-2025-0076', asegurado: 'Roberto Sánchez', agente: 'Ana Domínguez', ramo: 'Vida Individual', monto: '$267', vence: '01 Mar 2026', status: 'parcial' as BillingStatus },
  { id: 'FAC-2026-0196', poliza: 'POL-2025-0070', asegurado: 'Grupo Comercial Norte', agente: 'Diego Pacheco', ramo: 'GMM Colectivo', monto: '$6,500', vence: '01 Mar 2026', status: 'pagado' as BillingStatus },
]

const MOCK_COMISIONES = [
  { agente: 'Valeria Castillo', polizas: 12, primaNeta: '$186,400', pctComision: '8%', montoComision: '$14,912', status: 'pagado' as BillingStatus, mes: 'Mar 2026' },
  { agente: 'Diego Pacheco', polizas: 9, primaNeta: '$142,800', pctComision: '8%', montoComision: '$11,424', status: 'pendiente' as BillingStatus, mes: 'Mar 2026' },
  { agente: 'Ana Domínguez', polizas: 7, primaNeta: '$98,600', pctComision: '7.5%', montoComision: '$7,395', status: 'pendiente' as BillingStatus, mes: 'Mar 2026' },
  { agente: 'Luis Ramírez', polizas: 6, primaNeta: '$72,000', pctComision: '7.5%', montoComision: '$5,400', status: 'pagado' as BillingStatus, mes: 'Mar 2026' },
  { agente: 'Héctor Ríos', polizas: 4, primaNeta: '$44,200', pctComision: '7%', montoComision: '$3,094', status: 'vencido' as BillingStatus, mes: 'Mar 2026' },
]

const STATUS_MAP: Record<BillingStatus, { label: string; color: string; bg: string }> = {
  pagado:   { label: 'Pagado',   color: '#69A481', bg: 'rgba(105,164,129,0.10)' },
  pendiente:{ label: 'Pendiente',color: '#F7941D', bg: 'rgba(247,148,29,0.10)' },
  vencido:  { label: 'Vencido',  color: '#7C1F31', bg: 'rgba(124,31,49,0.10)' },
  parcial:  { label: 'Parcial',  color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
}

const totalCobrado = MOCK_PRIMAS.filter(p => p.status === 'pagado').length
const totalPendiente = MOCK_PRIMAS.filter(p => p.status === 'pendiente' || p.status === 'parcial').length
const totalVencido = MOCK_PRIMAS.filter(p => p.status === 'vencido').length
const totalComisionesPendiente = MOCK_COMISIONES.filter(c => c.status === 'pendiente').reduce((s, c) => s + parseFloat(c.montoComision.replace(/[$,]/g, '')), 0)

export default function BillingPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('primas')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BillingStatus | 'todos'>('todos')
  const [pagarModal, setPagarModal] = useState<string | null>(null)
  const [pagados, setPagados] = useState<string[]>([])

  const filteredPrimas = MOCK_PRIMAS.filter(p => {
    const stLocal = pagados.includes(p.id) ? 'pagado' : p.status
    const matchStatus = statusFilter === 'todos' || stLocal === statusFilter
    const matchSearch = !search || p.asegurado.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  function confirmarPago(id: string) {
    setPagados(prev => [...prev, id])
    setPagarModal(null)
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
            <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">Billing</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Primas y comisiones</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Estado de cobros y nómina de comisiones de agentes</p>
        </div>
        <div className="ml-auto">
          <button onClick={() => exportCSV(
            tab === 'primas'
              ? MOCK_PRIMAS.map(p => ({ ID: p.id, Póliza: p.poliza, Asegurado: p.asegurado, Agente: p.agente, Ramo: p.ramo, Monto: p.monto, Vence: p.vence, Estatus: pagados.includes(p.id) ? 'pagado' : p.status }))
              : MOCK_COMISIONES.map(c => ({ Agente: c.agente, Pólizas: c.polizas, 'Prima neta': c.primaNeta, '% Comisión': c.pctComision, 'Monto comisión': c.montoComision, Mes: c.mes, Estatus: c.status })),
            tab === 'primas' ? 'billing-primas' : 'billing-comisiones')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Cobros al corriente', val: totalCobrado, icon: Check, color: '#69A481' },
          { label: 'Pendientes de pago', val: totalPendiente, icon: AlertCircle, color: '#F7941D' },
          { label: 'Cobros vencidos', val: totalVencido, icon: TrendingDown, color: '#7C1F31' },
          { label: 'Comisiones por pagar', val: `$${totalComisionesPendiente.toLocaleString('es-MX')}`, icon: DollarSign, color: '#3B82F6' },
        ].map(k => {
          const Icon = k.icon
          return (
            <div key={k.label} className="bg-[#EFF2F9] rounded-2xl px-4 py-3 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: k.color + '18' }}>
                <Icon size={18} style={{ color: k.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider leading-tight">{k.label}</p>
                <p className="text-[20px] font-bold leading-none mt-0.5" style={{ color: k.color }}>{k.val}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['primas', 'comisiones'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all capitalize', tab === t
              ? 'text-white shadow-[0_4px_14px_rgba(247,148,29,0.35)]'
              : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B]')}
            style={tab === t ? { background: '#F7941D' } : {}}>
            {t === 'primas' ? 'Recibos de prima' : 'Nómina de comisiones'}
          </button>
        ))}
      </div>

      {tab === 'primas' && (
        <>
          {/* Filtros primas */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#EFF2F9] rounded-xl px-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.08)]">
              <Search size={14} className="text-[#9CA3AF] shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar asegurado o ID..."
                className="flex-1 bg-transparent py-2.5 text-[13px] text-[#1A1F2B] outline-none placeholder:text-[#9CA3AF]" />
            </div>
            {(['todos', 'pagado', 'pendiente', 'vencido', 'parcial'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn('px-3 py-2 rounded-xl text-[11px] font-semibold transition-all', statusFilter === s
                  ? 'text-white'
                  : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B]')}
                style={statusFilter === s ? { background: s === 'todos' ? '#F7941D' : STATUS_MAP[s as BillingStatus].color } : {}}>
                {s === 'todos' ? 'Todos' : STATUS_MAP[s as BillingStatus].label}
              </button>
            ))}
          </div>

          {/* Tabla primas */}
          <div className="bg-[#EFF2F9] rounded-2xl shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)] overflow-hidden">
            <div className="grid grid-cols-[1fr_1.2fr_1fr_80px_80px_100px_100px] gap-x-3 px-5 py-3 border-b border-[#D1D5DB]/20">
              {['ID', 'Asegurado', 'Agente', 'Ramo', 'Monto', 'Vence', 'Estatus'].map(h => (
                <span key={h} className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {filteredPrimas.map(p => {
              const isPagado = pagados.includes(p.id)
              const st = STATUS_MAP[isPagado ? 'pagado' : p.status]
              return (
                <div key={p.id} className="grid grid-cols-[1fr_1.2fr_1fr_80px_80px_100px_100px] gap-x-3 px-5 py-3.5 border-b border-[#D1D5DB]/10 items-center hover:bg-white/30 transition-colors">
                  <p className="text-[11px] text-[#1A1F2B] font-semibold">{p.id}</p>
                  <p className="text-[12px] text-[#1A1F2B] truncate">{p.asegurado}</p>
                  <p className="text-[11px] text-[#6B7280] truncate">{p.agente}</p>
                  <p className="text-[10px] text-[#6B7280] truncate">{p.ramo.replace(' Individual', ' Ind.').replace(' Colectivo', ' Col.')}</p>
                  <p className="text-[12px] text-[#F7941D] font-semibold">{p.monto}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{p.vence}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-semibold" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                    {!isPagado && p.status !== 'pagado' && (
                      <button onClick={() => setPagarModal(p.id)} className="text-[10px] text-[#69A481] hover:underline font-semibold">Pagar</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {tab === 'comisiones' && (
        <div className="bg-[#EFF2F9] rounded-2xl shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)] overflow-hidden">
          <div className="grid grid-cols-[1.5fr_80px_1fr_80px_1fr_100px_100px] gap-x-3 px-5 py-3 border-b border-[#D1D5DB]/20">
            {['Agente', 'Pólizas', 'Prima neta', '% Com.', 'Comisión', 'Mes', 'Estatus'].map(h => (
              <span key={h} className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">{h}</span>
            ))}
          </div>
          {MOCK_COMISIONES.map(c => {
            const st = STATUS_MAP[c.status]
            return (
              <div key={c.agente} className="grid grid-cols-[1.5fr_80px_1fr_80px_1fr_100px_100px] gap-x-3 px-5 py-3.5 border-b border-[#D1D5DB]/10 items-center hover:bg-white/30 transition-colors">
                <p className="text-[13px] text-[#1A1F2B] font-semibold">{c.agente}</p>
                <p className="text-[12px] text-[#6B7280]">{c.polizas}</p>
                <p className="text-[12px] text-[#6B7280]">{c.primaNeta}</p>
                <p className="text-[12px] text-[#6B7280]">{c.pctComision}</p>
                <p className="text-[13px] text-[#F7941D] font-bold">{c.montoComision}</p>
                <p className="text-[11px] text-[#9CA3AF]">{c.mes}</p>
                <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-semibold" style={{ color: st.color, background: st.bg }}>{st.label}</span>
              </div>
            )
          })}
          {/* Total */}
          <div className="px-5 py-4 border-t border-[#D1D5DB]/20 flex items-center justify-between">
            <p className="text-[12px] text-[#9CA3AF] font-semibold">TOTAL COMISIONES MES</p>
            <p className="text-[18px] text-[#F7941D] font-bold">
              ${MOCK_COMISIONES.reduce((s, c) => s + parseFloat(c.montoComision.replace(/[$,]/g, '')), 0).toLocaleString('es-MX')}
            </p>
          </div>
        </div>
      )}

      {/* Modal confirmar pago */}
      {pagarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm shadow-[-16px_-16px_40px_#FAFBFF,16px_16px_40px_rgba(22,27,29,0.25)] p-6 flex flex-col gap-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#69A481]/12 flex items-center justify-center mx-auto mb-3">
                <CreditCard size={24} className="text-[#69A481]" />
              </div>
              <p className="text-[15px] text-[#1A1F2B] font-semibold">Confirmar pago</p>
              <p className="text-[12px] text-[#9CA3AF] mt-1">{pagarModal}</p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">El estado cambiará a &quot;Pagado&quot; y se registrará en el sistema.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPagarModal(null)}
                className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]">
                Cancelar
              </button>
              <button onClick={() => confirmarPago(pagarModal)}
                className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-white flex items-center justify-center gap-1.5"
                style={{ background: '#69A481', boxShadow: '0 4px 14px rgba(105,164,129,0.35)' }}>
                <Check size={13} /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
