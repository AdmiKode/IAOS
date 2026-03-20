'use client'
import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, FileText, CreditCard, FolderOpen, AlertTriangle, Bell, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

const CLIENT_NAV = [
  { icon: Home,          label: 'Inicio',    href: '/client/inicio' },
  { icon: FileText,      label: 'Pólizas',   href: '/client/polizas' },
  { icon: CreditCard,    label: 'Pagos',     href: '/client/pagos' },
  { icon: AlertTriangle, label: 'Siniestros',href: '/client/siniestros' },
  { icon: FolderOpen,    label: 'Docs',      href: '/client/documentos' },
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user, router])

  if (!user) return null

  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AN'

  return (
    <div className="min-h-screen bg-[#EFF2F9] flex flex-col max-w-[430px] mx-auto relative">
      {/* Header mobile */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4 shrink-0">
        <div>
          <p className="text-[11px] text-[#9CA3AF] tracking-widest uppercase">Bienvenido</p>
          <h1 className="text-[18px] text-[#1A1F2B] tracking-wide">{user.name?.split(' ')[0]}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-9 h-9 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)] flex items-center justify-center text-[#6B7280]">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F7941D] rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-[#1A1F2B] flex items-center justify-center text-white text-[12px]">
            {initials}
          </div>
          <button onClick={() => { logout(); router.push('/login') }}
            className="w-9 h-9 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)] flex items-center justify-center text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto px-5 pb-28">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#EFF2F9] shadow-[-0px_-8px_24px_rgba(22,27,29,0.12)] px-2 pt-3 pb-6 flex justify-between z-50">
        {CLIENT_NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 min-w-[52px] py-2 px-2 rounded-2xl transition-all duration-200',
                active
                  ? 'bg-[#EFF2F9] shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.18)]'
                  : 'text-[#9CA3AF] hover:text-[#6B7280]'
              )}
            >
              <item.icon size={20} className={active ? 'text-[#F7941D]' : 'text-[#9CA3AF]'} />
              <span className={cn('text-[9px] tracking-wide', active ? 'text-[#F7941D]' : 'text-[#9CA3AF]')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
