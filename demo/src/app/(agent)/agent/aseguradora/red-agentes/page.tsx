'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Bot, Search, TrendingUp, Award, Users, Star,
  ChevronRight, X, Phone, Mail, MapPin, Target
} from 'lucide-react'

const PROMOTORIAS = [
  { id: 'p1', nombre: 'Promotoria Vidal Grupo', ciudad: 'CDMX', director: 'Lic. Carlos Vidal', agentes: 12, primas: 842000, meta: 900000, siniestros: 3, status: 'activa', crecimiento: 14 },
  { id: 'p2', nombre: 'Seguros Premier Norte', ciudad: 'Monterrey', director: 'Ing. Patricia Leal', agentes: 9, primas: 680000, meta: 700000, siniestros: 2, status: 'activa', crecimiento: 8 },
  { id: 'p3', nombre: 'Alianza Seguros GDL', ciudad: 'Guadalajara', director: 'Lic. Roberto Serna', agentes: 7, primas: 520000, meta: 600000, siniestros: 4, status: 'activa', crecimiento: -3 },
  { id: 'p4', nombre: 'Grupo Asegurador Sur', ciudad: 'Mérida', director: 'Dra. Claudia Moreno', agentes: 5, primas: 310000, meta: 400000, siniestros: 1, status: 'activa', crecimiento: 22 },
  { id: 'p5', nombre: 'Seguros del Pacífico', ciudad: 'Guadalajara', director: 'Ing. Jorge Tapia', agentes: 6, primas: 280000, meta: 350000, siniestros: 2, status: 'activa', crecimiento: 5 },
]

const AGENTES = [
  { id: 'a1', nombre: 'Valeria Castillo', promotoria: 'Promotoria Vidal Grupo', cedula: 'C-98432', ciudad: 'CDMX', primas: 284000, meta: 250000, polizas: 31, siniestros: 2, score: 94, tel: '55 1234-5678', email: 'v.castillo@demo.com', ramo: 'GMM Individual' },
  { id: 'a2', nombre: 'Diego Pacheco', promotoria: 'Seguros Premier Norte', cedula: 'C-76201', ciudad: 'Monterrey', primas: 242000, meta: 220000, polizas: 18, siniestros: 1, score: 91, tel: '81 2345-6789', email: 'd.pacheco@demo.com', ramo: 'GMM Colectivo' },
  { id: 'a3', nombre: 'Ana Domínguez', promotoria: 'Alianza Seguros GDL', cedula: 'C-54810', ciudad: 'Guadalajara', primas: 198000, meta: 230000, polizas: 24, siniestros: 3, score: 78, tel: '33 3456-7890', email: 'a.dominguez@demo.com', ramo: 'Vida Individual' },
  { id: 'a4', nombre: 'Luis Ramírez', promotoria: 'Promotoria Vidal Grupo', cedula: 'C-12098', ciudad: 'CDMX', primas: 187000, meta: 200000, polizas: 22, siniestros: 1, score: 85, tel: '55 4567-8901', email: 'l.ramirez@demo.com', ramo: 'GMM Individual' },
  { id: 'a5', nombre: 'Héctor Ríos', promotoria: 'Grupo Asegurador Sur', cedula: 'C-34521', ciudad: 'Mérida', primas: 164000, meta: 160000, polizas: 19, siniestros: 0, score: 88, tel: '99 5678-9012', email: 'h.rios@demo.com', ramo: 'GMM Individual' },
  { id: 'a6', nombre: 'Sofía Mendoza', promotoria: 'Seguros Premier Norte', cedula: 'C-67432', ciudad: 'Monterrey', primas: 142000, meta: 180000, polizas: 15, siniestros: 1, score: 72, tel: '81 6789-0123', email: 's.mendoza@demo.com', ramo: 'GMM Colectivo' },
  { id: 'a7', nombre: 'Javier Morales', promotoria: 'Alianza Seguros GDL', cedula: 'C-89012', ciudad: 'Guadalajara', primas: 98000, meta: 150000, polizas: 12, siniestros: 2, score: 61, tel: '33 7890-1234', email: 'j.morales@demo.com', ramo: 'Vida Individual' },
]

