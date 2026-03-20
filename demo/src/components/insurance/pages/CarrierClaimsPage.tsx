'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  FileText,
  Search,
} from 'lucide-react'
import Link from 'next/link'
import {
  adjusterById,
  claimsCases,
  claimsFinancialKpis,
  claimsStatusLabel,
  ClaimStatus,
} from '@/data/carrier-core'
import { AdjusterRealtimeMap } from '@/components/claims/AdjusterRealtimeMap'
import { Panel, StatusBadge } from '@/components/insurance/CarrierUi'

const STATUS_COLOR: Record<ClaimStatus, '#69A481' | '#7C1F31' | '#F7941D' | '#6E7F8D'> = {
  reportado: '#6E7F8D',
  ajustador_asignado: '#F7941D',
  en_camino: '#F7941D',
  en_sitio: '#69A481',
  inspeccion_en_curso: '#69A481',
  resolucion_preliminar: '#6E7F8D',
  cerrado: '#69A481',
}

const CLAIM_STATUS_ORDER: ClaimStatus[] = [
  'reportado',
  'ajustador_asignado',
  'en_camino',
  'en_sitio',
  'inspeccion_en_curso',
  'resolucion_preliminar',
  'cerrado',
]

interface CarrierClaimsPageProps {
  mapboxToken?: string
}

