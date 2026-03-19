'use client'
import { useEffect, useRef, useState } from 'react'
import { MOCK_LEADS, MOCK_CHART_DATA } from '@/data/mock'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

// ─── Datos por ramo ───────────────────────────────────────────────────────────
const RAMOS = [
  { label: 'GMM',   color: '#F7941D', key: 'GMM' },
  { label: 'Auto',  color: '#69A481', key: 'Auto' },
  { label: 'Vida',  color: '#7C1F31', key: 'Vida' },
  { label: 'Daños', color: '#6E7F8D', key: 'Daños' },
  { label: 'Hogar', color: '#B5BFC6', key: 'Hogar' },
  { label: 'RC',    color: '#9CA3AF', key: 'RC' },
]

function countByRamo(leads: typeof MOCK_LEADS) {
  const counts: Record<string, number> = {}
  for (const l of leads) {
    const ramo = RAMOS.find(r => l.ramo?.includes(r.key))?.key || 'Otros'
    counts[ramo] = (counts[ramo] || 0) + 1
  }
  return counts
}

// ─── Donut animado (SVG puro, sin librerías) ──────────────────────────────────
function AnimatedDonut({ data, total }: { data: { label: string; color: string; count: number }[]; total: number }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const R = 60
  const STROKE = 14
  const C = 2 * Math.PI * R
  const cx = 90
  const cy = 90

  // Calcular offsets acumulativos
  let offset = 0
  const segments = data.map((d) => {
    const pct = total > 0 ? d.count / total : 0
    const dash = animated ? pct * C : 0
    const gap = C - dash
    const seg = { ...d, pct, dash, gap, offset }
    offset += pct * C
    return seg
  })

  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <svg ref={ref} width={180} height={180} viewBox="0 0 180 180">
        {/* Track */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(22,27,29,0.07)" strokeWidth={STROKE} />

        {segments.map((seg, i) => (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={-seg.offset}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: 'rotate(-90deg)',
              transition: `stroke-dasharray ${0.6 + i * 0.12}s cubic-bezier(0.34,1.56,0.64,1)`,
              filter: `drop-shadow(0 0 4px ${seg.color}55)`,
            }}
          />
        ))}
      </svg>
      {/* Centro */}
      <div className="absolute flex flex-col items-center">
        <span className="text-[22px] text-[#1A1F2B] leading-none">{total}</span>
        <span className="text-[10px] text-[#9CA3AF] tracking-widest uppercase mt-0.5">leads</span>
      </div>
    </div>
  )
}

// ─── Barra animada individual ─────────────────────────────────────────────────
function AnimatedBar({ label, count, max, color, delay }: { label: string; count: number; max: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(count / max), 300 + delay)
    return () => clearTimeout(t)
  }, [count, max, delay])

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-[#6B7280] w-10 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-[10px] rounded-full overflow-hidden" style={{ background: 'rgba(22,27,29,0.06)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${width * 100}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            transition: `width 0.8s cubic-bezier(0.34,1.2,0.64,1)`,
            boxShadow: `0 0 6px ${color}55`,
          }}
        />
      </div>
      <span className="text-[11px] font-medium w-4 shrink-0" style={{ color }}>{count}</span>
    </div>
  )
}

// ─── Tooltip personalizado para Recharts ──────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#EFF2F9] rounded-xl px-3 py-2 text-[11px] shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] border border-white/60">
      <p className="text-[#9CA3AF] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name === 'primas' ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── Bloque principal ─────────────────────────────────────────────────────────
export function ChartsBlock() {
  const counts = countByRamo(MOCK_LEADS)
  const total = MOCK_LEADS.length
  const max = Math.max(...RAMOS.map(r => counts[r.key] || 0), 1)

  const ramoData = RAMOS.map(r => ({
    ...r,
    count: counts[r.key] || 0,
  })).filter(r => r.count > 0)

  // Datos de barras mensuales enriquecidos
  const barData = MOCK_CHART_DATA.map(d => ({
    ...d,
    primasK: Math.round(d.primas / 1000),
  }))

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

      {/* ── 1. Donut: cartera por tipo de seguro ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] flex flex-col gap-4">
        <div>
          <p className="text-[13px] text-[#1A1F2B] tracking-wide">Cartera por ramo</p>
          <p className="text-[11px] text-[#9CA3AF]">Distribución de leads activos</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatedDonut data={ramoData} total={total} />
          <div className="flex flex-col gap-2 flex-1">
            {ramoData.map(r => (
              <div key={r.key} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color, boxShadow: `0 0 4px ${r.color}` }} />
                <span className="text-[11px] text-[#6B7280] flex-1">{r.label}</span>
                <span className="text-[11px] font-medium" style={{ color: r.color }}>{r.count}</span>
                <span className="text-[10px] text-[#9CA3AF]">{Math.round((r.count / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Barras animadas horizontales ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] flex flex-col gap-4">
        <div>
          <p className="text-[13px] text-[#1A1F2B] tracking-wide">Leads por ramo</p>
          <p className="text-[11px] text-[#9CA3AF]">Captación acumulada · pipeline activo</p>
        </div>
        <div className="flex flex-col gap-3 flex-1 justify-center">
          {ramoData.map((r, i) => (
            <AnimatedBar
              key={r.key}
              label={r.label}
              count={r.count}
              max={max}
              color={r.color}
              delay={i * 80}
            />
          ))}
        </div>
        {/* Mini stat */}
        <div className="mt-2 pt-3 border-t border-[#D1D5DB]/40 flex items-center justify-between">
          <span className="text-[11px] text-[#9CA3AF]">Ramo líder</span>
          <span className="text-[12px] font-medium text-[#F7941D]">
            {ramoData.sort((a, b) => b.count - a.count)[0]?.label} · {ramoData.sort((a, b) => b.count - a.count)[0]?.count} leads
          </span>
        </div>
      </div>

      {/* ── 3. Área + Barras: producción mensual ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] flex flex-col gap-4">
        <div>
          <p className="text-[13px] text-[#1A1F2B] tracking-wide">Producción mensual</p>
          <p className="text-[11px] text-[#9CA3AF]">Primas emitidas · MXN miles</p>
        </div>

        <div className="flex-1" style={{ height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={18}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F7941D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#F7941D" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(247,148,29,0.06)', radius: 6 }} />
              <Bar dataKey="primasK" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out">
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === barData.length - 1 ? '#F7941D' : 'rgba(247,148,29,0.25)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tendencia */}
        <div className="pt-2 border-t border-[#D1D5DB]/40 flex items-center justify-between">
          <span className="text-[11px] text-[#9CA3AF]">vs mes anterior</span>
          <span className="text-[12px] font-medium text-[#69A481]">↑ +11.7%</span>
        </div>
      </div>

    </div>
  )
}

