'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Mic,
  MicOff,
  Search,
  Send,
  ShieldOff,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import {
  FraudAlert,
  FraudState,
  fraudAlerts,
  fraudLevelLabel,
  suspiciousProviders,
  xoriaRiskPrompts,
  agentPerformance,
  underwritingCases,
} from '@/data/carrier-core'
import { Panel, StatusBadge } from '@/components/insurance/CarrierUi'
import { useVoiceIO } from '@/lib/useVoiceIO'

// ─── Colores ──────────────────────────────────────────────────────────────────

function fraudColor(state: FraudState): '#69A481' | '#F7941D' | '#7C1F31' | '#6E7F8D' {
  if (state === 'normal') return '#69A481'
  if (state === 'observado') return '#6E7F8D'
  if (state === 'riesgo_medio') return '#F7941D'
  return '#7C1F31'
}

// ─── Mini chat Xoria Antifraude ────────────────────────────────────────────────

interface ChatMsg { id: string; role: 'user' | 'assistant'; text: string }

function XoriaFraudChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'init', role: 'assistant', text: 'Xoria antifraude activa. Puedo identificar patrones sospechosos, revisar proveedores con anomalías y resumir expedientes observados. ¿Qué analizamos?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const { isListening, toggleListen, supported, speak } = useVoiceIO({
    lang: 'es-MX',
    onTranscript: (text, isFinal) => { if (isFinal) setInput(text) },
  })

  async function handleSend(raw?: string) {
    const msg = (raw ?? input).trim()
    if (!msg || loading) return
    setMessages(prev => [...prev, { id: `u_${Date.now()}`, role: 'user', text: msg }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/xoria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          context: {
            perfil: 'aseguradora_antifraude',
            alertas: fraudAlerts,
            proveedores: suspiciousProviders,
          },
        }),
      })
      const data = await res.json()
      const reply = data.response || data.reply || 'Sin análisis disponible.'
      setMessages(prev => [...prev, { id: `a_${Date.now()}`, role: 'assistant', text: reply }])
      speak(reply)
    } catch {
      setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'assistant', text: 'Xoria no pudo completar el análisis. Intenta de nuevo.' }])
    }
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-3">
        {xoriaRiskPrompts.slice(3).map(p => (
          <button key={p} onClick={() => handleSend(p)}
            className="rounded-full bg-white/35 px-3 py-1.5 text-[11px] text-[#1A1F2B] hover:bg-white/55 transition-all">
            {p}
          </button>
        ))}
      </div>
      <div className="max-h-[280px] space-y-2 overflow-y-auto rounded-2xl bg-white/35 p-3">
        {messages.map(m => (
          <div key={m.id} className={`rounded-2xl p-3 text-[12px] ${m.role === 'user' ? 'ml-8 bg-[#F7941D]/18 text-[#1A1F2B]' : 'mr-8 bg-[#1A1F2B]/8 text-[#1A1F2B]'}`}>
            <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">{m.role === 'user' ? 'Tú' : 'Xoria'}</p>
            <p>{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="mr-8 rounded-2xl bg-[#1A1F2B]/8 p-3 text-[12px] text-[#6E7F8D]">
            <p className="mb-1 text-[10px] uppercase tracking-[0.14em]">Xoria</p>
            Analizando patrones…
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Consulta sobre fraude, proveedores o expedientes observados…"
          className="flex-1 rounded-xl bg-[#EFF2F9] px-3 py-2 text-[12px] text-[#1A1F2B] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)] outline-none" />
        {supported && (
          <button onClick={toggleListen}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${isListening ? 'bg-[#7C1F31] text-white' : 'bg-[#EFF2F9] text-[#6E7F8D] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)]'}`}>
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
        )}
        <button onClick={() => handleSend()}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.30)] hover:bg-[#E8820A] transition-all">
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Alerta card ──────────────────────────────────────────────────────────────

function AlertCard({ alert, onResolve }: { alert: FraudAlert; onResolve: (id: string, res: FraudAlert['resolution']) => void }) {
  const color = fraudColor(alert.severity)
  return (
    <div className="rounded-2xl bg-white/35 p-4 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12px] text-[#1A1F2B] truncate">{alert.entityName}</p>
          <p className="text-[10px] text-[#6E7F8D]">{alert.detectedAt}</p>
        </div>
        <StatusBadge color={color} text={fraudLevelLabel[alert.severity]} />
      </div>

      <p className="text-[12px] text-[#1A1F2B] font-medium">{alert.description}</p>

      <div className="rounded-xl bg-[#EFF2F9] p-2.5 space-y-1">
        {alert.detail.map((d, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[10px] text-[#6E7F8D]">
            <AlertTriangle size={9} className="mt-0.5 shrink-0" style={{ color }} />
            {d}
          </div>
        ))}
      </div>

      {alert.agentName && (
        <p className="text-[10px] text-[#6E7F8D]">Agente: {alert.agentName} · {alert.promotoria}</p>
      )}

      {alert.resolution === 'pendiente' && (
        <div className="flex gap-2">
          <button onClick={() => onResolve(alert.id, 'confirmado_fraude')}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#7C1F31]/12 px-3 py-2 text-[11px] text-[#7C1F31] hover:bg-[#7C1F31]/20 transition-all">
            <XCircle size={13} /> Confirmar fraude
          </button>
          <button onClick={() => onResolve(alert.id, 'falso_positivo')}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#69A481]/12 px-3 py-2 text-[11px] text-[#69A481] hover:bg-[#69A481]/20 transition-all">
            <CheckCircle2 size={13} /> Falso positivo
          </button>
        </div>
      )}
      {alert.resolution !== 'pendiente' && (
        <div className="rounded-xl px-3 py-2 text-[11px]"
          style={{ background: alert.resolution === 'confirmado_fraude' ? 'rgba(124,31,49,0.1)' : 'rgba(105,164,129,0.1)', color: alert.resolution === 'confirmado_fraude' ? '#7C1F31' : '#69A481' }}>
          {alert.resolution === 'confirmado_fraude' ? '⚠ Fraude confirmado' : '✓ Falso positivo'}
        </div>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export function CarrierFraudPage() {
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<FraudState | 'todos'>('todos')
  const [localResolutions, setLocalResolutions] = useState<Record<string, FraudAlert['resolution']>>({})

  function handleResolve(id: string, res: FraudAlert['resolution']) {
    setLocalResolutions(prev => ({ ...prev, [id]: res }))
  }

  const filtered = useMemo(() => {
    return fraudAlerts.filter(a => {
      const effectiveSeverity = severityFilter === 'todos' || a.severity === severityFilter
      const src = `${a.entityName} ${a.description} ${a.agentName ?? ''} ${a.promotoria ?? ''}`.toLowerCase()
      const matchSearch = !search.trim() || src.includes(search.toLowerCase())
      return effectiveSeverity && matchSearch
    }).map(a => ({ ...a, resolution: localResolutions[a.id] ?? a.resolution }))
  }, [fraudAlerts, search, severityFilter, localResolutions])

  const SEVERITIES: FraudState[] = ['normal', 'observado', 'riesgo_medio', 'riesgo_alto', 'bloqueo_auditoria']

  const kpis = useMemo(() => ({
    criticos: fraudAlerts.filter(a => a.severity === 'riesgo_alto' || a.severity === 'bloqueo_auditoria').length,
    pendientes: fraudAlerts.filter(a => (localResolutions[a.id] ?? a.resolution) === 'pendiente').length,
    confirmados: Object.values(localResolutions).filter(r => r === 'confirmado_fraude').length,
    proveedoresSusp: suspiciousProviders.filter(p => p.state === 'riesgo_alto' || p.state === 'bloqueo_auditoria').length,
  }), [localResolutions])

  // Agentes con mayor tasa de rechazo
  const agentesObservados = agentPerformance
    .filter(a => a.claimsRatio > 55 || a.cancellations > 5)
    .sort((a, b) => b.claimsRatio - a.claimsRatio)

  // Solicitudes con inconsistencias
  const solicitudesAnomales = underwritingCases.filter(u => u.inconsistencies.length > 0)

  return (
    <div className="space-y-4">

      {/* KPIs antifraude */}
      <Panel
        title="Auditoría y antifraude"
        subtitle="Motor de deteccion de anomalias en originacion, cobranza, siniestros y proveedores."
        right={<ShieldOff size={16} className="text-[#7C1F31]" />}
      >
        <div className="grid gap-3 sm:grid-cols-4">
          <Link href="/agent/aseguradora/antifraude" className="group rounded-2xl bg-white/35 p-4 hover:bg-white/55 transition-all">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Alertas criticas</p>
              <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#7C1F31] transition-colors" />
            </div>
            <p className="mt-1.5 text-[28px] text-[#7C1F31]">{kpis.criticos}</p>
            <p className="text-[10px] text-[#6E7F8D] mt-0.5">Riesgo alto + Bloqueo</p>
          </Link>
          <Link href="/agent/aseguradora/antifraude" className="group rounded-2xl bg-white/35 p-4 hover:bg-white/55 transition-all">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Pendientes revision</p>
              <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#F7941D] transition-colors" />
            </div>
            <p className="mt-1.5 text-[28px] text-[#F7941D]">{kpis.pendientes}</p>
            <p className="text-[10px] text-[#6E7F8D] mt-0.5">Sin resolucion asignada</p>
          </Link>
          <Link href="/agent/aseguradora/antifraude" className="group rounded-2xl bg-white/35 p-4 hover:bg-white/55 transition-all">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Fraudes confirmados</p>
              <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#7C1F31] transition-colors" />
            </div>
            <p className="mt-1.5 text-[28px] text-[#7C1F31]">{kpis.confirmados}</p>
            <p className="text-[10px] text-[#6E7F8D] mt-0.5">En esta sesion de revision</p>
          </Link>
          <Link href="/agent/aseguradora/antifraude" className="group rounded-2xl bg-white/35 p-4 hover:bg-white/55 transition-all">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Proveedores sospechosos</p>
              <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#7C1F31] transition-colors" />
            </div>
            <p className="mt-1.5 text-[28px] text-[#7C1F31]">{kpis.proveedoresSusp}</p>
            <p className="text-[10px] text-[#6E7F8D] mt-0.5">Con riesgo alto o bloqueo</p>
          </Link>
        </div>
      </Panel>

      {/* Bandeja de alertas */}
      <Panel
        title="Alertas activas"
        subtitle="Anomalias detectadas en originacion, siniestros, cobranza y proveedores."
        right={
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setSeverityFilter('todos')}
                className={`rounded-full px-2.5 py-1 text-[10px] transition-all ${severityFilter === 'todos' ? 'bg-[#F7941D] text-white' : 'bg-white/35 text-[#6E7F8D] hover:bg-white/55'}`}>
                Todos
              </button>
              {SEVERITIES.map(s => (
                <button key={s} onClick={() => setSeverityFilter(prev => prev === s ? 'todos' : s)}
                  className={`rounded-full px-2.5 py-1 text-[10px] transition-all ${severityFilter === s ? 'bg-[#F7941D] text-white' : 'bg-white/35 text-[#6E7F8D] hover:bg-white/55'}`}>
                  {fraudLevelLabel[s]}
                </button>
              ))}
            </div>
            <label className="relative block w-full max-w-[220px]">
              <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7F8D]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar alerta o expediente"
                className="w-full rounded-xl bg-[#EFF2F9] py-2 pl-8 pr-3 text-[11px] text-[#1A1F2B] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)] outline-none" />
            </label>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(alert => <AlertCard key={alert.id} alert={alert} onResolve={handleResolve} />)}
          {filtered.length === 0 && (
            <p className="col-span-3 text-center text-[12px] text-[#6E7F8D] py-6">Sin alertas con ese filtro.</p>
          )}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Proveedores sospechosos */}
        <Panel title="Proveedores observados" subtitle="Talleres, hospitales, gruas y despachos con patrones de anomalia.">
          <div className="space-y-2">
            {suspiciousProviders.map(prov => {
              const col = fraudColor(prov.state)
              return (
                <div key={prov.id} className="rounded-2xl bg-white/35 p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-[12px] text-[#1A1F2B]">{prov.name}</p>
                      <p className="text-[10px] text-[#6E7F8D] capitalize">{prov.type} · {prov.zone}</p>
                    </div>
                    <StatusBadge color={col} text={fraudLevelLabel[prov.state]} />
                  </div>
                  <p className="text-[10px] text-[#6E7F8D] mb-2">{prov.topAlert}</p>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="rounded-full px-2 py-1" style={{ background: `${col}18`, color: col }}>
                      {prov.alertCount} alertas
                    </span>
                    {prov.avgInvoiceInflation > 0 && (
                      <span className="rounded-full bg-[#F7941D]/12 px-2 py-1 text-[#F7941D]">
                        +{prov.avgInvoiceInflation}% sobre historico
                      </span>
                    )}
                    {prov.duplicateClaims > 0 && (
                      <span className="rounded-full bg-[#7C1F31]/12 px-2 py-1 text-[#7C1F31]">
                        {prov.duplicateClaims} duplicados
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* Agentes y solicitudes con anomalías */}
        <div className="space-y-4">
          <Panel title="Agentes observados" subtitle="Canales comerciales con indicadores de riesgo operativo.">
            <div className="space-y-2">
              {agentesObservados.map(ag => (
                <div key={ag.id} className="rounded-2xl bg-white/35 p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-[#1A1F2B]">{ag.name}</p>
                    <p className="text-[10px] text-[#6E7F8D]">{ag.promotoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px]" style={{ color: ag.claimsRatio > 60 ? '#7C1F31' : '#F7941D' }}>
                      Siniestralidad {ag.claimsRatio}%
                    </p>
                    <p className="text-[10px] text-[#6E7F8D]">Cancelaciones {ag.cancellations}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Solicitudes con inconsistencias" subtitle="Expedientes en underwriting con alertas de datos.">
            <div className="space-y-2">
              {solicitudesAnomales.map(uw => (
                <div key={uw.id} className="rounded-2xl bg-white/35 p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[12px] text-[#1A1F2B]">{uw.insuredName}</p>
                    <span className="text-[10px] text-[#7C1F31] flex items-center gap-1">
                      <AlertTriangle size={10} /> {uw.inconsistencies.length} inconsistencias
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6E7F8D] mb-1">{uw.id} · {uw.product}</p>
                  {uw.inconsistencies.map((inc, i) => (
                    <p key={i} className="text-[10px] text-[#7C1F31]">· {inc}</p>
                  ))}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Xoria antifraude */}
      <Panel
        title="Xoria — inteligencia antifraude"
        subtitle="Consulta alertas criticas, patrones sospechosos, resumen de casos y proveedores observados."
        right={<Bot size={16} className="text-[#F7941D]" />}
      >
        <XoriaFraudChat />
      </Panel>
    </div>
  )
}
