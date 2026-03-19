'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, FileText, Download, Plus, X, CheckCircle, Clock, AlertCircle, BarChart2, PieChart, CreditCard, Receipt, Building2, ChevronRight, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_POLICIES, MOCK_PAYMENTS, MOCK_CHART_DATA } from '@/data/mock'

type Tab = 'resumen' | 'comisiones' | 'cfdi' | 'flujo'

// ─── MOCK DATA FINANCIERO ────────────────────────────────────────────────────
const COMISIONES = [
  { id: 'com1', poliza: 'GNP-2025-001234', cliente: 'Ana López', tipo: 'GMM Individual', prima: 8500, porcentaje: 18, monto: 1530, status: 'pagada', fecha: '2026-03-05', aseguradora: 'GNP' },
  { id: 'com2', poliza: 'QUA-2025-005678', cliente: 'Ana López', tipo: 'Auto Amplia', prima: 1025, porcentaje: 15, monto: 154, status: 'pagada', fecha: '2026-03-05', aseguradora: 'Qualitas' },
  { id: 'com3', poliza: 'AXA-2025-000345', cliente: 'Empresa XYZ', tipo: 'GMM Colectivo', prima: 145000, porcentaje: 10, monto: 14500, status: 'pendiente', fecha: '2026-04-01', aseguradora: 'AXA' },
  { id: 'com4', poliza: 'GNP-2026-002100', cliente: 'Miguel Ángel Cruz', tipo: 'GMM Plus', prima: 9200, porcentaje: 18, monto: 1656, status: 'pendiente', fecha: '2026-04-01', aseguradora: 'GNP' },
  { id: 'com5', poliza: 'MAP-2025-003300', cliente: 'Empresa XYZ', tipo: 'RC Empresarial', prima: 28000, porcentaje: 12, monto: 3360, status: 'pagada', fecha: '2026-03-10', aseguradora: 'MAPFRE' },
  { id: 'com6', poliza: 'MET-2026-009012', cliente: 'Roberto Sánchez', tipo: 'Vida Temporal', prima: 4200, porcentaje: 20, monto: 840, status: 'pendiente', fecha: '2026-04-01', aseguradora: 'Metlife' },
  { id: 'com7', poliza: 'QUA-2026-008912', cliente: 'Laura Vega', tipo: 'Auto Amplia', prima: 1420, porcentaje: 15, monto: 213, status: 'pagada', fecha: '2026-03-10', aseguradora: 'Qualitas' },
]

const CFDI_LIST = [
  { id: 'cfdi1', folio: 'A-2026-001', cliente: 'Ana López', concepto: 'Comisión GMM Individual Mar 2026', monto: '$1,530.00', iva: '$244.80', total: '$1,774.80', fecha: '2026-03-05', status: 'timbrada', uuid: 'f8a3b2c1-1234-5678-abcd-000000000001' },
  { id: 'cfdi2', folio: 'A-2026-002', cliente: 'Empresa XYZ', concepto: 'Comisión RC Empresarial Mar 2026', monto: '$3,360.00', iva: '$537.60', total: '$3,897.60', fecha: '2026-03-10', status: 'timbrada', uuid: 'f8a3b2c1-1234-5678-abcd-000000000002' },
  { id: 'cfdi3', folio: 'A-2026-003', cliente: 'Laura Vega', concepto: 'Comisión Auto Mar 2026', monto: '$213.00', iva: '$34.08', total: '$247.08', fecha: '2026-03-10', status: 'timbrada', uuid: 'f8a3b2c1-1234-5678-abcd-000000000003' },
  { id: 'cfdi4', folio: 'A-2026-004', cliente: 'Empresa XYZ', concepto: 'Comisión GMM Colectivo Abr 2026', monto: '$14,500.00', iva: '$2,320.00', total: '$16,820.00', fecha: '2026-04-01', status: 'pendiente', uuid: '' },
  { id: 'cfdi5', folio: 'A-2026-005', cliente: 'Miguel Ángel Cruz', concepto: 'Comisión GMM Plus Abr 2026', monto: '$1,656.00', iva: '$264.96', total: '$1,920.96', fecha: '2026-04-01', status: 'pendiente', uuid: '' },
  { id: 'cfdi6', folio: 'A-2025-098', cliente: 'Laura Vega', concepto: 'Comisión Hogar Feb 2025', monto: '$684.00', iva: '$109.44', total: '$793.44', fecha: '2025-02-01', status: 'cancelada', uuid: 'f8a3b2c1-1234-5678-abcd-000000000098' },
]

