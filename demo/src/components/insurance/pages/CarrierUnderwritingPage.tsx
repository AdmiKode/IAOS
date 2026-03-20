'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileCheck2,
  Search,
  ShieldAlert,
  XCircle,
} from 'lucide-react'
import {
  formatCurrencyMXN,
  UnderwritingStatus,
  underwritingCases,
  underwritingStatusLabel,
} from '@/data/carrier-core'
import { Panel, StatusBadge } from '@/components/insurance/CarrierUi'

const STATUS_COLOR: Record<UnderwritingStatus, '#69A481' | '#7C1F31' | '#F7941D' | '#6E7F8D'> = {
  nuevo: '#6E7F8D',
  en_revision: '#F7941D',
  observado: '#7C1F31',
  aprobado: '#69A481',
  rechazado: '#7C1F31',
  pendiente_informacion: '#6E7F8D',
}

const ACTION_TARGET_STATUS: Record<'aprobar' | 'rechazar' | 'info', UnderwritingStatus> = {
  aprobar: 'aprobado',
  rechazar: 'rechazado',
  info: 'pendiente_informacion',
}

export function CarrierUnderwritingPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<UnderwritingStatus | 'todos'>('todos')
  const [selectedId, setSelectedId] = useState(underwritingCases[0]?.id)
  const [localStatus, setLocalStatus] = useState<Record<string, UnderwritingStatus>>({})

  const cases = useMemo(() => {
    return underwritingCases.filter((item) => {
      const effectiveStatus = localStatus[item.id] ?? item.status
      const matchStatus = statusFilter === 'todos' || effectiveStatus === statusFilter
      const source = `${item.id} ${item.insuredName} ${item.agentName} ${item.promotoria}`.toLowerCase()
      const matchSearch = !search.trim() || source.includes(search.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [localStatus, search, statusFilter])

  const selected = cases.find((item) => item.id === selectedId) ?? cases[0] ?? null

  function applyDecision(action: 'aprobar' | 'rechazar' | 'info') {
    if (!selected) return
    const status = ACTION_TARGET_STATUS[action]
    setLocalStatus((prev) => ({ ...prev, [selected.id]: status }))
  }

  return (
    <div className="space-y-4">
      <Panel
        title="Suscripcion / underwriting"
        subtitle="Mesa operativa para revisar expediente, score de riesgo y consistencias documentales."
      >
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {(
            ['nuevo', 'en_revision', 'observado', 'aprobado', 'rechazado', 'pendiente_informacion'] as UnderwritingStatus[]
          ).map((status) => {
            const total = underwritingCases.filter(
              (item) => (localStatus[item.id] ?? item.status) === status,
            ).length
            return (
              <button
                key={status}
                onClick={() => setStatusFilter((current) => (current === status ? 'todos' : status))}
                className="rounded-2xl bg-white/35 p-3 text-left"
              >
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">{underwritingStatusLabel[status]}</p>
                <p className="mt-1 text-[20px]" style={{ color: STATUS_COLOR[status] }}>{total}</p>
              </button>
            )
          })}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Panel
          title="Bandeja de solicitudes"
          subtitle="Expedientes entrantes con score de riesgo y alertas de inconsistencias."
          right={
            <label className="relative block w-full max-w-[260px]">
              <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7F8D]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar folio, asegurado o agente"
                className="w-full rounded-xl bg-[#EFF2F9] py-2 pl-8 pr-3 text-[11px] text-[#1A1F2B] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)] outline-none"
              />
            </label>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#B5BFC6]/30 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">
                  <th className="py-2">Folio</th>
                  <th className="py-2">Asegurado</th>
                  <th className="py-2">Canal</th>
                  <th className="py-2">Riesgo</th>
                  <th className="py-2">Inconsistencias</th>
                  <th className="py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((item) => {
                  const effectiveStatus = localStatus[item.id] ?? item.status
                  const scoreColor = item.riskScore >= 75 ? '#69A481' : item.riskScore >= 55 ? '#F7941D' : '#7C1F31'
                  const isActive = selected?.id === item.id
                  return (
                    <tr
                      key={item.id}
                      className="cursor-pointer border-b border-[#B5BFC6]/20 text-[12px] text-[#1A1F2B] hover:bg-white/35"
                      onClick={() => setSelectedId(item.id)}
                      style={{ background: isActive ? 'rgba(247,148,29,0.08)' : undefined }}
                    >
                      <td className="py-2">{item.id}</td>
                      <td className="py-2">
                        <p>{item.insuredName}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{item.product}</p>
                      </td>
                      <td className="py-2">
                        <p>{item.agentName}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{item.promotoria}</p>
                      </td>
                      <td className="py-2" style={{ color: scoreColor }}>
                        {item.riskScore}
                      </td>
                      <td className="py-2">
                        {item.inconsistencies.length ? (
                          <span className="inline-flex items-center gap-1 text-[#7C1F31] text-[11px]">
                            <AlertTriangle size={12} /> {item.inconsistencies.length}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#69A481] text-[11px]">
                            <CheckCircle2 size={12} /> 0
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        <StatusBadge color={STATUS_COLOR[effectiveStatus]} text={underwritingStatusLabel[effectiveStatus]} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Expediente estructurado" subtitle="Documentos, observaciones y decision de suscripcion.">
          {selected ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/35 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Caso seleccionado</p>
                <p className="mt-1 text-[14px] text-[#1A1F2B]">{selected.id} · {selected.insuredName}</p>
                <p className="mt-1 text-[11px] text-[#6E7F8D]">
                  {selected.ramo} · Prima anual {formatCurrencyMXN(selected.annualPremium)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Documentos</p>
                <div className="space-y-1.5">
                  {selected.documents.map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1.5 text-[#1A1F2B]">
                        <FileCheck2 size={12} />
                        {doc.name}
                      </span>
                      <StatusBadge
                        color={doc.status === 'ok' ? '#69A481' : doc.status === 'observado' ? '#F7941D' : '#7C1F31'}
                        text={doc.status}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Alertas y observaciones</p>
                <div className="space-y-1.5">
                  {selected.inconsistencies.length === 0 && (
                    <p className="text-[11px] text-[#69A481] inline-flex items-center gap-1.5">
                      <CheckCircle2 size={12} /> Sin inconsistencias detectadas.
                    </p>
                  )}
                  {selected.inconsistencies.map((issue) => (
                    <p key={issue} className="text-[11px] text-[#7C1F31] inline-flex items-center gap-1.5">
                      <ShieldAlert size={12} /> {issue}
                    </p>
                  ))}
                  {selected.observations.map((note) => (
                    <p key={note} className="text-[11px] text-[#1A1F2B] inline-flex items-center gap-1.5">
                      <Eye size={12} className="text-[#6E7F8D]" /> {note}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => applyDecision('aprobar')}
                  className="rounded-xl bg-[#69A481] px-2 py-2 text-[11px] text-white"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => applyDecision('rechazar')}
                  className="rounded-xl bg-[#7C1F31] px-2 py-2 text-[11px] text-white"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => applyDecision('info')}
                  className="rounded-xl bg-[#F7941D] px-2 py-2 text-[11px] text-white"
                >
                  Solicitar info
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-[#6E7F8D]">No hay solicitudes para el filtro seleccionado.</p>
          )}
        </Panel>
      </div>
    </div>
  )
}
