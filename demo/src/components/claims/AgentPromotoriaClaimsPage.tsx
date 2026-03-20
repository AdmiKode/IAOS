'use client'

import { useMemo, useState } from 'react'
import { Search, PhoneCall, AlertTriangle, TrendingUp } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import {
  adjusterById,
  claimsCases,
  claimsStatusLabel,
  ClaimStatus,
  riskScores,
  fraudAlerts,
  underwritingCases,
  riskLevelLabel,
  fraudLevelLabel,
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

function etaForClaim(claim: (typeof claimsCases)[number]) {
  const point =
    claim.tracking.find((tracking) => tracking.status === claim.status) ??
    claim.tracking[Math.max(0, claim.tracking.length - 2)]
  return point?.etaMinutes ?? 0
}

interface AgentPromotoriaClaimsPageProps {
  mapboxToken?: string
}

export function AgentPromotoriaClaimsPage({ mapboxToken = '' }: AgentPromotoriaClaimsPageProps) {
  const { user } = useAuth()
  const isPromotoria = user?.role === 'promotoria'

  const baseClaims = useMemo(() => {
    if (isPromotoria) {
      const byAgency = claimsCases.filter((claim) =>
        user?.agency ? claim.promotoria.toLowerCase().includes(user.agency.toLowerCase()) : true,
      )
      return byAgency.length ? byAgency : claimsCases
    }

    const byAgent = claimsCases.filter((claim) =>
      user?.name ? claim.agentName.toLowerCase().includes(user.name.toLowerCase()) : false,
    )
    if (byAgent.length) return byAgent

    const byAgency = claimsCases.filter((claim) =>
      user?.agency ? claim.promotoria.toLowerCase().includes(user.agency.toLowerCase()) : false,
    )
    return byAgency.length ? byAgency : claimsCases.slice(0, 2)
  }, [isPromotoria, user?.agency, user?.name])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'todos'>('todos')
  const [selectedId, setSelectedId] = useState(baseClaims[0]?.id)

  const rows = useMemo(() => {
    return baseClaims.filter((claim) => {
      const source = `${claim.id} ${claim.insuredName} ${claim.type} ${claim.policyId}`.toLowerCase()
      const matchesSearch = !search.trim() || source.includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'todos' || claim.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [baseClaims, search, statusFilter])

  const selected = rows.find((claim) => claim.id === selectedId) ?? rows[0] ?? null
  const selectedAdjuster = selected ? adjusterById(selected.adjusterId) : null

  const summary = useMemo(() => {
    const openClaims = baseClaims.filter((claim) => claim.status !== 'cerrado')
    const critical = baseClaims.filter((claim) => claim.elapsedMinutes > claim.slaMinutes).length
    const activeAdjusters = new Set(openClaims.map((claim) => claim.adjusterId)).size
    const avgEta = openClaims.length
      ? Math.round(openClaims.reduce((sum, claim) => sum + etaForClaim(claim), 0) / openClaims.length)
      : 0

    return {
      total: baseClaims.length,
      open: openClaims.length,
      critical,
      activeAdjusters,
      avgEta,
    }
  }, [baseClaims])

  return (
    <div className="space-y-4">
      <Panel
        title={isPromotoria ? 'Siniestros de la red' : 'Siniestros de tus clientes'}
        subtitle={
          isPromotoria
            ? 'Seguimiento ejecutivo consolidado de siniestros y ajustadores para toda la promotoria.'
            : 'Seguimiento operativo para atencion al cliente con estatus, ETA y trazabilidad del caso.'
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Total visibles</p>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">{summary.total}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Abiertos</p>
            <p className="mt-1 text-[20px] text-[#F7941D]">{summary.open}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">SLA critico</p>
            <p className="mt-1 text-[20px] text-[#7C1F31]">{summary.critical}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Ajustadores activos</p>
            <p className="mt-1 text-[20px] text-[#69A481]">{summary.activeAdjusters}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">ETA promedio</p>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">{summary.avgEta} min</p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Panel
          title="Bandeja de siniestros"
          subtitle="Estatus consolidado y seleccion de caso para seguimiento en tiempo real."
          right={
            <label className="relative block w-full max-w-[280px]">
              <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7F8D]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar siniestro o poliza"
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
                  <th className="py-2">Asegurado</th>
                  <th className="py-2">Poliza</th>
                  <th className="py-2">Ajustador</th>
                  <th className="py-2">ETA</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((claim) => {
                  const active = selected?.id === claim.id
                  const adjuster = adjusterById(claim.adjusterId)
                  const critical = claim.elapsedMinutes > claim.slaMinutes
                  return (
                    <tr
                      key={claim.id}
                      className="cursor-pointer border-b border-[#B5BFC6]/20 text-[12px] text-[#1A1F2B] hover:bg-white/35"
                      onClick={() => setSelectedId(claim.id)}
                      style={{ background: active ? 'rgba(247,148,29,0.08)' : undefined }}
                    >
                      <td className="py-2">
                        <p>{claim.id}</p>
                        <StatusBadge color={STATUS_COLOR[claim.status]} text={claimsStatusLabel[claim.status]} />
                      </td>
                      <td className="py-2">
                        <p>{claim.insuredName}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{claim.type}</p>
                      </td>
                      <td className="py-2">
                        <p>{claim.policyId}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{claim.location.city}</p>
                      </td>
                      <td className="py-2">
                        <p>{adjuster?.name ?? 'Sin asignar'}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{adjuster?.status ?? 'sin estatus'}</p>
                      </td>
                      <td className="py-2" style={{ color: critical ? '#7C1F31' : '#69A481' }}>
                        {etaForClaim(claim)} min
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Detalle y tracking" subtitle="Timeline del caso, contacto y visibilidad en mapa tipo Uber.">
          {selected ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/35 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Caso seleccionado</p>
                <p className="mt-1 text-[14px] text-[#1A1F2B]">{selected.id} · {selected.type}</p>
                <p className="text-[11px] text-[#6E7F8D]">{selected.insuredName} · {selected.policyId}</p>
              </div>

              <AdjusterRealtimeMap
                claim={selected}
                depth={isPromotoria ? 'promotoria' : 'agente'}
                mapboxToken={mapboxToken}
              />

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-white/35 p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Contacto asegurado</p>
                  <p className="mt-1 text-[11px] text-[#1A1F2B]">{selected.insuredPhone}</p>
                  <p className="text-[11px] text-[#6E7F8D]">{selected.insuredEmail}</p>
                </div>
                <div className="rounded-2xl bg-white/35 p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Ajustador asignado</p>
                  <p className="mt-1 text-[11px] text-[#1A1F2B]">{selectedAdjuster?.name ?? 'Sin asignar'}</p>
                  <p className="text-[11px] text-[#6E7F8D]">{selectedAdjuster?.phone ?? 'Sin contacto'}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Timeline</p>
                <div className="space-y-1.5">
                  {selected.timeline.map((item) => (
                    <p key={`${item.at}-${item.note}`} className="text-[11px] text-[#1A1F2B]">
                      {item.at} · {claimsStatusLabel[item.status]} · {item.note}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Evidencias</p>
                <div className="space-y-1.5">
                  {selected.evidence.map((evidence) => (
                    <p key={evidence.id} className="text-[11px] text-[#1A1F2B]">
                      {evidence.name} · {evidence.source} · {evidence.uploadedAt}
                    </p>
                  ))}
                </div>
              </div>

              {!isPromotoria && selectedAdjuster?.phone && (
                <div className="rounded-2xl border border-[#F7941D]/30 bg-[#F7941D]/10 p-3 text-[11px] text-[#1A1F2B] inline-flex items-center gap-2">
                  <PhoneCall size={12} className="text-[#F7941D]" />
                  Contacto rapido ajustador: {selectedAdjuster.phone}
                </div>
              )}

              {selected.elapsedMinutes > selected.slaMinutes && (
                <div className="rounded-2xl border border-[#7C1F31]/30 bg-[#7C1F31]/10 p-3 text-[11px] text-[#7C1F31] inline-flex items-center gap-2">
                  <AlertTriangle size={12} /> Caso fuera de SLA, requiere seguimiento prioritario.
                </div>
              )}
            </div>
          ) : (
            <p className="text-[12px] text-[#6E7F8D]">No hay siniestros para el filtro seleccionado.</p>
          )}
        </Panel>
      </div>

      {/* ─── Panel de inteligencia visible para promotoría ─────────────────── */}
      {isPromotoria && (
        <div className="grid gap-4 xl:grid-cols-2">
          {/* Solicitudes de alto riesgo de la red */}
          <Panel
            title="Expedientes observados de la red"
            subtitle="Solicitudes con inconsistencias o score de riesgo critico en tu promotoria."
            right={<TrendingUp size={14} className="text-[#F7941D]" />}
          >
            <div className="space-y-2">
              {underwritingCases
                .filter(uw => uw.inconsistencies.length > 0 || uw.riskScore < 60)
                .map(uw => {
                  const rs = riskScores.find(r => r.entityId === uw.id)
                  return (
                    <div key={uw.id} className="rounded-2xl bg-white/35 p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-[12px] text-[#1A1F2B]">{uw.insuredName}</p>
                          <p className="text-[10px] text-[#6E7F8D]">{uw.id} · {uw.agentName}</p>
                        </div>
                        {rs && (
                          <div className="text-right shrink-0">
                            <p className="text-[16px]" style={{ color: rs.riskScore >= 70 ? '#69A481' : rs.riskScore >= 50 ? '#F7941D' : '#7C1F31' }}>{rs.riskScore}</p>
                            <p className="text-[9px] text-[#6E7F8D]">Risk Score</p>
                          </div>
                        )}
                      </div>
                      {uw.inconsistencies.length > 0 && (
                        <div className="space-y-0.5">
                          {uw.inconsistencies.map((inc, i) => (
                            <p key={i} className="text-[10px] text-[#7C1F31] flex items-start gap-1">
                              <AlertTriangle size={9} className="mt-0.5 shrink-0" />
                              {inc}
                            </p>
                          ))}
                        </div>
                      )}
                      {rs?.flags && rs.flags.length > 0 && (
                        <div className="mt-1.5 space-y-0.5">
                          {rs.flags.map((f, i) => (
                            <p key={i} className="text-[10px] text-[#F7941D] flex items-start gap-1">
                              <AlertTriangle size={9} className="mt-0.5 shrink-0" />
                              {f}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              {underwritingCases.filter(uw => uw.inconsistencies.length > 0 || uw.riskScore < 60).length === 0 && (
                <p className="text-[12px] text-[#6E7F8D]">Sin expedientes observados en tu red.</p>
              )}
            </div>
          </Panel>

          {/* Alertas de fraude de la red */}
          <Panel
            title="Alertas de fraude en tu red"
            subtitle="Casos con anomalias detectadas por el motor antifraude."
            right={<AlertTriangle size={14} className="text-[#7C1F31]" />}
          >
            <div className="space-y-2">
              {fraudAlerts
                .filter(a => a.severity !== 'normal')
                .map(fa => (
                  <div key={fa.id} className="rounded-2xl bg-white/35 p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="text-[12px] text-[#1A1F2B] truncate">{fa.entityName}</p>
                        {fa.agentName && (
                          <p className="text-[10px] text-[#6E7F8D]">Agente: {fa.agentName}</p>
                        )}
                      </div>
                      <StatusBadge
                        color={fa.severity === 'riesgo_alto' || fa.severity === 'bloqueo_auditoria' ? '#7C1F31' : '#F7941D'}
                        text={fraudLevelLabel[fa.severity]}
                      />
                    </div>
                    <p className="text-[10px] text-[#6E7F8D]">{fa.description}</p>
                  </div>
                ))}
              {fraudAlerts.filter(a => a.severity !== 'normal').length === 0 && (
                <p className="text-[12px] text-[#6E7F8D]">Sin alertas activas en tu red.</p>
              )}
            </div>
          </Panel>
        </div>
      )}

      {/* ─── Vista de riesgo para agente individual ─────────────────────────── */}
      {!isPromotoria && (
        <Panel
          title="Riesgo y documentos pendientes"
          subtitle="Inconsistencias en expedientes de tus clientes que requieren accion."
          right={<TrendingUp size={14} className="text-[#F7941D]" />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {underwritingCases
              .filter(uw => uw.inconsistencies.length > 0 || uw.documents.some(d => d.status !== 'ok'))
              .slice(0, 4)
              .map(uw => (
                <div key={uw.id} className="rounded-2xl bg-white/35 p-3 space-y-2">
                  <div>
                    <p className="text-[12px] text-[#1A1F2B]">{uw.insuredName}</p>
                    <p className="text-[10px] text-[#6E7F8D]">{uw.id} · {uw.product}</p>
                  </div>
                  {uw.documents.filter(d => d.status !== 'ok').map(doc => (
                    <div key={doc.name} className="flex items-center justify-between text-[10px]">
                      <span className="text-[#1A1F2B]">{doc.name}</span>
                      <StatusBadge
                        color={doc.status === 'faltante' ? '#7C1F31' : '#F7941D'}
                        text={doc.status}
                      />
                    </div>
                  ))}
                  {uw.inconsistencies.map((inc, i) => (
                    <p key={i} className="text-[10px] text-[#F7941D] flex items-start gap-1">
                      <AlertTriangle size={9} className="mt-0.5 shrink-0" />
                      {inc}
                    </p>
                  ))}
                  <p className="text-[10px] text-[#6E7F8D] italic">Accion: corrige antes de que la solicitud sea rechazada</p>
                </div>
              ))}
            {underwritingCases.filter(uw => uw.inconsistencies.length > 0 || uw.documents.some(d => d.status !== 'ok')).length === 0 && (
              <p className="text-[12px] text-[#6E7F8D] col-span-2">Sin expedientes con documentos faltantes.</p>
            )}
          </div>
        </Panel>
      )}
    </div>
  )
}
