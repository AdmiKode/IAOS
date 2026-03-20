'use client'

import { useMemo, useState } from 'react'
import { Clock3, FileText, Search } from 'lucide-react'
import {
  formatCurrencyMXN,
  policyRecords,
  policyStatusLabel,
  PolicyStatus,
} from '@/data/carrier-core'
import { Panel, StatusBadge } from '@/components/insurance/CarrierUi'

const STATUS_COLOR: Record<PolicyStatus, '#69A481' | '#7C1F31' | '#F7941D' | '#6E7F8D'> = {
  activa: '#69A481',
  pendiente_pago: '#F7941D',
  cancelada: '#7C1F31',
  vencida: '#6E7F8D',
  renovada: '#69A481',
}

export function CarrierPoliciesPage() {
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | 'todas'>('todas')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(policyRecords[0]?.id)

  const rows = useMemo(() => {
    return policyRecords.filter((row) => {
      const matchStatus = statusFilter === 'todas' || row.status === statusFilter
      const source = `${row.id} ${row.insuredName} ${row.agentOrigin} ${row.promotoria}`.toLowerCase()
      const matchSearch = !search.trim() || source.includes(search.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [search, statusFilter])

  const selected = rows.find((row) => row.id === selectedId) ?? rows[0] ?? null

  return (
    <div className="space-y-4">
      <Panel title="Administracion de polizas" subtitle="Cartera, vigencias, endosos, renovaciones e historial de movimientos.">
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {(['activa', 'pendiente_pago', 'cancelada', 'vencida', 'renovada'] as PolicyStatus[]).map((status) => {
            const total = policyRecords.filter((row) => row.status === status).length
            return (
              <button
                key={status}
                onClick={() => setStatusFilter((current) => (current === status ? 'todas' : status))}
                className="rounded-2xl bg-white/35 p-3 text-left"
              >
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">{policyStatusLabel[status]}</p>
                <p className="mt-1 text-[20px]" style={{ color: STATUS_COLOR[status] }}>{total}</p>
              </button>
            )
          })}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Panel
          title="Listado de polizas"
          subtitle="Relacion con agente origen, promotoria, ramo, prima y vigencia."
          right={
            <label className="relative block w-full max-w-[280px]">
              <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7F8D]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar poliza, asegurado o canal"
                className="w-full rounded-xl bg-[#EFF2F9] py-2 pl-8 pr-3 text-[11px] text-[#1A1F2B] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)] outline-none"
              />
            </label>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#B5BFC6]/30 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">
                  <th className="py-2">Poliza</th>
                  <th className="py-2">Asegurado</th>
                  <th className="py-2">Origen</th>
                  <th className="py-2">Prima</th>
                  <th className="py-2">Vigencia</th>
                  <th className="py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const active = selected?.id === row.id
                  return (
                    <tr
                      key={row.id}
                      className="cursor-pointer border-b border-[#B5BFC6]/20 text-[12px] text-[#1A1F2B] hover:bg-white/35"
                      onClick={() => setSelectedId(row.id)}
                      style={{ background: active ? 'rgba(247,148,29,0.08)' : undefined }}
                    >
                      <td className="py-2">{row.id}</td>
                      <td className="py-2">
                        <p>{row.insuredName}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{row.ramo}</p>
                      </td>
                      <td className="py-2">
                        <p>{row.agentOrigin}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{row.promotoria}</p>
                      </td>
                      <td className="py-2">{formatCurrencyMXN(row.annualPremium)}</td>
                      <td className="py-2">
                        <p>{row.startDate}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{row.endDate}</p>
                      </td>
                      <td className="py-2">
                        <StatusBadge color={STATUS_COLOR[row.status]} text={policyStatusLabel[row.status]} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Detalle de poliza" subtitle="Endosos, renovaciones, historico y documentos relacionados.">
          {selected ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/35 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Poliza</p>
                <p className="mt-1 text-[14px] text-[#1A1F2B]">{selected.id}</p>
                <p className="mt-1 text-[11px] text-[#6E7F8D]">Cobertura: {selected.coverage}</p>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Asegurados / beneficiarios</p>
                <p className="text-[11px] text-[#1A1F2B]">Asegurado principal: {selected.insuredName}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selected.beneficiaries.map((beneficiary) => (
                    <span key={beneficiary} className="rounded-full bg-[#F7941D]/15 px-2 py-1 text-[10px] text-[#F7941D]">
                      {beneficiary}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Endosos</p>
                {selected.endorsements.length === 0 && <p className="text-[11px] text-[#6E7F8D]">Sin endosos registrados.</p>}
                <div className="space-y-2">
                  {selected.endorsements.map((endorsement) => (
                    <div key={endorsement.id} className="rounded-xl border border-[#B5BFC6]/30 bg-white/35 p-2 text-[11px]">
                      <p className="text-[#1A1F2B]">{endorsement.id} · {endorsement.type}</p>
                      <p className="text-[#6E7F8D]">{endorsement.date} · {endorsement.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Historial de movimientos</p>
                <div className="space-y-1.5">
                  {selected.movements.map((movement) => (
                    <p key={`${movement.date}-${movement.action}`} className="text-[11px] text-[#1A1F2B] inline-flex items-center gap-1.5">
                      <Clock3 size={12} className="text-[#6E7F8D]" />
                      {movement.date} · {movement.action} · {movement.actor}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Documentos</p>
                <div className="space-y-1.5">
                  {selected.documents.map((document) => (
                    <p key={document} className="text-[11px] text-[#1A1F2B] inline-flex items-center gap-1.5">
                      <FileText size={12} className="text-[#6E7F8D]" /> {document}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-[#6E7F8D]">No hay polizas para el filtro seleccionado.</p>
          )}
        </Panel>
      </div>
    </div>
  )
}
