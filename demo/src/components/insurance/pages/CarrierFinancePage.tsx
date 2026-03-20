import {
  concentrationByChannel,
  formatCurrencyMXN,
  monthlyFinance,
  profitabilityByRamo,
} from '@/data/carrier-core'
import { Panel } from '@/components/insurance/CarrierUi'

export function CarrierFinancePage() {
  const current = monthlyFinance[monthlyFinance.length - 1]
  const previous = monthlyFinance[monthlyFinance.length - 2]

  const emittedMoM = ((current.emitted - previous.emitted) / previous.emitted) * 100
  const collectedMoM = ((current.collected - previous.collected) / previous.collected) * 100
  const pendingMoM = ((current.pending - previous.pending) / previous.pending) * 100

  const forecastGap = current.forecast - current.collected

  return (
    <div className="space-y-4">
      <Panel title="Finanzas aseguradora" subtitle="Primas emitidas, cobradas, pendientes, rentabilidad y forecast operativo.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Primas emitidas</p>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">{formatCurrencyMXN(current.emitted)}</p>
            <p className="text-[10px]" style={{ color: emittedMoM >= 0 ? '#69A481' : '#7C1F31' }}>{emittedMoM.toFixed(1)}% mes contra mes</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Primas cobradas</p>
            <p className="mt-1 text-[20px] text-[#69A481]">{formatCurrencyMXN(current.collected)}</p>
            <p className="text-[10px]" style={{ color: collectedMoM >= 0 ? '#69A481' : '#7C1F31' }}>{collectedMoM.toFixed(1)}% mes contra mes</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Pendientes</p>
            <p className="mt-1 text-[20px] text-[#F7941D]">{formatCurrencyMXN(current.pending)}</p>
            <p className="text-[10px]" style={{ color: pendingMoM <= 0 ? '#69A481' : '#7C1F31' }}>{pendingMoM.toFixed(1)}% mes contra mes</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Forecast de cierre</p>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">{formatCurrencyMXN(current.forecast)}</p>
            <p className="text-[10px] text-[#6E7F8D]">Gap de cierre: {formatCurrencyMXN(forecastGap)}</p>
          </div>
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

        <Panel title="Rentabilidad mock por ramo" subtitle="Margen tecnico y siniestralidad para seguimiento financiero.">
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
            <p className="rounded-2xl bg-white/35 p-3">- El canal banca presenta brecha de cobranza de 19.9% respecto a forecast.</p>
            <p className="rounded-2xl bg-white/35 p-3">- El bucket de 61+ dias concentra {formatCurrencyMXN(current.pending * 0.27)} y requiere celda de recuperacion.</p>
            <p className="rounded-2xl bg-white/35 p-3">- Ramo Auto supera umbral de siniestralidad objetivo por 3.9 puntos.</p>
            <p className="rounded-2xl bg-white/35 p-3">- Forecast de cierre mantiene gap positivo de {formatCurrencyMXN(forecastGap)} contra cobranza actual.</p>
          </div>
        </Panel>
      </div>
    </div>
  )
}
