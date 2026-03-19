'use client'
import { MOCK_POLICIES } from '@/data/mock'
import { Badge } from '@/components/ui'
import { FileText, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const STATUS_MAP = {
  activa:    { label: 'Activa',    variant: 'success' as const },
  vigente:   { label: 'Vigente',   variant: 'success' as const },
  pendiente: { label: 'Pendiente', variant: 'warning' as const },
  vencida:   { label: 'Vencida',   variant: 'danger' as const },
  cancelada: { label: 'Cancelada', variant: 'danger' as const },
}

export default function PolizasPage() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_POLICIES.filter(p =>
    p.clientName.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.policyNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Pólizas</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">{MOCK_POLICIES.length} pólizas en cartera</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
          <Plus size={15} />
          Nueva póliza
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar pólizas..."
          className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.15)] placeholder:text-[#9CA3AF]" />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(policy => {
          const status = STATUS_MAP[policy.status] || { label: policy.status, variant: 'default' as const }
          return (
            <div key={policy.id}
              className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex items-center gap-4 cursor-pointer hover:scale-[1.01] transition-transform duration-150">
              <div className="w-11 h-11 rounded-xl bg-[#F7941D]/12 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-[#F7941D]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[14px] text-[#1A1F2B] truncate">{policy.clientName}</p>
                  <Badge label={status.label} variant={status.variant} size="sm" />
                </div>
                <p className="text-[12px] text-[#6B7280] truncate">{policy.type} · {policy.insurer}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{policy.policyNumber} · Vence {policy.endDate}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] text-[#F7941D]">{policy.premium}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Prima</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
