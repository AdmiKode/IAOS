'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CarFront,
  Clock3,
  MapPinned,
  Navigation,
  PhoneCall,
  Route,
  ShieldAlert,
} from 'lucide-react'
import {
  adjusterById,
  claimsStatusLabel,
  ClaimCase,
  ClaimStatus,
} from '@/data/carrier-core'

type ViewDepth = 'aseguradora' | 'promotoria' | 'agente' | 'asegurado'

const STATUS_COLOR: Record<ClaimStatus, string> = {
  reportado: '#6E7F8D',
  ajustador_asignado: '#F7941D',
  en_camino: '#F7941D',
  en_sitio: '#69A481',
  inspeccion_en_curso: '#69A481',
  resolucion_preliminar: '#6E7F8D',
  cerrado: '#69A481',
}

function buildMapboxStaticUrl(token: string, centerLat: number, centerLng: number) {
  if (!token) return ''
  const zoom = 12.2
  return `https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/${centerLng},${centerLat},${zoom},0/1200x700?access_token=${token}`
}

function toPercent(value: number, min: number, max: number) {
  if (max - min < 0.000001) return 50
  return ((value - min) / (max - min)) * 100
}

function asPillColor(isCritical: boolean) {
  return isCritical
    ? 'rgba(124,31,49,0.14)'
    : 'rgba(105,164,129,0.14)'
}

interface AdjusterRealtimeMapProps {
  claim: ClaimCase
  depth: ViewDepth
  mapboxToken?: string
}

