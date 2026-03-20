'use client'
import { useState } from 'react'
import { Card, CardHeader, Badge } from '@/components/ui'
import { MOCK_KPIS, MOCK_LEADS, MOCK_AGENDA, MOCK_CHART_DATA, PIPELINE_STAGES, MOCK_POLICIES, MOCK_TICKETS, MOCK_PAYMENTS, MOCK_AGENTES_EQUIPO } from '@/data/mock'
import { TrendingUp, TrendingDown, ArrowRight, CalendarDays, Mic, X, FileText, CreditCard, AlertTriangle, RefreshCw, Users, BarChart3, Star, Target, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { ChartsBlock, GrowthRingChart } from '@/components/agent/ChartsBlock'
import { ClientLink } from '@/components/ui'

const STAGE_COLORS: Record<string, string> = {
  prospecto:     '#9CA3AF',
  contactado:    '#6B7280',
  cita_agendada: '#F7941D',
  propuesta:     '#F7941D',
  negociacion:   '#6B7280',
  cierre:        '#69A481',
  ganado:        '#69A481',
  perdido:       '#7C1F31',
  renovacion:    '#6B7280',
}

// ─── Datos de detalle por KPI ─────────────────────────────────────────────────
const KPI_DETAIL: Record<string, {
  icon: React.ElementType
  href: string
  linkLabel: string
  description: string
  rows: { label: string; value: string; sub?: string; status?: string }[]
}> = {
  k1: {
    icon: FileText,
    href: '/agent/polizas',
    linkLabel: 'Ver todas las pólizas',
    description: 'Pólizas con estatus activo o vigente actualmente en tu cartera.',
    rows: MOCK_POLICIES.filter(p => p.status === 'activa' || p.status === 'vigente').slice(0, 6).map(p => ({
      label: p.clientName,
      value: p.type,
      sub: p.insurer + ' · ' + p.policyNumber + ' · ' + p.startDate + ' → ' + p.endDate,
      status: p.status,
    })),
  },
  k2: {
    icon: CreditCard,
    href: '/agent/cobranza',
    linkLabel: 'Ver cobranza',
    description: 'Prima mensual acumulada de todas las pólizas activas en cartera.',
    rows: MOCK_POLICIES.filter(p => p.status === 'activa' || p.status === 'vigente').slice(0, 6).map(p => ({
      label: p.clientName,
      value: p.premium,
      sub: p.type + ' · ' + p.insurer + ' · ' + p.startDate + ' → ' + p.endDate,
      status: p.status,
    })),
  },
  k3: {
    icon: Users,
    href: '/agent/pipeline',
    linkLabel: 'Ver pipeline completo',
    description: 'Prospectos activos en todas las etapas del pipeline de ventas.',
    rows: MOCK_LEADS.slice(0, 6).map(l => ({
      label: l.name,
      value: l.value || '—',
      sub: l.product + ' · ' + l.stage,
      status: l.stage,
    })),
  },
  k4: {
    icon: RefreshCw,
    href: '/agent/renovaciones',
    linkLabel: 'Ver renovaciones',
    description: 'Pólizas próximas a vencer en los siguientes 30 días.',
    rows: MOCK_POLICIES.filter(p => {
      const end = new Date(p.endDate)
      const diff = (end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      return diff >= 0 && diff <= 90
    }).slice(0, 6).map(p => ({
      label: p.clientName,
      value: p.endDate,
      sub: p.type + ' · ' + p.insurer + ' · Inicio: ' + p.startDate,
      status: p.status,
    })),
  },
  k5: {
    icon: AlertTriangle,
    href: '/agent/tickets',
    linkLabel: 'Ver todos los tickets',
    description: 'Tickets de soporte abiertos o en proceso que requieren atención.',
    rows: MOCK_TICKETS.filter(t => t.status !== 'cerrado').slice(0, 6).map(t => ({
      label: t.clientName,
      value: t.priority,
      sub: t.subject,
      status: t.status,
    })),
  },
  k6: {
    icon: BarChart3,
    href: '/agent/reportes',
    linkLabel: 'Ver reportes',
    description: 'Tasa de cierre: prospectos que llegaron a emisión vs total de leads ingresados.',
    rows: [
      { label: 'Leads totales ingresados', value: '12', sub: 'Últimos 3 meses' },
      { label: 'Leads en emisión / cerrados', value: '8', sub: 'Avanzaron a emisión' },
      { label: 'Tasa de conversión', value: '67%', sub: 'vs 61% trimestre anterior' },
      { label: 'Mejora vs trimestre ant.', value: '+4%', sub: 'Por encima del promedio sector (58%)' },
    ],
  },
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  activa:     { label: 'Activa',     color: '#69A481' },
  vigente:    { label: 'Vigente',    color: '#69A481' },
  pendiente:  { label: 'Pendiente',  color: '#F7941D' },
  en_proceso: { label: 'En proceso', color: '#F7941D' },
  abierto:    { label: 'Abierto',    color: '#F7941D' },
  vencida:    { label: 'Vencida',    color: '#7C1F31' },
  vencido:    { label: 'Vencido',    color: '#7C1F31' },
  alta:       { label: 'Alta',       color: '#7C1F31' },
  urgente:    { label: 'Urgente',    color: '#7C1F31' },
  media:      { label: 'Media',      color: '#F7941D' },
  baja:       { label: 'Baja',       color: '#9CA3AF' },
}

function KPIModal({ kpi, onClose }: { kpi: typeof MOCK_KPIS[0]; onClose: () => void }) {
  const detail = KPI_DETAIL[kpi.id]
  if (!detail) return null
  const Icon = detail.icon
  const up = kpi.trend === 'up'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}
      onClick={onClose}
    >
      <div
        className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] flex flex-col max-h-[88vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F7941D]/12 flex items-center justify-center">
              <Icon size={18} className="text-[#F7941D]" />
            </div>
            <div>
              <h2 className="text-[15px] text-[#1A1F2B] leading-tight">{kpi.label}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[22px] text-[#1A1F2B] leading-none">{kpi.value}</span>
                <span className={cn('flex items-center gap-0.5 text-[11px] px-2 py-0.5 rounded-lg',
                  up ? 'text-[#69A481] bg-[#69A481]/12' : 'text-[#7C1F31] bg-[#7C1F31]/12')}>
                  {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {kpi.change}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#7C1F31] transition-colors mt-1">
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="text-[12px] text-[#9CA3AF] px-6 pb-3 leading-relaxed shrink-0">{detail.description}</p>

        {/* Rows */}
        <div className="flex flex-col gap-2 px-6 pb-4 overflow-y-auto flex-1 min-h-0">
          {detail.rows.map((row, i) => {
            const st = row.status ? STATUS_LABEL[row.status] : null
            return (
              <div key={i} className="bg-white/40 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1A1F2B] truncate leading-tight">{row.label}</p>
                  {row.sub && <p className="text-[10px] text-[#9CA3AF] truncate mt-0.5">{row.sub}</p>}
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-[12px] text-[#F7941D] whitespace-nowrap">{row.value}</span>
                  {st && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md" style={{ color: st.color, background: st.color + '18' }}>
                      {st.label}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer link */}
        <div className="px-6 pb-6 pt-2 shrink-0">
          <Link href={detail.href} onClick={onClose}>
            <button className="w-full py-2.5 rounded-2xl text-white text-[13px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(247,148,29,0.3)] hover:brightness-110 transition-all"
              style={{ background: '#F7941D' }}>
              {detail.linkLabel} <ArrowRight size={13} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function KPICard({ kpi, onClick }: { kpi: typeof MOCK_KPIS[0]; onClick: () => void }) {
  const up = kpi.trend === 'up'
  return (
    <button
      onClick={onClick}
      className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] flex flex-col gap-2 text-left w-full hover:scale-[1.02] active:scale-[0.99] transition-transform duration-150 group"
    >
      {/* Top row: badge only */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase leading-tight line-clamp-2 flex-1 min-w-0">{kpi.label}</p>
        <div className={cn('flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-lg shrink-0',
          up ? 'text-[#69A481] bg-[#69A481]/12' : 'text-[#7C1F31] bg-[#7C1F31]/12')}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          <span className="whitespace-nowrap">{kpi.change}</span>
        </div>
      </div>
      {/* Value */}
      <p className="text-[22px] text-[#1A1F2B] leading-none truncate">{kpi.value}</p>
      {/* Period + tap hint */}
      <div className="flex items-center justify-between gap-1">
        <p className="text-[10px] text-[#9CA3AF] truncate flex-1">{kpi.period}</p>
        <span className="text-[9px] text-[#F7941D]/60 group-hover:text-[#F7941D] transition-colors shrink-0 whitespace-nowrap">Ver detalle →</span>
      </div>
    </button>
  )
}

function PipelineColumn({ stage }: { stage: string }) {
  const leads = MOCK_LEADS.filter(l => l.stage === stage)
  const stageInfo = PIPELINE_STAGES.find(s => s.id === stage)
  const color = STAGE_COLORS[stage] || '#9CA3AF'

  return (
    <div className="flex flex-col gap-2 min-w-[180px]">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[11px] text-[#6B7280] tracking-wide uppercase truncate">{stageInfo?.label}</span>
        <span className="ml-auto text-[10px] bg-[#EFF2F9] rounded-full px-2 py-0.5 shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.12)] text-[#9CA3AF] shrink-0">
          {leads.length}
        </span>
      </div>
      {leads.map(lead => (
        <Link key={lead.id} href={`/agent/pipeline`}
          className="w-full text-left bg-[#EFF2F9] rounded-xl p-3 shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] hover:scale-[1.02] transition-transform duration-150 block">
          <p className="text-[12px] text-[#1A1F2B] leading-tight truncate">{lead.name}</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">{lead.product}</p>
          <div className="flex items-center justify-between mt-2 gap-1">
            <span className="text-[11px] text-[#F7941D] truncate">{lead.value}</span>
            <div className="w-7 h-7 rounded-lg bg-[#EFF2F9] flex items-center justify-center shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.12)] text-[#9CA3AF] shrink-0">
              <span className="text-[9px]">{lead.score}%</span>
            </div>
          </div>
        </Link>
      ))}
      {leads.length === 0 && (
        <div className="h-16 rounded-xl border-2 border-dashed border-[#D1D5DB] flex items-center justify-center">
          <span className="text-[11px] text-[#D1D5DB]">Vacío</span>
        </div>
      )}
    </div>
  )
}

// ─── CARRIER CORE DASHBOARD (broker) ────────────────────────────────────────

const CORE_MODULES = [
  {
    id: 'underwriting',
    label: 'Underwriting',
    desc: 'Bandeja de suscripción',
    route: '/agent/aseguradora/underwriting',
    color: '#F7941D',
    kpiVal: '3',
    kpiLabel: 'pendientes',
    icon: FileText,
  },
  {
    id: 'polizas',
    label: 'Policy Admin',
    desc: 'Cartera y endosos',
    route: '/agent/aseguradora/polizas',
    color: '#69A481',
    kpiVal: '8',
    kpiLabel: 'pólizas activas',
    icon: CreditCard,
  },
  {
    id: 'billing',
    label: 'Billing',
    desc: 'Primas y comisiones',
    route: '/agent/aseguradora/billing',
    color: '#3B82F6',
    kpiVal: '$42,225',
    kpiLabel: 'por pagar',
    icon: BarChart3,
  },
  {
    id: 'siniestros',
    label: 'Claims',
    desc: 'Gestión de siniestros',
    route: '/agent/aseguradora/siniestros',
    color: '#7C1F31',
    kpiVal: '2',
    kpiLabel: 'abiertos',
    icon: AlertTriangle,
  },
]

function CarrierCoreDashboard({ greeting, name, agency }: { greeting: string; name?: string; agency?: string }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-[#F7941D] font-semibold tracking-[0.2em] uppercase">Core Asegurador</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">{greeting}, {name?.split(' ')[0]}</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">
            {agency && <span className="text-[#F7941D]">{agency} · </span>}
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Link href="/agent/xoria">
          <button className="flex items-center gap-2 h-10 px-5 rounded-2xl text-white text-[13px] font-semibold"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 6px 20px rgba(247,148,29,0.4)' }}>
            Consultar XORIA <ArrowRight size={13} />
          </button>
        </Link>
      </div>

      {/* KPI resumen */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Suscripciones pendientes', val: '3', color: '#F7941D', icon: FileText, href: '/agent/aseguradora/underwriting' },
          { label: 'Pólizas activas',          val: '8', color: '#69A481', icon: CreditCard, href: '/agent/aseguradora/polizas' },
          { label: 'Primas por cobrar',        val: '$42,225', color: '#3B82F6', icon: BarChart3, href: '/agent/aseguradora/billing' },
          { label: 'Siniestros abiertos',      val: '2', color: '#7C1F31', icon: AlertTriangle, href: '/agent/aseguradora/siniestros' },
        ].map(k => {
          const KIcon = k.icon
          return (
            <Link key={k.label} href={k.href}>
              <div className="bg-[#EFF2F9] rounded-2xl px-5 py-4 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex flex-col gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-transform duration-150 group">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: k.color + '18' }}>
                    <KIcon size={15} style={{ color: k.color }} />
                  </div>
                  <ChevronRight size={11} className="text-[#D1D5DB] group-hover:text-[#F7941D] transition-colors" />
                </div>
                <p className="text-[22px] font-bold leading-none" style={{ color: k.color }}>{k.val}</p>
                <p className="text-[11px] text-[#9CA3AF] leading-tight">{k.label}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Módulos */}
      <div>
        <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-3">Módulos del sistema</p>
        <div className="grid grid-cols-2 gap-4">
          {CORE_MODULES.map(m => {
            const MIcon = m.icon
            return (
              <Link key={m.id} href={m.route}>
                <div className="group bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] hover:shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] transition-all cursor-pointer flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: m.color + '18' }}>
                      <MIcon size={18} style={{ color: m.color }} />
                    </div>
                    <ChevronRight size={14} className="text-[#D1D5DB] group-hover:text-[#9CA3AF] transition-colors" />
                  </div>
                  <div>
                    <p className="text-[16px] text-[#1A1F2B] font-bold leading-tight">{m.label}</p>
                    <p className="text-[12px] text-[#9CA3AF] mt-0.5">{m.desc}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[22px] font-bold leading-none" style={{ color: m.color }}>{m.kpiVal}</p>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">{m.kpiLabel}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white"
                      style={{ background: m.color, boxShadow: `0 4px 12px ${m.color}40` }}>
                      Abrir
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* XORIA briefing */}
      <div className="bg-[#1A1F2B] rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden">
            <Image src="/Icono xoria.png" alt="XORIA" width={28} height={28} className="object-cover w-full h-full" />
          </div>
          <p className="text-[13px] text-white font-semibold">Briefing de XORIA</p>
        </div>
        <p className="text-[12px] text-[#9CA3AF] leading-relaxed">
          Hay <span className="text-[#F7941D] font-semibold">3 solicitudes de suscripción</span> pendientes de evaluación.
          Una póliza de GMM colectivo vence en <span className="text-[#F7941D] font-semibold">7 días</span>.
          Comisiones por <span className="text-[#69A481] font-semibold">$8,450</span> listas para nómina de esta semana.
        </p>
        <Link href="/agent/xoria">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F7941D] rounded-xl text-white text-[13px] font-semibold hover:bg-[#e08019] transition-colors">
            Preguntar a XORIA <ArrowRight size={13} />
          </button>
        </Link>
      </div>
    </div>
  )
}

// ─── DASHBOARD BROKER / PROMOTORÍA ─────────────────────────────────────────

const agentes = MOCK_AGENTES_EQUIPO
const totalPolizas = agentes.reduce((s, a) => s + a.polizasActivas, 0)
const totalPrima = agentes.reduce((s, a) => s + a.primaTotal, 0)
const totalComision = agentes.reduce((s, a) => s + a.comisionMes, 0)
const totalLeads = agentes.reduce((s, a) => s + a.leads, 0)
const avgCierre = Math.round(agentes.reduce((s, a) => s + a.tasaCierre, 0) / agentes.length)
const agentesActivos = agentes.filter(a => a.status === 'activo').length

function fmt(n: number) {
  return n >= 1000000
    ? '$' + (n / 1000000).toFixed(1) + 'M'
    : n >= 1000
    ? '$' + (n / 1000).toFixed(0) + 'K'
    : '$' + n.toLocaleString('es-MX')
}

const BROKER_KPIS = [
  { label: 'Pólizas activas (equipo)', value: totalPolizas.toString(), change: '+18%', up: true, icon: FileText },
  { label: 'Prima total del equipo', value: fmt(totalPrima), change: '+11%', up: true, icon: CreditCard },
  { label: 'Comisión mensual total', value: fmt(totalComision), change: '+9%', up: true, icon: Target },
  { label: 'Leads en pipeline', value: totalLeads.toString(), change: '+7', up: true, icon: Users },
  { label: 'Tasa de cierre promedio', value: avgCierre + '%', change: '+4%', up: true, icon: BarChart3 },
  { label: 'Agentes activos', value: agentesActivos + ' / ' + agentes.length, change: '1 inactivo', up: false, icon: Star },
]

function BrokerDashboard({ greeting, role, name, agency }: { greeting: string; role: string; name?: string; agency?: string }) {
  const isBroker = role === 'broker'
  const sortedAgentes = [...agentes].sort((a, b) => b.primaTotal - a.primaTotal)

  const BROKER_KPI_LINKS = [
    '/agent/polizas',
    '/agent/cobranza',
    '/agent/financiero',
    '/agent/pipeline',
    '/agent/reportes',
    '/agent/equipo',
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] text-[#1A1F2B] tracking-wide">{greeting}, {name?.split(' ')[0]}</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">
            {agency} · {isBroker ? 'Panel de Broker' : 'Panel de Promotoría'} · {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Link href="/agent/equipo">
          <button className="flex items-center gap-2 h-10 px-5 rounded-2xl text-white text-[13px] font-semibold transition-all hover:scale-[1.03]"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 6px 20px rgba(247,148,29,0.4)' }}>
            <Users size={15} /> Gestionar equipo
          </button>
        </Link>
      </div>

      {/* KPIs consolidados */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {BROKER_KPIS.map((kpi, idx) => {
          const Icon = kpi.icon
          const href = BROKER_KPI_LINKS[idx] || '/agent/reportes'
          return (
            <Link key={kpi.label} href={href}>
              <div
                className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] flex flex-col gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-transform duration-150 group">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase leading-tight line-clamp-2 flex-1 min-w-0">{kpi.label}</p>
                  <span className={cn('flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-lg shrink-0',
                    kpi.up ? 'text-[#69A481] bg-[#69A481]/12' : 'text-[#7C1F31] bg-[#7C1F31]/12')}>
                    {kpi.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span className="whitespace-nowrap">{kpi.change}</span>
                  </span>
                </div>
                <p className="text-[20px] text-[#1A1F2B] leading-none truncate">{kpi.value}</p>
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                    <Icon size={14} className="text-[#F7941D]" />
                  </div>
                  <ChevronRight size={11} className="text-[#D1D5DB] group-hover:text-[#F7941D] transition-colors" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Ranking agentes + Pipeline consolidado */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Ranking */}
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] text-[#1A1F2B] tracking-wide">Ranking de agentes</h3>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">Por prima mensual · mes actual</p>
            </div>
            <Link href="/agent/equipo">
              <button className="flex items-center gap-1.5 text-[12px] text-[#F7941D] hover:underline shrink-0">
                Ver equipo <ArrowRight size={12} />
              </button>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {sortedAgentes.map((ag, idx) => (
              <Link key={ag.id} href={`/agent/equipo/${ag.id}`}>
                <div className="flex items-center gap-3 bg-white/50 rounded-xl px-4 py-3 hover:bg-white/80 transition-colors cursor-pointer group">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-[12px] font-black"
                    style={{
                      background: idx === 0 ? '#F7941D' : idx === 1 ? '#9CA3AF' : idx === 2 ? '#C0884C' : '#EFF2F9',
                      color: idx < 3 ? 'white' : '#6B7280',
                      boxShadow: idx < 3 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                    }}>
                    {idx + 1}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1A1F2B] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {ag.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#1A1F2B] leading-tight truncate font-medium group-hover:text-[#F7941D] transition-colors">{ag.name}</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{ag.polizasActivas} pólizas · {ag.tasaCierre}% cierre</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] text-[#F7941D] font-bold">{fmt(ag.primaTotal)}</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <div className="h-1.5 w-16 bg-[#EFF2F9] rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: ag.avanceMeta + '%', background: ag.avanceMeta >= 90 ? '#69A481' : ag.avanceMeta >= 70 ? '#F7941D' : '#7C1F31' }} />
                      </div>
                      <span className="text-[10px] text-[#9CA3AF]">{ag.avanceMeta}%</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[#D1D5DB] group-hover:text-[#F7941D] transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pipeline consolidado */}
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] text-[#1A1F2B] tracking-wide">Pipeline consolidado</h3>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">Todos los agentes · {MOCK_LEADS.length} prospectos activos</p>
            </div>
            <Link href="/agent/pipeline">
              <button className="flex items-center gap-1.5 text-[12px] text-[#F7941D] hover:underline shrink-0">
                Ver completo <ArrowRight size={12} />
              </button>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {PIPELINE_STAGES.slice(0, 8).map(stage => {
              const count = MOCK_LEADS.filter(l => l.stage === stage.id).length
              const pct = Math.round((count / MOCK_LEADS.length) * 100)
              const color = STAGE_COLORS[stage.id] || '#9CA3AF'
              return (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-[11px] text-[#6B7280] w-28 shrink-0 truncate">{stage.label}</span>
                  <div className="flex-1 h-2 bg-[#EFF2F9] rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]">
                    <div className="h-full rounded-full transition-all" style={{ width: pct + '%', background: color }} />
                  </div>
                  <span className="text-[11px] text-[#9CA3AF] w-6 text-right shrink-0">{count}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]/60 grid grid-cols-2 gap-3">
            {[
              { label: 'Valor total en pipeline', val: '$2.87M' },
              { label: 'Prospectos calientes (>80%)', val: MOCK_LEADS.filter(l => l.score >= 80).length.toString() },
            ].map(item => (
              <div key={item.label} className="bg-white/50 rounded-xl px-3 py-2">
                <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
                <p className="text-[15px] text-[#1A1F2B] font-bold mt-0.5">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas del equipo + XORIA briefing */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)]">
          <h3 className="text-[15px] text-[#1A1F2B] mb-4 tracking-wide">Alertas del equipo</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Héctor Ríos — sin actividad hace 9 días', type: 'warning', link: '/agent/equipo/ag4' },
              { label: '14 pólizas vencen en los próximos 30 días', type: 'danger', link: '/agent/renovaciones' },
              { label: 'Valeria Castillo al 99% de su meta mensual', type: 'success', link: '/agent/equipo/ag5' },
              { label: '3 tickets de siniestros sin asignar', type: 'danger', link: '/agent/tickets' },
              { label: 'Diego Pacheco — 5 leads sin seguimiento', type: 'warning', link: '/agent/equipo/ag2' },
            ].map((alert, i) => (
              <Link key={i} href={alert.link}>
                <div className={cn('flex items-center gap-3 rounded-xl px-4 py-3 hover:opacity-80 transition-opacity cursor-pointer',
                  alert.type === 'danger' ? 'bg-[#7C1F31]/8' : alert.type === 'warning' ? 'bg-[#F7941D]/8' : 'bg-[#69A481]/8')}>
                  <AlertTriangle size={13} className={alert.type === 'danger' ? 'text-[#7C1F31] shrink-0' : alert.type === 'warning' ? 'text-[#F7941D] shrink-0' : 'text-[#69A481] shrink-0'} />
                  <p className="text-[12px] text-[#1A1F2B] flex-1">{alert.label}</p>
                  <ChevronRight size={12} className="text-[#D1D5DB] shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* XORIA Briefing */}
        <div className="bg-gradient-to-br from-[#1A1F2B] to-[#2D3548] rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-[0_4px_16px_rgba(247,148,29,0.3)]">
              <Image src="/Icono xoria.png" alt="XORIA" width={48} height={48} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="text-[13px] text-white font-semibold">Briefing de XORIA</p>
              <p className="text-[10px] text-[#9CA3AF]">{isBroker ? 'Análisis del equipo broker' : 'Análisis de la promotoría'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { text: 'Valeria Castillo generó el 42% de la prima del mes. Considera asignarle más leads de GMM Colectivo.' },
              { text: '3 agentes tienen tasas de cierre por debajo del promedio del mercado (58%). Sugerencia: sesión de coaching.' },
              { text: 'El ramo Auto muestra el mayor crecimiento este mes (+22%). Diego Pacheco puede aprovechar esto.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/8 rounded-xl px-4 py-3">
                <p className="text-[12px] text-[#D1D5DB] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <Link href="/agent/xoria">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F7941D] rounded-xl text-white text-[13px] font-semibold hover:bg-[#e08019] transition-colors">
              Preguntar a XORIA <ArrowRight size={13} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AgentDashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
  const [activeKpi, setActiveKpi] = useState<typeof MOCK_KPIS[0] | null>(null)

  // ── Vista diferenciada por rol ────────────────────────────────────────────
  if (user?.role === 'promotoria') {
    return <BrokerDashboard greeting={greeting} role={user.role} name={user.name} agency={user.agency} />
  }
  if (user?.role === 'broker') {
    return <CarrierCoreDashboard greeting={greeting} name={user.name} agency={user.agency} />
  }

  return (
    <>
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
          <Link href="/agent/nueva-venta">
            <button className="flex items-center gap-2.5 h-10 px-5 rounded-2xl text-white text-[13px] font-semibold tracking-wide transition-all duration-200 hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 6px 20px rgba(247,148,29,0.4)' }}>
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                <Image src="/Icono xoria.png" alt="XORIA" width={20} height={20} className="object-cover w-full h-full" />
              </div>
              Nueva venta asistida
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
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {MOCK_KPIS.map(kpi => (
          <KPICard key={kpi.id} kpi={kpi} onClick={() => setActiveKpi(kpi)} />
        ))}
      </div>

      {/* ── Gráficas animadas: donut + barras + producción ── */}
      <ChartsBlock />

      {/* ── Crecimiento de cartera + Agenda ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Anillos de crecimiento */}
        <div className="xl:col-span-2">
          <GrowthRingChart />
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
                <div className="flex flex-col items-center pt-0.5 shrink-0">
                  <span className="text-[11px] text-[#F7941D] whitespace-nowrap">{item.time}</span>
                </div>
                <div className="flex-1 min-w-0 bg-[#EFF2F9] rounded-xl px-3 py-2 shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.12)]">
                  <p className="text-[12px] text-[#1A1F2B] leading-tight line-clamp-2">{item.title}</p>
                  {item.client && <p className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">{item.client}</p>}
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
            <button className="flex items-center gap-1.5 text-[12px] text-[#F7941D] hover:underline shrink-0">
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
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-[0_4px_16px_rgba(247,148,29,0.3)]">
          <Image src="/Icono xoria.png" alt="XORIA" width={48} height={48} className="object-cover w-full h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-white tracking-wide">Resumen de XORIA</p>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5 leading-relaxed line-clamp-3">
            Tienes 3 prospectos en etapa de propuesta con alta probabilidad de cierre esta semana.
            María González requiere seguimiento urgente. Tu tasa de conversión es del 24% — 6% sobre el promedio del sector.
          </p>
        </div>
        <Link href="/agent/xoria" className="shrink-0">
          <button className="flex items-center gap-2 h-9 px-4 bg-[#F7941D] rounded-xl text-white text-[12px] hover:bg-[#E8820A] transition-colors whitespace-nowrap">
            Preguntar <ArrowRight size={13} />
          </button>
        </Link>
      </div>
    </div>

    {/* KPI Detail Modal */}
    {activeKpi && <KPIModal kpi={activeKpi} onClose={() => setActiveKpi(null)} />}
    </>
  )
}