export function CarrierClaimsPage({ mapboxToken = '' }: CarrierClaimsPageProps) {
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'todos'>('todos')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(claimsCases[0]?.id)

  const rows = useMemo(() => {
    return claimsCases.filter((row) => {
      const matchStatus = statusFilter === 'todos' || row.status === statusFilter
      const source = `${row.id} ${row.type} ${row.insuredName} ${row.policyId} ${row.agentName} ${row.promotoria}`.toLowerCase()
      const matchSearch = !search.trim() || source.includes(search.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [search, statusFilter])

  const selected = rows.find((row) => row.id === selectedId) ?? rows[0] ?? null
  const selectedAdjuster = selected ? adjusterById(selected.adjusterId) : null

  return (
    <div className="space-y-4">
      <Panel title="Siniestros" subtitle="Claims center financiero: reservas, pagos, siniestralidad y seguimiento en tiempo real.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {claimsFinancialKpis.map((kpi) => (
            <Link key={kpi.label} href={kpi.drillPath}
              className="group rounded-2xl bg-white/35 p-3 flex flex-col gap-1 hover:bg-white/55 transition-all"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">{kpi.label}</p>
                <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#F7941D] transition-colors" />
              </div>
              <p className="text-[20px] leading-none" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-[10px] text-[#6E7F8D]">{kpi.sub}</p>
            </Link>
          ))}
        </div>
      </Panel>

      <Panel
        title="Bandeja de siniestros"
        subtitle="Operacion por estado: reporte, asignacion, traslado, inspeccion y resolucion."
        right={
          <label className="relative block w-full max-w-[280px]">
            <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7F8D]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar siniestro, poliza o asegurado"
              className="w-full rounded-xl bg-[#EFF2F9] py-2 pl-8 pr-3 text-[11px] text-[#1A1F2B] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)] outline-none"
            />
          </label>
        }
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {CLAIM_STATUS_ORDER.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter((current) => (current === status ? 'todos' : status))}
            >
              <StatusBadge color={STATUS_COLOR[status]} text={claimsStatusLabel[status]} />
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#B5BFC6]/30 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">
                <th className="py-2">Siniestro</th>
                <th className="py-2">Tipo / fecha</th>
                <th className="py-2">Poliza / asegurado</th>
                <th className="py-2">Ubicacion</th>
                <th className="py-2">Ajustador</th>
                <th className="py-2">SLA</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const active = selected?.id === row.id
                const adjuster = adjusterById(row.adjusterId)
                const slaCritical = row.elapsedMinutes > row.slaMinutes
                return (
                  <tr
                    key={row.id}
                    className="cursor-pointer border-b border-[#B5BFC6]/20 text-[12px] text-[#1A1F2B] hover:bg-white/35"
                    onClick={() => setSelectedId(row.id)}
                    style={{ background: active ? 'rgba(247,148,29,0.08)' : undefined }}
                  >
                    <td className="py-2">
                      <p>{row.id}</p>
                      <StatusBadge color={STATUS_COLOR[row.status]} text={claimsStatusLabel[row.status]} />
                    </td>
                    <td className="py-2">
                      <p>{row.type}</p>
                      <p className="text-[10px] text-[#6E7F8D]">{row.reportedAt}</p>
                    </td>
                    <td className="py-2">
                      <p>{row.policyId}</p>
                      <p className="text-[10px] text-[#6E7F8D]">{row.insuredName}</p>
                    </td>
                    <td className="py-2">
                      <p>{row.location.city}</p>
                      <p className="text-[10px] text-[#6E7F8D]">{row.location.address}</p>
                    </td>
                    <td className="py-2">
                      <p>{adjuster?.name ?? 'Sin asignar'}</p>
                      <p className="text-[10px] text-[#6E7F8D]">{adjuster?.status ?? 'N/A'}</p>
                    </td>
                    <td className="py-2">
                      <p style={{ color: slaCritical ? '#7C1F31' : '#69A481' }}>
                        {row.elapsedMinutes}/{row.slaMinutes} min
                      </p>
                      {slaCritical && (
                        <p className="text-[10px] text-[#7C1F31] inline-flex items-center gap-1">
                          <AlertTriangle size={11} /> critico
                        </p>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {selected && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Panel title="Tracking de ajustador en tiempo real" subtitle="Vista operativa completa con ETA, ruta y puntos de actualizacion.">
            <AdjusterRealtimeMap claim={selected} depth="aseguradora" mapboxToken={mapboxToken} />
          </Panel>

          <Panel title="Detalle del caso" subtitle="Timeline, vehiculo, contacto, evidencia y observaciones.">
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/35 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Datos del siniestro</p>
                <p className="mt-1 text-[14px] text-[#1A1F2B]">{selected.id} · {selected.type}</p>
                <p className="mt-1 text-[11px] text-[#6E7F8D]">Poliza {selected.policyId} · {selected.insuredName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-white/35 p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Vehiculo</p>
                  <p className="mt-1 text-[12px] text-[#1A1F2B]">{selected.vehicle.plate}</p>
                  <p className="text-[11px] text-[#6E7F8D]">{selected.vehicle.model} · {selected.vehicle.color}</p>
                </div>
                <div className="rounded-2xl bg-white/35 p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Contacto</p>
                  <p className="mt-1 text-[12px] text-[#1A1F2B]">{selected.insuredPhone}</p>
                  <p className="text-[11px] text-[#6E7F8D]">{selected.insuredEmail}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Timeline</p>
                <div className="space-y-2">
                  {selected.timeline.map((item) => (
                    <div key={`${item.at}-${item.note}`} className="text-[11px] text-[#1A1F2B]">
                      <StatusBadge color={STATUS_COLOR[item.status]} text={claimsStatusLabel[item.status]} />
                      <p className="mt-1">{item.at} · {item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Evidencia y documentos</p>
                <div className="space-y-1.5">
                  {selected.evidence.map((evidence) => (
                    <p key={evidence.id} className="text-[11px] text-[#1A1F2B] inline-flex items-center gap-1.5">
                      <FileText size={12} className="text-[#6E7F8D]" /> {evidence.name} · {evidence.source}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Observaciones del ajustador</p>
                <div className="space-y-1.5">
                  {selected.notes.map((note) => (
                    <p key={note} className="text-[11px] text-[#1A1F2B]">• {note}</p>
                  ))}
                  {selectedAdjuster && (
                    <p className="text-[11px] text-[#6E7F8D]">
                      Ajustador asignado: {selectedAdjuster.name} ({selectedAdjuster.phone})
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}
