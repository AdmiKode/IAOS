'use client'
import { useState } from 'react'
import { MOCK_PAYMENTS, MOCK_POLICIES } from '@/data/mock'
import { CreditCard, TrendingUp, AlertTriangle, CheckCircle, Search, Filter, Download, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const STATUS_COLOR: Record<string, string> = {
  pagado: '#69A481',
  pendiente: '#F7941D',
  vencido: '#7C1F31',
}

const MONTHLY_DATA = [
  { mes: 'Ene', cobrado: 48000, pendiente: 12000 },
  { mes: 'Feb', cobrado: 52000, pendiente: 8000 },
  { mes: 'Mar', cobrado: 61000, pendiente: 15000 },
  { mes: 'Abr', cobrado: 55000, pendiente: 10000 },
  { mes: 'May', cobrado: 70000, pendiente: 6000 },
  { mes: 'Jun', cobrado: 78000, pendiente: 9000 },
]

export default function CobranzaPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filtered = MOCK_PAYMENTS.filter(p => {
    const matchSearch = p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.concept.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalCobrado = MOCK_PAYMENTS.filter(p => p.status === 'pagado').reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, '') || '0'), 0)
  const totalPendiente = MOCK_PAYMENTS.filter(p => p.status === 'pendiente').reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, '') || '0'), 0)
  const totalVencido = MOCK_PAYMENTS.filter(p => p.status === 'vencido').reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, '') || '0'), 0)

  const kpis = [
    { label: 'Cobrado este mes', val: `$${totalCobrado.toLocaleString()}`, color: '#69A481', icon: CheckCircle },
    { label: 'Por cobrar', val: `$${totalPendiente.toLocaleString()}`, color: '#F7941D', icon: CreditCard },
    { label: 'Vencido', val: `$${totalVencido.toLocaleString()}`, color: '#7C1F31', icon: AlertTriangle },
    { label: 'Pólizas activas', val: MOCK_POLICIES.filter(p => p.status === 'activa' || p.status === 'vigente').length, color: '#6B7280', icon: TrendingUp },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${k.color}15` }}>
              <k.icon size={16} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-[18px] leading-tight" style={{ color: k.color }}>{k.val}</p>
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfica */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[14px] text-[#1A1F2B]">Flujo de cobranza</p>
            <p className="text-[11px] text-[#9CA3AF]">Primer semestre del año</p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#69A481] rounded" />Cobrado</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#F7941D] rounded" />Pendiente</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCob" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#69A481" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#69A481" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F7941D" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F7941D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#EFF2F9', border: 'none', borderRadius: 12, fontSize: 12 }} />
            <Area type="monotone" dataKey="cobrado" stroke="#69A481" strokeWidth={2} fill="url(#gradCob)" />
            <Area type="monotone" dataKey="pendiente" stroke="#F7941D" strokeWidth={2} fill="url(#gradPend)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de pagos */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente o concepto..."
              className="w-full bg-[#EFF2F9] pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
          </div>
          <div className="flex gap-2">
            {['pagado', 'pendiente', 'vencido'].map(s => (
              <button key={s} onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                className="text-[11px] px-2.5 py-1.5 rounded-xl transition-all"
                style={{ background: filterStatus === s ? `${STATUS_COLOR[s]}20` : 'transparent', color: filterStatus === s ? STATUS_COLOR[s] : '#9CA3AF', border: `1px solid ${filterStatus === s ? STATUS_COLOR[s] : '#D1D5DB'}` }}>
                {s}
              </button>
            ))}
            <button className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
              <Download size={13} />
            </button>
          </div>
        </div>

        {/* Encabezado tabla */}
        <div className="grid grid-cols-5 gap-3 px-3 pb-2 border-b border-[#D1D5DB]/20">
          {['Cliente', 'Concepto', 'Monto', 'Vencimiento', 'Estado'].map(h => (
            <p key={h} className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{h}</p>
          ))}
        </div>

        {filtered.map(p => (
          <div key={p.id} className="grid grid-cols-5 gap-3 px-3 py-3 border-b border-[#D1D5DB]/10 last:border-0 hover:bg-white/30 rounded-xl transition-colors">
            <p className="text-[12px] text-[#1A1F2B] truncate">{p.clientName}</p>
            <p className="text-[12px] text-[#6B7280] truncate">{p.concept}</p>
            <p className="text-[12px] text-[#F7941D]">{p.amount}</p>
            <p className="text-[12px] text-[#9CA3AF]">{p.dueDate}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded-lg" style={{ background: `${STATUS_COLOR[p.status] || '#9CA3AF'}15`, color: STATUS_COLOR[p.status] || '#9CA3AF' }}>{p.status}</span>
              {p.status === 'pendiente' && (
                <button className="text-[10px] text-[#F7941D] hover:underline">Cobrar</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
