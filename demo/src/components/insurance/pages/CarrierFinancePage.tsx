'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react'
import {
  CommissionStatus,
  commissionRecords,
  commissionStatusLabel,
  concentrationByChannel,
  formatCurrencyMXN,
  monthlyFinance,
  profitabilityByRamo,
} from '@/data/carrier-core'
import { Panel } from '@/components/insurance/CarrierUi'

const STATUS_COLOR: Record<CommissionStatus, string> = {
  pagado: '#69A481',
  pendiente: '#F7941D',
  retenido: '#7C1F31',
  en_proceso: '#6E7F8D',
}

function CfdiIcon({ emitido }: { emitido: boolean }) {
  return emitido
    ? <CheckCircle2 size={13} className="text-[#69A481] shrink-0" />
    : <XCircle size={13} className="text-[#7C1F31] shrink-0" />
}

export function CarrierFinancePage() {
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'promotoria' | 'agente'>('todos')
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'todos'>('todos')

  const current = monthlyFinance[monthlyFinance.length - 1]
  const previous = monthlyFinance[monthlyFinance.length - 2]

  const emittedMoM = ((current.emitted - previous.emitted) / previous.emitted) * 100
  const collectedMoM = ((current.collected - previous.collected) / previous.collected) * 100
  const pendingMoM = ((current.pending - previous.pending) / previous.pending) * 100
  const forecastGap = current.forecast - current.collected

  // Totales de comisiones
  const totalComisiones = commissionRecords.reduce((s, r) => s + r.comision, 0)
  const comisionesPagadas = commissionRecords.filter(r => r.status === 'pagado').reduce((s, r) => s + r.comision, 0)
  const comisionesPendientes = commissionRecords.filter(r => r.status === 'pendiente' || r.status === 'en_proceso').reduce((s, r) => s + r.comision, 0)
  const cfdiPendientes = commissionRecords.filter(r => !r.cfdiEmitido).length

  const filteredCommissions = commissionRecords.filter(r => {
    const matchTipo = tipoFilter === 'todos' || r.tipo === tipoFilter
    const matchStatus = statusFilter === 'todos' || r.status === statusFilter
    return matchTipo && matchStatus
  })

  return (
    <div className="space-y-4">

      {/* KPIs financieros principales */}
      <Panel title="Finanzas aseguradora" subtitle="Primas emitidas, cobradas, pendientes, rentabilidad y forecast operativo.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/agent/aseguradora/finanzas" className="group rounded-2xl bg-white/35 p-3 hover:bg-white/55 transition-all">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Primas emitidas</p>
              <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#F7941D] transition-colors" />
            </div>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">{formatCurrencyMXN(current.emitted)}</p>
            <p className="text-[10px]" style={{ color: emittedMoM >= 0 ? '#69A481' : '#7C1F31' }}>{emittedMoM.toFixed(1)}% mes contra mes</p>
          </Link>
          <Link href="/agent/aseguradora/billing" className="group rounded-2xl bg-white/35 p-3 hover:bg-white/55 transition-all">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Primas cobradas</p>
              <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#69A481] transition-colors" />
            </div>
            <p className="mt-1 text-[20px] text-[#69A481]">{formatCurrencyMXN(current.collected)}</p>
            <p className="text-[10px]" style={{ color: collectedMoM >= 0 ? '#69A481' : '#7C1F31' }}>{collectedMoM.toFixed(1)}% mes contra mes</p>
          </Link>
          <Link href="/agent/aseguradora/billing" className="group rounded-2xl bg-white/35 p-3 hover:bg-white/55 transition-all">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Pendientes cobranza</p>
              <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#F7941D] transition-colors" />
            </div>
            <p className="mt-1 text-[20px] text-[#F7941D]">{formatCurrencyMXN(current.pending)}</p>
            <p className="text-[10px]" style={{ color: pendingMoM <= 0 ? '#69A481' : '#7C1F31' }}>{pendingMoM.toFixed(1)}% mes contra mes</p>
          </Link>
          <Link href="/agent/aseguradora/finanzas" className="group rounded-2xl bg-white/35 p-3 hover:bg-white/55 transition-all">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Forecast de cierre</p>
              <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#1A1F2B] transition-colors" />
            </div>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">{formatCurrencyMXN(current.forecast)}</p>
            <p className="text-[10px] text-[#6E7F8D]">Gap de cierre: {formatCurrencyMXN(forecastGap)}</p>
          </Link>
        </div>
      </Panel>

      {/* KPIs de comisiones */}
      <Panel title="Comisiones — Promotorias y agentes" subtitle="Cruce de pagos de comisiones contra primas recibidas y entrega de CFDI.">
        <div className="grid gap-3 sm:grid-cols-4 mb-5">
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Total comisiones mes</p>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">{formatCurrencyMXN(totalComisiones)}</p>
            <p className="text-[10px] text-[#6E7F8D]">10 entidades · mar 2026 + feb 2026</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Comisiones pagadas</p>
            <p className="mt-1 text-[20px] text-[#69A481]">{formatCurrencyMXN(comisionesPagadas)}</p>
            <p className="text-[10px] text-[#6E7F8D]">Con CFDI emitido</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Pendiente / en proceso</p>
            <p className="mt-1 text-[20px] text-[#F7941D]">{formatCurrencyMXN(comisionesPendientes)}</p>
            <p className="text-[10px] text-[#6E7F8D]">En proceso o sin cierre</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3 flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">CFDI pendientes</p>
            <div className="flex items-center gap-2 mt-1">
              <AlertTriangle size={16} className="text-[#7C1F31]" />
              <p className="text-[20px] text-[#7C1F31]">{cfdiPendientes}</p>
            </div>
            <p className="text-[10px] text-[#6E7F8D]">Sin comprobante fiscal recibido</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(['todos', 'promotoria', 'agente'] as const).map(t => (
            <button key={t} onClick={() => setTipoFilter(t)}
              className={`rounded-full px-3 py-1 text-[10px] font-semibold transition-all ${tipoFilter === t ? 'bg-[#F7941D] text-white' : 'bg-white/35 text-[#6E7F8D] hover:bg-white/55'}`}>
              {t === 'todos' ? 'Todos' : t === 'promotoria' ? 'Promotorias' : 'Agentes'}
            </button>
          ))}
          <div className="w-px bg-[#B5BFC6]/40 mx-1" />
          {(['todos', 'pagado', 'pendiente', 'en_proceso', 'retenido'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-[10px] font-semibold transition-all ${statusFilter === s ? 'bg-[#1A1F2B] text-white' : 'bg-white/35 text-[#6E7F8D] hover:bg-white/55'}`}>
              {s === 'todos' ? 'Todos los estados' : commissionStatusLabel[s as CommissionStatus]}
            </button>
          ))}
        </div>

        {/* Tabla de comisiones */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#B5BFC6]/30 text-[10px] uppercase tracking-[0.12em] text-[#6E7F8D]">
                <th className="py-2 pr-4">Entidad</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Prima</th>
                <th className="py-2 pr-4">Comision</th>
                <th className="py-2 pr-4">% Comision</th>
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4">CFDI</th>
                <th className="py-2">Observacion</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.map(r => (
                <tr key={r.id} className="border-b border-[#B5BFC6]/15 text-[12px] hover:bg-white/35 transition-colors">
                  <td className="py-2 pr-4">
                    <p className="text-[#1A1F2B] font-medium">{r.entidad}</p>
                    <p className="text-[10px] text-[#6E7F8D]">{r.mes}</p>
                  </td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.tipo === 'promotoria' ? 'bg-[#F7941D]/10 text-[#F7941D]' : 'bg-[#1A1F2B]/10 text-[#1A1F2B]'}`}>
                      {r.tipo === 'promotoria' ? 'Promotoria' : 'Agente'}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-[#1A1F2B]">{formatCurrencyMXN(r.prima)}</td>
                  <td className="py-2 pr-4 font-semibold" style={{ color: STATUS_COLOR[r.status] }}>{formatCurrencyMXN(r.comision)}</td>
                  <td className="py-2 pr-4 text-[#6E7F8D]">{r.porcentaje}%</td>
                  <td className="py-2 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: `${STATUS_COLOR[r.status]}18`, color: STATUS_COLOR[r.status] }}>
                      {commissionStatusLabel[r.status]}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-1.5">
                      <CfdiIcon emitido={r.cfdiEmitido} />
                      {r.cfdiEmitido
                        ? <span className="text-[10px] text-[#69A481]">{r.cfdiDate}</span>
                        : <span className="text-[10px] text-[#7C1F31]">Sin CFDI</span>
                      }
                    </div>
                    {r.cfdiUuid && <p className="text-[9px] text-[#B5BFC6] mt-0.5 font-mono">{r.cfdiUuid}</p>}
                  </td>
                  <td className="py-2 text-[10px] text-[#6E7F8D]">{r.observacion ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Comparativo mensual" subtitle="Emision, cobranza y pendiente de los ultimos seis meses.">
          <div className="space-y-2">
            {monthlyFinance.map((row) => {
              const collectionRatio = row.emitted > 0 ? Math.round((row.collected / row.emitted) * 100) : 0
              return (
                <div key={row.month} className="rounded-2xl bg-white/35 p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <p className="text-[#1A1F2B]">{row.month}</p>
                    <p className="text-[#6E7F8D]">{collectionRatio}% cobrado</p>
                  </div>
                  <p className="mt-1 text-[10px] text-[#6E7F8D]">
                    Emitida {formatCurrencyMXN(row.emitted)} · Cobrada {formatCurrencyMXN(row.collected)} · Pendiente {formatCurrencyMXN(row.pending)}
                  </p>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel title="Rentabilidad por ramo" subtitle="Margen tecnico y siniestralidad para seguimiento financiero.">
          <div className="space-y-2">
            {profitabilityByRamo.map((row) => (
              <div key={row.ramo} className="rounded-2xl bg-white/35 p-3">
                <div className="flex items-center justify-between text-[11px]">
                  <p className="text-[#1A1F2B]">{row.ramo}</p>
                  <p className="text-[#69A481]">Margen {row.margin}%</p>
                </div>
                <p className="mt-1 text-[10px] text-[#6E7F8D]">Siniestralidad estimada {row.lossRatio}%</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Concentracion por canal" subtitle="Peso de cada canal comercial sobre la emision total.">
          <div className="space-y-2">
            {concentrationByChannel.map((row) => (
              <div key={row.channel} className="rounded-2xl bg-white/35 p-3">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <p className="text-[#1A1F2B]">{row.channel}</p>
                  <p className="text-[#6E7F8D]">{row.share}%</p>
                </div>
                <div className="h-2 rounded-full bg-[#B5BFC6]/35">
                  <div className="h-full rounded-full bg-[#F7941D]" style={{ width: `${row.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Alertas financieras" subtitle="Cobranza y proyeccion para toma de decision mensual.">
          <div className="space-y-2 text-[11px] text-[#1A1F2B]">
            <div className="rounded-2xl bg-white/35 p-3 flex items-start gap-2">
              <Clock size={13} className="text-[#F7941D] shrink-0 mt-0.5" />
              <p>Canal banca presenta brecha de cobranza de 19.9% respecto a forecast.</p>
            </div>
            <div className="rounded-2xl bg-white/35 p-3 flex items-start gap-2">
              <AlertTriangle size={13} className="text-[#7C1F31] shrink-0 mt-0.5" />
              <p>Bucket 61+ dias concentra {formatCurrencyMXN(current.pending * 0.27)} — requiere celda de recuperacion.</p>
            </div>
            <div className="rounded-2xl bg-white/35 p-3 flex items-start gap-2">
              <AlertTriangle size={13} className="text-[#7C1F31] shrink-0 mt-0.5" />
              <p>Ramo Auto supera umbral de siniestralidad objetivo por 3.9 puntos.</p>
            </div>
            <div className="rounded-2xl bg-white/35 p-3 flex items-start gap-2">
              <AlertTriangle size={13} className="text-[#7C1F31] shrink-0 mt-0.5" />
              <p>{cfdiPendientes} entidades sin CFDI entregado — riesgo de deducibilidad fiscal en cierre de mes.</p>
            </div>
            <div className="rounded-2xl bg-white/35 p-3 flex items-start gap-2">
              <CheckCircle2 size={13} className="text-[#69A481] shrink-0 mt-0.5" />
              <p>Forecast de cierre mantiene gap positivo de {formatCurrencyMXN(forecastGap)} contra cobranza actual.</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
