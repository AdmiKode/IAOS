'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  CircleDollarSign,
  FileText,
  LogOut,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const NAV_GROUPS = [
  {
    label: 'Operativo',
    items: [
      { href: '/agent/aseguradora', label: 'Resumen ejecutivo', icon: Building2 },
      { href: '/agent/aseguradora/underwriting', label: 'Suscripcion', icon: ShieldCheck },
      { href: '/agent/aseguradora/polizas', label: 'Polizas', icon: FileText },
      { href: '/agent/aseguradora/billing', label: 'Cobranza', icon: CircleDollarSign },
      { href: '/agent/aseguradora/siniestros', label: 'Siniestros', icon: ShieldAlert },
      { href: '/agent/aseguradora/red-agentes', label: 'Red comercial', icon: BriefcaseBusiness },
    ],
  },
  {
    label: 'Inteligencia',
    items: [
      { href: '/agent/aseguradora/riesgo', label: 'Riesgo predictivo', icon: TrendingUp },
      { href: '/agent/aseguradora/antifraude', label: 'Antifraude', icon: ScanSearch },
      { href: '/agent/aseguradora/finanzas', label: 'Finanzas', icon: ChartNoAxesCombined },
      { href: '/agent/aseguradora/reportes', label: 'Reportes', icon: BarChart3 },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href === '/agent/aseguradora') return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

export function CarrierWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-3xl bg-[#EFF2F9] p-4 shadow-[-12px_-12px_26px_#FAFBFF,12px_12px_26px_rgba(22,27,29,0.2)] lg:sticky lg:top-0 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">

        {/* Header del sidebar — sin tarjeta cristal, con icono Xoria */}
        <div className="mb-5 flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-xl bg-[#1A1F2B] flex items-center justify-center shrink-0 shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.28)]">
            <Building2 size={16} className="text-[#F7941D]" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-[#1A1F2B] truncate">GNP Seguros</p>
            <p className="text-[10px] text-[#6E7F8D] truncate">Core operativo</p>
          </div>
        </div>

        {/* Grupos de navegación */}
        <div className="space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[9px] uppercase tracking-[0.18em] text-[#B5BFC6]">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href)
                  const isXoria = item.label === 'Xoria'
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
                      {isXoria ? (
                        <div className="w-[15px] h-[15px] rounded-full overflow-hidden shrink-0">
                          <Image src="/Icono xoria.png" alt="Xoria" width={15} height={15} className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <item.icon size={14} />
                      )}
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Xoria al fondo — con icono real */}
        <div className="mt-5 rounded-2xl bg-[#1A1F2B] p-3">
          <Link href="/agent/aseguradora/xoria" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
              <Image src="/Icono xoria.png" alt="Xoria" width={28} height={28} className="object-cover w-full h-full" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-white truncate">Xoria corporativa</p>
              <p className="text-[10px] text-white/50 truncate">Copiloto operativo</p>
            </div>
          </Link>
        </div>

        {/* Salir del sistema */}
        <button
          onClick={() => { logout(); router.push('/login') }}
          className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] text-[#7C1F31] hover:bg-[#7C1F31]/10 transition-all"
        >
          <LogOut size={14} />
          Salir del sistema
        </button>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  )
}
