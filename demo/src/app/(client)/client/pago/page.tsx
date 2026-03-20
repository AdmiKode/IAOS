'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft, CreditCard, Shield, Lock, CheckCircle2, Loader2,
  AlertCircle, ChevronRight, Clock, Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PLANES: Record<string, { nombre: string; aseguradora: string; prima: string; periodo: string; color: string; logo: string }> = {
  gnp: { nombre: 'GNP Esencial', aseguradora: 'GNP', prima: '1,890', periodo: 'mes', color: '#0057A8', logo: '🏛️' },
  bupa: { nombre: 'BUPA National Plus', aseguradora: 'BUPA', prima: '2,640', periodo: 'mes', color: '#003DA5', logo: '🔵' },
  axa: { nombre: 'AXA Premium', aseguradora: 'AXA', prima: '4,200', periodo: 'mes', color: '#00008F', logo: '⬡' },
  metlife: { nombre: 'MetLife Grupal', aseguradora: 'MetLife', prima: '890', periodo: 'empleado/mes', color: '#3E86B4', logo: '⚓' },
  gnp_col: { nombre: 'GNP Colectivo Plus', aseguradora: 'GNP', prima: '1,490', periodo: 'empleado/mes', color: '#0057A8', logo: '🏛️' },
  bupa_col: { nombre: 'BUPA Empresarial', aseguradora: 'BUPA', prima: '2,200', periodo: 'empleado/mes', color: '#003DA5', logo: '🔵' },
}

const STEPS = ['Propuesta', 'Firma', 'Pago', 'Confirmación']

