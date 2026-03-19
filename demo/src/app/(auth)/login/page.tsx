'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff, Chrome, Apple, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = login(email, password)
    if (result.success && result.redirect) {
      router.push(result.redirect)
    } else {
      setError('Credenciales incorrectas. Usa agente@demo.com / demo1234')
      setLoading(false)
    }
  }

  function handleSocialLogin(provider: 'google' | 'apple') {
    setLoading(true)
    // Mock: simula login como agente
    setTimeout(() => {
      login('agente@demo.com', 'demo1234')
      router.push('/agent/dashboard')
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-[#EFF2F9] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Esferas decorativas de fondo */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle at 35% 35%, #ffb347, #F7941D 50%, #c8600a)', filter: 'blur(2px)' }} />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle at 35% 35%, #8fbc9f, #69A481 50%, #4a7a5d)', filter: 'blur(2px)' }} />
      <div className="absolute top-1/4 -left-8 w-24 h-24 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle at 35% 35%, #ffb347, #F7941D)' }} />

      {/* Card central */}
      <div className="relative w-full max-w-sm bg-[#EFF2F9] rounded-[2rem] p-8 shadow-[-20px_-20px_40px_#FAFBFF,20px_20px_40px_rgba(22,27,29,0.23)]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF2F9] shadow-[-8px_-8px_16px_#FAFBFF,8px_8px_16px_rgba(22,27,29,0.18)] flex items-center justify-center mb-4">
            <Image src="/icon.png" alt="IAOS" width={40} height={40} className="rounded-xl" />
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] tracking-wide">Insurance Agent OS</h1>
          <p className="text-[13px] text-[#6B7280] mt-1 tracking-wide">Accede a tu workspace</p>
        </div>

        {/* Social buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#EFF2F9] rounded-2xl text-[13px] text-[#6B7280] tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-40 shadow-[-5px_-5px_10px_#FAFBFF,5px_5px_10px_rgba(22,27,29,0.18)] hover:text-[#1A1F2B]"
          >
            <Chrome size={16} className="text-[#F7941D]" />
            Google
          </button>
          <button
            onClick={() => handleSocialLogin('apple')}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#EFF2F9] rounded-2xl text-[13px] text-[#6B7280] tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-40 shadow-[-5px_-5px_10px_#FAFBFF,5px_5px_10px_rgba(22,27,29,0.18)] hover:text-[#1A1F2B]"
          >
            <Apple size={16} />
            Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#D1D5DB]" />
          <span className="text-[11px] text-[#9CA3AF] tracking-widest uppercase">o con email</span>
          <div className="flex-1 h-px bg-[#D1D5DB]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="agente@demo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail size={14} />}
            autoComplete="email"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#6B7280] tracking-widest uppercase">Contraseña</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#9CA3AF]"><Lock size={14} /></span>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full bg-[#EFF2F9] rounded-2xl pl-11 pr-12 py-3.5 text-[14px] text-[#1A1F2B] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] shadow-[inset_-5px_-5px_10px_#FAFBFF,inset_5px_5px_10px_rgba(22,27,29,0.18)] focus:shadow-[inset_-4px_-4px_10px_#FAFBFF,inset_4px_4px_10px_rgba(22,27,29,0.18)]"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-4 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-[12px] text-[#7C1F31] bg-[#7C1F31]/8 rounded-xl px-3 py-2.5">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Demo hint */}
          <div className="bg-[#F7941D]/10 rounded-xl px-3 py-2 text-[11px] text-[#F7941D] tracking-wide">
            <span className="text-[#F7941D]/70">Demo:</span> agente@demo.com · cliente@demo.com — pass: demo1234
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="mt-1 w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Accediendo...
              </span>
            ) : 'Entrar al sistema'}
          </Button>
        </form>

        <p className="text-center text-[11px] text-[#9CA3AF] mt-6 tracking-wide">
          Al acceder aceptas los <span className="text-[#F7941D]">Términos de uso</span>
        </p>
      </div>
    </main>
  )
}
