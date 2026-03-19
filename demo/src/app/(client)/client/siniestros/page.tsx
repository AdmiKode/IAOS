'use client'
import { Shield, Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui'

export default function ClientSiniestrosPage() {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div>
        <h2 className="text-[18px] text-[#1A1F2B] tracking-wide">Siniestros</h2>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">Reportes y seguimiento de siniestros</p>
      </div>

      {/* Empty state */}
      <div className="bg-[#EFF2F9] rounded-2xl p-8 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#69A481]/12 flex items-center justify-center">
          <Shield size={28} className="text-[#69A481]" />
        </div>
        <div>
          <p className="text-[15px] text-[#1A1F2B]">Sin siniestros activos</p>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Tu protección está activa y sin reportes pendientes</p>
        </div>
        <Button variant="secondary" size="sm">
          <Plus size={13} />
          Reportar siniestro
        </Button>
      </div>

      {/* Proceso info */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.12)]">
        <h3 className="text-[14px] text-[#1A1F2B] mb-3">¿Cómo reportar un siniestro?</h3>
        {['Contacta a tu agente o usa el botón "Reportar siniestro"',
          'Describe el incidente y adjunta evidencia fotográfica',
          'Recibirás un número de caso en menos de 24 horas',
          'Seguimiento en tiempo real desde esta sección'].map((step, i) => (
          <div key={i} className="flex gap-3 mb-3 last:mb-0">
            <div className="w-6 h-6 rounded-full bg-[#F7941D] flex items-center justify-center text-white text-[11px] shrink-0 mt-0.5">{i + 1}</div>
            <p className="text-[13px] text-[#6B7280] leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
