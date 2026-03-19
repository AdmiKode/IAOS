'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, FileText, MessageSquare, Calendar,
  BarChart3, Settings, LogOut, Bot, Phone, Layers, ChevronRight,
  Bell, Search, FilePlus, RefreshCw, Menu, X, AlertTriangle,
  CreditCard, BookOpen, Shield, Tag, Brain, Crown, TrendingUp, Mail
} from 'lucide-react'
import { NotificationsPanel } from '@/components/agent/NotificationsPanel'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/agent/dashboard' },
  { icon: Users, label: 'Clientes', href: '/agent/clientes' },
  { icon: Layers, label: 'Pipeline', href: '/agent/pipeline' },
  { icon: FileText, label: 'Pólizas', href: '/agent/polizas' },
  { icon: FilePlus, label: 'Emisión', href: '/agent/emision' },
  { icon: RefreshCw, label: 'Renovaciones', href: '/agent/renovaciones' },
  { icon: MessageSquare, label: 'Mensajes', href: '/agent/mensajes' },
  { icon: AlertTriangle, label: 'Tickets', href: '/agent/tickets' },
  { icon: Shield, label: 'Siniestros', href: '/agent/siniestros' },
  { icon: CreditCard, label: 'Cobranza', href: '/agent/cobranza' },
  { icon: TrendingUp, label: 'Financiero', href: '/agent/financiero' },
  { icon: Mail, label: 'Correo', href: '/agent/correo' },
  { icon: BookOpen, label: 'Knowledge', href: '/agent/knowledge' },
  { icon: Calendar, label: 'Agenda', href: '/agent/agenda' },
  { icon: BarChart3, label: 'Reportes', href: '/agent/reportes' },
  { icon: Bot, label: 'XORIA', href: '/agent/xoria' },
  { icon: Phone, label: 'Voz IA', href: '/agent/voz' },
  { icon: Tag, label: 'Catálogos', href: '/agent/catalogos' },
  { icon: Shield, label: 'Compliance', href: '/agent/compliance' },
  { icon: Brain, label: 'IA Control', href: '/agent/ia-control' },
  { icon: Crown, label: 'Mi Plan', href: '/agent/plan' },
]

