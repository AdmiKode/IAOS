'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, User, Mail, Phone, Building2, Lock, Shield, AlertCircle, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLANS = [
  { id: 'basico',       label: 'Básico',       price: '$299/mes',   desc: '1 usuario · Hasta 150 pólizas · XORIA básico · Soporte email' },
  { id: 'profesional',  label: 'Profesional',  price: '$599/mes',   desc: '3 usuarios · Pólizas ilimitadas · Voz IA · Soporte prioritario' },
  { id: 'agencia',      label: 'Agencia',       price: '$1,299/mes', desc: 'Usuarios ilimitados · Multi-sucursal · API · Soporte dedicado' },
]

// Tipos de usuario — solo el agente independiente puede registrarse solo
const USER_TYPES = [
  {
    id: 'agente',
    icon: User,
    label: 'Agente independiente',
    desc: 'Tengo cédula CNSF propia y gestiono mi propia cartera',
    allowed: true,
  },
  {
    id: 'promotoria',
    icon: Shield,
    label: 'Promotor / Directora de red',
    desc: 'Superviso un equipo de agentes',
    allowed: false,
    message: 'El acceso para promotorias lo gestiona tu aseguradora o el administrador de tu red. Contacta a soporte.',
  },
  {
    id: 'aseguradora',
    icon: Building2,
    label: 'Aseguradora / Empresa',
    desc: 'Represento una aseguradora o despacho corporativo',
    allowed: false,
    message: 'Las cuentas para aseguradoras se configuran con nuestro equipo comercial. Escríbenos a ventas@iaos.mx',
  },
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

  const [step, setStep] = useState<'type' | 'form' | 'done'>('type')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    cedula: '',
    empresa: '',
    telefono: '',
    plan: planFromUrl,
    password: '',
  })

  const up = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const canSubmit = form.nombre && form.email && form.password.length >= 6 && form.plan

  function handleTypeSelect(type: typeof USER_TYPES[0]) {
    setSelectedType(type.id)
    if (!type.allowed) {
      setBlockedMessage(type.message ?? null)
    } else {
      setBlockedMessage(null)
      setStep('form')
    }
  }

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
          {step === 'type' && (
            <>
              <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Crea tu cuenta</h1>
              <p className="text-[13px] text-[#9CA3AF] mt-1">¿Cuál es tu perfil?</p>
            </>
          )}
          {step === 'form' && (
            <>
              <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Registro de agente</h1>
              <p className="text-[13px] text-[#9CA3AF] mt-1">Prueba gratis 14 días · sin tarjeta</p>
            </>
          )}
        </div>

        <div className="bg-[#EFF2F9] rounded-3xl shadow-[-12px_-12px_28px_#FAFBFF,12px_12px_28px_rgba(22,27,29,0.18)] p-6">

          {/* ── PASO 1: Tipo de usuario ── */}
          {step === 'type' && (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] text-[#6B7280] mb-1">
                El acceso a IAOS está diseñado para <strong className="text-[#1A1F2B]">agentes independientes</strong> que quieren contratar su propia licencia.
              </p>

              {USER_TYPES.map(type => {
                const Ic = type.icon
                const isSelected = selectedType === type.id
                return (
                  <button key={type.id} onClick={() => handleTypeSelect(type)}
                    className={cn(
                      'w-full text-left flex items-start gap-4 p-4 rounded-2xl border transition-all',
                      isSelected && type.allowed   ? 'border-[#F7941D] bg-[#F7941D]/5' :
                      isSelected && !type.allowed  ? 'border-[#7C1F31]/30 bg-[#7C1F31]/5' :
                      'border-transparent bg-[#EFF2F9] shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.12)]'
                    )}>
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                      type.allowed ? 'bg-[#F7941D]/10' : 'bg-[#9CA3AF]/10')}>
                      <Ic size={18} className={type.allowed ? 'text-[#F7941D]' : 'text-[#9CA3AF]'} />
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-[14px]', type.allowed ? 'text-[#1A1F2B]' : 'text-[#6B7280]')}>
                        {type.label}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">{type.desc}</p>
                    </div>
                    {type.allowed
                      ? <ChevronRight size={16} className="text-[#F7941D] shrink-0 mt-0.5" />
                      : <X size={14} className="text-[#9CA3AF] shrink-0 mt-0.5" />
                    }
                  </button>
                )
              })}

              {/* Mensaje de bloqueo */}
              {blockedMessage && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[#7C1F31]/8 border border-[#7C1F31]/15 text-[12px] text-[#7C1F31]">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{blockedMessage}</span>
                </div>
              )}

              <p className="text-[11px] text-[#9CA3AF] text-center mt-2">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-[#F7941D] hover:underline">Inicia sesión</Link>
              </p>
            </div>
          )}

          {/* ── PASO 2: Formulario agente ── */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Back */}
              <button type="button" onClick={() => setStep('type')}
                className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors mb-1">
                ← Cambiar tipo de cuenta
              </button>

              {/* Nombre */}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Nombre completo</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input value={form.nombre} onChange={e => up('nombre', e.target.value)} required
                    placeholder="Tu nombre completo"
                    className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Email profesional</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input type="email" value={form.email} onChange={e => up('email', e.target.value)} required
                    placeholder="tu@email.com"
                    className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                </div>
              </div>

              {/* Cédula CNSF y Teléfono */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Cédula CNSF</label>
                  <div className="relative">
                    <Shield size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input value={form.cedula} onChange={e => up('cedula', e.target.value)}
                      placeholder="CNSF-00000"
                      className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Teléfono</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type="tel" value={form.telefono} onChange={e => up('telefono', e.target.value)}
                      placeholder="+52 55 0000 0000"
                      className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  </div>
                </div>
              </div>

              {/* Empresa / agencia opcional */}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Nombre comercial / Agencia <span className="normal-case">(opcional)</span></label>
                <div className="relative">
                  <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input value={form.empresa} onChange={e => up('empresa', e.target.value)}
                    placeholder="Ej: Seguros Premier"
                    className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                </div>
              </div>

              {/* Plan */}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-2 block">Tu plan · suscripción mensual</label>
                <div className="flex flex-col gap-2">
                  {PLANS.map(pl => (
                    <button key={pl.id} type="button" onClick={() => up('plan', pl.id)}
                      className={cn('w-full text-left p-3 rounded-xl border transition-all',
                        form.plan === pl.id
                          ? 'border-[#F7941D] bg-[#F7941D]/5'
                          : 'border-[#D1D5DB]/30 bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]')}>
                      <div className="flex items-center justify-between">
                        <p className="text-[12px]" style={{ color: form.plan === pl.id ? '#F7941D' : '#1A1F2B' }}>{pl.label}</p>
                        <p className="text-[12px] font-medium" style={{ color: form.plan === pl.id ? '#F7941D' : '#6B7280' }}>{pl.price}</p>
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">{pl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Contraseña</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => up('password', e.target.value)} required placeholder="Mínimo 6 caracteres"
                    className="w-full bg-[#EFF2F9] pl-9 pr-10 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={!canSubmit}
                className="w-full py-3.5 rounded-xl bg-[#F7941D] text-white text-[13px] font-medium hover:bg-[#E8820A] transition-colors shadow-[0_4px_12px_rgba(247,148,29,0.3)] disabled:opacity-40 mt-1">
                Crear cuenta y empezar prueba gratuita
              </button>

              <p className="text-[10px] text-[#9CA3AF] text-center">
                Al registrarte aceptas los <span className="text-[#F7941D]">Términos de uso</span> · 14 días gratis, luego facturación mensual
              </p>
            </form>
          )}

          {/* ── PASO 3: Cuenta creada ── */}
          {step === 'done' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#69A481]/15 flex items-center justify-center">
                <CheckCircle size={32} className="text-[#69A481]" />
              </div>
              <div>
                <p className="text-[16px] text-[#1A1F2B]">¡Cuenta creada!</p>
                <p className="text-[13px] text-[#9CA3AF] mt-1">Tu periodo de prueba ha comenzado. Redirigiendo al login...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
