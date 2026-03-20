'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  agentPerformance,
  formatCurrencyMXN,
  promotoriaPerformance,
} from '@/data/carrier-core'
import { Panel } from '@/components/insurance/CarrierUi'

export function CarrierNetworkPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'promotorias' | 'agentes'>('promotorias')

  const filteredPromotorias = useMemo(() => {
    return promotoriaPerformance.filter((row) =>
      row.channelName.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search])

  const filteredAgents = useMemo(() => {
    return agentPerformance.filter((row) => {
      const source = `${row.name} ${row.promotoria}`.toLowerCase()
      return source.includes(search.toLowerCase())
    })
  }, [search])

  const totals = useMemo(() => {
    const emission = promotoriaPerformance.reduce((sum, row) => sum + row.monthlyEmission, 0)
    const openClaims = promotoriaPerformance.reduce((sum, row) => sum + row.openClaims, 0)
    const avgConversion = promotoriaPerformance.reduce((sum, row) => sum + row.conversionRate, 0) / promotoriaPerformance.length
    return { emission, openClaims, avgConversion }
  }, [])

  return (
    <div className="space-y-4">
      <Panel title="Red comercial" subtitle="Desempeno por promotoria y agente: produccion, conversion, cancelaciones y siniestralidad.">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Produccion total red</p>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">{formatCurrencyMXN(totals.emission)}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Conversion promedio</p>
            <p className="mt-1 text-[20px] text-[#69A481]">{totals.avgConversion.toFixed(1)}%</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Siniestros abiertos red</p>
            <p className="mt-1 text-[20px] text-[#7C1F31]">{totals.openClaims}</p>
          </div>
        </div>
      </Panel>

      <Panel
        title="Panel corporativo de desempeno"
        subtitle="Control de calidad de expediente, tiempos de emision y siniestralidad por canal."
        right={
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-white/35 p-1">
              <button
                onClick={() => setTab('promotorias')}
                className={`rounded-lg px-3 py-1 text-[11px] ${tab === 'promotorias' ? 'bg-[#1A1F2B] text-white' : 'text-[#6E7F8D]'}`}
              >
                Promotorias
              </button>
              <button
                onClick={() => setTab('agentes')}
                className={`rounded-lg px-3 py-1 text-[11px] ${tab === 'agentes' ? 'bg-[#1A1F2B] text-white' : 'text-[#6E7F8D]'}`}
              >
                Agentes
              </button>
            </div>
            <label className="relative block w-[220px]">
              <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7F8D]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar canal"
                className="w-full rounded-xl bg-[#EFF2F9] py-2 pl-8 pr-3 text-[11px] text-[#1A1F2B] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)] outline-none"
              />
            </label>
          </div>
        }
      >
        {tab === 'promotorias' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#B5BFC6]/30 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">
                  <th className="py-2">Promotoria</th>
                  <th className="py-2">Produccion</th>
                  <th className="py-2">Conversion</th>
                  <th className="py-2">Cancelaciones</th>
                  <th className="py-2">Siniestralidad</th>
                  <th className="py-2">Calidad expediente</th>
                  <th className="py-2">Tiempo emision</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotorias.map((row) => (
                  <tr key={row.id} className="border-b border-[#B5BFC6]/20 text-[12px] text-[#1A1F2B]">
                    <td className="py-2">{row.channelName}</td>
                    <td className="py-2">{formatCurrencyMXN(row.monthlyEmission)}</td>
                    <td className="py-2" style={{ color: row.conversionRate >= 35 ? '#69A481' : '#F7941D' }}>{row.conversionRate}%</td>
                    <td className="py-2" style={{ color: row.cancellationRate > 6 ? '#7C1F31' : '#6E7F8D' }}>{row.cancellationRate}%</td>
                    <td className="py-2">{row.lossRatio}%</td>
                    <td className="py-2">{row.dossierQuality}%</td>
                    <td className="py-2">{row.avgEmissionHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'agentes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#B5BFC6]/30 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">
                  <th className="py-2">Agente</th>
                  <th className="py-2">Promotoria</th>
                  <th className="py-2">Produccion</th>
                  <th className="py-2">Conversion</th>
                  <th className="py-2">Cancelaciones</th>
                  <th className="py-2">Siniestralidad</th>
                  <th className="py-2">Calidad expediente</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((row) => (
                  <tr key={row.id} className="border-b border-[#B5BFC6]/20 text-[12px] text-[#1A1F2B]">
                    <td className="py-2">{row.name}</td>
                    <td className="py-2">{row.promotoria}</td>
                    <td className="py-2">{formatCurrencyMXN(row.monthlyEmission)}</td>
                    <td className="py-2" style={{ color: row.conversionRate >= 35 ? '#69A481' : '#F7941D' }}>{row.conversionRate}%</td>
                    <td className="py-2" style={{ color: row.cancellations > 5 ? '#7C1F31' : '#6E7F8D' }}>{row.cancellations}%</td>
                    <td className="py-2">{row.claimsRatio}%</td>
                    <td className="py-2">{row.dossierQuality}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
