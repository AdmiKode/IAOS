'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { X, CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const FEATURES = [
  { title: 'XORIA — IA Conversacional', desc: 'Asistente inteligente con acceso a tu cartera, agenda y pipeline. Responde en segundos.', color: '#F7941D' },
  { title: 'Pipeline Kanban', desc: 'Visualiza y gestiona cada prospecto desde primer contacto hasta emisión.', color: '#69A481' },
  { title: 'Cotizador Multi-aseguradora', desc: 'Compara primas de múltiples aseguradoras en un solo flujo guiado.', color: '#7C1F31' },
  { title: 'Renovaciones Inteligentes', desc: 'Alertas automáticas antes del vencimiento. Retención sin esfuerzo.', color: '#1A1F2B' },
  { title: 'Portal del Asegurado', desc: 'Tu cliente consulta pólizas, pagos y abre siniestros sin llamarte.', color: '#F7941D' },
  { title: 'Voz IA en Tiempo Real', desc: 'Dicta notas, consulta tu cartera y responde mensajes con tu voz.', color: '#69A481' },
]

const STATS = [
  { value: '3.4×', label: 'más pólizas por agente' },
  { value: '68%', label: 'reducción en tiempo admin.' },
  { value: '91%', label: 'retención de cartera' },
  { value: '<2 min', label: 'tiempo de cotización' },
]

const PLANS = [
  { id: 'agente', name: 'Agente', price: '$299', period: '/mes', features: ['1 usuario', 'Hasta 200 pólizas', 'XORIA básico', 'Portal cliente'], highlight: false },
  { id: 'profesional', name: 'Profesional', price: '$599', period: '/mes', features: ['3 usuarios', 'Pólizas ilimitadas', 'XORIA avanzado', 'Voz IA', 'Cotizador multi-aseg.'], highlight: true },
  { id: 'agencia', name: 'Agencia', price: '$1,299', period: '/mes', features: ['Usuarios ilimitados', 'Multi-sucursal', 'IA personalizada', 'API access', 'Soporte prioritario'], highlight: false },
]

