'use client'
import { useState } from 'react'
import {
  Building2, Users2, User, ShieldCheck,
  CheckCircle, BarChart3, FileText, MessageSquare,
  Mic, Zap, Globe, Lock, TrendingUp, CreditCard,
  ClipboardList, AlertTriangle, Star, Phone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface PlanModule {
  icon: React.ElementType
  name: string
  desc: string
}
interface PlanMetric {
  label: string
  value: string
  color?: string
}
interface ProfilePlan {
  id: string
  label: string
  subtitle: string
  color: string
  icon: React.ElementType
  headline: string
  metrics: PlanMetric[]
  modules: PlanModule[]
  highlight: string
}

// ─── Perfiles ─────────────────────────────────────────────────────────────────
const PROFILES: ProfilePlan[] = [
  {
    id: 'aseguradora',
    label: 'Aseguradora',
    subtitle: 'GNP Seguros — Core Operativo',
    color: '#1A1F2B',
    icon: Building2,
    headline: 'Gestion integral del negocio asegurador. Suscripcion masiva, control de siniestros, red comercial, riesgo y antifraude desde un solo panel.',
    metrics: [
      { label: 'Polizas activas',     value: '52,418',  color: '#69A481' },
      { label: 'Prima acumulada',      value: '$184M',   color: '#F7941D' },
      { label: 'Siniestros abiertos',  value: '612',     color: '#7C1F31' },
      { label: 'Agentes en red',       value: '1,240',   color: '#1A1F2B' },
    ],
    modules: [
      { icon: BarChart3,     name: 'Dashboard operativo',        desc: 'KPIs de produccion, siniestralidad y cobranza en tiempo real' },
      { icon: ClipboardList, name: 'Suscripcion / Underwriting', desc: 'Mesa de revision de expedientes, score de riesgo, aprobacion masiva' },
      { icon: FileText,      name: 'Polizas',                    desc: 'Inventario de 52K polizas activas con filtros por ramo, estado y agente' },
      { icon: AlertTriangle, name: 'Siniestros',                 desc: 'Bandeja de 612 siniestros abiertos, ajustadores, reservas y pagos' },
      { icon: Globe,         name: 'Red comercial',              desc: 'Gestion de promotorias, agentes, metas y produccion consolidada' },
      { icon: TrendingUp,    name: 'Riesgo',                     desc: 'Mapa de concentracion de riesgo, indice de siniestralidad por ramo' },
      { icon: Lock,          name: 'Antifraude',                 desc: 'Deteccion de patrones anomalos, alertas activas y casos en investigacion' },
      { icon: CreditCard,    name: 'Finanzas',                   desc: 'Comisiones por agente, estado CFDI, reservas tecnicas y liquidaciones' },
      { icon: BarChart3,     name: 'Reportes regulatorios',      desc: 'CNSF, reservas IBNR, estadisticas de prima y siniestralidad' },
      { icon: Zap,           name: 'XORIA Copiloto IA',          desc: 'Analisis predictivo, alertas automaticas y resumenes ejecutivos' },
    ],
    highlight: 'Modulo exclusivo: Antifraude con deteccion automatica en tiempo real',
  },
  {
    id: 'promotoria',
    label: 'Promotoria',
    subtitle: 'Red de agentes y produccion consolidada',
    color: '#69A481',
    icon: Users2,
    headline: 'Administra tu red de agentes, consolida produccion, metas y comisiones. Recluta, capacita y haz crecer tu promotoria desde un solo lugar.',
    metrics: [
      { label: 'Agentes activos',     value: '23',       color: '#69A481' },
      { label: 'Prima de red',         value: '$12.4M',   color: '#F7941D' },
      { label: 'Meta del mes',         value: '94%',      color: '#69A481' },
      { label: 'Comision acumulada',   value: '$186K',    color: '#1A1F2B' },
    ],
    modules: [
      { icon: BarChart3,     name: 'Dashboard de red',           desc: 'Produccion consolidada, avance de metas y ranking de agentes' },
      { icon: Users2,        name: 'Equipo de agentes',          desc: 'Fichas de cada agente: cartera, prima, tasa de cierre, ramos' },
      { icon: TrendingUp,    name: 'Metas y KPIs',               desc: 'Seguimiento de metas individuales y de la red. Alertas de desviacion' },
      { icon: Star,          name: 'Reclutamiento',              desc: 'Pipeline de nuevos agentes, estado de cedula CNSF y onboarding' },
      { icon: CreditCard,    name: 'Comisiones',                 desc: 'Liquidaciones mensuales, sobrebono, estado de pago por agente' },
      { icon: ClipboardList, name: 'Capacitacion',               desc: 'Materiales de formacion, seguimientos y certificaciones del equipo' },
      { icon: FileText,      name: 'Reportes de red',            desc: 'Produccion por ramo, aseguradora y periodo. Exportacion CSV y PDF' },
      { icon: MessageSquare, name: 'Mensajes',                   desc: 'Comunicacion directa con cada agente de la red' },
      { icon: Zap,           name: 'XORIA Copiloto IA',          desc: 'Analisis de desempeno de agentes, sugerencias de intervencion' },
      { icon: Users2,        name: 'Recursos Humanos',           desc: 'Altas y bajas de agentes, nomina, prestaciones y expedientes del equipo' },
    ],
    highlight: 'Modulo exclusivo: Ranking y sobrebono automatico por produccion',
  },
  {
    id: 'agente',
    label: 'Agente',
    subtitle: 'Cartera propia y gestion comercial completa',
    color: '#F7941D',
    icon: User,
    headline: 'Todo lo que necesitas para gestionar tu cartera, cerrar ventas y atender a tus clientes. XORIA como tu copiloto de ventas en tiempo real.',
    metrics: [
      { label: 'Polizas activas',     value: '247',     color: '#69A481' },
      { label: 'Prima total',          value: '$184K',   color: '#F7941D' },
      { label: 'Cartera activa',       value: '38',      color: '#1A1F2B' },
      { label: 'Comision del mes',     value: '$27.6K',  color: '#69A481' },
    ],
    modules: [
      { icon: BarChart3,     name: 'Dashboard',                  desc: 'KPIs personales: prima, polizas activas, cobranza pendiente' },
      { icon: Users2,        name: 'Clientes',                   desc: 'Directorio y expediente de cada cliente con historial completo' },
      { icon: TrendingUp,    name: 'Cartera de oportunidades',   desc: 'Kanban de oportunidades por etapa, valor potencial y fecha estimada' },
      { icon: FileText,      name: 'Polizas',                    desc: 'Inventario de tu cartera activa con renovaciones proximas' },
      { icon: Globe,         name: 'Cotizador y Emision',        desc: 'Genera cotizaciones multiaseguradora y emite directamente' },
      { icon: ClipboardList, name: 'Renovaciones',               desc: 'Lista priorizada de polizas por vencer con accion inmediata' },
      { icon: CreditCard,    name: 'Cobranza',                   desc: 'Pagos pendientes, recordatorios automaticos y conciliacion' },
      { icon: AlertTriangle, name: 'Siniestros',                 desc: 'Apertura y seguimiento de siniestros de tu cartera' },
      { icon: MessageSquare, name: 'Mensajes',                   desc: 'Chat con clientes, WhatsApp integrado y correo centralizado' },
      { icon: Phone,         name: 'Agenda',                     desc: 'Citas, llamadas y seguimientos con recordatorios automaticos' },
      { icon: FileText,      name: 'Reportes',                   desc: 'Prima por ramo, comisiones, tasa de renovacion y cierre' },
      { icon: Mic,           name: 'Voz y XORIA IA',             desc: 'Copiloto conversacional con voz bidireccional en espanol mexicano' },
    ],
    highlight: 'XORIA con voz: dicta, consulta y ejecuta sin tocar el teclado',
  },
  {
    id: 'cliente',
    label: 'App Cliente',
    subtitle: 'Portal del asegurado',
    color: '#6E7F8D',
    icon: ShieldCheck,
    headline: 'Tu asegurado tiene acceso a sus polizas, puede reportar siniestros, revisar el estado de sus tramites y comunicarse con su agente desde la app.',
    metrics: [
      { label: 'Polizas vigentes',    value: '3',       color: '#69A481' },
      { label: 'Proximo pago',         value: '$8,500',  color: '#F7941D' },
      { label: 'Siniestros activos',   value: '1',       color: '#7C1F31' },
      { label: 'Documentos',           value: '12',      color: '#6E7F8D' },
    ],
    modules: [
      { icon: FileText,      name: 'Mis polizas',                desc: 'Detalle de coberturas, vigencia, suma asegurada y beneficiarios' },
      { icon: CreditCard,    name: 'Mis pagos',                  desc: 'Historial de pagos, comprobantes y proximos vencimientos' },
      { icon: AlertTriangle, name: 'Reportar siniestro',         desc: 'Flujo guiado para abrir un reporte con fotos y descripcion' },
      { icon: TrendingUp,    name: 'Estado de tramite',          desc: 'Seguimiento en tiempo real de siniestros y solicitudes activas' },
      { icon: FileText,      name: 'Documentos',                 desc: 'Polizas, recibos, cartas de cobertura y dictamenes medicos' },
      { icon: MessageSquare, name: 'Chat con agente',            desc: 'Comunicacion directa con su agente asignado' },
      { icon: Zap,           name: 'XORIA Asistente',            desc: 'Respuestas inmediatas a preguntas sobre su seguro en espanol' },
    ],
    highlight: 'Sin instalacion: acceso web desde cualquier dispositivo',
  },
]

// ─── Componente ───────────────────────────────────────────────────────────────
export default function PlanPage() {
  const [active, setActive] = useState<string>('agente')
  const profile = PROFILES.find(p => p.id === active)!
  const Icon = profile.icon

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Mi Plan · Perfiles del sistema</h1>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">Explora las capacidades de cada perfil de usuario en la plataforma</p>
      </div>

      {/* Selector de perfil */}
      <div className="flex gap-2 flex-wrap">
        {PROFILES.map(p => {
          const Ic = p.icon
          const isActive = p.id === active
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all',
                isActive
                  ? 'text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]'
                  : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)] hover:text-[#1A1F2B]'
              )}
              style={{ background: isActive ? p.color : undefined }}
            >
              <Ic size={14} />
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Tarjeta principal del perfil */}
      <div className="bg-[#EFF2F9] rounded-2xl p-6 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.16)]">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `${profile.color}18` }}>
            <Icon size={26} style={{ color: profile.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[18px] text-[#1A1F2B]">{profile.label}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full text-white"
                style={{ background: profile.color }}>
                {profile.subtitle}
              </span>
            </div>
            <p className="text-[13px] text-[#6B7280] mt-1 leading-relaxed">{profile.headline}</p>
          </div>
        </div>

        {/* Metricas representativas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {profile.metrics.map(m => (
            <div key={m.label} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.12)]">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{m.label}</p>
              <p className="text-[18px] mt-0.5" style={{ color: m.color ?? profile.color }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Highlight */}
        <div className="flex items-center gap-2 text-[12px] px-3 py-2 rounded-xl"
          style={{ background: `${profile.color}12`, color: profile.color }}>
          <Star size={13} />
          {profile.highlight}
        </div>
      </div>

      {/* Modulos disponibles */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] text-[#1A1F2B]">Modulos incluidos</p>
          <span className="text-[11px] px-2.5 py-1 rounded-lg text-white"
            style={{ background: profile.color }}>
            {profile.modules.length} modulos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {profile.modules.map(mod => {
            const ModIcon = mod.icon
            return (
              <div key={mod.name}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.10)]">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${profile.color}15` }}>
                  <ModIcon size={14} style={{ color: profile.color }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12px] text-[#1A1F2B] font-medium">{mod.name}</p>
                    <CheckCircle size={11} style={{ color: profile.color }} className="shrink-0" />
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] leading-snug mt-0.5">{mod.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Comparativa rapida de perfiles */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.12)]">
        <p className="text-[13px] text-[#1A1F2B] mb-4">Comparativa rapida de perfiles</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROFILES.map(p => {
            const Ic = p.icon
            const isSelected = p.id === active
            return (
              <button key={p.id} onClick={() => setActive(p.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all',
                  isSelected ? 'shadow-[0_4px_14px_rgba(0,0,0,0.18)]' : 'bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.10)] hover:bg-white/40'
                )}
                style={{ background: isSelected ? p.color : undefined }}>
                <Ic size={20} style={{ color: isSelected ? 'white' : p.color }} />
                <p className="text-[11px]" style={{ color: isSelected ? 'white' : '#1A1F2B' }}>{p.label}</p>
                <p className="text-[18px] font-semibold" style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : p.color }}>
                  {p.modules.length}
                </p>
                <p className="text-[9px]" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}>modulos</p>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
