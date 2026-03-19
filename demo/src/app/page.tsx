'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function IntroPage() {
  // Parallax leve en las esferas al mover el mouse
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

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(135deg, #d9cfc8 0%, #cbc5be 30%, #bdb7b4 60%, #c8c2c0 100%)' }}
    >
      {/* ── Esferas 3D ── */}
      {/* Grande top-right */}
      <div
        ref={sphere2}
        className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ top: '-80px', right: '-60px', width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #ffcf9e, #F7941D 45%, #b35b00 80%)',
          boxShadow: '0 30px 80px rgba(247,148,29,0.45), inset -8px -8px 20px rgba(0,0,0,0.15)',
        }}
      />
      {/* Mediana bottom-left */}
      <div
        ref={sphere1}
        className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ bottom: '-60px', left: '-40px', width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #ffcf9e, #F7941D 45%, #b35b00 80%)',
          boxShadow: '0 20px 60px rgba(247,148,29,0.35), inset -6px -6px 16px rgba(0,0,0,0.15)',
        }}
      />
      {/* Pequeña top-left */}
      <div
        ref={sphere3}
        className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ top: '55%', left: '-30px', width: 130, height: 130, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #ffcf9e, #F7941D 45%, #c86800 80%)',
          boxShadow: '0 10px 30px rgba(247,148,29,0.30), inset -4px -4px 10px rgba(0,0,0,0.12)',
        }}
      />

      {/* ── Anillos ── */}
      {/* Anillo desplazado — lejos del logo */}
      <div
        ref={ring1}
        className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ top: '32%', left: '6%', width: 110, height: 110, borderRadius: '50%',
          border: '14px solid rgba(247,148,29,0.55)',
          filter: 'blur(1px)',
          boxShadow: 'inset 0 0 12px rgba(247,148,29,0.3), 0 0 20px rgba(247,148,29,0.2)',
        }}
      />
      {/* Anillo bottom-right */}
      <div
        ref={ring2}
        className="absolute pointer-events-none transition-transform duration-500 ease-out"
        style={{ bottom: '12%', right: '8%', width: 80, height: 80, borderRadius: '50%',
          border: '10px solid rgba(247,148,29,0.40)',
          filter: 'blur(0.5px)',
          boxShadow: 'inset 0 0 8px rgba(247,148,29,0.2)',
        }}
      />

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-8 pt-7 pb-2 max-w-6xl mx-auto w-full">
        {/* Título cristal donde antes estaba el logo */}
        <div className="flex flex-col leading-tight">
          <span className="text-white/50 text-lg font-bold tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">Insurance</span>
          <span className="text-white/50 text-lg font-bold tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">Agent OS</span>
        </div>
        <Link
          href="/login"
          className="px-5 py-2 rounded-full bg-white/15 text-[#1A1F2B] text-xs font-semibold tracking-widest uppercase border border-white/40 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
        >
          Acceder
        </Link>
      </nav>

      {/* ── Glass panel central ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div
          className="relative w-full max-w-lg rounded-2xl px-10 py-12 flex flex-col items-center gap-6"
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          {/* Etiqueta */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7941D] animate-pulse" />
            <span className="text-[#F7941D] text-[10px] font-bold tracking-[0.25em] uppercase">Powered by XORIA AI</span>
          </div>

          {/* Logo grande dentro de la tarjeta */}
          <Image
            src="/logo.png"
            alt="Insurance Agent OS"
            width={220}
            height={72}
            className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
            priority
          />

          {/* Descripción */}
          <p className="text-[#374151] text-sm leading-relaxed text-center max-w-sm">
            El sistema operativo del agente de seguros moderno. Gestiona cartera, cotiza, automatiza renovaciones y atiende clientes con IA — desde un solo lugar.
          </p>

          {/* CTA centrados */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Link
              href="/landing"
              className="px-7 py-3 rounded-full bg-white/20 text-[#1A1F2B] text-xs font-bold tracking-widest uppercase border border-white/40 backdrop-blur-sm hover:bg-white/35 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
            >
              Conocer más
            </Link>
            <Link
              href="/login"
              className="px-7 py-3 rounded-full bg-[#F7941D] text-white text-xs font-bold tracking-widest uppercase shadow-[0_4px_20px_rgba(247,148,29,0.5)] hover:bg-[#e08019] transition-all duration-200"
            >
              Entrar al demo
            </Link>
          </div>

          {/* Indicador scroll */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
            <div className="w-px h-8 bg-white/50" />
            <div className="w-1 h-1 rounded-full bg-white/50" />
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
