'use client'
import { useState } from 'react'
import { Card, CardHeader, Badge } from '@/components/ui'
import { MOCK_KPIS, MOCK_LEADS, MOCK_AGENDA, MOCK_CHART_DATA, PIPELINE_STAGES } from '@/data/mock'
import { TrendingUp, TrendingDown, ArrowRight, Bot, CalendarDays, Mic } from 'lucide-react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const STAGE_COLORS: Record<string, string> = {
  prospecto:     '#9CA3AF',
  contactado:    '#60A5FA',
  cita_agendada: '#A78BFA',
  propuesta:     '#F7941D',
  negociacion:   '#F59E0B',
  cierre:        '#10B981',
  ganado:        '#69A481',
  perdido:       '#7C1F31',
  renovacion:    '#3B82F6',
}

function KPICard({ kpi }: { kpi: typeof MOCK_KPIS[0] }) {
  const up = kpi.trend === 'up'
  return (
    <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-[#9CA3AF] tracking-widest uppercase mb-1">{kpi.label}</p>
          <p className="text-[26px] text-[#1A1F2B] leading-none">{kpi.value}</p>
        </div>
        <div className={cn('flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg',
          up ? 'text-[#69A481] bg-[#69A481]/12' : 'text-[#7C1F31] bg-[#7C1F31]/12')}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {kpi.change}
        </div>
      </div>
      <p className="text-[12px] text-[#9CA3AF]">{kpi.period}</p>
    </div>
  )
}

function PipelineColumn({ stage }: { stage: string }) {
  const leads = MOCK_LEADS.filter(l => l.stage === stage)
  const stageInfo = PIPELINE_STAGES.find(s => s.id === stage)
  const color = STAGE_COLORS[stage] || '#9CA3AF'

  return (
    <div className="flex flex-col gap-2 min-w-[180px]">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] text-[#6B7280] tracking-wide uppercase">{stageInfo?.label}</span>
        <span className="ml-auto text-[10px] bg-[#EFF2F9] rounded-full px-2 py-0.5 shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.12)] text-[#9CA3AF]">
          {leads.length}
        </span>
      </div>
      {leads.map(lead => (
        <div key={lead.id} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] cursor-pointer hover:scale-[1.02] transition-transform duration-150">
          <p className="text-[13px] text-[#1A1F2B] leading-tight">{lead.name}</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">{lead.product}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[12px] text-[#F7941D]">{lead.value}</span>
            <div className="w-6 h-6 rounded-lg bg-[#EFF2F9] flex items-center justify-center shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.12)] text-[#9CA3AF]">
              <span className="text-[10px]">{lead.score}%</span>
            </div>
          </div>
        </div>
      ))}
      {leads.length === 0 && (
        <div className="h-16 rounded-xl border-2 border-dashed border-[#D1D5DB] flex items-center justify-center">
          <span className="text-[11px] text-[#D1D5DB]">Vacío</span>
        </div>
      )}
    </div>
  )
}

export default function AgentDashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] text-[#1A1F2B] tracking-wide">{greeting}, {user?.name?.split(' ')[0]}</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/agent/xoria">
            <button className="flex items-center gap-2 h-10 px-4 bg-[#EFF2F9] rounded-xl shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] text-[13px] text-[#F7941D] hover:scale-105 transition-transform duration-150">
              <Bot size={15} />
              Preguntar a XORIA
            </button>
          </Link>
          <Link href="/agent/voz">
            <button className="w-10 h-10 flex items-center justify-center bg-[#EFF2F9] rounded-xl shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] text-[#6B7280] hover:scale-105 transition-transform duration-150">
              <Mic size={15} />
            </button>
          </Link>
        </div>
      </div>

      {/* KPIs grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {MOCK_KPIS.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
      </div>

      {/* Fila central: Gráfica + Agenda */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Gráfica de producción */}
        <div className="xl:col-span-2 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)]">
          <CardHeader title="Producción mensual" subtitle="Primas emitidas · MXN" />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7941D" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F7941D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#EFF2F9', border: 'none', borderRadius: 12, fontSize: 12, boxShadow: '-4px -4px 8px #FAFBFF, 4px 4px 8px rgba(22,27,29,0.15)' }}
                  itemStyle={{ color: '#F7941D' }}
                  cursor={{ stroke: '#F7941D', strokeOpacity: 0.3, strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="primas" stroke="#F7941D" strokeWidth={2} fill="url(#gradAcc)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agenda */}
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)]">
          <CardHeader title="Agenda hoy" action={
            <Link href="/agent/agenda">
              <button className="text-[11px] text-[#F7941D] hover:underline flex items-center gap-1">
                Ver todo <ArrowRight size={11} />
              </button>
            </Link>
          } />
          <div className="flex flex-col gap-2">
            {MOCK_AGENDA.map(item => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="flex flex-col items-center pt-0.5">
                  <span className="text-[11px] text-[#F7941D] whitespace-nowrap">{item.time}</span>
                </div>
                <div className="flex-1 bg-[#EFF2F9] rounded-xl px-3 py-2 shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.12)]">
                  <p className="text-[12px] text-[#1A1F2B] leading-tight">{item.title}</p>
                  {item.client && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{item.client}</p>}
                </div>
                <Badge label={item.type === 'call' ? 'Llamada' : item.type === 'meeting' ? 'Reunión' : item.type === 'followup' ? 'Seguimiento' : 'Tarea'}
                  variant={item.type === 'call' ? 'info' : item.type === 'meeting' ? 'warning' : 'default'}
                  size="sm" />
              </div>
            ))}
            {MOCK_AGENDA.length === 0 && (
              <p className="text-[12px] text-[#9CA3AF] text-center py-4">Sin eventos hoy</p>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Kanban (scroll horizontal) */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] text-[#1A1F2B] tracking-wide">Pipeline de ventas</h3>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">{MOCK_LEADS.length} prospectos activos</p>
          </div>
          <Link href="/agent/pipeline">
            <button className="flex items-center gap-1.5 text-[12px] text-[#F7941D] hover:underline">
              Ver completo <ArrowRight size={12} />
            </button>
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {PIPELINE_STAGES.slice(0, 6).map(stage => (
            <PipelineColumn key={stage.id} stage={stage.id} />
          ))}
        </div>
      </div>

      {/* XORIA Briefing */}
      <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#F7941D]/20 flex items-center justify-center shrink-0">
          <Bot size={22} className="text-[#F7941D]" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] text-white tracking-wide">Resumen de XORIA</p>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5 leading-relaxed">
            Tienes 3 prospectos en etapa de propuesta con alta probabilidad de cierre esta semana.
            María González requiere seguimiento urgente. Tu tasa de conversión es del 24% — 6% sobre el promedio del sector.
          </p>
        </div>
        <Link href="/agent/xoria">
          <button className="shrink-0 flex items-center gap-2 h-9 px-4 bg-[#F7941D] rounded-xl text-white text-[12px] hover:bg-[#E8820A] transition-colors">
            Preguntar <ArrowRight size={13} />
          </button>
        </Link>
      </div>
    </div>
  )
}
