'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  TrendingUp, TrendingDown, Shield, DollarSign, FileText, AlertTriangle,
  Users2, BarChart3, Bot, ChevronRight, Award, Star, Zap, Activity,
  Target, Globe, Bell
} from 'lucide-react'

// ─── DATOS MOCK ASEGURADORA GNP ──────────────────────────────────────────────
const PRIMAS_POR_RAMO = [
  { ramo: 'GMM Individual', meta: 45000000, actual: 38420000, color: '#F7941D', icon: '🏥' },
  { ramo: 'GMM Colectivo',  meta: 80000000, actual: 71200000, color: '#69A481', icon: '🏢' },
  { ramo: 'Vida Individual',meta: 30000000, actual: 22800000, color: '#3B82F6', icon: '❤️' },
  { ramo: 'Auto',           meta: 25000000, actual: 24100000, color: '#7C1F31', icon: '🚗' },
  { ramo: 'Daños',          meta: 20000000, actual: 14600000, color: '#9CA3AF', icon: '🏗️' },
]

const TOP_PROMOTORIAS = [
  { nombre: 'Promotoria Vidal Grupo', agentes: 42, prima: 28400000, meta: 30000000, ciudad: 'CDMX', pct: 95 },
  { nombre: 'Seguros Premier Norte', agentes: 31, prima: 22100000, meta: 25000000, ciudad: 'Monterrey', pct: 88 },
  { nombre: 'Alianza Seguros GDL',   agentes: 28, prima: 19800000, meta: 22000000, ciudad: 'Guadalajara', pct: 90 },
  { nombre: 'Grupo Asegurador Sur',  agentes: 19, prima: 12400000, meta: 15000000, ciudad: 'Puebla', pct: 83 },
  { nombre: 'Despacho Omega MX',     agentes: 14, prima: 8900000,  meta: 12000000, ciudad: 'Querétaro', pct: 74 },
]

const TOP_AGENTES = [
  { nombre: 'Valeria Castillo', promotoria: 'Promotoria Vidal', polizas: 312, prima: 298400, cambio: '+14%', badge: '🥇' },
  { nombre: 'Lucía Morán',      promotoria: 'Seguros Premier', polizas: 178, prima: 142800, cambio: '+9%',  badge: '🥈' },
  { nombre: 'Carlos Mendoza',   promotoria: 'Promotoria Vidal', polizas: 247, prima: 184320, cambio: '+8%',  badge: '🥉' },
  { nombre: 'Ana Domínguez',    promotoria: 'Alianza GDL',     polizas: 134, prima: 98600,  cambio: '+6%',  badge: '⭐' },
  { nombre: 'Diego Pacheco',    promotoria: 'Premier Norte',   polizas: 89,  prima: 64200,  cambio: '+3%',  badge: '⭐' },
]

const KPI_CARDS = [
  { label: 'Prima emitida marzo',   value: '$171.1M',  change: '+11.2%', up: true,  icon: DollarSign, color: '#69A481' },
  { label: 'Pólizas activas',       value: '18,342',   change: '+842',   up: true,  icon: FileText,   color: '#F7941D' },
  { label: 'Tasa de aprobación',    value: '78.4%',    change: '+2.1%',  up: true,  icon: Shield,     color: '#3B82F6' },
  { label: 'Siniestros abiertos',   value: '284',      change: '-12',    up: true,  icon: AlertTriangle, color: '#7C1F31' },
  { label: 'Tiempo emisión prom.',  value: '1.8 días', change: '-0.4d',  up: true,  icon: Activity,   color: '#69A481' },
  { label: 'Red de agentes activa', value: '1,247',    change: '+38',    up: true,  icon: Users2,     color: '#F7941D' },
]