const MEDALLAS = ['🥇', '🥈', '🥉']
const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`

function ScoreBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[9px] font-bold w-7 text-right" style={{ color }}>{pct}%</span>
    </div>
  )
}

export default function RedAgentesPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'promotorias' | 'agentes'>('agentes')
  const [search, setSearch] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<typeof AGENTES[0] | null>(null)
  const [selectedProm, setSelectedProm] = useState<typeof PROMOTORIAS[0] | null>(null)
  const [xoriaQ, setXoriaQ] = useState('')
  const [xoriaR, setXoriaR] = useState('')
  const [xoriaLoading, setXoriaLoading] = useState(false)

  const agentesFiltered = AGENTES.filter(a =>
    !search || a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    a.promotoria.toLowerCase().includes(search.toLowerCase()) ||
    a.ciudad.toLowerCase().includes(search.toLowerCase())
  )

  const promFiltered = PROMOTORIAS.filter(p =>
    !search || p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.ciudad.toLowerCase().includes(search.toLowerCase())
  )

  const totalRed = {
    primas: AGENTES.reduce((s, a) => s + a.primas, 0),
    polizas: AGENTES.reduce((s, a) => s + a.polizas, 0),
    agentes: AGENTES.length,
    promotorias: PROMOTORIAS.length,
  }

  async function askXoria() {
    if (!xoriaQ.trim()) return
    setXoriaLoading(true)
    try {
      const res = await fetch('/api/xoria/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: xoriaQ, context: { perfil: 'aseguradora_red', agentes: AGENTES, promotorias: PROMOTORIAS, totalRed } }),
      })
      const d = await res.json()
      setXoriaR(d.response || d.reply || 'Sin respuesta.')
    } catch { setXoriaR('XORIA no disponible.') }
    setXoriaLoading(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/agent/aseguradora')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] text-[#F7941D] font-bold tracking-[0.2em] uppercase">GNP Seguros</span>
            <span className="text-[10px] text-[#D1D5DB]">·</span>
            <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">Red de distribución</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Red de agentes</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Promotorias · Agentes · Producción · Rankings</p>
        </div>
      </div>

      {/* KPIs red */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Producción total', value: fmt(totalRed.primas), icon: TrendingUp, color: '#F7941D', sub: 'Primas mensuales' },
          { label: 'Pólizas activas', value: totalRed.polizas.toString(), icon: Target, color: '#69A481', sub: 'En toda la red' },
          { label: 'Agentes activos', value: totalRed.agentes.toString(), icon: Users, color: '#1A1F2B', sub: 'Con cédula AMIS' },
          { label: 'Promotorias', value: totalRed.promotorias.toString(), icon: Award, color: '#3B82F6', sub: 'Autorizadas GNP' },
        ].map(k => {
          const Icon = k.icon
          return (
            <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={13} style={{ color: k.color }} />
                <span className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{k.label}</span>
              </div>
              <p className="text-[24px] font-bold" style={{ color: k.color }}>{k.value}</p>
              <p className="text-[9px] text-[#9CA3AF] mt-0.5">{k.sub}</p>
            </div>
          )
        })}
      </div>

      {/* XORIA */}
      <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={14} className="text-[#F7941D]" />
          <span className="text-[11px] text-white/60 font-semibold">XORIA · Red de distribución</span>
        </div>
        {xoriaR && (
          <div className="mb-3 p-2.5 rounded-xl bg-white/8 border border-white/10">
            <p className="text-[11px] text-white/80 leading-relaxed">{xoriaR}</p>
          </div>
        )}
        <div className="flex gap-2">
          <input value={xoriaQ} onChange={e => setXoriaQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askXoria()}
            placeholder="¿Cuál promotoria tiene mejor desempeño? · ¿Qué agente supera su meta?"
            className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#F7941D]/50" />
          <button onClick={askXoria} disabled={xoriaLoading}
            className="px-3 py-2 rounded-xl text-white text-[11px] font-bold disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
            {xoriaLoading ? '...' : 'Preguntar'}
          </button>
        </div>
      </div>

      {/* Tabs + búsqueda */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 bg-[#EFF2F9] rounded-xl p-1 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
          {[{ key: 'agentes' as const, label: 'Agentes' }, { key: 'promotorias' as const, label: 'Promotorias' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn('px-5 py-1.5 rounded-lg text-[11px] font-bold transition-all',
                tab === t.key ? 'bg-[#1A1F2B] text-white shadow-md' : 'text-[#9CA3AF] hover:text-[#1A1F2B]')}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'agentes' ? 'Buscar agente, promotoria o ciudad...' : 'Buscar promotoria o director...'}
            className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_6px_#FAFBFF,inset_2px_2px_6px_rgba(22,27,29,0.12)] placeholder-[#9CA3AF]" />
        </div>
      </div>

      {/* Leaderboard Agentes */}
      {tab === 'agentes' && (
        <div className="flex flex-col gap-2">
          {agentesFiltered.map((a, i) => {
            const pct = Math.min(100, Math.round((a.primas / a.meta) * 100))
            const barColor = pct >= 100 ? '#69A481' : pct >= 70 ? '#F7941D' : '#7C1F31'
            return (
              <button key={a.id} onClick={() => setSelectedAgent(a)}
                className="w-full bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.10)] hover:scale-[1.005] transition-all text-left">
                <div className="flex items-center gap-4">
                  {/* Ranking */}
                  <div className="flex flex-col items-center justify-center w-10 shrink-0">
                    {i < 3 ? (
                      <span className="text-2xl">{MEDALLAS[i]}</span>
                    ) : (
                      <span className="text-[16px] font-bold text-[#D1D5DB]">#{i + 1}</span>
                    )}
                  </div>

                  {/* Avatar + info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                      style={{ background: `linear-gradient(135deg, ${i < 3 ? '#F7941D' : '#1A1F2B'}, ${i < 3 ? '#e08019' : '#2D3548'})` }}>
                      {a.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#1A1F2B] truncate">{a.nombre}</p>
                      <p className="text-[10px] text-[#9CA3AF] truncate">{a.promotoria} · {a.ciudad}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#1A1F2B]">{fmt(a.primas)}</p>
                      <p className="text-[9px] text-[#9CA3AF]">de {fmt(a.meta)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold" style={{ color: barColor }}>{pct}%</p>
                      <p className="text-[9px] text-[#9CA3AF]">de meta</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-bold text-[#3B82F6]">{a.polizas}</p>
                      <p className="text-[9px] text-[#9CA3AF]">pólizas</p>
                    </div>
                    <div className="w-24">
                      <ScoreBar value={a.primas} max={a.meta} color={barColor} />
                    </div>
                    {a.score >= 85 && <Star size={13} className="text-[#F7941D] shrink-0" fill="#F7941D" />}
                    <ChevronRight size={13} className="text-[#D1D5DB]" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Leaderboard Promotorias */}
      {tab === 'promotorias' && (
        <div className="flex flex-col gap-2">
          {promFiltered.sort((a, b) => b.primas - a.primas).map((p, i) => {
            const pct = Math.min(100, Math.round((p.primas / p.meta) * 100))
            const barColor = pct >= 95 ? '#69A481' : pct >= 70 ? '#F7941D' : '#7C1F31'
            return (
              <button key={p.id} onClick={() => setSelectedProm(p)}
                className="w-full bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.10)] hover:scale-[1.005] transition-all text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 shrink-0 flex items-center justify-center">
                    {i < 3 ? <span className="text-2xl">{MEDALLAS[i]}</span> : <span className="text-[16px] font-bold text-[#D1D5DB]">#{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1A1F2B] truncate">{p.nombre}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{p.ciudad} · Dir: {p.director}</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#1A1F2B]">{fmt(p.primas)}</p>
                      <p className="text-[9px] text-[#9CA3AF]">de {fmt(p.meta)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-bold text-[#6B7280]">{p.agentes} agentes</p>
                      <p className="text-[10px]" style={{ color: p.crecimiento >= 0 ? '#69A481' : '#7C1F31' }}>
                        {p.crecimiento >= 0 ? '+' : ''}{p.crecimiento}% vs ant.
                      </p>
                    </div>
                    <div className="w-24">
                      <ScoreBar value={p.primas} max={p.meta} color={barColor} />
                    </div>
                    <ChevronRight size={13} className="text-[#D1D5DB]" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Modal Agente */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F2B]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#EFF2F9] rounded-3xl shadow-[0_32px_80px_rgba(26,31,43,0.5)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-6 py-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">GNP Seguros · Red de agentes</p>
                <h2 className="text-[18px] text-white font-bold">{selectedAgent.nombre}</h2>
                <p className="text-[12px] text-white/50 mt-0.5">{selectedAgent.promotoria}</p>
              </div>
              <button onClick={() => setSelectedAgent(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Cédula AMIS', selectedAgent.cedula],
                  ['Ciudad', selectedAgent.ciudad],
                  ['Ramo principal', selectedAgent.ramo],
                  ['Teléfono', selectedAgent.tel],
                  ['Correo', selectedAgent.email],
                  ['Pólizas activas', selectedAgent.polizas.toString()],
                  ['Producción mensual', fmt(selectedAgent.primas)],
                  ['Meta mensual', fmt(selectedAgent.meta)],
                  ['Siniestros abiertos', selectedAgent.siniestros.toString()],
                  ['Score IAOS', `${selectedAgent.score}/100`],
                ].map(([l, v]) => (
                  <div key={l} className="bg-white/30 rounded-xl px-3 py-2.5">
                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">{l}</p>
                    <p className="text-[12px] text-[#1A1F2B] font-semibold mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1.5">Avance de meta</p>
                <ScoreBar
                  value={selectedAgent.primas}
                  max={selectedAgent.meta}
                  color={selectedAgent.primas >= selectedAgent.meta ? '#69A481' : '#F7941D'}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[12px] font-bold"
                  style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
                  <Mail size={13} /> Enviar mensaje
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold text-[#6B7280]"
                  style={{ background: 'rgba(156,163,175,0.12)', border: '1px solid rgba(156,163,175,0.20)' }}>
                  <Phone size={13} /> Llamar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Promotoria */}
      {selectedProm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F2B]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#EFF2F9] rounded-3xl shadow-[0_32px_80px_rgba(26,31,43,0.5)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-6 py-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">GNP Seguros · Red de promotorias</p>
                <h2 className="text-[18px] text-white font-bold">{selectedProm.nombre}</h2>
                <p className="text-[12px] text-white/50 mt-0.5">{selectedProm.ciudad} · Dir: {selectedProm.director}</p>
              </div>
              <button onClick={() => setSelectedProm(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Director', selectedProm.director],
                  ['Ciudad', selectedProm.ciudad],
                  ['No. agentes', selectedProm.agentes.toString()],
                  ['Siniestros activos', selectedProm.siniestros.toString()],
                  ['Producción mensual', fmt(selectedProm.primas)],
                  ['Meta mensual', fmt(selectedProm.meta)],
                  ['Crecimiento', `${selectedProm.crecimiento >= 0 ? '+' : ''}${selectedProm.crecimiento}%`],
                  ['Estatus', selectedProm.status === 'activa' ? '✅ Activa' : '⚠️ Inactiva'],
                ].map(([l, v]) => (
                  <div key={l} className="bg-white/30 rounded-xl px-3 py-2.5">
                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">{l}</p>
                    <p className="text-[12px] text-[#1A1F2B] font-semibold mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1.5">Producción vs meta</p>
                <ScoreBar value={selectedProm.primas} max={selectedProm.meta}
                  color={selectedProm.primas >= selectedProm.meta * 0.95 ? '#69A481' : '#F7941D'} />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[12px] font-bold"
                  style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
                  <Mail size={13} /> Mensaje directo
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold text-[#1A1F2B]"
                  style={{ background: 'rgba(26,31,43,0.08)', border: '1px solid rgba(26,31,43,0.12)' }}>
                  <Users size={13} /> Ver agentes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
