'use client'
import { useState, useRef, useCallback } from 'react'
import { MOCK_PAYMENTS, MOCK_POLICIES } from '@/data/mock'
import { CreditCard, TrendingUp, AlertTriangle, CheckCircle, Search, Download, Upload, X, Loader2, Scan, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ClientLink } from '@/components/ui'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const STATUS_COLOR: Record<string, string> = {
  pagado: '#69A481',
  pendiente: '#F7941D',
  vencido: '#7C1F31',
}

const MONTHLY_DATA = [
  { mes: 'Ene', cobrado: 48000, pendiente: 12000 },
  { mes: 'Feb', cobrado: 52000, pendiente: 8000 },
  { mes: 'Mar', cobrado: 61000, pendiente: 15000 },
  { mes: 'Abr', cobrado: 55000, pendiente: 10000 },
  { mes: 'May', cobrado: 70000, pendiente: 6000 },
  { mes: 'Jun', cobrado: 78000, pendiente: 9000 },
]

export default function CobranzaPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [cobrarModal, setCobrarModal] = useState<typeof MOCK_PAYMENTS[0] | null>(null)
  const [ocrStep, setOcrStep] = useState<'idle' | 'uploading' | 'done'>('idle')
  const [ocrFile, setOcrFile] = useState<string | null>(null)
  const [cobrado, setCobrado] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = MOCK_PAYMENTS.filter(p => {
    const matchSearch = p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.concept.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalCobrado = MOCK_PAYMENTS.filter(p => p.status === 'pagado').reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, '') || '0'), 0)
  const totalPendiente = MOCK_PAYMENTS.filter(p => p.status === 'pendiente').reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, '') || '0'), 0)
  const totalVencido = MOCK_PAYMENTS.filter(p => p.status === 'vencido').reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, '') || '0'), 0)

  function openCobrar(p: typeof MOCK_PAYMENTS[0]) {
    setCobrarModal(p); setOcrStep('idle'); setOcrFile(null); setSubmitted(false)
  }

  function handleComprobante(file: File | null) {
    if (!file) return
    setOcrFile(file.name)
    setOcrStep('uploading')
    setTimeout(() => setOcrStep('done'), 2000)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    handleComprobante(e.dataTransfer.files[0])
  }, [])

  function handleConfirm() {
    setSubmitted(true)
    setTimeout(() => {
      if (cobrarModal) setCobrado(prev => new Set([...prev, cobrarModal.id]))
      setCobrarModal(null); setOcrStep('idle'); setOcrFile(null); setSubmitted(false)
    }, 1800)
  }

  const kpis = [
    { label: 'Cobrado este mes', val: `$${totalCobrado.toLocaleString()}`, color: '#69A481', icon: CheckCircle },
    { label: 'Por cobrar', val: `$${totalPendiente.toLocaleString()}`, color: '#F7941D', icon: CreditCard },
    { label: 'Vencido', val: `$${totalVencido.toLocaleString()}`, color: '#7C1F31', icon: AlertTriangle },
    { label: 'Pólizas activas', val: MOCK_POLICIES.filter(p => p.status === 'activa' || p.status === 'vigente').length, color: '#6B7280', icon: TrendingUp },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${k.color}15` }}>
              <k.icon size={16} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-[18px] leading-tight" style={{ color: k.color }}>{k.val}</p>
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfica */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[14px] text-[#1A1F2B]">Flujo de cobranza</p>
            <p className="text-[11px] text-[#9CA3AF]">Primer semestre del año</p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#69A481] rounded" />Cobrado</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#F7941D] rounded" />Pendiente</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCob" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#69A481" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#69A481" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F7941D" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F7941D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#EFF2F9', border: 'none', borderRadius: 12, fontSize: 12 }} />
            <Area type="monotone" dataKey="cobrado" stroke="#69A481" strokeWidth={2} fill="url(#gradCob)" />
            <Area type="monotone" dataKey="pendiente" stroke="#F7941D" strokeWidth={2} fill="url(#gradPend)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de pagos */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente o concepto..."
              className="w-full bg-[#EFF2F9] pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
          </div>
          <div className="flex gap-2">
            {['pagado', 'pendiente', 'vencido'].map(s => (
              <button key={s} onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                className="text-[11px] px-2.5 py-1.5 rounded-xl transition-all"
                style={{ background: filterStatus === s ? `${STATUS_COLOR[s]}20` : 'transparent', color: filterStatus === s ? STATUS_COLOR[s] : '#9CA3AF', border: `1px solid ${filterStatus === s ? STATUS_COLOR[s] : '#D1D5DB'}` }}>
                {s}
              </button>
            ))}
            <button className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
              <Download size={13} />
            </button>
          </div>
        </div>

        {/* Encabezado tabla */}
        <div className="grid grid-cols-5 gap-3 px-3 pb-2 border-b border-[#D1D5DB]/20">
          {['Cliente', 'Concepto', 'Monto', 'Vencimiento', 'Estado'].map(h => (
            <p key={h} className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{h}</p>
          ))}
        </div>

          {filtered.map(p => (
          <div key={p.id} className="grid grid-cols-5 gap-3 px-3 py-3 border-b border-[#D1D5DB]/10 last:border-0 hover:bg-white/30 rounded-xl transition-colors">
            <p className="text-[12px] text-[#1A1F2B] truncate">
              <ClientLink name={p.clientName} plain className="text-[12px] text-[#1A1F2B]" />
            </p>
            <p className="text-[12px] text-[#6B7280] truncate">{p.concept}</p>
            <p className="text-[12px] text-[#F7941D]">{p.amount}</p>
            <p className="text-[12px] text-[#9CA3AF]">{p.dueDate}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded-lg" style={{ background: `${STATUS_COLOR[cobrado.has(p.id) ? 'pagado' : p.status] || '#9CA3AF'}15`, color: STATUS_COLOR[cobrado.has(p.id) ? 'pagado' : p.status] || '#9CA3AF' }}>
                {cobrado.has(p.id) ? 'pagado' : p.status}
              </span>
              {(p.status === 'pendiente' || p.status === 'vencido') && !cobrado.has(p.id) && (
                <button onClick={() => openCobrar(p)} className="text-[10px] text-white bg-[#F7941D] px-2.5 py-0.5 rounded-lg hover:bg-[#E8820A] transition-colors">Cobrar</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal cobro de pago */}
      {cobrarModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#69A481]/10 flex items-center justify-center">
                  <CreditCard size={15} className="text-[#69A481]" />
                </div>
                <p className="text-[15px] text-[#1A1F2B]">Registrar pago</p>
              </div>
              <button onClick={() => setCobrarModal(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Resumen de pago */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Cliente', val: cobrarModal.clientName },
                  { label: 'Concepto', val: cobrarModal.concept },
                  { label: 'Monto', val: cobrarModal.amount },
                  { label: 'Vencimiento', val: cobrarModal.dueDate },
                ].map(f => (
                  <div key={f.label} className="bg-white/40 rounded-xl p-3">
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{f.label}</p>
                    <p className="text-[13px] text-[#1A1F2B] mt-0.5">{f.val}</p>
                  </div>
                ))}
              </div>

              {/* Comprobante */}
              <div>
                <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide mb-2">Comprobante de pago</p>
                <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={e => handleComprobante(e.target.files?.[0] || null)} />

                {ocrStep === 'idle' && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onClick={() => fileRef.current?.click()}
                    className={cn('border-2 border-dashed rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all',
                      dragging ? 'border-[#69A481] bg-[#69A481]/5' : 'border-[#D1D5DB] hover:border-[#69A481]/50')}>
                    <Upload size={20} className="text-[#9CA3AF]" />
                    <p className="text-[12px] text-[#6B7280]">Arrastra comprobante o haz clic</p>
                    <p className="text-[11px] text-[#9CA3AF]">Transferencia, depósito, captura de pago</p>
                  </div>
                )}

                {ocrStep === 'uploading' && (
                  <div className="border-2 border-[#69A481]/30 rounded-2xl p-4 bg-[#69A481]/5 flex items-center gap-3">
                    <Loader2 size={16} className="text-[#69A481] animate-spin" />
                    <p className="text-[12px] text-[#69A481]">Verificando comprobante...</p>
                  </div>
                )}

                {ocrStep === 'done' && (
                  <div className="border-2 border-[#69A481]/40 rounded-2xl p-4 bg-[#69A481]/5 flex items-center gap-3">
                    <CheckCircle size={16} className="text-[#69A481]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#69A481]">Comprobante verificado</p>
                      <p className="text-[11px] text-[#9CA3AF] truncate">{ocrFile}</p>
                    </div>
                    <button onClick={() => { setOcrStep('idle'); setOcrFile(null) }} className="text-[11px] text-[#9CA3AF] hover:text-[#F7941D]">Cambiar</button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Referencia / Folio</label>
                <input placeholder="REF-2026-XXXXX" className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
              </div>

              <button onClick={handleConfirm} disabled={submitted}
                className={cn('w-full py-3.5 rounded-xl text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2',
                  submitted ? 'bg-[#69A481]' : 'bg-[#F7941D] hover:bg-[#E8820A] shadow-[0_4px_12px_rgba(247,148,29,0.3)]')}>
                {submitted ? <><CheckCircle size={15} /> Pago registrado</> : 'Confirmar pago'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