// ─── Cilindro 3D que se llena ─────────────────────────────────────────────────
function Cylinder3D({ pct, color, label, meta, actual }: { pct: number; color: string; label: string; meta: number; actual: number }) {
  const [animPct, setAnimPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 300)
    return () => clearTimeout(t)
  }, [pct])

  const filled = Math.min(animPct, 100)
  const M = (v: number) => `$${(v / 1000000).toFixed(1)}M`

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Cilindro SVG */}
      <div className="relative" style={{ width: 64, height: 120 }}>
        <svg width="64" height="120" viewBox="0 0 64 120" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={`cyl-fill-${label.replace(/\s/g,'')}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity="0.7" />
              <stop offset="50%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id={`cyl-body-${label.replace(/\s/g,'')}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C8CDD8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#E5E7EB" stopOpacity="0.2" />
            </linearGradient>
            <clipPath id={`clip-${label.replace(/\s/g,'')}`}>
              <rect x="0" y={110 - (filled * 100 / 100)} width="64" height="100" style={{ transition: 'y 1.5s cubic-bezier(0.22,1,0.36,1)' }} />
            </clipPath>
          </defs>

          {/* Cuerpo vacío */}
          <rect x="8" y="10" width="48" height="100" rx="6"
            fill={`url(#cyl-body-${label.replace(/\s/g,'')})`}
            stroke="#D1D5DB" strokeWidth="1" />

          {/* Líquido que sube */}
          <g clipPath={`url(#clip-${label.replace(/\s/g,'')})`}>
            <rect x="8" y="10" width="48" height="100" rx="6"
              fill={`url(#cyl-fill-${label.replace(/\s/g,'')})`} />
          </g>

          {/* Brillo */}
          <rect x="12" y="14" width="8" height="90" rx="4"
            fill="white" opacity="0.15" />

          {/* Tapa superior */}
          <ellipse cx="32" cy="10" rx="24" ry="6"
            fill={color} opacity="0.3"
            stroke={color} strokeWidth="1" strokeOpacity="0.5" />

          {/* Tapa inferior */}
          <ellipse cx="32" cy="110" rx="24" ry="6"
            fill="#D1D5DB" opacity="0.5"
            stroke="#C8CDD8" strokeWidth="1" />

          {/* Nivel del líquido — elipse en la parte superior del líquido */}
          <ellipse cx="32" cy={110 - (filled)} rx="24" ry="6"
            fill={color} opacity="0.6"
            style={{ transition: 'cy 1.5s cubic-bezier(0.22,1,0.36,1)' }} />

          {/* Porcentaje en el cilindro */}
          <text x="32" y="65" textAnchor="middle" fontSize="12" fontWeight="bold"
            fill={filled > 50 ? 'white' : color} opacity="0.9">
            {Math.round(filled)}%
          </text>
        </svg>

        {/* Indicador de nivel con glow */}
        {filled > 5 && (
          <div className="absolute right-0 transition-all duration-1000"
            style={{ bottom: `${(filled * 100) / 120}%`, transform: 'translateY(50%)' }}>
            <div className="w-2 h-0.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="text-center">
        <p className="text-[10px] font-bold text-[#1A1F2B] leading-tight max-w-[70px]">{label}</p>
        <p className="text-[9px] text-[#9CA3AF] mt-0.5">{M(actual)} / {M(meta)}</p>
      </div>
    </div>
  )
}

// ─── Barra de producción animada ──────────────────────────────────────────────
function ProductionBar({ nombre, pct, prima, meta, ciudad, rank }: {
  nombre: string; pct: number; prima: number; meta: number; ciudad: string; rank: number
}) {
  const [anim, setAnim] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnim(pct), 400 + rank * 100)
    return () => clearTimeout(t)
  }, [pct, rank])

  const colors = ['#F7941D', '#69A481', '#3B82F6', '#7C1F31', '#9CA3AF']
  const color = colors[rank]
  const M = (v: number) => `$${(v / 1000000).toFixed(1)}M`

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: color }}>
            {rank + 1}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#1A1F2B] leading-none">{nombre}</p>
            <p className="text-[9px] text-[#9CA3AF]">{ciudad}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold text-[#1A1F2B]">{M(prima)}</p>
          <p className="text-[9px] font-semibold" style={{ color }}>{pct}% de meta</p>
        </div>
      </div>
      {/* Barra */}
      <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-[1400ms] ease-out relative"
          style={{ width: `${anim}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}>
          {/* Brillo */}
          <div className="absolute inset-y-0 left-0 w-4 rounded-full opacity-60"
            style={{ background: 'linear-gradient(90deg, white, transparent)' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Gauge circular tipo NASA ─────────────────────────────────────────────────
function NasaGauge({ value, max, label, color, unit }: {
  value: number; max: number; label: string; color: string; unit: string
}) {
  const [anim, setAnim] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnim(value), 500)
    return () => clearTimeout(t)
  }, [value])

  const pct = (anim / max) * 100
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ * 0.75 // 270° arc
  const gap = circ - dash

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="#E5E7EB" strokeWidth="8"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
          transform="rotate(135 50 50)" />
        {/* Fill animado */}
        <circle cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
          transform="rotate(135 50 50)"
          filter={`url(#glow-${label})`}
          style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.22,1,0.36,1)' }} />
        {/* Punto brillante en el extremo */}
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="white" strokeWidth="3"
          strokeDasharray={`2 ${circ - 2}`}
          strokeDashoffset={circ * 0.125 - dash}
          strokeLinecap="round"
          transform="rotate(135 50 50)"
          opacity="0.8" />
        {/* Valor */}
        <text x="50" y="45" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1A1F2B">{Math.round(anim)}</text>
        <text x="50" y="58" textAnchor="middle" fontSize="9" fill="#9CA3AF">{unit}</text>
      </svg>
      <p className="text-[10px] text-[#6B7280] font-semibold text-center max-w-[80px] leading-tight">{label}</p>
    </div>
  )
}

// ─── Partículas de fondo (solo decorativas) ───────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}
          className="absolute rounded-full opacity-10 animate-pulse"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: i % 3 === 0 ? '#F7941D' : i % 3 === 1 ? '#69A481' : '#3B82F6',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }} />
      ))}
    </div>
  )
}