export function AdjusterRealtimeMap({ claim, depth, mapboxToken = '' }: AdjusterRealtimeMapProps) {
  const adjuster = adjusterById(claim.adjusterId)

  const initialIndex = useMemo(() => {
    const direct = claim.tracking.findIndex((point) => point.status === claim.status)
    if (direct >= 0) return direct
    return Math.max(0, claim.tracking.length - 2)
  }, [claim.status, claim.tracking])

  const [pointIndex, setPointIndex] = useState(initialIndex)

  useEffect(() => {
    setPointIndex(initialIndex)
  }, [initialIndex, claim.id])

  useEffect(() => {
    if (claim.status === 'cerrado') return
    if (pointIndex >= claim.tracking.length - 1) return

    const timer = setInterval(() => {
      setPointIndex((prev) => Math.min(prev + 1, claim.tracking.length - 1))
    }, 2500)

    return () => clearInterval(timer)
  }, [claim.status, pointIndex, claim.tracking.length])

  const currentPoint = claim.tracking[pointIndex]
  const eta = currentPoint?.etaMinutes ?? 0
  const elapsed = claim.elapsedMinutes + pointIndex * 3
  const slaCritical = elapsed > claim.slaMinutes

  const allLat = claim.tracking.map((point) => point.lat)
  const allLng = claim.tracking.map((point) => point.lng)
  allLat.push(claim.location.lat)
  allLng.push(claim.location.lng)

  const minLat = Math.min(...allLat)
  const maxLat = Math.max(...allLat)
  const minLng = Math.min(...allLng)
  const maxLng = Math.max(...allLng)

  const centerLat = (minLat + maxLat) / 2
  const centerLng = (minLng + maxLng) / 2

  const mapImage = buildMapboxStaticUrl(mapboxToken, centerLat, centerLng)

  const routePoints = claim.tracking.map((point) => {
    const x = toPercent(point.lng, minLng, maxLng)
    const y = 100 - toPercent(point.lat, minLat, maxLat)
    return `${x},${y}`
  })

  const adjusterPosition = claim.tracking[pointIndex] ?? claim.tracking[0]
  const adjusterLeft = toPercent(adjusterPosition.lng, minLng, maxLng)
  const adjusterTop = 100 - toPercent(adjusterPosition.lat, minLat, maxLat)

  const claimLeft = toPercent(claim.location.lng, minLng, maxLng)
  const claimTop = 100 - toPercent(claim.location.lat, minLat, maxLat)

  const compact = depth === 'asegurado'

  return (
    <div className="rounded-3xl bg-[#EFF2F9] p-4 md:p-5 shadow-[-10px_-10px_24px_#FAFBFF,10px_10px_24px_rgba(22,27,29,0.18)]">
      <div className="mb-3 flex flex-wrap items-center gap-2 md:gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1F2B] px-2.5 py-1 text-[10px] tracking-[0.14em] text-white uppercase">
          <Route size={12} />
          Tracking ajustador
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px]"
          style={{ background: asPillColor(slaCritical), color: slaCritical ? '#7C1F31' : '#69A481' }}
        >
          <Clock3 size={12} />
          {slaCritical ? 'SLA critico' : 'SLA en control'}
        </span>
        <span className="ml-auto text-[11px] text-[#6E7F8D]">
          ETA ajustador: <strong className="text-[#1A1F2B]">{eta} min</strong>
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[#B5BFC6]/35 bg-[#E4EBF1]">
        {mapImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mapImage}
            alt="Mapa de tracking en tiempo real"
            className="h-[280px] w-full object-cover md:h-[340px]"
          />
        ) : (
          <div className="h-[280px] w-full bg-[linear-gradient(135deg,#EFF2F9_0%,#E4EBF1_45%,#DDE5EC_100%)] md:h-[340px]" />
        )}

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <polyline
            points={routePoints.join(' ')}
            fill="none"
            stroke="#F7941D"
            strokeWidth="1.4"
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
        </svg>

        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${claimLeft}%`, top: `${claimTop}%` }}
        >
          <div className="rounded-full border border-[#7C1F31]/25 bg-[#7C1F31] px-2 py-1 text-[10px] text-white shadow-[0_4px_10px_rgba(124,31,49,0.4)]">
            SIN
          </div>
        </div>

        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-[2200ms]"
          style={{ left: `${adjusterLeft}%`, top: `${adjusterTop}%` }}
        >
          <div className="rounded-full border border-[#F7941D]/25 bg-[#F7941D] p-2 text-white shadow-[0_8px_18px_rgba(247,148,29,0.45)]">
            <CarFront size={14} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-white/35 p-3">
          <p className="mb-1 text-[10px] tracking-[0.14em] text-[#6E7F8D] uppercase">Ajustador</p>
          <p className="text-[14px] text-[#1A1F2B]">{adjuster?.name ?? 'Sin asignar'}</p>
          <p className="mt-0.5 text-[11px] text-[#6E7F8D]">
            {adjuster?.unitCode ?? 'N/A'} · {adjuster?.zone ?? 'Sin zona'}
          </p>
          {(depth === 'aseguradora' || depth === 'agente') && adjuster?.phone && (
            <p className="mt-1 text-[11px] text-[#6E7F8D] inline-flex items-center gap-1.5">
              <PhoneCall size={12} /> {adjuster.phone}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-white/35 p-3">
          <p className="mb-1 text-[10px] tracking-[0.14em] text-[#6E7F8D] uppercase">Siniestro</p>
          <p className="text-[14px] text-[#1A1F2B]">{claim.id}</p>
          <p className="mt-0.5 text-[11px] text-[#6E7F8D]">{claimsStatusLabel[currentPoint?.status ?? claim.status]}</p>
          <p className="mt-1 text-[11px] text-[#6E7F8D] inline-flex items-center gap-1.5">
            <MapPinned size={12} /> {claim.location.city}
          </p>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] tracking-[0.14em] text-[#6E7F8D] uppercase">Poliza</p>
            <p className="mt-1 text-[13px] text-[#1A1F2B]">{claim.policyId}</p>
            <p className="mt-0.5 text-[11px] text-[#6E7F8D]">{claim.insuredName}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] tracking-[0.14em] text-[#6E7F8D] uppercase">Vehiculo</p>
            <p className="mt-1 text-[13px] text-[#1A1F2B]">{claim.vehicle.plate}</p>
            <p className="mt-0.5 text-[11px] text-[#6E7F8D]">{claim.vehicle.model} · {claim.vehicle.color}</p>
          </div>
          <div className="rounded-2xl bg-white/35 p-3">
            <p className="text-[10px] tracking-[0.14em] text-[#6E7F8D] uppercase">SLA</p>
            <p className="mt-1 text-[13px] text-[#1A1F2B]">{elapsed} / {claim.slaMinutes} min</p>
            <p className="mt-0.5 text-[11px]" style={{ color: slaCritical ? '#7C1F31' : '#69A481' }}>
              {slaCritical ? 'Excedido' : 'Dentro de ventana'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl bg-white/35 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.14em] text-[#6E7F8D] uppercase">Puntos de actualizacion</p>
          <p className="text-[11px] text-[#6E7F8D] inline-flex items-center gap-1.5">
            <Navigation size={12} />
            {currentPoint?.updateLabel}
          </p>
        </div>
        <div className="space-y-2">
          {claim.tracking.slice(0, pointIndex + 1).map((point, index) => (
            <div key={point.id} className="flex items-center gap-2.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: STATUS_COLOR[point.status] }}
              />
              <p className="flex-1 text-[11px] text-[#1A1F2B]">{point.updateLabel}</p>
              <p className="text-[10px] text-[#6E7F8D]">{point.updateAt}</p>
              {index === pointIndex && (
                <span className="text-[10px] text-[#F7941D]">en vivo</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {(depth === 'aseguradora' || depth === 'promotoria') && (
        <div className="mt-4 rounded-2xl border border-[#7C1F31]/20 bg-[#7C1F31]/8 p-3 text-[11px] text-[#7C1F31] inline-flex items-center gap-2">
          <ShieldAlert size={13} />
          Ruta sugerida: mantener seguimiento por anillo de prioridad y reasignar si ETA supera 15 minutos.
        </div>
      )}
    </div>
  )
}