function formatCard(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

function PagoContent() {
  const router = useRouter()
  const params = useSearchParams()
  const tipo = params.get('tipo') || 'gmm-individual'
  const planId = params.get('plan') || 'bupa'
  const plan = PLANES[planId] || PLANES['bupa']

  const [metodo, setMetodo] = useState<'tarjeta' | 'transferencia' | 'oxxo'>('tarjeta')
  const [cardNum, setCardNum] = useState('')
  const [nombre, setNombre] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cuotas, setCuotas] = useState<'mensual' | 'anual'>('mensual')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const primaNum = parseFloat(plan.prima.replace(/,/g, ''))
  const primaMensual = cuotas === 'anual' ? (primaNum * 12 * 0.9).toFixed(0) : primaNum.toFixed(0)
  const primaLabel = cuotas === 'anual' ? `MXN $${Number(primaMensual).toLocaleString()} / año` : `MXN $${Number(primaMensual).toLocaleString()} / mes`
  const descuento = cuotas === 'anual' ? `Ahorro del 10% vs mensual` : ''

  function pagar() {
    if (metodo === 'tarjeta') {
      if (cardNum.replace(/\s/g, '').length < 16) return setError('Ingresa un número de tarjeta válido de 16 dígitos.')
      if (!nombre.trim()) return setError('Escribe el nombre del titular de la tarjeta.')
      if (expiry.length < 5) return setError('Ingresa la fecha de vencimiento (MM/AA).')
      if (cvv.length < 3) return setError('Ingresa el CVV de 3 dígitos.')
    }
    setError('')
    setCargando(true)
    setTimeout(() => {
      setCargando(false)
      router.push(`/client/confirmacion?tipo=${tipo}&plan=${planId}&monto=${primaMensual}&periodo=${cuotas}`)
    }, 2200)
  }

  return (
    <div className="min-h-screen bg-[#EFF2F9] flex flex-col">
      {/* Header */}
      <div className="bg-[#EFF2F9] border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between shadow-[0_2px_8px_rgba(22,27,29,0.06)]">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.14)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
            <ArrowLeft size={14} />
          </button>
          <div className="flex items-center gap-2">
            <Image src="/Icono xoria.png" alt="IAOS" width={22} height={22} className="object-cover rounded-full" onError={() => {}} />
            <span className="text-[13px] text-[#1A1F2B] font-semibold">Portal del Asegurado</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#69A481]/10 border border-[#69A481]/20">
          <Lock size={10} className="text-[#69A481]" />
          <span className="text-[10px] text-[#69A481] font-semibold">Conexión segura · SSL 256-bit</span>
        </div>
      </div>

      {/* Progreso */}
      <div className="px-6 py-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => {
              const done = i < 2
              const active = i === 2
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                      done ? 'bg-[#69A481] text-white' : active ? 'bg-[#F7941D] text-white shadow-[0_0_12px_rgba(247,148,29,0.4)]' : 'bg-[#E5E7EB] text-[#9CA3AF]')}>
                      {done ? <CheckCircle2 size={13} /> : i + 1}
                    </div>
                    <span className={cn('text-[9px] font-semibold uppercase tracking-wider', done ? 'text-[#69A481]' : active ? 'text-[#F7941D]' : 'text-[#9CA3AF]')}>{step}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn('flex-1 h-0.5 mx-2 mt-[-14px] rounded-full', done ? 'bg-[#69A481]' : 'bg-[#E5E7EB]')} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">

          {/* Resumen del plan */}
          <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-1">Plan seleccionado</p>
                <p className="text-[16px] text-[#1A1F2B] font-bold">{plan.nombre}</p>
                <p className="text-[11px] text-[#6B7280]">{plan.aseguradora} · {tipo === 'gmm-colectivo' ? 'GMM Colectivo' : 'GMM Individual'}</p>
              </div>
              <div className="text-right">
                <p className="text-[22px] font-bold text-[#F7941D]">${cuotas === 'anual' ? Number(primaMensual).toLocaleString() : plan.prima}</p>
                <p className="text-[10px] text-[#9CA3AF]">MXN / {plan.periodo}</p>
              </div>
            </div>
            {/* Toggle mensual/anual */}
            <div className="mt-3 flex gap-2 bg-[#EFF2F9] rounded-xl p-1 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
              {(['mensual', 'anual'] as const).map(op => (
                <button key={op} onClick={() => setCuotas(op)}
                  className={cn('flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all capitalize', cuotas === op ? 'bg-white text-[#F7941D] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]' : 'text-[#9CA3AF]')}>
                  {op}
                </button>
              ))}
            </div>
            {descuento && <p className="mt-1.5 text-center text-[10px] text-[#69A481] font-semibold">✓ {descuento} → Prima anual: {primaLabel}</p>}
          </div>

          {/* Método de pago */}
          <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <p className="text-[13px] text-[#1A1F2B] font-semibold mb-3">Método de pago</p>
            <div className="flex gap-2 mb-4">
              {[
                { id: 'tarjeta' as const, label: 'Tarjeta', icon: <CreditCard size={13} /> },
                { id: 'transferencia' as const, label: 'SPEI', icon: <Shield size={13} /> },
                { id: 'oxxo' as const, label: 'OXXO Pay', icon: <Smartphone size={13} /> },
              ].map(m => (
                <button key={m.id} onClick={() => setMetodo(m.id)}
                  className={cn('flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-[11px] font-semibold transition-all border', metodo === m.id ? 'bg-[#F7941D]/10 border-[#F7941D]/30 text-[#F7941D]' : 'border-[#E5E7EB] text-[#9CA3AF] hover:border-[#D1D5DB]')}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {metodo === 'tarjeta' && (
              <div className="flex flex-col gap-3">
                {/* Card number */}
                <div>
                  <label className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wide mb-1 block">Número de tarjeta</label>
                  <div className="relative">
                    <input type="text" value={cardNum}
                      onChange={e => setCardNum(formatCard(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-3 rounded-xl text-[13px] text-[#1A1F2B] bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] outline-none border-none placeholder-[#D1D5DB] font-mono tracking-widest" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      {['💳', '🔵', '🔴'].map((c, i) => <span key={i} className="text-[14px] opacity-60">{c}</span>)}
                    </div>
                  </div>
                </div>
                {/* Titular */}
                <div>
                  <label className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wide mb-1 block">Nombre del titular</label>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value.toUpperCase())}
                    placeholder="COMO APARECE EN LA TARJETA"
                    className="w-full px-4 py-3 rounded-xl text-[13px] text-[#1A1F2B] bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] outline-none border-none placeholder-[#D1D5DB] uppercase tracking-wide" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wide mb-1 block">Vencimiento</label>
                    <input type="text" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 rounded-xl text-[13px] text-[#1A1F2B] bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] outline-none border-none placeholder-[#D1D5DB] font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wide mb-1 block">CVV</label>
                    <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      className="w-full px-4 py-3 rounded-xl text-[13px] text-[#1A1F2B] bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] outline-none border-none placeholder-[#D1D5DB] font-mono" />
                  </div>
                </div>
              </div>
            )}

            {metodo === 'transferencia' && (
              <div className="bg-white/60 rounded-xl p-4 border border-[#E5E7EB]">
                <p className="text-[12px] text-[#1A1F2B] font-semibold mb-2">Transferencia SPEI</p>
                <div className="flex flex-col gap-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Banco:</span><span className="text-[#1A1F2B] font-medium">BBVA México</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">CLABE:</span><span className="text-[#1A1F2B] font-mono">012 180 0123456789 01</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Referencia:</span><span className="text-[#F7941D] font-bold">IAOS-{Date.now().toString().slice(-6)}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Monto:</span><span className="text-[#1A1F2B] font-bold">MXN ${plan.prima}</span></div>
                </div>
                <p className="mt-2 text-[10px] text-[#9CA3AF]">⚠️ Incluye la referencia exacta. Confirmación en 24-48 hrs hábiles.</p>
              </div>
            )}

            {metodo === 'oxxo' && (
              <div className="bg-white/60 rounded-xl p-4 border border-[#E5E7EB] text-center">
                <div className="w-20 h-20 mx-auto mb-2 bg-[#F0F0F0] rounded-lg flex items-center justify-center text-[32px]">🏪</div>
                <p className="text-[12px] text-[#1A1F2B] font-semibold">Ficha OXXO Pay</p>
                <p className="text-[20px] font-mono font-bold text-[#1A1F2B] tracking-widest mt-1">8310 {Date.now().toString().slice(-4)} 0021</p>
                <p className="text-[10px] text-[#9CA3AF] mt-1">Válida 72 hrs · Presenta en cualquier OXXO</p>
                <p className="text-[11px] text-[#F7941D] font-bold mt-2">MXN ${plan.prima} / {plan.periodo}</p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-[#7C1F31]/08 border border-[#7C1F31]/20 rounded-xl px-4 py-3">
              <AlertCircle size={14} className="text-[#7C1F31] shrink-0" />
              <p className="text-[12px] text-[#7C1F31]">{error}</p>
            </div>
          )}

          {/* Detalles cargo */}
          <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <p className="text-[11px] text-[#9CA3AF] font-semibold uppercase tracking-wider mb-2.5">Resumen del cargo</p>
            <div className="flex flex-col gap-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Prima neta {cuotas}</span>
                <span className="text-[#1A1F2B] font-medium">MXN ${plan.prima}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Derecho de póliza</span>
                <span className="text-[#1A1F2B] font-medium">MXN $350.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">IVA (16%)</span>
                <span className="text-[#1A1F2B] font-medium">MXN ${(primaNum * 0.16 + 56).toFixed(2)}</span>
              </div>
              {cuotas === 'anual' && (
                <div className="flex justify-between text-[#69A481]">
                  <span className="font-medium">Descuento anual (10%)</span>
                  <span className="font-bold">- MXN ${(primaNum * 12 * 0.1).toFixed(0)}</span>
                </div>
              )}
              <div className="border-t border-[#E5E7EB] mt-1.5 pt-1.5 flex justify-between">
                <span className="text-[#1A1F2B] font-bold">Total a cobrar</span>
                <span className="text-[#F7941D] font-bold text-[14px]">MXN ${Number(primaMensual).toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-[#9CA3AF]">
              <Clock size={11} />
              <span>El cargo aparecerá como "IAOS · SEGURO" en tu estado de cuenta.</span>
            </div>
          </div>

          {/* CTA */}
          <button onClick={pagar} disabled={cargando}
            className="w-full py-4 rounded-2xl text-white font-bold text-[15px] flex items-center justify-center gap-2.5 disabled:opacity-70 hover:scale-[1.02] transition-all"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 8px 24px rgba(247,148,29,0.45)' }}>
            {cargando ? <><Loader2 size={16} className="animate-spin" /> Procesando pago...</> : <><Lock size={15} /> Autorizar pago · MXN ${Number(primaMensual).toLocaleString()}</>}
          </button>

          <div className="flex items-center justify-center gap-4 text-[9px] text-[#9CA3AF]">
            <div className="flex items-center gap-1"><Shield size={10} /><span>Pago seguro</span></div>
            <div className="flex items-center gap-1"><Lock size={10} /><span>Encriptado TLS</span></div>
            <div className="flex items-center gap-1"><CheckCircle2 size={10} /><span>PCI DSS</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PagoPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#EFF2F9]">
        <Loader2 size={20} className="animate-spin text-[#F7941D]" />
      </div>
    }>
      <PagoContent />
    </Suspense>
  )
}
