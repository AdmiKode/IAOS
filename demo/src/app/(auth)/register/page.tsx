'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, User, Mail, Phone, Building2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLANS = [
  { id: 'agente', label: 'Agente — $299/mes', desc: '1 usuario · Hasta 200 pólizas · XORIA básico' },
  { id: 'profesional', label: 'Profesional — $599/mes', desc: '3 usuarios · Pólizas ilimitadas · Voz IA' },
  { id: 'agencia', label: 'Agencia — $1,299/mes', desc: 'Usuarios ilimitados · Multi-sucursal · API' },
]

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  )
}

function RegisterContent() {
  const router = useRouter()
  const params = useSearchParams()
  const planFromUrl = params.get('plan') || 'profesional'

  const [step, setStep] = useState<'form' | 'done'>('form')
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    empresa: '',
    telefono: '',
    plan: planFromUrl,
    password: '',
  })

  const up = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const canSubmit = form.nombre && form.email && form.password.length >= 6 && form.plan

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setStep('done')
    setTimeout(() => router.push('/login'), 2500)
  }

  return (
    <div className="min-h-screen bg-[#EFF2F9] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Fondos */}
      <div aria-hidden className="fixed top-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(247,148,29,0.18), transparent 70%)', filter: 'blur(50px)' }} />
      <div aria-hidden className="fixed bottom-[-100px] left-[-80px] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(105,164,129,0.15), transparent 70%)', filter: 'blur(50px)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="IAOS" width={140} height={48} className="h-12 w-auto object-contain mb-4" />
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Crear cuenta</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Empieza tu periodo de prueba de 14 dias</p>
        </div>

        <div className="bg-[#EFF2F9] rounded-3xl shadow-[-12px_-12px_28px_#FAFBFF,12px_12px_28px_rgba(22,27,29,0.18)] p-6">
          {step === 'done' ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#69A481]/15 flex items-center justify-center">
                <CheckCircle size={32} className="text-[#69A481]" />
              </div>
              <div>
                <p className="text-[16px] text-[#1A1F2B]">Cuenta creada</p>
                <p className="text-[13px] text-[#9CA3AF] mt-1">Redirigiendo al login...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Nombre */}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Nombre completo</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input value={form.nombre} onChange={e => up('nombre', e.target.value)} required
                    placeholder="Tu nombre"
                    className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Email</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input type="email" value={form.email} onChange={e => up('email', e.target.value)} required
                    placeholder="tu@email.com"
                    className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                </div>
              </div>

              {/* Empresa y teléfono */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Empresa</label>
                  <div className="relative">
                    <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input value={form.empresa} onChange={e => up('empresa', e.target.value)}
                      placeholder="Agencia (opcional)"
                      className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Telefono</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type="tel" value={form.telefono} onChange={e => up('telefono', e.target.value)}
                      placeholder="+52 55 0000"
                      className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  </div>
                </div>
              </div>

              {/* Plan */}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-2 block">Plan seleccionado</label>
                <div className="flex flex-col gap-2">
                  {PLANS.map(pl => (
                    <button key={pl.id} type="button" onClick={() => up('plan', pl.id)}
                      className={cn('w-full text-left p-3 rounded-xl border transition-all', form.plan === pl.id ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-[#D1D5DB]/30 bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]')}>
                      <p className="text-[12px] text-[#1A1F2B]" style={{ color: form.plan === pl.id ? '#F7941D' : undefined }}>{pl.label}</p>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">{pl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Contrasena</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => up('password', e.target.value)} required
                    placeholder="Minimo 6 caracteres"
                    className="w-full bg-[#EFF2F9] pl-9 pr-10 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={!canSubmit}
                className="w-full py-3.5 rounded-xl bg-[#F7941D] text-white text-[13px] font-medium hover:bg-[#E8820A] transition-colors shadow-[0_4px_12px_rgba(247,148,29,0.3)] disabled:opacity-40 mt-1">
                Crear cuenta
              </button>

              <p className="text-[11px] text-[#9CA3AF] text-center">
                Ya tienes cuenta?{' '}
                <Link href="/login" className="text-[#F7941D] hover:underline">Iniciar sesion</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
