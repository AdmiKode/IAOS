'use client'
import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, FileText, CreditCard, FolderOpen, Shield, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

const CLIENT_NAV = [
  { icon: Home, label: 'Inicio', href: '/client/inicio' },
  { icon: FileText, label: 'Pólizas', href: '/client/polizas' },
  { icon: CreditCard, label: 'Pagos', href: '/client/pagos' },
  { icon: Shield, label: 'Siniestros', href: '/client/siniestros' },
  { icon: MessageSquare, label: 'Mensajes', href: '/client/mensajes' },
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#EFF2F9] flex flex-col max-w-[430px] mx-auto relative">
      {/* Header mobile */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4 shrink-0">
        <div>
          <p className="text-[11px] text-[#9CA3AF] tracking-widest uppercase">Bienvenido</p>
          <h1 className="text-[18px] text-[#1A1F2B] tracking-wide">{user.name?.split(' ')[0]}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF2F9] shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] flex items-center justify-center">
            <Image src="/icon.png" alt="IAOS" width={24} height={24} className="rounded-lg" />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto px-5 pb-28">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#EFF2F9] shadow-[-0px_-8px_24px_rgba(22,27,29,0.12)] px-4 pt-3 pb-6 flex justify-between z-50">
        {CLIENT_NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 min-w-[52px] py-2 px-3 rounded-2xl transition-all duration-200',
                active
                  ? 'bg-[#EFF2F9] shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.18)]'
                  : 'text-[#9CA3AF] hover:text-[#6B7280]'
              )}
            >
              <item.icon size={20} className={active ? 'text-[#F7941D]' : 'text-[#9CA3AF]'} />
              <span className={cn('text-[10px] tracking-wide', active ? 'text-[#F7941D]' : 'text-[#9CA3AF]')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
