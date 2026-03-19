'use client'
import { useState } from 'react'
import { MOCK_CHART_DATA, MOCK_KPIS, MOCK_POLICIES } from '@/data/mock'
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

const PERIODS = ['Este mes', 'Trimestre', 'Este año']

const RAMOS_DATA = [
  { name: 'Automóvil', value: 38, color: '#F7941D' },
  { name: 'Vida', value: 25, color: '#7C1F31' },
  { name: 'GMM', value: 18, color: '#69A481' },
  { name: 'Hogar', value: 12, color: '#1A1F2B' },
  { name: 'Otros', value: 7, color: '#B5BFC6' },
]

const TOP_CLIENTES = [
  { name: 'Carlos Mendoza', polizas: 4, prima: '$7,360', pct: 100 },
  { name: 'Laura Sánchez', polizas: 3, prima: '$6,300', pct: 86 },
  { name: 'Grupo Textil SA', polizas: 2, prima: '$5,200', pct: 71 },
  { name: 'Roberto García', polizas: 2, prima: '$4,120', pct: 56 },
  { name: 'Ana López', polizas: 1, prima: '$3,400', pct: 46 },
]

export default function ReportesPage() {
  const [period, setPeriod] = useState('Este mes')

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[#1A1F2B] text-2xl font-bold tracking-tight">Reportes</h1>
          <p className="text-[#6B7280] text-sm mt-1">Análisis de producción y cartera</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#9CA3AF]" />
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn('px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                period === p
                  ? 'bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)]'
                  : 'neu-sm text-[#6B7280] hover:text-[#1A1F2B]')}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MOCK_KPIS.map(kpi => (
          <div key={kpi.id} className="neu-md rounded-2xl p-5">
            <p className="text-[#9CA3AF] text-xs tracking-widest uppercase mb-2">{kpi.label}</p>
            <p className="text-[#1A1F2B] text-2xl font-bold">{kpi.value}</p>
            <div className={cn('flex items-center gap-1 mt-1 text-xs',
              kpi.trend === 'up' ? 'text-[#69A481]' : kpi.trend === 'down' ? 'text-[#7C1F31]' : 'text-[#9CA3AF]')}>
              {kpi.trend === 'up' ? <TrendingUp size={11} /> : kpi.trend === 'down' ? <TrendingDown size={11} /> : null}
              {kpi.change} · {kpi.period}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Area chart */}
        <div className="neu-md rounded-2xl p-6">
          <h3 className="text-[#1A1F2B] font-semibold mb-5">Prima acumulada mensual</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F7941D" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F7941D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#B5BFC6" strokeOpacity={0.25} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#EFF2F9', border: 'none', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 20px rgba(22,27,29,0.15)' }}
                formatter={(v) => [`$${Number(v).toLocaleString('es-MX')}`, 'Prima']}
              />
              <Area type="monotone" dataKey="primas" stroke="#F7941D" strokeWidth={2.5} fill="url(#rptGrad)" dot={{ r: 4, fill: '#F7941D', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="neu-md rounded-2xl p-6">
          <h3 className="text-[#1A1F2B] font-semibold mb-5">Distribución por ramo</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={RAMOS_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                paddingAngle={3} dataKey="value" stroke="none">
                {RAMOS_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#EFF2F9', border: 'none', borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [`${v}%`, 'Cartera']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {RAMOS_DATA.map(r => (
              <div key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                  <span className="text-[#6B7280] text-xs">{r.name}</span>
                </div>
                <span className="text-[#1A1F2B] text-xs font-semibold">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="neu-md rounded-2xl p-6">
        <h3 className="text-[#1A1F2B] font-semibold mb-5">Leads generados por mes</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MOCK_CHART_DATA} margin={{ top: 0, right: 5, left: 0, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#B5BFC6" strokeOpacity={0.2} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#EFF2F9', border: 'none', borderRadius: 12, fontSize: 12 }}
              formatter={(v) => [v, 'Leads']}
            />
            <Bar dataKey="leads" fill="#69A481" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top clients ranking */}
      <div className="neu-md rounded-2xl p-6">
        <h3 className="text-[#1A1F2B] font-semibold mb-5">Top 5 clientes por prima</h3>
        <div className="flex flex-col gap-4">
          {TOP_CLIENTES.map((c, i) => (
            <div key={c.name} className="flex items-center gap-4">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                i === 0 ? "bg-[#F7941D] text-white shadow-[0_4px_10px_rgba(247,148,29,0.4)]"
                  : i === 1 ? "bg-[#69A481]/20 text-[#69A481]"
                  : "bg-[#EFF2F9] text-[#9CA3AF] shadow-[inset_-2px_-2px_4px_#FAFBFF,inset_2px_2px_4px_rgba(22,27,29,0.1)]")}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[#1A1F2B] text-sm font-semibold truncate">{c.name}</p>
                  <p className="text-[#F7941D] text-sm font-bold ml-4 shrink-0">{c.prima}</p>
                </div>
                <div className="h-1.5 rounded-full bg-[#B5BFC6]/20 overflow-hidden">
                  <div className="h-full rounded-full bg-[#F7941D] transition-all"
                    style={{ width: `${c.pct}%` }} />
                </div>
              </div>
              <p className="text-[#9CA3AF] text-xs shrink-0">{c.polizas} pól.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