const BOTTOM_ITEMS = [
  { icon: Settings, label: 'Configuración', href: '/agent/config' },
  { icon: LogOut, label: 'Salir', href: null },
]

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Client-side auth guard — redirect to login if no session
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user, router])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleLogout() {
    logout()
    router.push('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AG'

  // Shared nav list (used both in desktop panel and mobile drawer)
  function NavList({ onItemClick }: { onItemClick?: () => void }) {
    return (
      <>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] tracking-wide transition-all duration-200',
                active
                  ? 'bg-[#EFF2F9] text-[#F7941D] shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.18)]'
                  : 'text-[#6B7280] hover:text-[#1A1F2B] hover:bg-[#EFF2F9]/60'
              )}
            >
              {item.label === 'XORIA' ? (
                <div className="w-[15px] h-[15px] rounded-full overflow-hidden shrink-0">
                  <Image src="/Icono xoria.png" alt="XORIA" width={15} height={15} className="object-cover w-full h-full" />
                </div>
              ) : (
                <item.icon size={15} />
              )}
              {item.label}
              {item.label === 'XORIA' && (
                <span className="ml-auto w-5 h-5 bg-[#F7941D] rounded-full flex items-center justify-center text-white text-[9px]">IA</span>
              )}
            </Link>
          )
        })}
      </>
    )
  }

  return (
    <div className="flex h-screen bg-[#EFF2F9]">

      {/* ── MOBILE OVERLAY ─────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ──────────────────────────────────── */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed top-0 left-0 h-full w-[280px] z-50 bg-[#EFF2F9] flex flex-col shadow-[8px_0_32px_rgba(22,27,29,0.20)] transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#D1D5DB]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <Image src="/icon.png" alt="IAOS" width={36} height={36} className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
            </div>
            <div>
              <p className="text-[13px] text-[#1A1F2B] tracking-wide truncate max-w-[140px]">{user?.name}</p>
              <p className="text-[11px] text-[#6B7280]">{user?.role === 'agent' ? 'Agente' : 'Admin'}</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#9CA3AF] hover:text-[#1A1F2B] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Drawer search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input placeholder="Buscar..." className="w-full bg-[#EFF2F9] rounded-xl pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.15)] placeholder:text-[#9CA3AF]" />
          </div>
        </div>

        {/* Drawer nav */}
        <nav className="flex flex-col px-3 gap-0.5 flex-1 overflow-y-auto">
          <NavList onItemClick={() => setMobileOpen(false)} />
        </nav>

        {/* Drawer bottom */}
        <div className="px-3 pb-5 pt-2 border-t border-[#D1D5DB]/40 flex flex-col gap-0.5">
          <Link href="/agent/config" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
            <Settings size={15} />
            Configuración
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#9CA3AF] hover:text-[#7C1F31] transition-colors w-full">
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ── DESKTOP RAIL (icon-only, dark) ─────────────────── */}
      <div className="hidden md:flex flex-col items-center w-[64px] h-full bg-[#1A1F2B] py-5 gap-1 shrink-0 z-20">
        {/* Logo */}
        <div className="mb-3 shrink-0 flex items-center justify-center">
          <Image src="/icon.png" alt="IAOS" width={44} height={44} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" />
        </div>

        {/* Nav icons — scrollable, sin scrollbar visible */}
        <div className="flex flex-col items-center gap-1 flex-1 min-h-0 overflow-y-auto w-full px-2 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 shrink-0',
                  active
                    ? 'bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)]'
                    : 'text-[#6E7F8D] hover:bg-white/10 hover:text-white'
                )}
              >
                {item.label === 'XORIA' ? (
                  <div className="w-[22px] h-[22px] rounded-full overflow-hidden">
                    <Image src="/Icono xoria.png" alt="XORIA" width={22} height={22} className="object-cover w-full h-full" style={{ filter: active ? 'none' : 'brightness(0.7) saturate(0.5)' }} />
                  </div>
                ) : (
                  <item.icon size={18} />
                )}
              </Link>
            )
          })}
        </div>

        {/* Bottom icons */}
        <div className="flex flex-col items-center gap-1 pb-2 shrink-0">
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
          <div className="w-10 h-10 rounded-xl bg-[#F7941D]/20 flex items-center justify-center text-[#F7941D] text-[12px] font-[Questrial] mt-2 cursor-pointer hover:bg-[#F7941D]/30 transition-colors shrink-0">
            {initials}
          </div>
        </div>
      </div>

      {/* ── DESKTOP EXPANDED PANEL ─────────────────────────── */}
      <div className={cn(
        'hidden md:flex flex-col h-full bg-[#EFF2F9] border-r border-[#D1D5DB]/40 transition-all duration-300 shrink-0 overflow-hidden',
        expanded ? 'w-[220px]' : 'w-0'
      )}>
        <div className="flex items-center justify-between px-4 pt-5 pb-3 shrink-0">
          <div>
            <h2 className="text-[13px] text-[#1A1F2B] tracking-wide truncate">{user?.name}</h2>
            <p className="text-[11px] text-[#6B7280] truncate">{user?.role === 'agent' ? 'Agente' : 'Administrador'}</p>
            <Link href="/agent/plan" className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] bg-[#F7941D]/15 text-[#F7941D] hover:bg-[#F7941D]/25 transition-colors">
              <Crown size={9} />
              Plan Profesional
            </Link>
          </div>
          <button onClick={() => setExpanded(v => !v)}
            className="w-6 h-6 flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1F2B] transition-colors">
            <ChevronRight size={14} className={cn('transition-transform duration-200', !expanded && 'rotate-180')} />
          </button>
        </div>

        <div className="px-3 pb-3 shrink-0">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input placeholder="Buscar..." className="w-full bg-[#EFF2F9] rounded-xl pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.15)] placeholder:text-[#9CA3AF]" />
          </div>
        </div>

        <nav className="flex flex-col px-3 gap-0.5 flex-1 min-h-0 overflow-y-auto">
          <NavList />
        </nav>

        <div className="px-3 pb-5 pt-2 border-t border-[#D1D5DB]/40 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#9CA3AF] hover:text-[#7C1F31] transition-colors w-full">
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-4 md:px-6 h-[60px] shrink-0 border-b border-[#D1D5DB]/30">
          {/* Left: hamburger (mobile) / chevron (desktop) */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors"
            >
              <Menu size={16} />
            </button>

            {/* Expand/collapse — desktop only */}
            <button onClick={() => setExpanded(v => !v)}
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
              <ChevronRight size={14} className={cn('transition-transform duration-200', expanded ? 'rotate-180' : '')} />
            </button>

            {/* Page title (mobile) */}
            <div className="md:hidden">
              {(() => {
                const item = NAV_ITEMS.find(i => pathname === i.href || pathname.startsWith(i.href + '/'))
                return item ? (
                  <p className="text-[14px] text-[#1A1F2B] tracking-wide">{item.label}</p>
                ) : null
              })()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F7941D] rounded-full" />
            </button>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-[#F7941D]/15 flex items-center justify-center text-[#F7941D] text-[12px] cursor-pointer">
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  )
}
