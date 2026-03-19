'use client'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { LogOut, User, Bell, Globe, Shield } from 'lucide-react'

export default function ConfigPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <div>
        <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Configuración</h1>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">Preferencias de tu workspace</p>
      </div>

      {/* Perfil */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#F7941D]/15 flex items-center justify-center text-[#F7941D] text-[18px]">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-[16px] text-[#1A1F2B]">{user?.name}</p>
            <p className="text-[13px] text-[#9CA3AF]">{user?.email}</p>
            <p className="text-[12px] text-[#F7941D] mt-0.5 capitalize">{user?.role}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { icon: User, label: 'Editar perfil', sub: 'Nombre, foto, firma' },
            { icon: Bell, label: 'Notificaciones', sub: 'Alertas, recordatorios' },
            { icon: Globe, label: 'Idioma', sub: 'Español (predeterminado)' },
            { icon: Shield, label: 'Seguridad', sub: 'Contraseña, 2FA' },
          ].map(item => (
            <div key={item.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)] cursor-pointer hover:scale-[1.01] transition-transform">
              <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                <item.icon size={15} className="text-[#F7941D]" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-[#1A1F2B]">{item.label}</p>
                <p className="text-[11px] text-[#9CA3AF]">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="danger" onClick={() => { logout(); router.push('/login') }} className="w-fit">
        <LogOut size={15} />
        Cerrar sesión
      </Button>

      <p className="text-[11px] text-[#B5BFC6] tracking-wide">Insurance Agent OS · Demo v1.0 · © 2026 AdmiKode</p>
    </div>
  )
}
