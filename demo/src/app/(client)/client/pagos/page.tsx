'use client'
import { CLIENT_PAYMENTS } from '@/data/mock'
import { Badge } from '@/components/ui'
import { CreditCard, CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_MAP = {
  pagado:   { label: 'Pagado',   variant: 'success' as const, icon: CheckCircle, color: '#69A481' },
  pendiente:{ label: 'Pendiente',variant: 'warning' as const, icon: CreditCard, color: '#F7941D' },
  vencido:  { label: 'Vencido', variant: 'danger' as const,  icon: AlertTriangle, color: '#7C1F31' },
}

export default function ClientPagosPage() {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div>
        <h2 className="text-[18px] text-[#1A1F2B] tracking-wide">Mis pagos</h2>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">{CLIENT_PAYMENTS.length} registros de pago</p>
      </div>

      <div className="flex flex-col gap-3">
        {CLIENT_PAYMENTS.map(payment => {
          const st = STATUS_MAP[payment.status]
          const Icon = st.icon
          return (
            <div key={payment.id}
              className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0')}
                style={{ backgroundColor: `${st.color}18` }}>
                <Icon size={16} style={{ color: st.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#1A1F2B] truncate">{payment.concept}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Vence: {payment.dueDate}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] text-[#1A1F2B]">{payment.amount}</p>
                <Badge label={st.label} variant={st.variant} size="sm" />
                {payment.status === 'pendiente' && (
                  <button className="block mt-1 text-[11px] text-white bg-[#F7941D] px-3 py-1 rounded-lg hover:bg-[#E8820A] transition-colors">
                    Pagar ahora
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