type PayStep = 'form' | 'processing' | 'done'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function LandingPage() {
  const [payModal, setPayModal] = useState<typeof PLANS[0] | null>(null)
  const [payStep, setPayStep] = useState<PayStep>('form')
  const [card, setCard] = useState({ nombre: '', numero: '', expiry: '', cvv: '' })

  function openPay(plan: typeof PLANS[0]) {
    setPayModal(plan); setPayStep('form')
    setCard({ nombre: '', numero: '', expiry: '', cvv: '' })
  }
  function handlePay() {
    setPayStep('processing')
    setTimeout(() => setPayStep('done'), 2500)
  }
  function formatCard(v: string) { return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }
  function formatExpiry(v: string) { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d }

  return (
    <div className="relative min-h-screen bg-[#EFF2F9] overflow-x-hidden font-[Questrial]">

      {/* Esferas decorativas de fondo */}
      <div
        aria-hidden
        className="fixed top-[-280px] left-[-260px] w-[520px] h-[520px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(247,148,29,0.22), rgba(247,148,29,0.04) 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Esfera pequeña decorativa alejada del logo */}
      <div
        aria-hidden
        className="fixed top-[140px] left-[-80px] w-[200px] h-[200px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(247,148,29,0.14), rgba(247,148,29,0.02) 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        aria-hidden
        className="fixed top-[30%] right-[-160px] w-[480px] h-[480px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(105,164,129,0.20), rgba(105,164,129,0.03) 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        aria-hidden
        className="fixed bottom-[-120px] left-[30%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(124,31,49,0.15), rgba(124,31,49,0.02) 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image src="/logo.png" alt="IAOS" width={130} height={44} className="h-11 w-auto object-contain relative z-10" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('features')} className="text-[#6B7280] text-sm hover:text-[#1A1F2B] transition-colors">Funciones</button>
          <button onClick={() => scrollTo('stats')} className="text-[#6B7280] text-sm hover:text-[#1A1F2B] transition-colors">Resultados</button>
          <button onClick={() => scrollTo('pricing')} className="text-[#6B7280] text-sm hover:text-[#1A1F2B] transition-colors">Planes</button>
          <button onClick={() => scrollTo('footer-section')} className="text-[#6B7280] text-sm hover:text-[#1A1F2B] transition-colors">Contacto</button>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/register" className="px-4 py-2.5 rounded-2xl text-[#6B7280] text-sm font-medium hover:text-[#1A1F2B] transition-colors">
            Registrarse
          </Link>
          <Link href="/login" className="px-5 py-2.5 rounded-2xl bg-[#F7941D] text-white text-sm font-semibold shadow-[0_4px_16px_rgba(247,148,29,0.35)] hover:bg-[#e08019] transition-all">
            Acceder
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-16 pb-24 flex flex-col lg:flex-row gap-16 items-center">

        {/* Copy */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7941D]/10 text-[#F7941D] text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7941D] animate-pulse" />
            Powered by XORIA AI
          </div>

          <h1 className="text-[#1A1F2B] text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
            El sistema operativo<br />
            del agente de seguros<br />
            <span className="text-[#F7941D]">del futuro</span>
          </h1>

          <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
            Gestiona toda tu cartera, cotiza en segundos, automatiza renovaciones
            y atiende a tus clientes con IA conversacional — desde un solo lugar.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/register"
              className="px-8 py-4 rounded-2xl bg-[#F7941D] text-white font-semibold text-base shadow-[0_8px_24px_rgba(247,148,29,0.40)] hover:bg-[#e08019] transition-all duration-200"
            >
              Comenzar gratis
            </Link>
            <button onClick={() => scrollTo('features')}
              className="px-8 py-4 rounded-2xl font-semibold text-base text-[#6B7280] bg-[#EFF2F9] shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-all duration-200"
            >
              Ver funciones
            </button>
          </div>

          <p className="text-[#9CA3AF] text-xs mt-6">
            Sin tarjeta de crédito. Demo disponible con credenciales de prueba.
          </p>
        </div>

        {/* Dashboard preview card (glass) */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div
            className="relative w-full max-w-md rounded-3xl p-6 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.75)',
              boxShadow: '-8px -8px 20px #FAFBFF, 8px 8px 24px rgba(22,27,29,0.14)',
            }}
          >
            {/* Mock topbar */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="h-3 w-24 rounded bg-[#1A1F2B]/10 mb-1.5" />
                <div className="h-2 w-16 rounded bg-[#6B7280]/15" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#69A481]" />
                <span className="text-[9px] text-[#69A481] font-medium">En línea</span>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Prima total', value: '$218k', color: '#F7941D' },
                { label: 'Pólizas activas', value: '142', color: '#69A481' },
                { label: 'Leads activos', value: '38', color: '#7C1F31' },
              ].map((k) => (
                <div
                  key={k.label}
                  className="rounded-xl p-3"
                  style={{
                    background: 'rgba(255,255,255,0.6)',
                    boxShadow: '-3px -3px 7px #FAFBFF, 3px 3px 7px rgba(22,27,29,0.10)',
                  }}
                >
                  <div className="text-[9px] text-[#9CA3AF] mb-1">{k.label}</div>
                  <div className="text-sm font-bold" style={{ color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Chart bars (decorative) */}
            <div className="flex items-end gap-1.5 h-20 mb-5">
              {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-lg transition-all" style={{
                  height: `${h}%`,
                  background: i === 11
                    ? '#F7941D'
                    : `rgba(247,148,29,${0.12 + (h / 100) * 0.25})`,
                }} />
              ))}
            </div>

            {/* XORIA chat bubble */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(247,148,29,0.2)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                  <Image src="/Icono xoria.png" alt="XORIA" width={24} height={24} className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] font-semibold text-[#1A1F2B]">XORIA</span>
              </div>
              <p className="text-[10px] text-[#6B7280] leading-relaxed">
                Detecté 3 pólizas que vencen esta semana. ¿Inicio el proceso de renovación?
              </p>
              <div className="flex gap-2 mt-3">
                <div className="px-3 py-1 rounded-lg bg-[#F7941D]/15 text-[#F7941D] text-[9px] font-semibold">Sí, renovar</div>
                <div className="px-3 py-1 rounded-lg bg-[#EFF2F9] text-[#6B7280] text-[9px] shadow-[inset_-2px_-2px_4px_#FAFBFF,inset_2px_2px_4px_rgba(22,27,29,0.1)]">Ver detalle</div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-[#69A481] text-white text-[10px] font-semibold shadow-[0_4px_12px_rgba(105,164,129,0.4)]">
              En vivo
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative z-10 bg-[#1A1F2B] py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.value} className="text-center">
                <div className="text-[#F7941D] text-4xl font-bold mb-2">{s.value}</div>
                <div className="text-[#9CA3AF] text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-[#1A1F2B] text-3xl font-bold tracking-tight mb-4">
            Todo lo que necesitas, integrado
          </h2>
          <p className="text-[#6B7280] text-base max-w-xl mx-auto">
            No más saltar entre hojas de cálculo, WhatsApp y correos. Insurance Agent OS centraliza tu operación completa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-default group transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: '-6px -6px 14px #FAFBFF, 6px 6px 16px rgba(22,27,29,0.10)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${f.color}18` }}
              >
                <div className="w-4 h-4 rounded-full" style={{ background: f.color }} />
              </div>
              <div>
                <h3 className="text-[#1A1F2B] font-semibold mb-2 text-base">{f.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 max-w-6xl mx-auto px-8 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-[#1A1F2B] text-3xl font-bold tracking-tight mb-4">Planes simples</h2>
          <p className="text-[#6B7280] text-base">Sin sorpresas. Sin ataduras.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'agente', name: 'Agente', price: '$299', period: '/mes', features: ['1 usuario', 'Hasta 200 pólizas', 'XORIA básico', 'Portal cliente'], highlight: false },
            { id: 'profesional', name: 'Profesional', price: '$599', period: '/mes', features: ['3 usuarios', 'Pólizas ilimitadas', 'XORIA avanzado', 'Voz IA', 'Cotizador multi-aseg.'], highlight: true },
            { id: 'agencia', name: 'Agencia', price: '$1,299', period: '/mes', features: ['Usuarios ilimitados', 'Multi-sucursal', 'IA personalizada', 'API access', 'Soporte prioritario'], highlight: false },
          ].map((p) => (
            <div
              key={p.name}
              className="rounded-3xl p-8 flex flex-col gap-6"
              style={p.highlight ? {
                background: '#1A1F2B',
                boxShadow: '0 20px 48px rgba(22,27,29,0.25)',
              } : {
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: '-6px -6px 14px #FAFBFF, 6px 6px 16px rgba(22,27,29,0.10)',
              }}
            >
              {p.highlight && (
                <div className="inline-flex self-start px-3 py-1 rounded-full bg-[#F7941D] text-white text-xs font-semibold">
                  Recomendado
                </div>
              )}
              <div>
                <h3 className={`font-bold text-xl mb-1 ${p.highlight ? 'text-white' : 'text-[#1A1F2B]'}`}>{p.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${p.highlight ? 'text-[#F7941D]' : 'text-[#1A1F2B]'}`}>{p.price}</span>
                  <span className={`text-sm ${p.highlight ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>{p.period}</span>
                </div>
              </div>

              <ul className="flex flex-col gap-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#69A481] flex items-center justify-center shrink-0">
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className={`text-sm ${p.highlight ? 'text-[#D1D5DB]' : 'text-[#6B7280]'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openPay(p)}
                className={`w-full text-center py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  p.highlight
                    ? 'bg-[#F7941D] text-white shadow-[0_4px_16px_rgba(247,148,29,0.4)] hover:bg-[#e08019]'
                    : 'bg-[#EFF2F9] text-[#1A1F2B] shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.12)] hover:shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.15)]'
                }`}
              >
                Comenzar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="footer-section" className="relative z-10 bg-[#1A1F2B] py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="IAOS" width={100} height={34} className="h-8 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <p className="text-[#6B7280] text-xs text-center">
            Todos los datos en el demo son ficticios. Solo para demostración.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/register" className="text-[#9CA3AF] text-sm hover:text-white transition-colors">Registro</Link>
            <Link href="/login" className="text-[#F7941D] text-sm font-semibold hover:text-[#e08019] transition-colors">
              Ingresar al demo
            </Link>
          </div>
        </div>
      </footer>

      {/* Modal pago Stripe simulado */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.6)', backdropFilter: 'blur(12px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <CreditCard size={15} className="text-[#F7941D]" />
                </div>
                <div>
                  <p className="text-[14px] text-[#1A1F2B]">Plan {payModal.name}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{payModal.price}{payModal.period} · Facturación mensual</p>
                </div>
              </div>
              <button onClick={() => setPayModal(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="p-5">
              {payStep === 'done' ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#69A481]/15 flex items-center justify-center">
                    <CheckCircle size={32} className="text-[#69A481]" />
                  </div>
                  <div>
                    <p className="text-[16px] text-[#1A1F2B] mb-1">Pago procesado</p>
                    <p className="text-[13px] text-[#9CA3AF]">Plan {payModal.name} activado. Crea tu cuenta para continuar.</p>
                  </div>
                  <Link href={`/register?plan=${payModal.id}`} onClick={() => setPayModal(null)}
                    className="w-full py-3.5 rounded-xl bg-[#F7941D] text-white text-[13px] font-medium text-center hover:bg-[#E8820A] transition-colors shadow-[0_4px_12px_rgba(247,148,29,0.3)]">
                    Crear mi cuenta
                  </Link>
                </div>
              ) : payStep === 'processing' ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <Loader2 size={32} className="text-[#F7941D] animate-spin" />
                  <p className="text-[14px] text-[#1A1F2B]">Procesando pago...</p>
                  <p className="text-[12px] text-[#9CA3AF]">Conectando con Stripe · Por favor espera</p>
                  <div className="w-full h-1.5 bg-[#D1D5DB]/30 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-[#F7941D] rounded-full" style={{ width: '85%', transition: 'width 2.5s ease' }} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.08)] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#9CA3AF]">Total a cobrar hoy</p>
                      <p className="text-[22px] text-[#F7941D] font-semibold">{payModal.price} MXN</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#69A481]">
                      <Lock size={11} />
                      Pago seguro
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Nombre en la tarjeta</label>
                    <input value={card.nombre} onChange={e => setCard(p => ({ ...p, nombre: e.target.value }))}
                      placeholder="Como aparece en tu tarjeta"
                      className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Numero de tarjeta</label>
                    <div className="relative">
                      <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input value={card.numero} onChange={e => setCard(p => ({ ...p, numero: formatCard(e.target.value) }))}
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-[#EFF2F9] pl-9 pr-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Vencimiento</label>
                      <input value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM/AA"
                        className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">CVV</label>
                      <input value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="123"
                        className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                    </div>
                  </div>
                  <button onClick={handlePay}
                    disabled={!card.nombre || card.numero.length < 19 || card.expiry.length < 5 || card.cvv.length < 3}
                    className="w-full py-3.5 rounded-xl bg-[#F7941D] text-white text-[13px] font-medium hover:bg-[#E8820A] transition-colors shadow-[0_4px_12px_rgba(247,148,29,0.3)] disabled:opacity-40 flex items-center justify-center gap-2">
                    <Lock size={13} />
                    Pagar {payModal.price} MXN
                  </button>
                  <p className="text-[10px] text-[#9CA3AF] text-center">Simulacion de pago — no se realizara ningun cargo real</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
