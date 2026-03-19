'use client'
import { MOCK_CHART_DATA, MOCK_KPIS } from '@/data/mock'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ReportesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Reportes y métricas</h1>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">Análisis de producción — {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MOCK_KPIS.map(kpi => (
          <div key={kpi.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]">
            <p className="text-[11px] text-[#9CA3AF] tracking-widest uppercase mb-2">{kpi.label}</p>
            <p className="text-[22px] text-[#1A1F2B]">{kpi.value}</p>
            <div className={cn('flex items-center gap-1 mt-1 text-[11px]',
              kpi.trend === 'up' ? 'text-[#69A481]' : kpi.trend === 'down' ? 'text-[#7C1F31]' : 'text-[#9CA3AF]')}>
              {kpi.trend === 'up' ? <TrendingUp size={11} /> : kpi.trend === 'down' ? <TrendingDown size={11} /> : null}
              {kpi.change} · {kpi.period}
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]">
          <h3 className="text-[14px] text-[#1A1F2B] mb-4">Primas emitidas (MXN)</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7941D" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F7941D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#EFF2F9', border: 'none', borderRadius: 12, fontSize: 12 }} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Primas']} />
                <Area type="monotone" dataKey="primas" stroke="#F7941D" strokeWidth={2} fill="url(#g1)" dot={{ fill: '#F7941D', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]">
          <h3 className="text-[14px] text-[#1A1F2B] mb-4">Comparativa mensual</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#EFF2F9', border: 'none', borderRadius: 12, fontSize: 12 }} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Primas']} />
                <Bar dataKey="primas" fill="#F7941D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