// ─── Nuevo ingreso animado (clientes por ramo en el tiempo) ───────────────────
export function GrowthRingChart() {
  const [phase, setPhase] = useState(0)

  // Simular clientes nuevos entrando en tiempo real
  const baseData = [
    { label: 'GMM',   color: '#F7941D', base: 89,  new: 12 },
    { label: 'Auto',  color: '#69A481', base: 64,  new: 8  },
    { label: 'Vida',  color: '#7C1F31', base: 41,  new: 5  },
    { label: 'Daños', color: '#6E7F8D', base: 33,  new: 7  },
    { label: 'Hogar', color: '#B5BFC6', base: 20,  new: 3  },
  ]

  const totalBase = baseData.reduce((s, d) => s + d.base, 0)
  const totalNew = baseData.reduce((s, d) => s + d.new, 0)

  // Animar la entrada de nuevos clientes en fases
  useEffect(() => {
    const t = setInterval(() => {
      setPhase(p => (p < 3 ? p + 1 : p))
    }, 1200)
    return () => clearInterval(t)
  }, [])

  const R = [72, 56, 40]
  const STROKES = [12, 10, 8]
  const cx = 100
  const cy = 100

  // 3 anillos: total acumulado, nuevos este mes, objetivo
  const rings = [
    { label: 'Cartera total', value: totalBase + (phase > 0 ? totalNew : 0), max: 300, color: '#F7941D' },
    { label: 'Nuevos este mes', value: phase > 1 ? totalNew : 0, max: 60, color: '#69A481' },
    { label: 'Meta mensual', value: phase > 2 ? 42 : 0, max: 60, color: '#9CA3AF' },
  ]

  return (
    <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)]">
      <div className="mb-4">
        <p className="text-[13px] text-[#1A1F2B] tracking-wide">Crecimiento de cartera</p>
        <p className="text-[11px] text-[#9CA3AF]">Nuevos clientes integrándose · en vivo</p>
      </div>

      <div className="flex gap-6 items-center">
        {/* Anillos concéntricos */}
        <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
          <svg width={200} height={200} viewBox="0 0 200 200">
            {rings.map((ring, i) => {
              const r = R[i]
              const stroke = STROKES[i]
              const C = 2 * Math.PI * r
              const pct = Math.min(ring.value / ring.max, 1)
              const dash = pct * C
              return (
                <g key={ring.label}>
                  {/* Track */}
                  <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(22,27,29,0.07)" strokeWidth={stroke} />
                  {/* Fill */}
                  <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke={ring.color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${C - dash}`}
                    strokeDashoffset={C / 4}
                    style={{
                      transformOrigin: `${cx}px ${cy}px`,
                      transform: 'rotate(-90deg)',
                      transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.2,0.64,1)',
                      filter: `drop-shadow(0 0 5px ${ring.color}66)`,
                    }}
                  />
                </g>
              )
            })}
          </svg>
          {/* Centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[26px] text-[#1A1F2B] leading-none">{totalBase + (phase > 0 ? totalNew : 0)}</span>
            <span className="text-[10px] text-[#9CA3AF] tracking-widest uppercase">clientes</span>
          </div>
        </div>

        {/* Leyenda + desglose */}
        <div className="flex flex-col gap-3 flex-1">
          {rings.map((ring, i) => (
            <div key={ring.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: ring.color, boxShadow: `0 0 5px ${ring.color}` }} />
                  <span className="text-[11px] text-[#6B7280]">{ring.label}</span>
                </div>
                <span className="text-[12px] font-medium" style={{ color: ring.color }}>{ring.value}</span>
              </div>
              {/* Mini barra de progreso */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(22,27,29,0.06)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${Math.min(ring.value / ring.max * 100, 100)}%`,
                  background: ring.color,
                  opacity: 0.7,
                  transition: 'width 1.2s cubic-bezier(0.34,1.2,0.64,1)',
                }} />
              </div>
            </div>
          ))}

          {/* Por ramo */}
          <div className="mt-2 pt-3 border-t border-[#D1D5DB]/40">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest mb-2">Por tipo de seguro</p>
            <div className="flex flex-wrap gap-1.5">
              {baseData.map(d => (
                <div key={d.label}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]"
                  style={{ background: `${d.color}12`, color: d.color }}>
                  <span className="font-medium">{d.label}</span>
                  {phase > 0 && (
                    <span className="opacity-70">+{d.new}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
