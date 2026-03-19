'use client'
import { useState, useRef, useCallback } from 'react'
import { CLIENT_PAYMENTS } from '@/data/mock'
import { Badge } from '@/components/ui'
import { CreditCard, CheckCircle, AlertTriangle, X, Upload, Loader2, Scan } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_MAP = {
  pagado:   { label: 'Pagado',   variant: 'success' as const, icon: CheckCircle, color: '#69A481' },
  pendiente:{ label: 'Pendiente',variant: 'warning' as const, icon: CreditCard, color: '#F7941D' },
  vencido:  { label: 'Vencido', variant: 'danger' as const,  icon: AlertTriangle, color: '#7C1F31' },
}

type PayStep = 'idle' | 'uploading' | 'done'
type Payment = typeof CLIENT_PAYMENTS[number]

export default function ClientPagosPage() {
  const [selected, setSelected] = useState<Payment | null>(null)
  const [method, setMethod] = useState('transferencia')
  const [payStep, setPayStep] = useState<PayStep>('idle')
  const [payFile, setPayFile] = useState<string | null>(null)
  const [folio, setFolio] = useState('')
  const [dragging, setDragging] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set())
  const fileRef = useRef<HTMLInputElement>(null)

  function openPago(p: Payment) {
    setSelected(p); setMethod('transferencia'); setPayStep('idle')
    setPayFile(null); setFolio(''); setDragging(false); setConfirmed(false)
  }

  function processFile(file: File) {
    setPayFile(file.name); setPayStep('uploading')
    setTimeout(() => setPayStep('done'), 2000)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [])

  function handleConfirm() {
    if (!selected) return
    setPaidIds(prev => new Set([...prev, selected.id]))
    setConfirmed(true)
    setTimeout(() => setSelected(null), 2000)
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      <div>
        <h2 className="text-[18px] text-[#1A1F2B] tracking-wide">Mis pagos</h2>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">{CLIENT_PAYMENTS.length} registros de pago</p>
      </div>

      <div className="flex flex-col gap-3">
        {CLIENT_PAYMENTS.map(payment => {
          const isPaid = paidIds.has(payment.id)
          const status = isPaid ? 'pagado' : payment.status
          const st = STATUS_MAP[status]
          const Icon = st.icon
          return (
            <div key={payment.id}
              className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
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
                {(status === 'pendiente' || status === 'vencido') && (
                  <button onClick={() => openPago(payment)}
                    className="block mt-1 text-[11px] text-white bg-[#F7941D] px-3 py-1 rounded-lg hover:bg-[#E8820A] transition-colors">
                    Pagar ahora
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de pago */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <CreditCard size={15} className="text-[#F7941D]" />
                </div>
                <p className="text-[15px] text-[#1A1F2B]">Realizar pago</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {confirmed ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#69A481]/15 flex items-center justify-center">
                    <CheckCircle size={28} className="text-[#69A481]" />
                  </div>
                  <p className="text-[15px] text-[#1A1F2B]">¡Pago registrado!</p>
                  <p className="text-[13px] text-[#9CA3AF]">Tu agente verificará el comprobante</p>
                </div>
              ) : (
                <>
                  {/* Resumen */}
                  <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.08)] flex flex-col gap-1.5">
                    <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide">Resumen del pago</p>
                    <p className="text-[14px] text-[#1A1F2B]">{selected.concept}</p>
                    <p className="text-[22px] text-[#F7941D] font-medium">{selected.amount}</p>
                    <p className="text-[11px] text-[#9CA3AF]">Vencimiento: {selected.dueDate}</p>
                  </div>

                  {/* Método de pago */}
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-2 block">Método de pago</label>
                    <div className="flex gap-2">
                      {['transferencia', 'tarjeta', 'SPEI'].map(m => (
                        <button key={m} onClick={() => setMethod(m)}
                          className={cn('flex-1 py-2 rounded-xl text-[12px] capitalize transition-all', method === m ? 'bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.3)]' : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]')}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comprobante */}
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-2 block">Comprobante de pago</label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={e => { e.preventDefault(); setDragging(true) }}
                      onDragLeave={() => setDragging(false)}
                      onClick={() => payStep === 'idle' && fileRef.current?.click()}
                      className={cn('rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 py-4 cursor-pointer',
                        dragging ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-[#D1D5DB]/40 hover:border-[#F7941D]/50')}>
                      {payStep === 'idle' && (
                        <>
                          <Upload size={20} className="text-[#9CA3AF]" />
                          <p className="text-[12px] text-[#9CA3AF]">Arrastra tu comprobante aquí</p>
                        </>
                      )}
                      {payStep === 'uploading' && (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 size={20} className="text-[#F7941D] animate-spin" />
                          <p className="text-[12px] text-[#F7941D]">Subiendo {payFile}...</p>
                          <div className="w-36 h-1.5 bg-[#D1D5DB]/30 rounded-full overflow-hidden">
                            <div className="h-full bg-[#F7941D] rounded-full" style={{ width: '65%', transition: 'width 2s ease' }} />
                          </div>
                        </div>
                      )}
                      {payStep === 'done' && (
                        <div className="flex items-center gap-2">
                          <CheckCircle size={18} className="text-[#69A481]" />
                          <p className="text-[12px] text-[#69A481]">{payFile} · listo</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
                  </div>

                  {/* Folio de referencia */}
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Folio / Referencia (opcional)</label>
                    <input value={folio} onChange={e => setFolio(e.target.value)}
                      placeholder="Núm. de operación o referencia..."
                      className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  </div>

                  <button onClick={handleConfirm} disabled={payStep !== 'done'}
                    className="w-full py-3.5 rounded-xl bg-[#F7941D] text-white text-[13px] font-medium hover:bg-[#E8820A] transition-colors shadow-[0_4px_12px_rgba(247,148,29,0.3)] disabled:opacity-40">
                    Confirmar pago
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

