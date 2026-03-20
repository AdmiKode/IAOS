'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  CircleDollarSign,
  FileStack,
  FileText,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/agent/aseguradora', label: 'Resumen ejecutivo', icon: Building2 },
  { href: '/agent/aseguradora/underwriting', label: 'Suscripcion', icon: ShieldCheck },
  { href: '/agent/aseguradora/polizas', label: 'Polizas', icon: FileText },
  { href: '/agent/aseguradora/billing', label: 'Cobranza', icon: CircleDollarSign },
  { href: '/agent/aseguradora/siniestros', label: 'Siniestros', icon: ShieldAlert },
  { href: '/agent/aseguradora/red-agentes', label: 'Red comercial', icon: BriefcaseBusiness },
  { href: '/agent/aseguradora/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/agent/aseguradora/finanzas', label: 'Finanzas', icon: ChartNoAxesCombined },
  { href: '/agent/aseguradora/xoria', label: 'Xoria', icon: Bot },
]

function isActive(pathname: string, href: string) {
  if (href === '/agent/aseguradora') return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

export function CarrierWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-3xl bg-[#EFF2F9] p-4 shadow-[-12px_-12px_26px_#FAFBFF,12px_12px_26px_rgba(22,27,29,0.2)] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <div className="mb-4 rounded-2xl bg-[#1A1F2B] p-4 text-white">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Carrier Core</p>
          <p className="mt-1 text-[15px]">GNP Seguros · Operacion corporativa</p>
          <p className="mt-1 text-[11px] text-white/70">Underwriting · Policy Admin · Billing · Claims</p>
        </div>

        <div className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] transition-all',
                  active
                    ? 'bg-[#EFF2F9] text-[#F7941D] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)]'
                    : 'text-[#6E7F8D] hover:bg-white/35 hover:text-[#1A1F2B]',
                )}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-[#B5BFC6]/40 bg-white/35 p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Arquitectura separada</p>
          <p className="mt-1 text-[12px] text-[#1A1F2B]">Este perfil opera como core asegurador, no como pipeline comercial.</p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F7941D]/12 px-2.5 py-1 text-[10px] text-[#F7941D]">
            <FileStack size={11} />
            Flujo corporativo
          </div>
        </div>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  )
}
