'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, FileText, MessageSquare, Calendar,
  BarChart3, Settings, LogOut, Bot, Phone, Layers, ChevronRight,
  Bell, Search
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/agent/dashboard' },
  { icon: Users, label: 'Clientes', href: '/agent/clientes' },
  { icon: Layers, label: 'Pipeline', href: '/agent/pipeline' },
  { icon: FileText, label: 'Pólizas', href: '/agent/polizas' },
  { icon: MessageSquare, label: 'Mensajes', href: '/agent/mensajes' },
  { icon: Calendar, label: 'Agenda', href: '/agent/agenda' },
  { icon: BarChart3, label: 'Reportes', href: '/agent/reportes' },
  { icon: Bot, label: 'XORIA', href: '/agent/xoria' },
  { icon: Phone, label: 'Voz IA', href: '/agent/voz' },
]

const BOTTOM_ITEMS = [
  { icon: Settings, label: 'Configuración', href: '/agent/config' },
  { icon: LogOut, label: 'Salir', href: null },
]

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

  function handleLogout() {
    logout()
    router.push('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AG'

  return (
    <div className="flex h-screen bg-[#EFF2F9] overflow-hidden">

      {/* Rail lateral oscuro (icono-only) */}
      <div className="flex flex-col items-center w-[64px] h-full bg-[#1A1F2B] py-5 gap-1 shrink-0 z-20">
        {/* Logo compacto */}
        <div className="w-10 h-10 rounded-xl bg-[#F7941D] flex items-center justify-center mb-5 shadow-[0_4px_12px_rgba(247,148,29,0.4)]">
          <Image src="/icon.png" alt="IAOS" width={24} height={24} className="rounded-lg" />
        </div>

        {/* Nav icons */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200',
                  active
                    ? 'bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)]'
                    : 'text-[#6E7F8D] hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon size={18} />
              </Link>
            )
          })}
        </div>

        {/* Bottom icons */}
        <div className="flex flex-col items-center gap-1 pb-2">
          {BOTTOM_ITEMS.map(item => (
            item.href ? (
              <Link key={item.label} href={item.href} title={item.label}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[#6E7F8D] hover:bg-white/10 hover:text-white transition-all duration-200">
                <item.icon size={18} />
              </Link>
            ) : (
              <button key={item.label} onClick={handleLogout} title={item.label}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[#6E7F8D] hover:bg-[#7C1F31]/40 hover:text-[#F87171] transition-all duration-200">
                <item.icon size={18} />
              </button>
            )
          ))}
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-[#F7941D]/20 flex items-center justify-center text-[#F7941D] text-[12px] font-[Questrial] mt-2 cursor-pointer hover:bg-[#F7941D]/30 transition-colors">
            {initials}
          </div>
        </div>
      </div>

      {/* Panel expandido (etiquetas + info contextual) */}
      <div className={cn(
        'flex flex-col h-full bg-[#EFF2F9] border-r border-[#D1D5DB]/40 transition-all duration-300 shrink-0 overflow-hidden',
        expanded ? 'w-[220px]' : 'w-0'
      )}>
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <div>
            <h2 className="text-[13px] text-[#1A1F2B] tracking-wide truncate">{user?.name}</h2>
            <p className="text-[11px] text-[#6B7280] truncate">{user?.role === 'agent' ? 'Agente' : 'Administrador'}</p>
          </div>
          <button onClick={() => setExpanded(v => !v)}
            className="w-6 h-6 flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1F2B] transition-colors">
            <ChevronRight size={14} className={cn('transition-transform duration-200', !expanded && 'rotate-180')} />
          </button>
        </div>

        <div className="px-3 pb-3">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input placeholder="Buscar..." className="w-full bg-[#EFF2F9] rounded-xl pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.15)] placeholder:text-[#9CA3AF]" />
          </div>
        </div>

        <nav className="flex flex-col px-3 gap-0.5 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] tracking-wide transition-all duration-200',
                  active
                    ? 'bg-[#EFF2F9] text-[#F7941D] shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.18)]'
                    : 'text-[#6B7280] hover:text-[#1A1F2B] hover:bg-[#EFF2F9]/60'
                )}
              >
                <item.icon size={15} />
                {item.label}
                {item.label === 'XORIA' && (
                  <span className="ml-auto w-5 h-5 bg-[#F7941D] rounded-full flex items-center justify-center text-white text-[9px]">IA</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pb-5 pt-2 border-t border-[#D1D5DB]/40">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#9CA3AF] hover:text-[#7C1F31] transition-colors w-full">
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Área de contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 h-[60px] shrink-0 border-b border-[#D1D5DB]/30">
          <button onClick={() => setExpanded(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
            <ChevronRight size={14} className={cn('transition-transform duration-200', expanded ? 'rotate-180' : '')} />
          </button>

          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F7941D] rounded-full" />
            </button>
            {/* Avatar topbar */}
            <div className="w-9 h-9 rounded-xl bg-[#F7941D]/15 flex items-center justify-center text-[#F7941D] text-[12px] cursor-pointer">
              {initials}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
