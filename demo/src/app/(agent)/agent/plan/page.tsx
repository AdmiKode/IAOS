'use client'
import { useState } from 'react'
import { CheckCircle, Lock, Crown, Zap, Building2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const PLAN_MODULES: Record<string, { modules: string[]; color: string; label: string; price: string; icon: React.ElementType }> = {
  agente: {
    label: 'Agente',
    price: '$299/mes',
    color: '#6B7280',
    icon: Zap,
    modules: ['Dashboard', 'Clientes', 'Pólizas', 'Cobranza', 'Mensajes', 'Agenda', 'Portal cliente', 'XORIA básico'],
  },
  profesional: {
    label: 'Profesional',
    price: '$599/mes',
    color: '#F7941D',
    icon: Crown,
    modules: ['Dashboard', 'Clientes', 'Pipeline Kanban', 'Pólizas', 'Emisión / Cotizador', 'Renovaciones', 'Cobranza', 'Mensajes', 'Tickets', 'Siniestros', 'Agenda', 'Reportes', 'Portal cliente', 'XORIA avanzado', 'Voz IA'],
  },
  agencia: {
    label: 'Agencia',
    price: '$1,299/mes',
    color: '#7C1F31',
    icon: Building2,
    modules: ['Dashboard', 'Clientes', 'Pipeline Kanban', 'Pólizas', 'Emisión / Cotizador', 'Renovaciones', 'Cobranza', 'Mensajes', 'Tickets', 'Siniestros', 'Knowledge Base', 'Agenda', 'Reportes avanzados', 'Catálogos', 'Compliance / Auditoría', 'IA Control', 'Voz IA', 'Portal cliente', 'XORIA personalizado', 'API Access', 'Multi-sucursal'],
  },
}

const ALL_MODULES = [
  'Dashboard', 'Clientes', 'Pipeline Kanban', 'Pólizas', 'Emisión / Cotizador',
  'Renovaciones', 'Cobranza', 'Mensajes', 'Tickets', 'Siniestros',
  'Knowledge Base', 'Agenda', 'Reportes avanzados', 'Catálogos', 'Compliance / Auditoría',
  'IA Control', 'Voz IA', 'Portal cliente', 'XORIA básico', 'XORIA avanzado',
  'XORIA personalizado', 'API Access', 'Multi-sucursal',
]

// Simulated current plan — in a real app this comes from auth context / subscription
const CURRENT_PLAN = 'profesional'

export default function PlanPage() {
  const [preview, setPreview] = useState<string>(CURRENT_PLAN)
  const plan = PLAN_MODULES[preview]
  const Icon = plan.icon

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Mi plan y permisos</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">Vista de modulos disponibles segun suscripcion</p>
        </div>
        <Link href="/landing#pricing"
          className="px-4 py-2.5 rounded-xl bg-[#F7941D] text-white text-[12px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
          Mejorar plan
        </Link>
      </div>

      {/* Plan actual badge */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${PLAN_MODULES[CURRENT_PLAN].color}18` }}>
          <Crown size={22} style={{ color: PLAN_MODULES[CURRENT_PLAN].color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide">Plan actual</p>
          <p className="text-[18px] text-[#1A1F2B]">{PLAN_MODULES[CURRENT_PLAN].label}</p>
          <p className="text-[12px]" style={{ color: PLAN_MODULES[CURRENT_PLAN].color }}>{PLAN_MODULES[CURRENT_PLAN].price}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-[#9CA3AF]">Modulos activos</p>
          <p className="text-[22px] text-[#69A481]">{PLAN_MODULES[CURRENT_PLAN].modules.length}</p>
        </div>
      </div>

      {/* Selector de vista por plan */}
      <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.12)]">
        <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide mb-3">Previsualizar como se ve cada plan</p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PLAN_MODULES).map(([key, pl]) => {
            const Ic = pl.icon
            return (
              <button key={key} onClick={() => setPreview(key)}
                className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] transition-all', preview === key ? 'text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]')}
                style={{ background: preview === key ? pl.color : undefined }}>
                <Ic size={13} />
                {pl.label}
                {key === CURRENT_PLAN && <span className="text-[9px] opacity-80">(actual)</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid de modulos */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}18` }}>
            <Icon size={15} style={{ color: plan.color }} />
          </div>
          <div>
            <p className="text-[14px] text-[#1A1F2B]">Vista: Plan {plan.label}</p>
            <p className="text-[11px] text-[#9CA3AF]">{plan.modules.length} de {ALL_MODULES.length} modulos activos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {ALL_MODULES.map(mod => {
            const active = plan.modules.includes(mod)
            return (
              <div key={mod} className={cn('flex items-center gap-2.5 p-3 rounded-xl transition-all', active ? 'bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]' : 'opacity-40')}>
                <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0', active ? '' : 'bg-[#D1D5DB]/40')}
                  style={{ background: active ? `${plan.color}20` : undefined }}>
                  {active
                    ? <CheckCircle size={12} style={{ color: plan.color }} />
                    : <Lock size={10} className="text-[#B5BFC6]" />
                  }
                </div>
                <span className="text-[12px]" style={{ color: active ? '#1A1F2B' : '#B5BFC6' }}>{mod}</span>
                {!active && preview === CURRENT_PLAN && (
                  <Link href="/landing#pricing" className="ml-auto text-[10px] text-[#F7941D] hover:underline flex items-center gap-0.5 shrink-0">
                    Activar <ChevronRight size={10} />
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Comparativa */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.12)]">
        <p className="text-[13px] text-[#1A1F2B] mb-4">Comparativa de planes</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr>
                <th className="text-left text-[#9CA3AF] py-2 pr-4 font-normal">Modulo</th>
                {Object.entries(PLAN_MODULES).map(([key, pl]) => (
                  <th key={key} className="text-center py-2 px-3 font-semibold" style={{ color: pl.color }}>{pl.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_MODULES.map((mod, i) => (
                <tr key={mod} className={i % 2 === 0 ? 'bg-[#EFF2F9]' : 'bg-white/20'}>
                  <td className="py-2 pr-4 text-[#6B7280]">{mod}</td>
                  {Object.entries(PLAN_MODULES).map(([key, pl]) => (
                    <td key={key} className="text-center py-2 px-3">
                      {pl.modules.includes(mod)
                        ? <CheckCircle size={13} style={{ color: pl.color }} className="mx-auto" />
                        : <div className="w-3 h-0.5 bg-[#D1D5DB] mx-auto rounded-full" />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
