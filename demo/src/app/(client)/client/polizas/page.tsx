'use client'
import { useState } from 'react'
import { CLIENT_POLICIES } from '@/data/mock'
import { Badge } from '@/components/ui'
import { FileText, ChevronRight, X, Download, Phone, Mail, AlertCircle } from 'lucide-react'

type Policy = typeof CLIENT_POLICIES[0]

const STATUS_MAP = {
  activa:    { label: 'Activa',    variant: 'success' as const },
  vigente:   { label: 'Vigente',   variant: 'success' as const },
  pendiente: { label: 'Pendiente', variant: 'warning' as const },
  vencida:   { label: 'Vencida',   variant: 'danger' as const },
  cancelada: { label: 'Cancelada', variant: 'danger' as const },
}

export default function ClientPolizasPage() {
  const [detail, setDetail] = useState<Policy | null>(null)
  return (
    <>
    <div className="flex flex-col gap-4 py-2">
      <div>
        <h2 className="text-[18px] text-[#1A1F2B] tracking-wide">Mis polizas</h2>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">{CLIENT_POLICIES.length} polizas contratadas</p>
      </div>

      {CLIENT_POLICIES.map(policy => {
        const st = STATUS_MAP[policy.status] || { label: policy.status, variant: 'default' as const }
        return (
          <div key={policy.id} onClick={() => setDetail(policy)}
            className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)] cursor-pointer hover:scale-[1.01] transition-transform duration-150">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7941D]/12 flex items-center justify-center">
                  <FileText size={16} className="text-[#F7941D]" />
                </div>
                <div>
                  <p className="text-[15px] text-[#1A1F2B]">{policy.type}</p>
                  <p className="text-[12px] text-[#9CA3AF]">{policy.insurer}</p>
                </div>
              </div>
              <Badge label={st.label} variant={st.variant} size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.1)]">
                <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase">No. de poliza</p>
                <p className="text-[12px] text-[#1A1F2B] mt-1">{policy.policyNumber}</p>
              </div>
              <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.1)]">
                <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase">Vencimiento</p>
                <p className="text-[12px] text-[#1A1F2B] mt-1">{policy.endDate}</p>
              </div>
              {policy.coverage && (
                <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.1)]">
                  <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase">Suma asegurada</p>
                  <p className="text-[12px] text-[#1A1F2B] mt-1">{policy.coverage}</p>
                </div>
              )}
              <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.1)]">
                <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase">Prima</p>
                <p className="text-[12px] text-[#F7941D] mt-1">{policy.premium}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-[12px] text-[#F7941D]">
              Ver detalles completos <ChevronRight size={12} />
            </div>
          </div>
        )
      })}
    </div>

      {/* Modal detalle poliza */}
      {detail && (() => {
        const st = STATUS_MAP[detail.status] || { label: detail.status, variant: 'default' as const }
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}>
            <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm p-6 shadow-[−20px_−20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setDetail(null)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors"><X size={16} /></button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F7941D]/12 flex items-center justify-center">
                  <FileText size={20} className="text-[#F7941D]" />
                </div>
                <div>
                  <p className="text-[16px] text-[#1A1F2B]">{detail.type}</p>
                  <p className="text-[12px] text-[#9CA3AF]">{detail.insurer}</p>
                </div>
                <div className="ml-auto">
                  <Badge label={st.label} variant={st.variant} size="sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'No. Poliza', val: detail.policyNumber },
                  { label: 'Prima', val: detail.premium, highlight: true },
                  { label: 'Inicio', val: (detail as any).startDate || 'N/D' },
                  { label: 'Vencimiento', val: detail.endDate },
                  ...(detail.coverage ? [{ label: 'Suma asegurada', val: detail.coverage }] : []),
                ].map(f => (
                  <div key={f.label} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.1)]">
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{f.label}</p>
                    <p className="text-[13px] mt-1" style={{ color: (f as any).highlight ? '#F7941D' : '#1A1F2B' }}>{f.val}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-[#F7941D] text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
                  <Download size={13} /> Descargar caratula
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-[#EFF2F9] text-[#6B7280] text-[13px] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-colors">
                  <AlertCircle size={13} /> Reportar siniestro
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
