'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const PERFILES_DEMO = [
  {
    rol: 'Agente de Seguros',
    email: 'agente@demo.com',
    password: 'demo1234',
    redirect: '/agent/dashboard',
    color: '#F7941D',
    colorLight: 'rgba(247,148,29,0.12)',
    border: 'rgba(247,148,29,0.35)',
    badge: 'Cédula vigente',
    puntos: [
      'Dashboard personal y agenda diaria',
      'Cartera de clientes y pipeline',
      'Originación, cotización y emisión',
      'Cobranza, siniestros y tickets',
      'XORIA como copiloto operativo',
    ],
  },
  {
    rol: 'Broker / Despacho',
    email: 'broker@demo.com',
    password: 'demo1234',
    redirect: '/agent/dashboard',
    color: '#0057A8',
    colorLight: 'rgba(0,87,168,0.10)',
    border: 'rgba(0,87,168,0.30)',
    badge: 'Con equipo',
    puntos: [
      'Visión global de todos los agentes',
      'Pipeline y cartera del despacho',
      'Gestión de equipo y reportes',
      'Financiero y comisiones del grupo',
      'Cumplimiento y control de IA',
    ],
  },
  {
    rol: 'Promotoría',
    email: 'promotoria@demo.com',
    password: 'demo1234',
    redirect: '/agent/dashboard',
    color: '#69A481',
    colorLight: 'rgba(105,164,129,0.12)',
    border: 'rgba(105,164,129,0.35)',
    badge: 'Red de agentes',
    puntos: [
      'Red completa de sub-agentes',
      'Dashboard consolidado de producción',
      'Metas, KPIs y productividad',
      'Reclutamiento y formación del equipo',
      'Reportes de crecimiento y retención',
    ],
  },
]