export default function AseguradoraDashboard() {
  const router = useRouter()
  const [now, setNow] = useState(new Date())
  const [xoriaOpen, setXoriaOpen] = useState(false)
  const [xoriaInput, setXoriaInput] = useState('')
  const [xoriaResp, setXoriaResp] = useState('')
  const [xoriaLoading, setXoriaLoading] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  async function preguntarXoria() {
    if (!xoriaInput.trim()) return
    setXoriaLoading(true)
    setXoriaResp('')
    try {
      const res = await fetch('/api/xoria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: xoriaInput,
          context: {
            perfil: 'aseguradora',
            empresa: 'GNP Seguros',
            fecha_hoy: now.toLocaleDateString('es-MX'),
            kpis: { prima_mes: '$171.1M', polizas_activas: 18342, tasa_aprobacion: '78.4%', siniestros_abiertos: 284 },
            promotorias: TOP_PROMOTORIAS.map(p => ({ nombre: p.nombre, prima: p.prima, pct: p.pct })),
            top_agentes: TOP_AGENTES.map(a => ({ nombre: a.nombre, polizas: a.polizas, prima: a.prima })),
          },
        }),
      })
      const data = await res.json()
      setXoriaResp(data.response || data.reply || 'Sin respuesta')
    } catch {
      setXoriaResp('XORIA no disponible en este momento. Intenta de nuevo.')
    }
    setXoriaLoading(false)
  }

  const totalPrimaMeta = PRIMAS_POR_RAMO.reduce((s, r) => s + r.meta, 0)
  const totalPrimaActual = PRIMAS_POR_RAMO.reduce((s, r) => s + r.actual, 0)
  const pctGlobal = Math.round((totalPrimaActual / totalPrimaMeta) * 100)

  return (
    <div className="flex flex-col gap-5 relative">
      <Particles />

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#69A481] animate-pulse" />
            <span className="text-[10px] text-[#69A481] font-bold tracking-[0.2em] uppercase">GNP Seguros · Sistema Operativo</span>
          </div>
          <h1 className="text-[24px] text-[#1A1F2B] font-bold tracking-tight">Centro de control</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">
            {now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}
            <span className="font-mono text-[#F7941D]">{now.toLocaleTimeString('es-MX')}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón XORIA */}
          <button onClick={() => setXoriaOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-[12px] font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#1A1F2B,#2D3548)', boxShadow: '0 4px 16px rgba(26,31,43,0.4)' }}>
            <Image src="/Icono xoria.png" alt="X" width={16} height={16} className="rounded-full" />
            Preguntar a XORIA
          </button>

          {/* Alertas */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7C1F31]" />
          </button>
        </div>
      </div>

      {/* ── PANEL XORIA ─────────────────────────────────────────────────── */}
      {xoriaOpen && (
        <div className="bg-gradient-to-br from-[#1A1F2B] to-[#2D3548] rounded-2xl p-5 shadow-[0_8px_32px_rgba(26,31,43,0.4)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="text-[13px] text-white font-bold">XORIA — Copiloto GNP</p>
              <p className="text-[10px] text-white/50">Acceso a promotorias · agentes · pólizas · siniestros · cobranza</p>
            </div>
          </div>
          {xoriaResp && (
            <div className="mb-4 p-3 rounded-xl bg-white/8 border border-white/10">
              <p className="text-[12px] text-white/80 leading-relaxed">{xoriaResp}</p>
            </div>
          )}
          <div className="flex gap-2">
            <input value={xoriaInput} onChange={e => setXoriaInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && preguntarXoria()}
              placeholder="¿Cuál es la promotoria con mayor producción? · ¿Cuántos siniestros abiertos?"
              className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-[12px] text-white placeholder-white/30 outline-none focus:border-[#F7941D]/50" />
            <button onClick={preguntarXoria} disabled={xoriaLoading || !xoriaInput.trim()}
              className="px-4 py-2.5 rounded-xl text-white text-[12px] font-bold disabled:opacity-40 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
              {xoriaLoading ? '...' : 'Consultar'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['Promotoria con mayor producción', '¿Cuántos siniestros abiertos?', 'Pólizas por vencer este mes', 'Tasa de aprobación underwriting', 'Agente estrella del mes'].map(q => (
              <button key={q} onClick={() => { setXoriaInput(q); setTimeout(preguntarXoria, 100) }}
                className="px-2.5 py-1 rounded-full text-[10px] text-white/60 border border-white/10 hover:border-[#F7941D]/40 hover:text-white/90 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── KPI CARDS ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {KPI_CARDS.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-5"
                style={{ background: kpi.color, transform: 'translate(20%, -20%)' }} />
              <Icon size={14} style={{ color: kpi.color }} className="mb-2" />
              <p className="text-[18px] font-bold text-[#1A1F2B] leading-none">{kpi.value}</p>
              <p className="text-[9px] text-[#9CA3AF] mt-1 uppercase tracking-wider leading-tight">{kpi.label}</p>
              <div className="flex items-center gap-1 mt-2">
                {kpi.up ? <TrendingUp size={10} className="text-[#69A481]" /> : <TrendingDown size={10} className="text-[#7C1F31]" />}
                <span className="text-[9px] font-bold" style={{ color: kpi.up ? '#69A481' : '#7C1F31' }}>{kpi.change}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── FILA 2: CILINDROS 3D + GAUGES ──────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Cilindros por ramo */}
        <div className="col-span-12 lg:col-span-7 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] font-semibold">Producción por ramo</p>
              <h2 className="text-[16px] text-[#1A1F2B] font-bold">Objetivo vs. real — Marzo 2026</h2>
            </div>
            <div className="text-right">
              <p className="text-[28px] font-bold text-[#F7941D] leading-none">{pctGlobal}%</p>
              <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">cumplimiento global</p>
            </div>
          </div>

          {/* Barra global */}
          <div className="mb-6">
            <div className="h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden mb-1">
              <div className="h-full rounded-full transition-all duration-[2s] ease-out relative overflow-hidden"
                style={{ width: `${pctGlobal}%`, background: 'linear-gradient(90deg,#F7941D,#69A481)' }}>
                <div className="absolute inset-0 bg-white/20 animate-pulse" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] text-[#9CA3AF]">$0</span>
              <span className="text-[9px] text-[#69A481] font-bold">${(totalPrimaActual / 1000000).toFixed(1)}M emitido</span>
              <span className="text-[9px] text-[#9CA3AF]">${(totalPrimaMeta / 1000000).toFixed(0)}M meta</span>
            </div>
          </div>

          {/* Cilindros */}
          <div className="flex items-end justify-around gap-2">
            {PRIMAS_POR_RAMO.map(r => (
              <Cylinder3D key={r.ramo}
                pct={Math.round((r.actual / r.meta) * 100)}
                color={r.color}
                label={r.ramo}
                meta={r.meta}
                actual={r.actual} />
            ))}
          </div>
        </div>

        {/* Gauges NASA */}
        <div className="col-span-12 lg:col-span-5 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] font-semibold mb-1">Indicadores operativos</p>
          <h2 className="text-[16px] text-[#1A1F2B] font-bold mb-4">Velocidad del core asegurador</h2>

          <div className="grid grid-cols-2 gap-3">
            <NasaGauge value={78} max={100} label="Tasa de aprobación UW" color="#F7941D" unit="%" />
            <NasaGauge value={91} max={100} label="Pólizas emitidas a tiempo" color="#69A481" unit="%" />
            <NasaGauge value={284} max={500} label="Siniestros en gestión" color="#7C1F31" unit="cases" />
            <NasaGauge value={1247} max={1500} label="Agentes activos en red" color="#3B82F6" unit="agentes" />
          </div>

          {/* Accesos rápidos módulos */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { label: 'Suscripción', href: '/agent/aseguradora/underwriting', color: '#F7941D', icon: Shield },
              { label: 'Pólizas', href: '/agent/aseguradora/polizas', color: '#69A481', icon: FileText },
              { label: 'Cobranza', href: '/agent/aseguradora/billing', color: '#3B82F6', icon: DollarSign },
              { label: 'Siniestros', href: '/agent/aseguradora/siniestros', color: '#7C1F31', icon: AlertTriangle },
            ].map(m => {
              const Icon = m.icon
              return (
                <button key={m.label} onClick={() => router.push(m.href)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/30 hover:bg-white/60 border border-transparent hover:border-[#E5E7EB] transition-all group">
                  <div className="flex items-center gap-2">
                    <Icon size={12} style={{ color: m.color }} />
                    <span className="text-[11px] font-semibold text-[#1A1F2B]">{m.label}</span>
                  </div>
                  <ChevronRight size={10} className="text-[#9CA3AF] group-hover:text-[#F7941D] transition-colors" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── FILA 3: RANKING PROMOTORIAS + TOP AGENTES ──────────────────── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Ranking promotorias */}
        <div className="col-span-12 lg:col-span-7 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] font-semibold">Red de distribución</p>
              <h2 className="text-[16px] text-[#1A1F2B] font-bold">Ranking de promotorias</h2>
            </div>
            <button onClick={() => router.push('/agent/aseguradora/red-agentes')}
              className="flex items-center gap-1 text-[11px] text-[#F7941D] font-semibold hover:text-[#e08019] transition-colors">
              Ver red completa <ChevronRight size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {TOP_PROMOTORIAS.map((p, i) => (
              <ProductionBar key={p.nombre} nombre={p.nombre} pct={p.pct}
                prima={p.prima} meta={p.meta} ciudad={p.ciudad} rank={i} />
            ))}
          </div>
        </div>

        {/* Top agentes */}
        <div className="col-span-12 lg:col-span-5 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] font-semibold">Estrellas del mes</p>
              <h2 className="text-[16px] text-[#1A1F2B] font-bold">Top agentes GNP</h2>
            </div>
            <Award size={16} className="text-[#F7941D]" />
          </div>

          <div className="flex flex-col gap-2">
            {TOP_AGENTES.map((a, i) => (
              <div key={a.nombre} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/30 hover:bg-white/50 transition-colors cursor-pointer"
                onClick={() => router.push('/agent/aseguradora/red-agentes')}>
                <div className="text-[18px] w-8 text-center">{a.badge}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-[#1A1F2B] truncate">{a.nombre}</p>
                  <p className="text-[9px] text-[#9CA3AF] truncate">{a.promotoria} · {a.polizas} pólizas</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-bold text-[#1A1F2B]">${(a.prima / 1000).toFixed(0)}K</p>
                  <p className="text-[9px] font-semibold text-[#69A481]">{a.cambio}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Badge agente del mes */}
          <div className="mt-3 p-3 rounded-xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg,#1A1F2B,#2D3548)' }}>
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10"
              style={{ background: '#F7941D' }} />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl bg-[#F7941D]/20">
                🏆
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Agente del mes · Marzo 2026</p>
                <p className="text-[13px] text-white font-bold">Valeria Castillo</p>
                <p className="text-[10px] text-[#F7941D]">$298,400 prima · 312 pólizas · 99% meta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILA 4: MÓDULOS RÁPIDOS ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Underwriting', desc: '23 solicitudes pendientes', href: '/agent/aseguradora/underwriting', icon: Shield, color: '#F7941D', alert: 23 },
          { label: 'Policy Admin',  desc: '18,342 pólizas activas', href: '/agent/aseguradora/polizas', icon: FileText, color: '#69A481', alert: 0 },
          { label: 'Billing',      desc: '$4.2M en cartera vencida', href: '/agent/aseguradora/billing', icon: DollarSign, color: '#3B82F6', alert: 47 },
          { label: 'Claims',       desc: '284 siniestros en gestión', href: '/agent/aseguradora/siniestros', icon: AlertTriangle, color: '#7C1F31', alert: 284 },
        ].map(m => {
          const Icon = m.icon
          return (
            <button key={m.label} onClick={() => router.push(m.href)}
              className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] text-left relative overflow-hidden group hover:shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.18)] transition-all active:scale-[0.98]">
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-5 transition-all group-hover:opacity-10"
                style={{ background: m.color }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110"
                style={{ background: `${m.color}15`, border: `1px solid ${m.color}30` }}>
                <Icon size={18} style={{ color: m.color }} />
              </div>
              <p className="text-[14px] font-bold text-[#1A1F2B]">{m.label}</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{m.desc}</p>
              {m.alert > 0 && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: m.color }}>
                  {m.alert > 99 ? '99+' : m.alert}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* ── ACCESO RED DE AGENTES ───────────────────────────────────────── */}
      <button onClick={() => router.push('/agent/aseguradora/red-agentes')}
        className="w-full p-4 rounded-2xl text-left relative overflow-hidden group hover:scale-[1.01] active:scale-[0.99] transition-all"
        style={{ background: 'linear-gradient(135deg,#1A1F2B 0%,#2D3548 100%)', boxShadow: '0 8px 32px rgba(26,31,43,0.3)' }}>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: '#F7941D' }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F7941D]/20 flex items-center justify-center">
              <Users2 size={22} className="text-[#F7941D]" />
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Red de distribución IAOS</p>
              <p className="text-[18px] text-white font-bold">Red de agentes y promotorias</p>
              <p className="text-[12px] text-white/50 mt-0.5">1,247 agentes activos · 38 promotorias · Leaderboard en tiempo real</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#F7941D] group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  )
}
