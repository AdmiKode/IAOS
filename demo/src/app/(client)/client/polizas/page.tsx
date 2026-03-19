'use client'
import { CLIENT_POLICIES } from '@/data/mock'
import { Badge } from '@/components/ui'
import { FileText, ChevronRight } from 'lucide-react'

const STATUS_MAP = {
  activa:    { label: 'Activa',    variant: 'success' as const },
  vigente:   { label: 'Vigente',   variant: 'success' as const },
  pendiente: { label: 'Pendiente', variant: 'warning' as const },
  vencida:   { label: 'Vencida',   variant: 'danger' as const },
  cancelada: { label: 'Cancelada', variant: 'danger' as const },
}

export default function ClientPolizasPage() {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div>
        <h2 className="text-[18px] text-[#1A1F2B] tracking-wide">Mis pólizas</h2>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">{CLIENT_POLICIES.length} pólizas contratadas</p>
      </div>

      {CLIENT_POLICIES.map(policy => {
        const st = STATUS_MAP[policy.status] || { label: policy.status, variant: 'default' as const }
        return (
          <div key={policy.id}
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
                <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase">No. de póliza</p>
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
  )
}
