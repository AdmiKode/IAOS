'use client'

import { useMemo, useState } from 'react'
import {
  Download,
  RefreshCcw,
  Search,
} from 'lucide-react'
import {
  billingRecords,
  formatCurrencyMXN,
} from '@/data/carrier-core'
import { Panel, StatusBadge } from '@/components/insurance/CarrierUi'
import { exportCsvReport } from '@/lib/exportReports'

type BillingStatus = 'pagado' | 'pendiente' | 'fallido'

const STATUS_COLOR: Record<BillingStatus, '#69A481' | '#7C1F31' | '#F7941D' | '#6E7F8D'> = {
  pagado: '#69A481',
  pendiente: '#F7941D',
  fallido: '#7C1F31',
}

function daysOverdue(date: string) {
  const due = new Date(`${date}T00:00:00`)
  const now = new Date('2026-03-20T10:00:00')
  const diff = now.getTime() - due.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function CarrierBillingPage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(billingRecords[0]?.id)
  const [localStatus, setLocalStatus] = useState<Record<string, BillingStatus>>({})
  const [localFollowUp, setLocalFollowUp] = useState<Record<string, string>>({})

  const rows = useMemo(() => {
    return billingRecords.filter((row) => {
      const source = `${row.id} ${row.policyId} ${row.insuredName} ${row.agentName} ${row.promotoria}`.toLowerCase()
      return !search.trim() || source.includes(search.toLowerCase())
    })
  }, [search])

  const selected = rows.find((row) => row.id === selectedId) ?? rows[0] ?? null

  const totals = useMemo(() => {
    const expected = billingRecords.reduce((sum, row) => sum + row.expectedAmount, 0)
    const paid = billingRecords.reduce((sum, row) => sum + row.paidAmount, 0)
    const pending = expected - paid
    const failed = billingRecords
      .filter((row) => (localStatus[row.id] ?? row.status) === 'fallido')
      .reduce((sum, row) => sum + row.expectedAmount, 0)
    return { expected, paid, pending, failed }
  }, [localStatus])

  const aging = useMemo(() => {
    const buckets = {
      current: 0,
      days_1_30: 0,
      days_31_60: 0,
      days_61_plus: 0,
    }

    for (const row of billingRecords) {
      if ((localStatus[row.id] ?? row.status) === 'pagado') continue
      const overdue = daysOverdue(row.dueDate)
      if (overdue <= 0) buckets.current += row.expectedAmount
      else if (overdue <= 30) buckets.days_1_30 += row.expectedAmount
      else if (overdue <= 60) buckets.days_31_60 += row.expectedAmount
      else buckets.days_61_plus += row.expectedAmount
    }

    return buckets
  }, [localStatus])

  const channelTotals = useMemo(() => {
    const totalsByChannel: Record<string, { expected: number; paid: number }> = {}
    billingRecords.forEach((row) => {
      const key = `${row.channel}-${row.agentName}-${row.promotoria}`
      if (!totalsByChannel[key]) totalsByChannel[key] = { expected: 0, paid: 0 }
      totalsByChannel[key].expected += row.expectedAmount
      totalsByChannel[key].paid += row.paidAmount
    })
    return Object.entries(totalsByChannel)
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => b.expected - a.expected)
  }, [])

  function markFollowUp() {
    if (!selected) return
    setLocalFollowUp((prev) => ({ ...prev, [selected.id]: 'en_gestion' }))
  }

  function retryCollection() {
    if (!selected) return
    setLocalStatus((prev) => ({ ...prev, [selected.id]: 'pendiente' }))
    setLocalFollowUp((prev) => ({ ...prev, [selected.id]: 'promesa_pago' }))
  }

  function exportCollection() {
    exportCsvReport(
      rows.map((row) => ({
        cobranza_id: row.id,
        poliza: row.policyId,
        asegurado: row.insuredName,
        canal: row.channel,
        agente: row.agentName,
        promotoria: row.promotoria,
        prima_esperada: row.expectedAmount,
        prima_cobrada: row.paidAmount,
        estatus: localStatus[row.id] ?? row.status,
        seguimiento: localFollowUp[row.id] ?? row.followUp,
      })),
      'cobranza_operativa',
    )
  }

  return (
    <div className="space-y-4">
      <Panel
        title="Cobranza / billing"
        subtitle="Primas cobradas, pendientes, pagos fallidos y cargos recurrentes por canal comercial."
        right={
          <button
            onClick={exportCollection}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#F7941D] px-3 py-2 text-[11px] text-white"
          >
            <Download size={13} /> Exportar cobranza
          </button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Primas cobradas</p>
            <p className="mt-1 text-[20px] text-[#69A481]">{formatCurrencyMXN(totals.paid)}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Primas pendientes</p>
            <p className="mt-1 text-[20px] text-[#F7941D]">{formatCurrencyMXN(totals.pending)}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Pagos fallidos</p>
            <p className="mt-1 text-[20px] text-[#7C1F31]">{formatCurrencyMXN(totals.failed)}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Cargos recurrentes</p>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">
              {billingRecords.filter((row) => row.recurringCharge).length}
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Aging de cobranza" subtitle="Estados de cuenta por antiguedad de vencimiento.">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/35 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Corriente</p>
              <p className="mt-1 text-[16px] text-[#69A481]">{formatCurrencyMXN(aging.current)}</p>
            </div>
            <div className="rounded-2xl bg-white/35 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">1-30 dias</p>
              <p className="mt-1 text-[16px] text-[#F7941D]">{formatCurrencyMXN(aging.days_1_30)}</p>
            </div>
            <div className="rounded-2xl bg-white/35 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">31-60 dias</p>
              <p className="mt-1 text-[16px] text-[#F7941D]">{formatCurrencyMXN(aging.days_31_60)}</p>
            </div>
            <div className="rounded-2xl bg-white/35 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">61+ dias</p>
              <p className="mt-1 text-[16px] text-[#7C1F31]">{formatCurrencyMXN(aging.days_61_plus)}</p>
            </div>
          </div>
        </Panel>

        <Panel title="Cobranza por canal / agente / promotoria" subtitle="Concentracion de prima esperada vs cobrada.">
          <div className="space-y-2">
            {channelTotals.map((row) => {
              const ratio = row.expected > 0 ? Math.round((row.paid / row.expected) * 100) : 0
              return (
                <div key={row.key} className="rounded-2xl bg-white/35 p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <p className="text-[#1A1F2B]">{row.key}</p>
                    <p className="text-[#6E7F8D]">{ratio}%</p>
                  </div>
                  <p className="mt-1 text-[10px] text-[#6E7F8D]">
                    Esperada {formatCurrencyMXN(row.expected)} · Cobrada {formatCurrencyMXN(row.paid)}
                  </p>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Panel
          title="Operacion de cobranza"
          subtitle="Bandeja para revisar detalle de pago y seguimiento operativo."
          right={
            <label className="relative block w-full max-w-[280px]">
              <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7F8D]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar cobro, poliza o asegurado"
                className="w-full rounded-xl bg-[#EFF2F9] py-2 pl-8 pr-3 text-[11px] text-[#1A1F2B] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)] outline-none"
              />
            </label>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#B5BFC6]/30 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">
                  <th className="py-2">Cobranza</th>
                  <th className="py-2">Poliza / asegurado</th>
                  <th className="py-2">Canal</th>
                  <th className="py-2">Prima</th>
                  <th className="py-2">Estatus</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const effectiveStatus = localStatus[row.id] ?? row.status
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
                        <p>{row.policyId}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{row.insuredName}</p>
                      </td>
                      <td className="py-2">
                        <p>{row.channel}</p>
                        <p className="text-[10px] text-[#6E7F8D]">{row.agentName}</p>
                      </td>
                      <td className="py-2">{formatCurrencyMXN(row.expectedAmount)}</td>
                      <td className="py-2">
                        <StatusBadge color={STATUS_COLOR[effectiveStatus]} text={effectiveStatus} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Detalle de pago" subtitle="Acciones operativas de seguimiento y reintento.">
          {selected ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/35 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Cobranza seleccionada</p>
                <p className="mt-1 text-[14px] text-[#1A1F2B]">{selected.id} · {selected.policyId}</p>
                <p className="mt-1 text-[11px] text-[#6E7F8D]">
                  Prima esperada: {formatCurrencyMXN(selected.expectedAmount)} · Cobrada: {formatCurrencyMXN(selected.paidAmount)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/35 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Estado de cuenta</p>
                <p className="text-[11px] text-[#1A1F2B]">Asegurado: {selected.insuredName}</p>
                <p className="text-[11px] text-[#1A1F2B]">Canal: {selected.channel} · {selected.promotoria}</p>
                <p className="text-[11px] text-[#1A1F2B]">Vencimiento: {selected.dueDate}</p>
                <p className="text-[11px] text-[#1A1F2B]">Seguimiento: {localFollowUp[selected.id] ?? selected.followUp}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={markFollowUp}
                  className="rounded-xl bg-[#F7941D] px-2 py-2 text-[11px] text-white"
                >
                  Marcar seguimiento
                </button>
                <button
                  onClick={retryCollection}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#1A1F2B] px-2 py-2 text-[11px] text-white"
                >
                  <RefreshCcw size={12} /> Reintentar cobro
                </button>
                <button
                  onClick={exportCollection}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#69A481] px-2 py-2 text-[11px] text-white"
                >
                  <Download size={12} /> Exportar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-[#6E7F8D]">No hay registros para el filtro seleccionado.</p>
          )}
        </Panel>
      </div>
    </div>
  )
}
