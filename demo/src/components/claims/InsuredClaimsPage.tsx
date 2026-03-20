'use client'

import { useMemo, useState } from 'react'
import { PhoneCall, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { adjusterById, claimsCases, claimsStatusLabel } from '@/data/carrier-core'
import { AdjusterRealtimeMap } from '@/components/claims/AdjusterRealtimeMap'
import { Panel } from '@/components/insurance/CarrierUi'

interface InsuredClaimsPageProps {
  mapboxToken?: string
}

export function InsuredClaimsPage({ mapboxToken = '' }: InsuredClaimsPageProps) {
  const { user } = useAuth()

  const myClaims = useMemo(() => {
    const byName = claimsCases.filter((claim) =>
      user?.name ? claim.insuredName.toLowerCase().includes(user.name.toLowerCase()) : false,
    )
    return byName.length ? byName : claimsCases.slice(0, 2)
  }, [user?.name])

  const [selectedId, setSelectedId] = useState(myClaims[0]?.id)
  const selected = myClaims.find((claim) => claim.id === selectedId) ?? myClaims[0] ?? null
  const adjuster = selected ? adjusterById(selected.adjusterId) : null

  return (
    <div className="space-y-4 py-2">
      <Panel
        title="Siniestros"
        subtitle="Seguimiento simplificado de tu reporte con estatus, ajustador asignado y llegada estimada."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Reportes visibles</p>
            <p className="mt-1 text-[20px] text-[#1A1F2B]">{myClaims.length}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Estatus actual</p>
            <p className="mt-1 text-[14px] text-[#F7941D]">{selected ? claimsStatusLabel[selected.status] : 'Sin reporte'}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Ajustador</p>
            <p className="mt-1 text-[14px] text-[#1A1F2B]">{adjuster?.name ?? 'Pendiente'}</p>
          </div>
        </div>
      </Panel>

      {selected && (
        <>
          <Panel title="Tracking del ajustador" subtitle="Vista en tiempo real tipo Uber con ETA y ruta sugerida.">
            <AdjusterRealtimeMap claim={selected} depth="asegurado" mapboxToken={mapboxToken} />
          </Panel>

          <Panel title="Detalle de tu caso" subtitle="Informacion esencial del siniestro y medios de contacto.">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white/35 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Siniestro</p>
                <p className="mt-1 text-[13px] text-[#1A1F2B]">{selected.id}</p>
                <p className="text-[11px] text-[#6E7F8D]">Poliza {selected.policyId}</p>
                <p className="text-[11px] text-[#6E7F8D]">{selected.type}</p>
              </div>
              <div className="rounded-2xl bg-white/35 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Contacto</p>
                <p className="mt-1 text-[11px] text-[#1A1F2B] inline-flex items-center gap-1.5">
                  <PhoneCall size={12} className="text-[#F7941D]" /> {adjuster?.phone ?? 'Sin telefono de ajustador'}
                </p>
                <p className="text-[11px] text-[#6E7F8D]">Aseguradora 800-123-4567</p>
                <p className="text-[11px] text-[#6E7F8D]">Agente: {selected.agentName}</p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-white/35 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Progreso</p>
              <div className="space-y-1.5">
                {selected.timeline.map((item) => (
                  <p key={`${item.at}-${item.note}`} className="text-[11px] text-[#1A1F2B]">
                    {item.at} · {claimsStatusLabel[item.status]} · {item.note}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-[#69A481]/30 bg-[#69A481]/10 p-3 text-[11px] text-[#1A1F2B] inline-flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#69A481]" />
              Mantente disponible por telefono. Tu ajustador notificara cada cambio de estatus.
            </div>
          </Panel>

          <Panel title="Tus siniestros" subtitle="Selecciona un folio para revisar su seguimiento.">
            <div className="grid gap-2 sm:grid-cols-2">
              {myClaims.map((claim) => (
                <button
                  key={claim.id}
                  onClick={() => setSelectedId(claim.id)}
                  className="rounded-2xl bg-white/35 p-3 text-left"
                  style={{
                    outline: selected?.id === claim.id ? '1px solid rgba(247,148,29,0.45)' : 'none',
                  }}
                >
                  <p className="text-[12px] text-[#1A1F2B]">{claim.id}</p>
                  <p className="text-[11px] text-[#6E7F8D]">{claim.type}</p>
                  <p className="mt-1 text-[11px] text-[#F7941D]">{claimsStatusLabel[claim.status]}</p>
                </button>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  )
}
