'use client'

import { useMemo, useState } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import {
  agentPerformance,
  billingRecords,
  claimsCases,
  claimsStatusLabel,
  formatCurrencyMXN,
  monthlyFinance,
  policyRecords,
  productionByRamo,
  promotoriaPerformance,
  reportsCatalog,
  underwritingCases,
} from '@/data/carrier-core'
import { Panel } from '@/components/insurance/CarrierUi'
import {
  exportCsvReport,
  exportExcelReport,
  exportPdfReport,
  ReportRow,
} from '@/lib/exportReports'

function rowsForReport(reportId: string): ReportRow[] {
  switch (reportId) {
    case 'RP-01':
      return productionByRamo.map((row) => ({
        ramo: row.ramo,
        prima_emitida: row.emitted,
        prima_cobrada: row.collected,
        polizas: row.policies,
      }))
    case 'RP-02':
      return promotoriaPerformance.map((row) => ({
        promotoria: row.channelName,
        produccion: row.monthlyEmission,
        conversion: row.conversionRate,
        cancelaciones: row.cancellationRate,
        siniestralidad: row.lossRatio,
      }))
    case 'RP-03':
      return agentPerformance.map((row) => ({
        agente: row.name,
        promotoria: row.promotoria,
        produccion: row.monthlyEmission,
        conversion: row.conversionRate,
        cancelaciones: row.cancellations,
      }))
    case 'RP-04':
      return underwritingCases.map((row) => ({
        folio: row.id,
        asegurado: row.insuredName,
        ramo: row.ramo,
        score_riesgo: row.riskScore,
        inconsistencias: row.inconsistencies.length,
        estatus: row.status,
      }))
    case 'RP-05':
      return policyRecords.map((row) => ({
        poliza: row.id,
        asegurado: row.insuredName,
        ramo: row.ramo,
        prima_anual: row.annualPremium,
        estatus: row.status,
      }))
    case 'RP-06':
      return billingRecords.map((row) => ({
        cobranza: row.id,
        poliza: row.policyId,
        asegurado: row.insuredName,
        esperado: row.expectedAmount,
        cobrado: row.paidAmount,
        estatus: row.status,
      }))
    case 'RP-07':
      return claimsCases.map((row) => ({
        siniestro: row.id,
        tipo: row.type,
        poliza: row.policyId,
        asegurado: row.insuredName,
        estatus: claimsStatusLabel[row.status],
      }))
    case 'RP-08':
      return claimsCases.map((row) => ({
        siniestro: row.id,
        estatus: claimsStatusLabel[row.status],
        sla_objetivo_min: row.slaMinutes,
        tiempo_transcurrido_min: row.elapsedMinutes,
        desvio_min: row.elapsedMinutes - row.slaMinutes,
      }))
    case 'RP-09':
      return policyRecords
        .filter((row) => row.status === 'renovada' || row.status === 'vencida')
        .map((row) => ({
          poliza: row.id,
          asegurado: row.insuredName,
          inicio: row.startDate,
          fin: row.endDate,
          estatus: row.status,
        }))
    case 'RP-10':
      return policyRecords
        .filter((row) => row.status === 'cancelada')
        .map((row) => ({
          poliza: row.id,
          asegurado: row.insuredName,
          ramo: row.ramo,
          prima_anual: row.annualPremium,
          estatus: row.status,
        }))
    default:
      return monthlyFinance.map((row) => ({
        mes: row.month,
        emitida: row.emitted,
        cobrada: row.collected,
        pendiente: row.pending,
      }))
  }
}

export function CarrierReportsPage() {
  const [selectedReport, setSelectedReport] = useState(reportsCatalog[0])

  const rows = useMemo(() => rowsForReport(selectedReport.id), [selectedReport.id])

  function exportCsv() {
    exportCsvReport(rows, selectedReport.name)
  }

  function exportExcel() {
    exportExcelReport(rows, selectedReport.name)
  }

  function exportPdf() {
    exportPdfReport(rows, selectedReport.name, selectedReport.name)
  }

  return (
    <div className="space-y-4">
      <Panel title="Reportes y exportacion" subtitle="Descarga operativa en CSV, Excel y PDF para produccion, suscripcion, cartera, cobranza y siniestros.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {reportsCatalog.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="rounded-2xl bg-white/35 p-3 text-left hover:bg-white/50"
              style={{
                outline: selectedReport.id === report.id ? '1px solid rgba(247,148,29,0.45)' : 'none',
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">{report.group}</p>
              <p className="mt-1 text-[14px] text-[#1A1F2B]">{report.name}</p>
              <p className="mt-1 text-[11px] text-[#6E7F8D]">{report.rows} filas base</p>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Panel title="Vista previa" subtitle={`${selectedReport.name} · ${rows.length} registros listos para exportar.`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#B5BFC6]/30 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">
                  {Object.keys(rows[0] ?? { dato: 'sin_datos' }).map((header) => (
                    <th key={header} className="py-2">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b border-[#B5BFC6]/20 text-[12px] text-[#1A1F2B]">
                    {Object.values(row).map((value, valueIndex) => (
                      <td key={valueIndex} className="py-2">
                        {typeof value === 'number' && value > 1_000 ? formatCurrencyMXN(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Exportacion" subtitle="Genera archivo para auditoria, conciliacion o distribucion ejecutiva.">
          <div className="space-y-3">
            <button
              onClick={exportCsv}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F7941D] px-3 py-2 text-[12px] text-white"
            >
              <Download size={14} /> Exportar CSV
            </button>
            <button
              onClick={exportExcel}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1F2B] px-3 py-2 text-[12px] text-white"
            >
              <FileSpreadsheet size={14} /> Exportar Excel
            </button>
            <button
              onClick={exportPdf}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#69A481] px-3 py-2 text-[12px] text-white"
            >
              <FileText size={14} /> Exportar PDF
            </button>

            <div className="rounded-2xl bg-white/35 p-3 text-[11px] text-[#1A1F2B]">
              <p>- El CSV mantiene formato plano para carga en BI o SQL.</p>
              <p>- El Excel genera tabla tabular para uso administrativo.</p>
              <p>- El PDF incluye resumen en una hoja para comites.</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
