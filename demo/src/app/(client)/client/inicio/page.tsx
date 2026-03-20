'use client'
import { useAuth } from '@/lib/auth-context'
import { CLIENT_POLICIES, CLIENT_PAYMENTS, MOCK_SINIESTROS } from '@/data/mock'
import { ChevronRight, Shield, CreditCard, AlertTriangle, Phone, MessageSquare, RefreshCw, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ClientInicio() {
  const { user } = useAuth()

  // MOCK_PAYMENTS usa: concept, amount, dueDate, status ('pagado'|'pendiente'|'vencido')
  const nextPayment = CLIENT_PAYMENTS.find(p => p.status === 'pendiente')
  const activePolicy = CLIENT_POLICIES.find(p => p.status === 'activa' || p.status === 'vigente')
  const activeClaim = MOCK_SINIESTROS.find(s => s.clientName === 'Ana López' && s.status === 'en_proceso')

  // Calcular días restantes a partir del vencimiento de la póliza activa
  const daysLeft = activePolicy?.endDate
    ? Math.max(0, Math.ceil((new Date(activePolicy.endDate).getTime() - Date.now()) / 86400000))
    : 312

  return (
    <div className="flex flex-col gap-4 py-2">

      {/* ── Tarjeta principal de póliza activa — GLASS ── */}
      {activePolicy && (
        <Link href="/client/polizas">
          <div className="relative rounded-3xl p-5 overflow-hidden active:scale-[0.98] transition-transform"
            style={{
              background: 'rgba(240,243,250,0.72)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.85)',
              boxShadow: '-6px -6px 16px rgba(255,255,255,0.9), 6px 6px 20px rgba(22,27,29,0.13)',
            }}>
            {/* Acento de color superior */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #F7941D, #69A481)' }} />

            <div className="flex items-start justify-between mb-4 mt-1">
              <div>
                <p className="text-[10px] text-[#6B7280] tracking-widest uppercase mb-1">Póliza principal</p>
                <p className="text-[18px] text-[#1A1F2B] tracking-wide font-medium">{activePolicy.type}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5 tracking-wider">{activePolicy.policyNumber}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(247,148,29,0.12)', border: '1px solid rgba(247,148,29,0.25)' }}>
                <Shield size={20} className="text-[#F7941D]" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#69A481] animate-pulse" />
              <span className="text-[12px] text-[#69A481] font-medium">Protección activa</span>
              <span className="ml-auto text-[10px] text-[#9CA3AF]">Ver detalle →</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Suma aseg.', value: activePolicy.coverage || '$3M' },
                { label: 'Prima', value: activePolicy.premium },
                { label: 'Días rest.', value: `${daysLeft}d`, highlight: daysLeft < 30 },
              ].map(k => (
                <div key={k.label} className="rounded-2xl p-3"
                  style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.9)' }}>
                  <p className="text-[9px] text-[#9CA3AF] uppercase tracking-widest">{k.label}</p>
                  <p className="text-[13px] mt-1 font-medium"
                    style={{ color: k.highlight ? '#F7941D' : '#1A1F2B' }}>{k.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Link>
      )}

      {/* ── Alerta de siniestro activo ── */}
      {activeClaim && (
        <Link href="/client/siniestros">
          <div className="bg-[#7C1F31]/8 border border-[#7C1F31]/20 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
            <div className="w-9 h-9 rounded-xl bg-[#7C1F31]/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-[#7C1F31]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#1A1F2B]">Siniestro en proceso</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5 truncate">{activeClaim.tipo} · {activeClaim.id}</p>
            </div>
            <ChevronRight size={14} className="text-[#7C1F31] shrink-0" />
          </div>
        </Link>
      )}

      {/* ── Alerta de pago próximo ── */}
      {nextPayment && (
        <Link href="/client/pagos">
          <div className="bg-[#F7941D]/10 border border-[#F7941D]/20 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
            <div className="w-9 h-9 rounded-xl bg-[#F7941D]/20 flex items-center justify-center shrink-0">
              <CreditCard size={16} className="text-[#F7941D]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#1A1F2B]">Pago próximo</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">{nextPayment.concept} · {nextPayment.dueDate}</p>
            </div>
            <span className="shrink-0 px-3 py-1 bg-[#F7941D] rounded-xl text-white text-[11px]">
              Pagar
            </span>
          </div>
        </Link>
      )}

      {/* ── Acciones rápidas ── */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: AlertTriangle, label: 'Reportar', href: '/client/siniestros', color: '#7C1F31' },
          { icon: RefreshCw,     label: 'Renovar',  href: '/client/polizas',    color: '#F7941D' },
          { icon: CreditCard,    label: 'Pagar',    href: '/client/pagos',      color: '#69A481' },
          { icon: MessageSquare, label: 'Agente',   href: '/client/mensajes',   color: '#1A1F2B' },
        ].map(action => {
          const Ic = action.icon
          return (
            <Link key={action.href} href={action.href}>
              <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#EFF2F9] shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.13)] active:scale-[0.95] transition-transform">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${action.color}15` }}>
                  <Ic size={16} style={{ color: action.color }} />
                </div>
                <p className="text-[10px] text-[#6B7280]">{action.label}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Mis pólizas ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[15px] text-[#1A1F2B]">Mis pólizas</p>
          <Link href="/client/polizas" className="text-[11px] text-[#F7941D] flex items-center gap-1">
            Ver todas <ChevronRight size={12} />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {CLIENT_POLICIES.map(policy => {
            const isActive = policy.status === 'activa' || policy.status === 'vigente'
            return (
              <Link key={policy.id} href="/client/polizas">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.12)] hover:scale-[1.01] transition-transform">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center',
                    isActive ? 'bg-[#69A481]/15' : 'bg-[#9CA3AF]/15')}>
                    <Shield size={16} className={isActive ? 'text-[#69A481]' : 'text-[#9CA3AF]'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#1A1F2B] truncate">{policy.type}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{policy.insurer} · Vence {policy.endDate}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: isActive ? '#69A48118' : '#9CA3AF18', color: isActive ? '#69A481' : '#9CA3AF' }}>
                    {isActive ? 'Activa' : policy.status}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Mis siniestros ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[15px] text-[#1A1F2B]">Siniestros</p>
          <Link href="/client/siniestros" className="text-[11px] text-[#F7941D] flex items-center gap-1">
            Ver todos <ChevronRight size={12} />
          </Link>
        </div>
        {MOCK_SINIESTROS.filter(s => s.clientName === 'Ana López').length === 0 ? (
          <p className="text-[12px] text-[#9CA3AF] py-3 text-center">Sin siniestros registrados</p>
        ) : (
          <div className="flex flex-col gap-2">
            {MOCK_SINIESTROS.filter(s => s.clientName === 'Ana López').map(s => (
              <Link key={s.id} href="/client/siniestros">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.12)] hover:scale-[1.01] transition-transform">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center',
                    s.status === 'en_proceso' ? 'bg-[#F7941D]/15' : 'bg-[#69A481]/15')}>
                    <AlertTriangle size={16} className={s.status === 'en_proceso' ? 'text-[#F7941D]' : 'text-[#69A481]'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#1A1F2B] truncate">{s.tipo}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{s.id} · {s.fecha}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: s.status === 'en_proceso' ? '#F7941D18' : '#69A48118',
                      color: s.status === 'en_proceso' ? '#F7941D' : '#69A481'
                    }}>
                    {s.status === 'en_proceso' ? 'En proceso' : 'Resuelto'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <Link href="/client/siniestros">
          <button className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-[#F7941D]/30 text-[12px] text-[#F7941D] flex items-center justify-center gap-2">
            <AlertTriangle size={13} /> Reportar nuevo siniestro
          </button>
        </Link>
      </div>

      {/* ── Pagos recientes ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[15px] text-[#1A1F2B]">Pagos recientes</p>
          <Link href="/client/pagos" className="text-[11px] text-[#F7941D] flex items-center gap-1">
            Ver todos <ChevronRight size={12} />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {CLIENT_PAYMENTS.slice(0, 3).map(payment => (
            <Link key={payment.id} href="/client/pagos">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.12)] hover:scale-[1.01] transition-transform">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center',
                  payment.status === 'pagado' ? 'bg-[#69A481]/15' : 'bg-[#F7941D]/15')}>
                  {payment.status === 'pagado'
                    ? <CheckCircle size={14} className="text-[#69A481]" />
                    : <CreditCard size={14} className="text-[#F7941D]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1A1F2B] truncate">{payment.concept}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{payment.dueDate}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] text-[#1A1F2B]">{payment.amount}</p>
                  <p className="text-[10px]" style={{ color: payment.status === 'pagado' ? '#69A481' : '#F7941D' }}>
                    {payment.status === 'pagado' ? 'Pagado' : 'Pendiente'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Contacto de emergencia — GLASS ── */}
      <div className="rounded-2xl p-4 flex items-center gap-4"
        style={{
          background: 'rgba(240,243,250,0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '-4px -4px 12px rgba(255,255,255,0.9), 4px 4px 14px rgba(22,27,29,0.10)',
        }}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(247,148,29,0.12)', border: '1px solid rgba(247,148,29,0.25)' }}>
          <Phone size={18} className="text-[#F7941D]" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-medium text-[#1A1F2B]">GNP Emergencias 24/7</p>
          <p className="text-[12px] text-[#6B7280] mt-0.5">800 400 9000</p>
        </div>
        <a href="tel:8004009000"
          className="px-3 py-1.5 bg-[#F7941D] rounded-xl text-white text-[11px] font-medium shadow-sm active:scale-95 transition-transform">
          Llamar
        </a>
      </div>

    </div>
  )
}