const FLUJO_MESES = [
  { mes: 'Oct 25', ingresos: 28400, gastos: 8200, comisiones: 22100 },
  { mes: 'Nov 25', ingresos: 31800, gastos: 9100, comisiones: 25600 },
  { mes: 'Dic 25', ingresos: 26900, gastos: 7800, comisiones: 20400 },
  { mes: 'Ene 26', ingresos: 34200, gastos: 9800, comisiones: 27900 },
  { mes: 'Feb 26', ingresos: 33000, gastos: 8900, comisiones: 26700 },
  { mes: 'Mar 26', ingresos: 36850, gastos: 10200, comisiones: 30050 },
]

const COLORES_ASEG: Record<string, string> = {
  GNP: '#1A4E8C', AXA: '#0066A1', Qualitas: '#C8102E', MAPFRE: '#B20000', Metlife: '#00A0DF',
}

export default function FinancieroPage() {
  const [tab, setTab] = useState<Tab>('resumen')
  const [cfdiDetail, setCfdiDetail] = useState<typeof CFDI_LIST[0] | null>(null)
  const [newCfdi, setNewCfdi] = useState(false)

  // KPIs
  const ingresosMes = 36850
  const comPendientes = COMISIONES.filter(c => c.status === 'pendiente').reduce((s, c) => s + c.monto, 0)
  const comPagadas = COMISIONES.filter(c => c.status === 'pagada').reduce((s, c) => s + c.monto, 0)
  const cfdiTimbradas = CFDI_LIST.filter(c => c.status === 'timbrada').length
  const porCobrar = MOCK_PAYMENTS.filter(p => p.status === 'pendiente').length

  const comByAseg = COMISIONES.reduce((acc, c) => {
    acc[c.aseguradora] = (acc[c.aseguradora] || 0) + c.monto
    return acc
  }, {} as Record<string, number>)

  const maxFlujo = Math.max(...FLUJO_MESES.map(f => f.ingresos))

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'resumen', label: 'Resumen', icon: BarChart2 },
    { id: 'comisiones', label: 'Comisiones', icon: DollarSign },
    { id: 'cfdi', label: 'CFDI / Facturas', icon: Receipt },
    { id: 'flujo', label: 'Flujo de caja', icon: TrendingUp },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Módulo Financiero</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">Comisiones, CFDI, flujo de caja y rentabilidad</p>
        </div>
        <button onClick={() => setNewCfdi(true)} className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
          <Plus size={15} />
          Nueva factura
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#EFF2F9] rounded-2xl p-1.5 shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)] w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] transition-all duration-150',
              tab === t.id
                ? 'bg-[#F7941D] text-white shadow-[0_3px_10px_rgba(247,148,29,0.35)]'
                : 'text-[#6B7280] hover:text-[#1A1F2B]')}>
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── RESUMEN ────────────────────────────────────── */}
      {tab === 'resumen' && (
        <div className="flex flex-col gap-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: TrendingUp, color: '#69A481', bg: 'bg-[#69A481]/10', label: 'Ingresos marzo', value: '$36,850', sub: '+11.7% vs feb' },
              { icon: DollarSign, color: '#F7941D', bg: 'bg-[#F7941D]/10', label: 'Comisiones pendientes', value: `$${comPendientes.toLocaleString()}`, sub: `${COMISIONES.filter(c => c.status === 'pendiente').length} por cobrar` },
              { icon: Receipt, color: '#1A1F2B', bg: 'bg-[#1A1F2B]/8', label: 'CFDI timbradas', value: cfdiTimbradas.toString(), sub: `${CFDI_LIST.filter(c => c.status === 'pendiente').length} pendientes` },
              { icon: CreditCard, color: '#7C1F31', bg: 'bg-[#7C1F31]/10', label: 'Recibos por cobrar', value: porCobrar.toString(), sub: 'primas activas' },
            ].map((kpi, i) => (
              <div key={i} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex flex-col gap-3">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', kpi.bg)}>
                  <kpi.icon size={16} style={{ color: kpi.color }} />
                </div>
                <div>
                  <p className="text-[22px] leading-none" style={{ color: kpi.color }}>{kpi.value}</p>
                  <p className="text-[12px] text-[#6B7280] mt-1">{kpi.label}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{kpi.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Comisiones por aseguradora */}
            <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
              <p className="text-[13px] text-[#1A1F2B] mb-4">Comisiones por aseguradora</p>
              <div className="flex flex-col gap-3">
                {Object.entries(comByAseg).sort((a,b) => b[1]-a[1]).map(([aseg, monto]) => {
                  const pct = Math.round((monto / Object.values(comByAseg).reduce((s,v) => s+v, 0)) * 100)
                  return (
                    <div key={aseg}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: COLORES_ASEG[aseg] || '#6B7280' }} />
                          <span className="text-[12px] text-[#6B7280]">{aseg}</span>
                        </div>
                        <span className="text-[12px] text-[#1A1F2B]">${monto.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-[#D1D5DB]/40 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: COLORES_ASEG[aseg] || '#6B7280' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Ingresos últimos 6 meses */}
            <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
              <p className="text-[13px] text-[#1A1F2B] mb-4">Ingresos últimos 6 meses</p>
              <div className="flex items-end gap-2 h-32">
                {FLUJO_MESES.map(f => (
                  <div key={f.mes} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end h-24 gap-0.5">
                      <div className="w-full rounded-t-md bg-[#F7941D] transition-all"
                        style={{ height: `${Math.round((f.ingresos / maxFlujo) * 80)}px` }} />
                    </div>
                    <span className="text-[9px] text-[#9CA3AF]">{f.mes}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#F7941D]" />
                  <span className="text-[10px] text-[#9CA3AF]">Ingresos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen P&L */}
          <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
            <p className="text-[13px] text-[#1A1F2B] mb-4">Estado de resultados — Marzo 2026</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Ingresos totales', value: '$36,850.00', color: '#69A481', icon: TrendingUp, detail: ['Comisiones cobradas $21,757', 'Honorarios $8,500', 'Otros $6,593'] },
                { label: 'Gastos operativos', value: '$10,200.00', color: '#7C1F31', icon: TrendingDown, detail: ['Plataformas $2,400', 'Publicidad $3,100', 'Administrativo $4,700'] },
                { label: 'Utilidad neta', value: '$26,650.00', color: '#F7941D', icon: DollarSign, detail: ['Margen 72.3%', 'vs objetivo $28,000', 'Faltante $1,350'] },
              ].map((row, i) => (
                <div key={i} className="bg-[#EFF2F9] rounded-xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${row.color}18` }}>
                      <row.icon size={13} style={{ color: row.color }} />
                    </div>
                    <p className="text-[11px] text-[#6B7280]">{row.label}</p>
                  </div>
                  <p className="text-[20px]" style={{ color: row.color }}>{row.value}</p>
                  <div className="mt-2 flex flex-col gap-0.5">
                    {row.detail.map((d, j) => (
                      <p key={j} className="text-[10px] text-[#9CA3AF]">· {d}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── COMISIONES ─────────────────────────────────── */}
      {tab === 'comisiones' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total comisiones', value: `$${(comPagadas + comPendientes).toLocaleString()}`, color: '#1A1F2B' },
              { label: 'Cobradas', value: `$${comPagadas.toLocaleString()}`, color: '#69A481' },
              { label: 'Pendientes', value: `$${comPendientes.toLocaleString()}`, color: '#F7941D' },
            ].map((k, i) => (
              <div key={i} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.13)] text-center">
                <p className="text-[20px]" style={{ color: k.color }}>{k.value}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-1">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#EFF2F9] rounded-2xl shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#D1D5DB]/20 flex items-center justify-between">
              <p className="text-[13px] text-[#1A1F2B]">Detalle de comisiones</p>
              <button className="flex items-center gap-1.5 text-[11px] text-[#6B7280] hover:text-[#F7941D]">
                <Filter size={11} /> Filtrar
              </button>
            </div>
            <div className="flex flex-col divide-y divide-[#D1D5DB]/15">
              {COMISIONES.map(c => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/20 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] text-white font-medium shrink-0"
                    style={{ background: COLORES_ASEG[c.aseguradora] || '#6B7280' }}>
                    {c.aseguradora.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1A1F2B] truncate">{c.cliente}</p>
                    <p className="text-[11px] text-[#6B7280] truncate">{c.tipo} · {c.poliza}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] text-[#F7941D]">${c.monto.toLocaleString()}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{c.porcentaje}% de ${c.prima.toLocaleString()}</p>
                  </div>
                  <div className="text-right shrink-0 w-20">
                    <p className="text-[10px] text-[#9CA3AF]">{c.fecha}</p>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full',
                      c.status === 'pagada' ? 'bg-[#69A481]/15 text-[#69A481]' : 'bg-[#F7941D]/15 text-[#F7941D]')}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CFDI ───────────────────────────────────────── */}
      {tab === 'cfdi' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Timbradas', value: CFDI_LIST.filter(c => c.status === 'timbrada').length, color: '#69A481' },
              { label: 'Pendientes', value: CFDI_LIST.filter(c => c.status === 'pendiente').length, color: '#F7941D' },
              { label: 'Canceladas', value: CFDI_LIST.filter(c => c.status === 'cancelada').length, color: '#7C1F31' },
            ].map((k, i) => (
              <div key={i} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.13)] text-center">
                <p className="text-[28px]" style={{ color: k.color }}>{k.value}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-1">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#EFF2F9] rounded-2xl shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#D1D5DB]/20 flex items-center justify-between">
              <p className="text-[13px] text-[#1A1F2B]">Facturas CFDI</p>
              <button onClick={() => setNewCfdi(true)} className="flex items-center gap-1.5 text-[11px] text-[#F7941D] hover:text-[#E8820A]">
                <Plus size={11} /> Nueva
              </button>
            </div>
            <div className="flex flex-col divide-y divide-[#D1D5DB]/15">
              {CFDI_LIST.map(cfdi => (
                <button key={cfdi.id} onClick={() => setCfdiDetail(cfdi)}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/20 transition-colors w-full text-left">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    cfdi.status === 'timbrada' ? 'bg-[#69A481]/15' : cfdi.status === 'pendiente' ? 'bg-[#F7941D]/15' : 'bg-[#7C1F31]/15')}>
                    <Receipt size={13} className={
                      cfdi.status === 'timbrada' ? 'text-[#69A481]' : cfdi.status === 'pendiente' ? 'text-[#F7941D]' : 'text-[#7C1F31]'
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] text-[#1A1F2B]">{cfdi.folio}</p>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full',
                        cfdi.status === 'timbrada' ? 'bg-[#69A481]/15 text-[#69A481]' :
                        cfdi.status === 'pendiente' ? 'bg-[#F7941D]/15 text-[#F7941D]' :
                        'bg-[#7C1F31]/15 text-[#7C1F31]')}>
                        {cfdi.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] truncate">{cfdi.cliente} · {cfdi.concepto}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] text-[#1A1F2B]">{cfdi.total}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{cfdi.fecha}</p>
                  </div>
                  <ChevronRight size={13} className="text-[#9CA3AF]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FLUJO DE CAJA ──────────────────────────────── */}
      {tab === 'flujo' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
            <p className="text-[13px] text-[#1A1F2B] mb-5">Flujo de caja — últimos 6 meses</p>
            <div className="flex items-end gap-3 h-40">
              {FLUJO_MESES.map(f => (
                <div key={f.mes} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex flex-col justify-end h-32 gap-0.5">
                    <div className="w-full rounded-t-md bg-[#69A481] transition-all"
                      style={{ height: `${Math.round((f.ingresos / maxFlujo) * 100)}px` }} />
                  </div>
                  <div className="w-full rounded-t-md bg-[#7C1F31]/60"
                    style={{ height: `${Math.round((f.gastos / maxFlujo) * 100)}px`, marginTop: '2px' }} />
                  <span className="text-[9px] text-[#9CA3AF] mt-1">{f.mes}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#69A481]" /><span className="text-[10px] text-[#9CA3AF]">Ingresos</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#7C1F31]/60" /><span className="text-[10px] text-[#9CA3AF]">Gastos</span></div>
            </div>
          </div>

          <div className="bg-[#EFF2F9] rounded-2xl shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#D1D5DB]/20">
              <p className="text-[13px] text-[#1A1F2B]">Detalle mensual</p>
            </div>
            <div className="flex flex-col divide-y divide-[#D1D5DB]/15">
              {[...FLUJO_MESES].reverse().map(f => (
                <div key={f.mes} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-16 shrink-0">
                    <p className="text-[12px] text-[#1A1F2B]">{f.mes}</p>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-2 text-right">
                    <div>
                      <p className="text-[11px] text-[#9CA3AF]">Ingresos</p>
                      <p className="text-[13px] text-[#69A481]">${f.ingresos.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#9CA3AF]">Gastos</p>
                      <p className="text-[13px] text-[#7C1F31]">${f.gastos.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#9CA3AF]">Utilidad</p>
                      <p className="text-[13px] text-[#F7941D]">${(f.ingresos - f.gastos).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagos pendientes */}
          <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
            <p className="text-[13px] text-[#1A1F2B] mb-3">Recibos pendientes de cobro</p>
            <div className="flex flex-col gap-2">
              {MOCK_PAYMENTS.filter(p => p.status === 'pendiente' || p.status === 'vencido').map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-[#EFF2F9] rounded-xl p-3 shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]">
                  <div className={cn('w-2 h-2 rounded-full shrink-0', p.status === 'vencido' ? 'bg-[#7C1F31]' : 'bg-[#F7941D]')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1A1F2B] truncate">{p.clientName}</p>
                    <p className="text-[10px] text-[#6B7280] truncate">{p.concept}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] text-[#1A1F2B]">{p.amount}</p>
                    <p className="text-[10px] text-[#9CA3AF]">Vence {p.dueDate}</p>
                  </div>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full shrink-0',
                    p.status === 'vencido' ? 'bg-[#7C1F31]/15 text-[#7C1F31]' : 'bg-[#F7941D]/15 text-[#F7941D]')}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal CFDI Detail */}
      {cfdiDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <Receipt size={15} className="text-[#F7941D]" />
                </div>
                <div>
                  <p className="text-[14px] text-[#1A1F2B]">{cfdiDetail.folio}</p>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full',
                    cfdiDetail.status === 'timbrada' ? 'bg-[#69A481]/15 text-[#69A481]' :
                    cfdiDetail.status === 'pendiente' ? 'bg-[#F7941D]/15 text-[#F7941D]' :
                    'bg-[#7C1F31]/15 text-[#7C1F31]')}>
                    {cfdiDetail.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setCfdiDetail(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31]">
                <X size={13} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {[
                ['Cliente', cfdiDetail.cliente],
                ['Concepto', cfdiDetail.concepto],
                ['Subtotal', cfdiDetail.monto],
                ['IVA 16%', cfdiDetail.iva],
                ['Total', cfdiDetail.total],
                ['Fecha', cfdiDetail.fecha],
                ['UUID', cfdiDetail.uuid || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1.5 border-b border-[#D1D5DB]/15 last:border-0">
                  <p className="text-[11px] text-[#9CA3AF]">{k}</p>
                  <p className="text-[12px] text-[#1A1F2B] max-w-[60%] text-right truncate">{v}</p>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button className="flex-1 py-2.5 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-[12px] text-[#6B7280] flex items-center justify-center gap-1.5 hover:text-[#F7941D]">
                  <Download size={13} /> Descargar XML
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-[12px] text-[#6B7280] flex items-center justify-center gap-1.5 hover:text-[#F7941D]">
                  <Download size={13} /> Descargar PDF
                </button>
              </div>
              {cfdiDetail.status === 'timbrada' && (
                <button className="w-full py-2.5 rounded-xl border border-[#7C1F31]/30 text-[12px] text-[#7C1F31] hover:bg-[#7C1F31]/5 transition-colors">
                  Cancelar CFDI ante el SAT
                </button>
              )}
              {cfdiDetail.status === 'pendiente' && (
                <button className="w-full py-2.5 rounded-xl bg-[#F7941D] text-white text-[12px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
                  Timbrar con PAC
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Factura */}
      {newCfdi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <Plus size={15} className="text-[#F7941D]" />
                </div>
                <p className="text-[14px] text-[#1A1F2B]">Nueva factura CFDI</p>
              </div>
              <button onClick={() => setNewCfdi(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31]">
                <X size={13} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {['RFC receptor', 'Nombre/Razón social', 'Concepto', 'Monto (sin IVA)', 'Uso de CFDI', 'Método de pago', 'Forma de pago'].map(label => (
                <div key={label}>
                  <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
                  <input className="w-full bg-[#EFF2F9] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#9CA3AF]"
                    placeholder={label} />
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button onClick={() => setNewCfdi(false)} className="flex-1 py-2.5 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-[12px] text-[#6B7280]">Cancelar</button>
                <button onClick={() => setNewCfdi(false)} className="flex-1 py-2.5 rounded-xl bg-[#F7941D] text-white text-[12px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A]">Generar y timbrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