export default function IntroPage() {
  const { login } = useAuth()
  const router = useRouter()

  const sphere1 = useRef<HTMLDivElement>(null)
  const sphere2 = useRef<HTMLDivElement>(null)
  const sphere3 = useRef<HTMLDivElement>(null)
  const ring1 = useRef<HTMLDivElement>(null)
  const ring2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 30
      const y = (e.clientY / window.innerHeight - 0.5) * 30
      if (sphere1.current) sphere1.current.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`
      if (sphere2.current) sphere2.current.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`
      if (sphere3.current) sphere3.current.style.transform = `translate(${x * 0.4}px, ${y * 0.6}px)`
      if (ring1.current) ring1.current.style.transform = `translate(${-x * 0.6}px, ${y * 0.4}px) rotate(${x}deg)`
      if (ring2.current) ring2.current.style.transform = `translate(${x * 0.3}px, ${-y * 0.3}px) rotate(${-x * 0.5}deg)`
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  function entrarComo(perfil: typeof PERFILES_DEMO[0]) {
    login(perfil.email, perfil.password)
    router.push(perfil.redirect)
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(135deg, #d9cfc8 0%, #cbc5be 30%, #bdb7b4 60%, #c8c2c0 100%)' }}
    >
      {/* ── Esferas 3D ── */}
      <div ref={sphere2} className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ top: '-80px', right: '-60px', width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #ffcf9e, #F7941D 45%, #b35b00 80%)',
          boxShadow: '0 30px 80px rgba(247,148,29,0.45), inset -8px -8px 20px rgba(0,0,0,0.15)' }} />
      <div ref={sphere1} className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ bottom: '-60px', left: '-40px', width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #ffcf9e, #F7941D 45%, #b35b00 80%)',
          boxShadow: '0 20px 60px rgba(247,148,29,0.35), inset -6px -6px 16px rgba(0,0,0,0.15)' }} />
      <div ref={sphere3} className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ top: '55%', left: '-30px', width: 130, height: 130, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #ffcf9e, #F7941D 45%, #c86800 80%)',
          boxShadow: '0 10px 30px rgba(247,148,29,0.30), inset -4px -4px 10px rgba(0,0,0,0.12)' }} />

      {/* ── Anillos ── */}
      <div ref={ring1} className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ top: '32%', left: '6%', width: 110, height: 110, borderRadius: '50%',
          border: '14px solid rgba(247,148,29,0.55)', filter: 'blur(1px)',
          boxShadow: 'inset 0 0 12px rgba(247,148,29,0.3), 0 0 20px rgba(247,148,29,0.2)' }} />
      <div ref={ring2} className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ bottom: '12%', right: '8%', width: 80, height: 80, borderRadius: '50%',
          border: '10px solid rgba(247,148,29,0.40)', filter: 'blur(0.5px)',
          boxShadow: 'inset 0 0 8px rgba(247,148,29,0.2)' }} />

      {/* ── Marca de agua ── */}
      <div className="absolute top-0 left-0 w-full z-10 flex justify-center pt-8 pointer-events-none select-none">
        <span style={{ fontFamily: 'Questrial, sans-serif', letterSpacing: '0.5em', fontSize: '22px', fontWeight: 700,
          color: 'rgba(255,255,255,0.80)', textTransform: 'uppercase', whiteSpace: 'nowrap',
          textShadow: '0 2px 16px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.20)' }}>
          Insurance Agent OS
        </span>
      </div>

      {/* ── Navbar (solo espaciador) ── */}
      <nav className="relative z-20 flex items-center justify-end px-8 pt-7 pb-2 max-w-6xl mx-auto w-full pointer-events-none h-16" />

      {/* ── Contenido principal ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">

        {/* Glass panel superior */}
        <div className="relative w-full max-w-lg rounded-2xl px-10 py-10 flex flex-col items-center gap-5"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)' }}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7941D] animate-pulse" />
            <span className="text-[#F7941D] text-[10px] font-bold tracking-[0.25em] uppercase">Impulsado por XORIA AI</span>
          </div>
          <Image src="/logo.png" alt="Insurance Agent OS" width={220} height={72}
            className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.18)]" priority />
          <p className="text-[#374151] text-sm leading-relaxed text-center max-w-sm">
            El sistema operativo del agente de seguros moderno. Gestiona cartera, cotiza, automatiza renovaciones y atiende clientes con IA — desde un solo lugar.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-1">
            <Link href="/landing"
              className="px-7 py-3 rounded-full bg-white/20 text-[#1A1F2B] text-xs font-bold tracking-widest uppercase border border-white/40 backdrop-blur-sm hover:bg-white/35 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
              Conocer más
            </Link>
            <Link href="/login"
              className="px-7 py-3 rounded-full bg-[#F7941D] text-white text-xs font-bold tracking-widest uppercase shadow-[0_4px_20px_rgba(247,148,29,0.5)] hover:bg-[#e08019] transition-all duration-200">
              Entrar al demo
            </Link>
          </div>
        </div>

        {/* ── Selector de perfiles ── */}
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px flex-1 bg-white/20" />
            <p className="text-white/70 text-[11px] font-bold tracking-[0.25em] uppercase">Acceder directamente como</p>
            <div className="h-px flex-1 bg-white/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PERFILES_DEMO.map(perfil => (
              <button key={perfil.email} onClick={() => entrarComo(perfil)}
                className="group text-left rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
                style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)', border: `1px solid ${perfil.border}`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white text-[15px] font-bold leading-tight">{perfil.rol}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: perfil.colorLight, color: perfil.color, border: `1px solid ${perfil.border}` }}>
                      {perfil.badge}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    style={{ background: perfil.colorLight, border: `1px solid ${perfil.border}` }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={perfil.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <ul className="flex flex-col gap-1.5 mb-4">
                  {perfil.puntos.map(p => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: perfil.colorLight }}>
                        <svg width="7" height="7" viewBox="0 0 12 12" fill={perfil.color}><path d="M2 6l3 3 5-5"/></svg>
                      </span>
                      <span className="text-[11px] text-white/75 leading-tight">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12px] font-bold transition-all"
                  style={{ background: perfil.colorLight, color: perfil.color, border: `1px solid ${perfil.border}` }}>
                  Entrar como {perfil.rol.split(' ')[0]}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={perfil.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 text-center pb-6 flex flex-col items-center gap-1">
        <p className="text-[#4B5563] text-[10px] tracking-widest uppercase font-semibold">
          Live Kode® · Insurance Agent OS
        </p>
        <p className="text-[#4B5563]/70 text-[9px] tracking-wider uppercase">
          Producto en proceso de patente · Todos los derechos reservados 2026
        </p>
      </div>
    </div>
  )
}
