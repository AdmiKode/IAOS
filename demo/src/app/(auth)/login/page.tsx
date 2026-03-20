'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff, Chrome, Apple, AlertCircle, User, Building2, Users2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const DEMO_PROFILES = [
  { label: 'Agente', email: 'agente@demo.com', password: 'demo1234', icon: User, color: '#F7941D', desc: 'Agente de seguros independiente' },
  { label: 'Promotoria', email: 'promotoria@demo.com', password: 'demo1234', icon: Users2, color: '#69A481', desc: 'Directora de promotoria' },
  { label: 'Aseguradora', email: 'aseguradora@demo.com', password: 'demo1234', icon: Building2, color: '#1A1F2B', desc: 'GNP Seguros' },
]

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
      setError('Credenciales incorrectas. Selecciona un perfil demo abajo.')
      setLoading(false)
    }
  }

  function handleSocialLogin(provider: 'google' | 'apple') {
    setLoading(true)
    setTimeout(() => {
      login('agente@demo.com', 'demo1234')
      router.push('/agent/dashboard')
    }, 1200)
  }

  function selectProfile(profile: typeof DEMO_PROFILES[0]) {
    setEmail(profile.email)
    setPassword(profile.password)
    setError('')
  }

  return (
    <main className="min-h-screen bg-[#EFF2F9] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle at 35% 35%, #ffb347, #F7941D 50%, #c8600a)', filter: 'blur(2px)' }} />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle at 35% 35%, #8fbc9f, #69A481 50%, #4a7a5d)', filter: 'blur(2px)' }} />

      <div className="relative w-full max-w-sm bg-[#EFF2F9] rounded-[2rem] p-8 shadow-[-20px_-20px_40px_#FAFBFF,20px_20px_40px_rgba(22,27,29,0.23)]">

        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Insurance Agent OS" width={180} height={54}
            className="object-contain mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]" priority />
          <p className="text-[13px] text-[#6B7280] mt-1 tracking-wide">Accede a tu workspace</p>
        </div>

        {/* Social buttons */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => handleSocialLogin('google')} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#EFF2F9] rounded-2xl text-[13px] text-[#6B7280] tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-40 shadow-[-5px_-5px_10px_#FAFBFF,5px_5px_10px_rgba(22,27,29,0.18)] hover:text-[#1A1F2B]">
            <Chrome size={16} className="text-[#F7941D]" /> Google
          </button>
          <button onClick={() => handleSocialLogin('apple')} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#EFF2F9] rounded-2xl text-[13px] text-[#6B7280] tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-40 shadow-[-5px_-5px_10px_#FAFBFF,5px_5px_10px_rgba(22,27,29,0.18)] hover:text-[#1A1F2B]">
            <Apple size={16} /> Apple
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#D1D5DB]" />
          <span className="text-[11px] text-[#9CA3AF] tracking-widest uppercase">o con email</span>
          <div className="flex-1 h-px bg-[#D1D5DB]" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="agente@demo.com" value={email} onChange={e => setEmail(e.target.value)}
            icon={<Mail size={14} />} autoComplete="email" required />
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#6B7280] tracking-widest uppercase">Contraseña</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#9CA3AF]"><Lock size={14} /></span>
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                autoComplete="current-password" required
                className="w-full bg-[#EFF2F9] rounded-2xl pl-11 pr-12 py-3.5 text-[14px] text-[#1A1F2B] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] shadow-[inset_-5px_-5px_10px_#FAFBFF,inset_5px_5px_10px_rgba(22,27,29,0.18)] focus:shadow-[inset_-4px_-4px_10px_#FAFBFF,inset_4px_4px_10px_rgba(22,27,29,0.18)]" />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-[12px] text-[#7C1F31] bg-[#7C1F31]/8 rounded-xl px-3 py-2.5">
              <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="mt-1 w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Accediendo...
              </span>
            ) : 'Entrar al sistema'}
          </Button>
        </form>

        {/* Selector de perfiles demo */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-[#D1D5DB]" />
            <span className="text-[10px] text-[#9CA3AF] tracking-widest uppercase">Perfiles demo</span>
            <div className="flex-1 h-px bg-[#D1D5DB]" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_PROFILES.map(profile => (
              <button key={profile.email} onClick={() => selectProfile(profile)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all hover:bg-white/50 group"
                title={`${profile.email} / ${profile.password}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: `${profile.color}15`, border: `1px solid ${profile.color}30` }}>
                  <profile.icon size={16} style={{ color: profile.color }} />
                </div>
                <p className="text-[9px] text-[#9CA3AF] leading-tight font-medium group-hover:text-[#1A1F2B] transition-colors">{profile.label}</p>
                <p className="text-[8px] text-[#9CA3AF]/70 leading-tight">{profile.desc}</p>
              </button>
            ))}
          </div>
          <p className="text-center text-[10px] text-[#9CA3AF] mt-2">Haz clic en un perfil para auto-rellenar · pass: <strong>demo1234</strong></p>
        </div>

        <p className="text-center text-[11px] text-[#9CA3AF] mt-4 tracking-wide">
          Al acceder aceptas los <span className="text-[#F7941D]">Términos de uso</span>
        </p>
      </div>
    </main>
  )
}
