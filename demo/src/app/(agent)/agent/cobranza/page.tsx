'use client'
import { useState } from 'react'
import { MOCK_PAYMENTS, MOCK_PAYMENT_HISTORY } from '@/data/mock'
import {
  CreditCard, AlertTriangle, CheckCircle2, Search,
  X, Bell, Clock, ChevronRight, Send, Settings2, FileText,
  Banknote, Building2, Landmark, Smartphone, Check, Info, Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const STATUS_COLOR: Record<string, string> = {
  pagado: '#69A481', pendiente: '#F7941D', vencido: '#7C1F31', confirmado: '#69A481',
}
const STATUS_BG: Record<string, string> = {
  pagado: 'rgba(105,164,129,0.12)', pendiente: 'rgba(247,148,29,0.12)', vencido: 'rgba(124,31,49,0.12)', confirmado: 'rgba(105,164,129,0.12)',
}
const STATUS_LABEL: Record<string, string> = {
  pagado: 'Pagado', pendiente: 'Pendiente', vencido: 'Vencido', confirmado: 'Confirmado',
}
const METODO_ICON: Record<string, React.ReactNode> = {
  'Efectivo': <Banknote size={13} className="text-[#69A481]" />,
  'Tarjeta débito': <CreditCard size={13} className="text-[#1A1F2B]" />,
  'Tarjeta crédito': <CreditCard size={13} className="text-[#F7941D]" />,
  'Transferencia SPEI': <Landmark size={13} className="text-[#0057A8]" />,
  'Domiciliación': <Smartphone size={13} className="text-[#6B7280]" />,
}
const MONTHLY_DATA = [
  { mes: 'Oct', cobrado: 148000, pendiente: 12000 },
  { mes: 'Nov', cobrado: 162000, pendiente: 8000 },
  { mes: 'Dic', cobrado: 134000, pendiente: 18000 },
  { mes: 'Ene', cobrado: 171000, pendiente: 10000 },
  { mes: 'Feb', cobrado: 165000, pendiente: 6000 },
  { mes: 'Mar', cobrado: 196720, pendiente: 15000 },
]

type Pago = typeof MOCK_PAYMENTS[0]
type HistorialItem = typeof MOCK_PAYMENT_HISTORY[0]

// Modal: Detalle de pago pendiente/vencido + recordatorio
function ModalPagoPendiente({ pago, onClose, onRecordatorio }: { pago: Pago; onClose: () => void; onRecordatorio: () => void }) {
  const due = new Date(pago.dueDate)
  const hoy = new Date('2026-03-19')
  const diasVencido = Math.floor((hoy.getTime() - due.getTime()) / 86400000)
  const diasRestantes = Math.floor((due.getTime() - hoy.getTime()) / 86400000)
  const estaVencido = pago.status === 'vencido'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.55)', backdropFilter: 'blur(10px)' }} onClick={onClose}>
      <div className="w-full max-w-md bg-[#EFF2F9] rounded-3xl shadow-[0_24px_80px_rgba(22,27,29,0.4)] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className={cn('px-5 py-4 flex items-center justify-between', estaVencido ? 'bg-gradient-to-r from-[#7C1F31] to-[#9B2941]' : 'bg-gradient-to-r from-[#F7941D] to-[#e08019]')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              {estaVencido ? <AlertTriangle size={18} className="text-white" /> : <Clock size={18} className="text-white" />}
            </div>
            <div>
              <p className="text-white font-bold text-[14px]">{estaVencido ? '⚠️ Pago vencido' : '🕐 Pago pendiente'}</p>
              <p className="text-white/70 text-[10px]">{pago.concept}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"><X size={14} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className={cn('rounded-xl px-4 py-3 flex items-start gap-2.5', estaVencido ? 'bg-[#7C1F31]/10 border border-[#7C1F31]/20' : 'bg-[#F7941D]/10 border border-[#F7941D]/20')}>
            <Info size={14} className={estaVencido ? 'text-[#7C1F31] shrink-0 mt-0.5' : 'text-[#F7941D] shrink-0 mt-0.5'} />
            <p className={cn('text-[11px] leading-relaxed', estaVencido ? 'text-[#7C1F31]' : 'text-[#e08019]')}>
              {estaVencido
                ? `Este recibo lleva ${diasVencido} días vencido. La póliza puede estar en riesgo de cancelación.`
                : diasRestantes <= 3
                  ? `Vence en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}. ¡Envía el recordatorio ahora!`
                  : `Vence el ${due.toLocaleDateString('es-MX', { day: '2-digit', month: 'long' })} — quedan ${diasRestantes} días.`}
            </p>
          </div>
          <div className="bg-[#EFF2F9] rounded-xl p-4 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-3">Detalle del recibo</p>
            <div className="flex flex-col gap-2 text-[11px]">
              {[
                { label: 'Asegurado', value: pago.clientName },
                { label: 'Concepto', value: pago.concept },
                { label: 'Monto', value: pago.amount, highlight: true },
                { label: 'Fecha de vencimiento', value: due.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }) },
                { label: 'Estado', value: estaVencido ? `Vencido hace ${diasVencido} días` : `Vence en ${diasRestantes} días` },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-[#9CA3AF]">{item.label}</span>
                  <span className={cn('font-semibold', item.highlight ? 'text-[#F7941D] text-[13px]' : 'text-[#1A1F2B]')}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-[11px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B] transition-all">Cerrar</button>
            <button onClick={onRecordatorio}
              className="flex-1 py-2.5 rounded-xl text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
              style={{ background: estaVencido ? 'linear-gradient(135deg,#7C1F31,#9B2941)' : 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 4px 14px rgba(247,148,29,0.35)' }}>
              <Send size={11} /> Enviar recordatorio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalRecordatorioEnviado({ cliente, onClose }: { cliente: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.55)', backdropFilter: 'blur(12px)' }} onClick={onClose}>
      <div className="w-full max-w-sm bg-[#EFF2F9] rounded-3xl p-7 text-center shadow-[0_24px_80px_rgba(22,27,29,0.4)]" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#69A481] flex items-center justify-center shadow-[0_8px_24px_rgba(105,164,129,0.4)]">
          <Check size={26} className="text-white" />
        </div>
        <h3 className="text-[16px] text-[#1A1F2B] font-bold mb-1">¡Recordatorio enviado!</h3>
        <p className="text-[12px] text-[#6B7280] mb-4">Mensaje enviado a <strong>{cliente}</strong> por WhatsApp y correo electrónico.</p>
        <div className="bg-[#EFF2F9] rounded-xl p-3 text-left shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] mb-4">
          <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wide mb-1">Mensaje enviado:</p>
          <p className="text-[11px] text-[#1A1F2B] italic">&ldquo;Hola {cliente}, te recordamos que tienes un pago de prima pendiente. Regulariza tu situación para mantener tu cobertura activa. Contáctanos si necesitas apoyo.&rdquo;</p>
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-white" style={{ background: 'linear-gradient(135deg,#69A481,#4d8060)' }}>Listo</button>
      </div>
    </div>
  )
}

function ModalRecibo({ pago, onClose }: { pago: HistorialItem; onClose: () => void }) {
  const [descargando, setDescargando] = useState(false)
  const [descargado, setDescargado] = useState(false)
  function simularDescarga() { setDescargando(true); setTimeout(() => { setDescargando(false); setDescargado(true) }, 1500) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.55)', backdropFilter: 'blur(10px)' }} onClick={onClose}>
      <div className="w-full max-w-md bg-[#EFF2F9] rounded-3xl shadow-[0_24px_80px_rgba(22,27,29,0.4)] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[9px] uppercase tracking-widest">RECIBO DE PAGO OFICIAL</p>
            <p className="text-white font-bold text-[14px] mt-0.5">{pago.policyNumber}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"><X size={14} /></button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="bg-[#EFF2F9] rounded-xl p-4 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
            <div className="flex flex-col gap-2 text-[11px]">
              {[
                { label: 'Asegurado', value: pago.clientName },
                { label: 'Concepto', value: pago.concepto },
                { label: 'Monto pagado', value: `MXN $${pago.monto.toLocaleString()}`, highlight: true },
                { label: 'Fecha de pago', value: new Date(pago.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }) },
                { label: 'Referencia', value: pago.referencia },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-[#9CA3AF]">{item.label}</span>
                  <span className={cn('font-semibold text-right max-w-[220px]', item.highlight ? 'text-[#F7941D] text-[13px]' : 'text-[#1A1F2B]')}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
              <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide mb-1.5">Método de pago</p>
              <div className="flex items-center gap-1.5">
                {METODO_ICON[pago.metodoPago] ?? <CreditCard size={13} className="text-[#6B7280]" />}
                <p className="text-[11px] text-[#1A1F2B] font-semibold">{pago.metodoPago}</p>
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{pago.banco}</p>
            </div>
            <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
              <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide mb-1.5">Destino del pago</p>
              <div className="flex items-center gap-1.5">
                <Building2 size={12} className="text-[#1A1F2B]" />
                <p className="text-[10px] text-[#1A1F2B] font-semibold leading-tight">{pago.destino}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: STATUS_BG[pago.status], border: `1px solid ${STATUS_COLOR[pago.status]}30` }}>
            <CheckCircle2 size={13} style={{ color: STATUS_COLOR[pago.status] }} />
            <p className="text-[11px] font-semibold" style={{ color: STATUS_COLOR[pago.status] }}>
              {STATUS_LABEL[pago.status]} {pago.comprobante ? '· Comprobante recibido' : '· Sin comprobante adjunto'}
            </p>
          </div>
          <button onClick={simularDescarga} disabled={descargando}
            className={cn('w-full py-2.5 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-2 transition-all', descargado ? 'bg-[#69A481] text-white' : 'text-white hover:opacity-90')}
            style={!descargado ? { background: 'linear-gradient(135deg,#1A1F2B,#2D3548)' } : {}}>
            {descargado ? <><Check size={13} /> Descargado</> : descargando ? 'Generando PDF...' : <><Download size={13} /> Descargar recibo PDF</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function ModalReglaRecordatorio({ onClose }: { onClose: () => void }) {
  const [horas, setHoras] = useState('48')
  const [canales, setCanales] = useState({ whatsapp: true, email: true, sms: false })
  const [guardado, setGuardado] = useState(false)
  function guardar() { setGuardado(true); setTimeout(() => { setGuardado(false); onClose() }, 1500) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.55)', backdropFilter: 'blur(10px)' }} onClick={onClose}>
      <div className="w-full max-w-md bg-[#EFF2F9] rounded-3xl shadow-[0_24px_80px_rgba(22,27,29,0.4)] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 size={15} className="text-[#F7941D]" />
            <p className="text-white font-bold text-[14px]">Regla de recordatorio automático</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"><X size={14} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="bg-[#F7941D]/10 border border-[#F7941D]/20 rounded-xl px-4 py-3">
            <p className="text-[11px] text-[#e08019] leading-relaxed">Define cada cuántas horas sin pago recibido se enviará automáticamente un nuevo recordatorio al asegurado.</p>
          </div>
          <div>
            <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2 block">Reenviar recordatorio cada:</label>
            <div className="flex items-center gap-3">
              <input type="number" value={horas} onChange={e => setHoras(e.target.value)} min={1} max={720}
                className="w-24 px-4 py-2.5 rounded-xl text-[13px] text-[#1A1F2B] font-bold bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] outline-none text-center" />
              <span className="text-[12px] text-[#6B7280] font-medium">horas sin pago recibido</span>
            </div>
            <div className="flex gap-2 mt-2">
              {['12', '24', '48', '72'].map(h => (
                <button key={h} onClick={() => setHoras(h)}
                  className={cn('px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all', horas === h ? 'bg-[#F7941D] text-white' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]')}>
                  {h}h
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2 block">Canales de envío</label>
            <div className="flex flex-col gap-2">
              {([['whatsapp', 'WhatsApp'], ['email', 'Correo electrónico'], ['sms', 'SMS']] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer" onClick={() => setCanales(prev => ({ ...prev, [key]: !prev[key] }))}>
                  <div className={cn('w-5 h-5 rounded-md flex items-center justify-center transition-all', canales[key] ? 'bg-[#F7941D]' : 'bg-[#EFF2F9] shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.10)]')}>
                    {canales[key] && <Check size={11} className="text-white" />}
                  </div>
                  <span className="text-[12px] text-[#1A1F2B]">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <button onClick={guardar}
            className={cn('w-full py-3 rounded-xl text-[12px] font-semibold text-white flex items-center justify-center gap-2 transition-all', guardado ? 'bg-[#69A481]' : '')}
            style={!guardado ? { background: 'linear-gradient(135deg,#F7941D,#e08019)' } : {}}>
            {guardado ? <><Check size={14} /> ¡Regla guardada!</> : 'Guardar regla'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CobranzaPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [pagoModal, setPagoModal] = useState<Pago | null>(null)
  const [recordatorioModal, setRecordatorioModal] = useState<string | null>(null)
  const [reciboModal, setReciboModal] = useState<HistorialItem | null>(null)
  const [reglaModal, setReglaModal] = useState(false)
  const [tabActiva, setTabActiva] = useState<'recibos' | 'historial'>('recibos')

  const filtered = MOCK_PAYMENTS.filter(p => {
    const matchSearch = p.clientName.toLowerCase().includes(search.toLowerCase()) || p.concept.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalCobrado = MOCK_PAYMENTS.filter(p => p.status === 'pagado').reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, '') || '0'), 0)
  const totalPendiente = MOCK_PAYMENTS.filter(p => p.status === 'pendiente').reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, '') || '0'), 0)
  const totalVencido = MOCK_PAYMENTS.filter(p => p.status === 'vencido').reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, '') || '0'), 0)

  function enviarRecordatorio() {
    const nombre = pagoModal?.clientName || ''
    setPagoModal(null)
    setRecordatorioModal(nombre)
  }

  return (
    <div className="flex flex-col gap-5">
      {pagoModal && <ModalPagoPendiente pago={pagoModal} onClose={() => setPagoModal(null)} onRecordatorio={enviarRecordatorio} />}
      {recordatorioModal && <ModalRecordatorioEnviado cliente={recordatorioModal} onClose={() => setRecordatorioModal(null)} />}
      {reciboModal && <ModalRecibo pago={reciboModal} onClose={() => setReciboModal(null)} />}
      {reglaModal && <ModalReglaRecordatorio onClose={() => setReglaModal(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-[#F7941D] font-bold tracking-[0.15em] uppercase mb-0.5">Módulo 11</p>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold">Cobranza y recibos</h1>
        </div>
        <button onClick={() => setReglaModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-colors">
          <Settings2 size={13} /> Regla recordatorio
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Cobrado este mes', value: `$${totalCobrado.toLocaleString()}`, color: '#69A481', icon: CheckCircle2 },
          { label: 'Pendiente de cobro', value: `$${totalPendiente.toLocaleString()}`, color: '#F7941D', icon: Clock },
          { label: 'Cartera vencida', value: `$${totalVencido.toLocaleString()}`, color: '#7C1F31', icon: AlertTriangle },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <kpi.icon size={16} style={{ color: kpi.color }} className="mb-2" />
            <p className="text-[20px] font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Gráfica */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] text-[#1A1F2B] font-bold">Tendencia de cobranza — últimos 6 meses</p>
          <div className="flex gap-3 text-[9px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#69A481]" />Cobrado</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F7941D]" />Pendiente</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={MONTHLY_DATA}>
            <defs>
              <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#69A481" stopOpacity={0.3} /><stop offset="100%" stopColor="#69A481" stopOpacity={0} /></linearGradient>
              <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F7941D" stopOpacity={0.3} /><stop offset="100%" stopColor="#F7941D" stopOpacity={0} /></linearGradient>
            </defs>
            <XAxis dataKey="mes" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={{ fontSize: 10, borderRadius: 8, border: 'none', background: '#fff' }} />
            <Area type="monotone" dataKey="cobrado" stroke="#69A481" strokeWidth={2} fill="url(#gc)" />
            <Area type="monotone" dataKey="pendiente" stroke="#F7941D" strokeWidth={2} fill="url(#gp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#EFF2F9] rounded-xl p-1 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] max-w-xs">
        {([['recibos', 'Recibos activos'], ['historial', 'Historial de pagos']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTabActiva(id)}
            className={cn('flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all', tabActiva === id ? 'bg-white text-[#F7941D] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]' : 'text-[#9CA3AF]')}>
            {label}
          </button>
        ))}
      </div>

      {tabActiva === 'recibos' && (
        <>
          {/* Filtros */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por asegurado o concepto..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[12px] text-[#1A1F2B] bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] outline-none placeholder-[#D1D5DB]" />
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            </div>
            {[null, 'pendiente', 'vencido', 'pagado'].map(s => (
              <button key={String(s)} onClick={() => setFilterStatus(s)}
                className={cn('px-3 py-2 rounded-xl text-[11px] font-semibold capitalize transition-all', filterStatus === s ? 'bg-[#F7941D] text-white' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#6B7280]')}>
                {s === null ? 'Todos' : s}
              </button>
            ))}
          </div>

          {/* Lista recibos */}
          <div className="flex flex-col gap-3">
            {filtered.map(pago => {
              const isPending = pago.status === 'pendiente' || pago.status === 'vencido'
              const due = new Date(pago.dueDate)
              const hoy = new Date('2026-03-19')
              const diasVencido = Math.floor((hoy.getTime() - due.getTime()) / 86400000)
              const diasRestantes = Math.floor((due.getTime() - hoy.getTime()) / 86400000)

              return (
                <div key={pago.id} onClick={() => isPending && setPagoModal(pago)}
                  className={cn('bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex items-center gap-4 group', isPending ? 'cursor-pointer hover:shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.18)] transition-all' : '')}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: STATUS_BG[pago.status] }}>
                    {pago.status === 'pagado' ? <CheckCircle2 size={16} style={{ color: STATUS_COLOR[pago.status] }} />
                      : pago.status === 'vencido' ? <AlertTriangle size={16} style={{ color: STATUS_COLOR[pago.status] }} />
                      : <Clock size={16} style={{ color: STATUS_COLOR[pago.status] }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] text-[#1A1F2B] font-semibold">{pago.clientName}</p>
                      <p className="text-[14px] font-bold" style={{ color: STATUS_COLOR[pago.status] }}>{pago.amount}</p>
                    </div>
                    <p className="text-[11px] text-[#6B7280] truncate">{pago.concept}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: STATUS_BG[pago.status], color: STATUS_COLOR[pago.status] }}>
                          {STATUS_LABEL[pago.status]}
                        </span>
                        {pago.status === 'vencido' && <span className="text-[9px] text-[#7C1F31] font-semibold">{diasVencido}d vencido</span>}
                        {pago.status === 'pendiente' && diasRestantes <= 5 && <span className="text-[9px] text-[#F7941D] font-semibold">Vence en {diasRestantes}d</span>}
                      </div>
                      {isPending && (
                        <button onClick={e => { e.stopPropagation(); setPagoModal(pago) }}
                          className="flex items-center gap-1 text-[9px] text-[#F7941D] font-semibold hover:opacity-75 transition-opacity">
                          <Bell size={10} /> Recordatorio
                        </button>
                      )}
                    </div>
                  </div>
                  {isPending && <ChevronRight size={14} className="text-[#D1D5DB] group-hover:text-[#F7941D] shrink-0 transition-colors" />}
                </div>
              )
            })}
          </div>
        </>
      )}

      {tabActiva === 'historial' && (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] text-[#9CA3AF]">Haz clic en cualquier registro para ver el recibo completo con método y destino del pago.</p>
          {MOCK_PAYMENT_HISTORY.map(ph => (
            <button key={ph.id} onClick={() => setReciboModal(ph)}
              className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex items-center gap-4 text-left group hover:shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.18)] transition-all w-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: STATUS_BG[ph.status] }}>
                {METODO_ICON[ph.metodoPago] ?? <CreditCard size={14} className="text-[#6B7280]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] text-[#1A1F2B] font-semibold">{ph.clientName}</p>
                  <p className="text-[13px] font-bold text-[#1A1F2B]">MXN ${ph.monto.toLocaleString()}</p>
                </div>
                <p className="text-[10px] text-[#6B7280] truncate">{ph.concepto}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-[#9CA3AF]">{new Date(ph.fecha).toLocaleDateString('es-MX')}</span>
                  <span className="text-[9px] text-[#9CA3AF]">·</span>
                  <span className="text-[9px] text-[#9CA3AF]">{ph.metodoPago}</span>
                  <span className="text-[9px] text-[#9CA3AF]">→</span>
                  <span className="text-[9px] text-[#6B7280] font-medium truncate max-w-[150px]">{ph.destino}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: STATUS_BG[ph.status], color: STATUS_COLOR[ph.status] }}>{STATUS_LABEL[ph.status]}</span>
                <FileText size={13} className="text-[#D1D5DB] group-hover:text-[#F7941D] transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
