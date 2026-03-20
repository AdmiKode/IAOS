'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  CalendarDays,
  FileBarChart,
  ShieldAlert,
} from 'lucide-react'
import {
  claimsCases,
  claimsSlaBoard,
  emissionByProduct,
  executiveKpis,
  formatCurrencyMXN,
  productionByChannel,
  productionByRamo,
  weeklyEmissionVsCollection,
} from '@/data/carrier-core'
import { AdjusterRealtimeMap } from '@/components/claims/AdjusterRealtimeMap'
import { Panel, TrendBadge } from '@/components/insurance/CarrierUi'

interface CarrierExecutivePageProps {
  mapboxToken?: string
}

export function CarrierExecutivePage({ mapboxToken = '' }: CarrierExecutivePageProps) {
  const maxRamo = Math.max(...productionByRamo.map((item) => item.emitted))
  const maxChannel = Math.max(...productionByChannel.map((item) => item.emitted))
  const trackedClaim = claimsCases.find((claim) => claim.status !== 'cerrado') ?? claimsCases[0]

  return (
    <div className="space-y-4">
      <Panel
        title="Resumen ejecutivo"
        subtitle="Vista corporativa de produccion, suscripcion, cartera, cobranza y siniestros."
        right={
          <div className="text-right">
            <p className="text-[10px] tracking-[0.14em] text-[#6E7F8D] uppercase">Corte operativo</p>
            <p className="text-[12px] text-[#1A1F2B] inline-flex items-center gap-1.5">
              <CalendarDays size={12} />
              {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {executiveKpis.map((kpi) => (
            <Link
              key={kpi.id}
              href={kpi.drillPath}
              className="rounded-2xl bg-white/35 p-3 transition-all hover:bg-white/50 hover:shadow-[-6px_-6px_12px_#FAFBFF,6px_6px_12px_rgba(22,27,29,0.15)]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] text-[#6E7F8D] tracking-[0.12em] uppercase">{kpi.label}</p>
                <ArrowUpRight size={12} className="text-[#F7941D]" />
              </div>
              <p className="mt-2 text-[20px] text-[#1A1F2B]">{kpi.value}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <TrendBadge trend={kpi.trend} text={kpi.delta} />
              </div>
            </Link>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Produccion por ramo" subtitle="Prima emitida y cobrada por linea de negocio.">
          <div className="space-y-3">
            {productionByRamo.map((item) => (
              <div key={item.ramo}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <p className="text-[#1A1F2B]">{item.ramo}</p>
                  <p className="text-[#6E7F8D]">{formatCurrencyMXN(item.emitted)}</p>
                </div>
                <div className="h-2 rounded-full bg-[#B5BFC6]/35">
                  <div
                    className="h-full rounded-full bg-[#F7941D]"
                    style={{ width: `${Math.round((item.emitted / maxRamo) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#6E7F8D]">
                  Cobrada: {formatCurrencyMXN(item.collected)} · Polizas: {item.policies.toLocaleString('es-MX')}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Produccion por canal" subtitle="Participacion de red comercial y canales directos.">
          <div className="space-y-3">
            {productionByChannel.map((item) => (
              <div key={item.channel}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <p className="text-[#1A1F2B]">{item.channel}</p>
                  <p className="text-[#6E7F8D]">{item.conversion}% conversion</p>
                </div>
                <div className="h-2 rounded-full bg-[#B5BFC6]/35">
                  <div
                    className="h-full rounded-full bg-[#F7941D]"
                    style={{ width: `${Math.round((item.emitted / maxChannel) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#6E7F8D]">
                  Emitida: {formatCurrencyMXN(item.emitted)} · Cobrada: {formatCurrencyMXN(item.collected)}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Primas vs cobranza" subtitle="Comparativo semanal de emision contra ingreso cobrado.">
          <div className="space-y-3">
            {weeklyEmissionVsCollection.map((row) => {
              const ratio = row.emitted > 0 ? Math.round((row.collected / row.emitted) * 100) : 0
              return (
                <div key={row.week} className="rounded-2xl bg-white/35 p-3">
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <p className="text-[#1A1F2B]">{row.week}</p>
                    <p className="text-[#6E7F8D]">{ratio}% cobrado</p>
                  </div>
                  <div className="flex gap-2 text-[11px]">
                    <span className="rounded-full bg-[#F7941D]/15 px-2 py-1 text-[#F7941D]">
                      Emision {formatCurrencyMXN(row.emitted)}
                    </span>
                    <span className="rounded-full bg-[#69A481]/15 px-2 py-1 text-[#69A481]">
                      Cobranza {formatCurrencyMXN(row.collected)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel title="Emisiones por producto" subtitle="Distribucion por producto y volumen emitido.">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#B5BFC6]/35 text-[10px] text-[#6E7F8D] uppercase tracking-[0.14em]">
                  <th className="py-2">Producto</th>
                  <th className="py-2">Aseguradora</th>
                  <th className="py-2">Emitidas</th>
                  <th className="py-2">Prima</th>
                </tr>
              </thead>
              <tbody>
                {emissionByProduct.map((row) => (
                  <tr key={row.product} className="border-b border-[#B5BFC6]/20 text-[12px] text-[#1A1F2B]">
                    <td className="py-2">{row.product}</td>
                    <td className="py-2">{row.insurer}</td>
                    <td className="py-2">{row.issued.toLocaleString('es-MX')}</td>
                    <td className="py-2">{formatCurrencyMXN(row.emitted)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="SLA de siniestros"
          subtitle="Control por etapa operativa con casos criticos."
          right={<ShieldAlert size={16} className="text-[#7C1F31]" />}
        >
          <div className="space-y-2">
            {claimsSlaBoard.map((stage) => (
              <div key={stage.stage} className="rounded-2xl bg-white/35 p-3">
                <div className="flex items-center justify-between text-[11px]">
                  <p className="text-[#1A1F2B]">{stage.stage}</p>
                  <p className="text-[#6E7F8D]">{stage.total} casos</p>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px]">
                  <span className="rounded-full bg-[#7C1F31]/15 px-2 py-1 text-[#7C1F31]">
                    Criticos: {stage.critical}
                  </span>
                  <span className="rounded-full bg-[#69A481]/15 px-2 py-1 text-[#69A481]">
                    Dentro SLA: {stage.total - stage.critical}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Mapa de actividad de ajustadores y siniestros"
          subtitle="Seguimiento en vivo del caso con mayor prioridad operativa."
          right={<FileBarChart size={16} className="text-[#F7941D]" />}
        >
          <AdjusterRealtimeMap claim={trackedClaim} depth="aseguradora" mapboxToken={mapboxToken} />
        </Panel>
      </div>
    </div>
  )
}
