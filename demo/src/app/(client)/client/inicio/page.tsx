'use client'
import { useAuth } from '@/lib/auth-context'
import { CLIENT_POLICIES, CLIENT_PAYMENTS, MOCK_KPIS } from '@/data/mock'
import { Badge } from '@/components/ui'
import { ChevronRight, Shield, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ClientInicio() {
  const { user } = useAuth()

  const nextPayment = CLIENT_PAYMENTS.find(p => p.status === 'pendiente')
  const activePolicy = CLIENT_POLICIES.find(p => p.status === 'activa' || p.status === 'vigente')

  return (
    <div className="flex flex-col gap-5 py-2">

      {/* Estado de póliza principal */}
      {activePolicy && (
        <div className="bg-gradient-to-br from-[#1A1F2B] to-[#2D3548] rounded-3xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] text-[#9CA3AF] tracking-widest uppercase mb-1">Póliza activa</p>
              <p className="text-[17px] text-white tracking-wide">{activePolicy.type}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#F7941D]/20 flex items-center justify-center">
              <Shield size={18} className="text-[#F7941D]" />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#69A481] animate-pulse" />
            <span className="text-[12px] text-[#69A481]">Protección activa</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Suma asegurada</p>
                  <p className="text-[14px] text-white mt-1">{activePolicy.coverage || 'Ver póliza'}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Prima mensual</p>
              <p className="text-[14px] text-white mt-1">{activePolicy.premium}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de pago próximo */}
      {nextPayment && (
        <div className="bg-[#F7941D]/10 border border-[#F7941D]/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F7941D]/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-[#F7941D]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] text-[#1A1F2B]">Pago próximo</p>
            <p className="text-[12px] text-[#6B7280] mt-0.5">{nextPayment.amount} · vence {nextPayment.dueDate}</p>
          </div>
          <Link href="/client/pagos">
            <button className="h-8 px-3 bg-[#F7941D] rounded-xl text-white text-[11px] hover:bg-[#E8820A] transition-colors">
              Pagar
            </button>
          </Link>
        </div>
      )}

      {/* Mis pólizas */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] text-[#1A1F2B] tracking-wide">Mis pólizas</h2>
          <Link href="/client/polizas">
            <button className="text-[11px] text-[#F7941D] flex items-center gap-1">
              Ver todas <ChevronRight size={12} />
            </button>
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {CLIENT_POLICIES.map(policy => {
            const isActive = policy.status === 'activa' || policy.status === 'vigente'
            return (
            <Link key={policy.id} href="/client/polizas">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.13)] hover:scale-[1.01] transition-transform duration-150">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center',
                  isActive ? 'bg-[#69A481]/15' : 'bg-[#9CA3AF]/15')}>
                  <Shield size={16} className={isActive ? 'text-[#69A481]' : 'text-[#9CA3AF]'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#1A1F2B] truncate">{policy.type}</p>
                  <p className="text-[11px] text-[#9CA3AF]">Vence: {policy.endDate}</p>
                </div>
                <Badge
                  label={isActive ? 'Activa' : 'Por vencer'}
                  variant={isActive ? 'success' : 'warning'}
                  size="sm"
                />
              </div>
            </Link>
            )
          })}
        </div>
      </div>

      {/* Pagos recientes */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] text-[#1A1F2B] tracking-wide">Pagos recientes</h2>
          <Link href="/client/pagos">
            <button className="text-[11px] text-[#F7941D] flex items-center gap-1">
              Ver todos <ChevronRight size={12} />
            </button>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {CLIENT_PAYMENTS.slice(0, 3).map(payment => (
            <div key={payment.id} className="flex items-center gap-3">
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center',
                payment.status === 'pagado' ? 'bg-[#69A481]/15' : 'bg-[#F7941D]/15')}>
                {payment.status === 'pagado'
                  ? <CheckCircle size={14} className="text-[#69A481]" />
                  : <CreditCard size={14} className="text-[#F7941D]" />
                }
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-[#1A1F2B]">{payment.concept}</p>
                <p className="text-[11px] text-[#9CA3AF]">{payment.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] text-[#1A1F2B]">{payment.amount}</p>
                <Badge
                  label={payment.status === 'pagado' ? 'Pagado' : 'Pendiente'}
                  variant={payment.status === 'pagado' ? 'success' : 'warning'}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contactar agente */}
      <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)] flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#69A481]/15 flex items-center justify-center shrink-0">
          <Shield size={18} className="text-[#69A481]" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] text-[#1A1F2B]">Tu agente</p>
          <p className="text-[12px] text-[#6B7280] mt-0.5">Carlos Ramírez · disponible</p>
        </div>
        <Link href="/client/mensajes">
          <button className="h-9 px-4 bg-[#EFF2F9] rounded-xl text-[12px] text-[#F7941D] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.14)] hover:scale-105 transition-transform">
            Mensaje
          </button>
        </Link>
      </div>
    </div>
  )
}
