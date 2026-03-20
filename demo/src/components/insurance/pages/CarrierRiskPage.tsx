'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Mic,
  MicOff,
  Send,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import {
  fraudAlerts,
  formatCurrencyMXN,
  riskKpis,
  riskLevelLabel,
  riskScores,
  RiskLevel,
  RiskScoreRecord,
  xoriaRiskPrompts,
} from '@/data/carrier-core'
import { Panel, StatusBadge } from '@/components/insurance/CarrierUi'
import { useVoiceIO } from '@/lib/useVoiceIO'

// ─── Helpers de color ─────────────────────────────────────────────────────────

function riskColor(level: RiskLevel): '#69A481' | '#F7941D' | '#7C1F31' | '#6E7F8D' {
  if (level === 'bajo') return '#69A481'
  if (level === 'medio') return '#F7941D'
  if (level === 'alto') return '#7C1F31'
  return '#7C1F31' // critico
}

function scoreColor(score: number) {
  if (score >= 75) return '#69A481'
  if (score >= 55) return '#F7941D'
  return '#7C1F31'
}

function scoreBar(score: number) {
  const color = scoreColor(score)
  return (
    <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#B5BFC6]/30">
      <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
    </div>
  )
}

// ─── Mini chat Xoria ──────────────────────────────────────────────────────────

interface ChatMsg { id: string; role: 'user' | 'assistant'; text: string }

function XoriaRiskChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'init', role: 'assistant', text: 'Xoria de riesgo activa. Puedo analizar scores, cartera en riesgo, propension de cancelacion y alertas de fraude. ¿Qué necesitas revisar?' },
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
            perfil: 'aseguradora_riesgo',
            riskScores,
            riskKpis,
            fraudAlerts,
          },
        }),
      })
      const data = await res.json()
      const reply = data.response || data.reply || 'Sin respuesta de análisis.'
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
        {xoriaRiskPrompts.map(p => (
          <button key={p} onClick={() => handleSend(p)}
            className="rounded-full bg-white/35 px-3 py-1.5 text-[11px] text-[#1A1F2B] hover:bg-white/55 transition-all">
            {p}
          </button>
        ))}
      </div>

      <div className="max-h-[320px] space-y-2 overflow-y-auto rounded-2xl bg-white/35 p-3">
        {messages.map(m => (
          <div key={m.id} className={`rounded-2xl p-3 text-[12px] ${m.role === 'user' ? 'ml-8 bg-[#F7941D]/18 text-[#1A1F2B]' : 'mr-8 bg-[#1A1F2B]/8 text-[#1A1F2B]'}`}>
            <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">{m.role === 'user' ? 'Tú' : 'Xoria'}</p>
            <p>{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="mr-8 rounded-2xl bg-[#1A1F2B]/8 p-3 text-[12px] text-[#6E7F8D]">
            <p className="mb-1 text-[10px] uppercase tracking-[0.14em]">Xoria</p>
            Analizando…
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Pregunta sobre riesgo, scores o cartera…"
          className="flex-1 rounded-xl bg-[#EFF2F9] px-3 py-2 text-[12px] text-[#1A1F2B] shadow-[inset_-3px_-3px_8px_#FAFBFF,inset_3px_3px_8px_rgba(22,27,29,0.16)] outline-none"
        />
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

// ─── Tarjeta de score ─────────────────────────────────────────────────────────

function ScoreCard({ record }: { record: RiskScoreRecord }) {
  const sc = scoreColor(record.riskScore)
  return (
    <div className="rounded-2xl bg-white/35 p-4 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12px] text-[#1A1F2B] truncate">{record.insuredName}</p>
          <p className="text-[10px] text-[#6E7F8D] truncate">{record.product} · {record.entityId}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[22px]" style={{ color: sc }}>{record.riskScore}</p>
          <p className="text-[9px] text-[#6E7F8D] uppercase tracking-[0.12em]">Risk Score</p>
        </div>
      </div>
      {scoreBar(record.riskScore)}

      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
        <div className="flex items-center justify-between rounded-xl bg-[#EFF2F9] px-2.5 py-1.5">
          <span className="text-[#6E7F8D]">Fraude</span>
          <StatusBadge color={riskColor(record.fraudRisk)} text={riskLevelLabel[record.fraudRisk]} />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#EFF2F9] px-2.5 py-1.5">
          <span className="text-[#6E7F8D]">Impago</span>
          <StatusBadge color={riskColor(record.paymentDefaultRisk)} text={riskLevelLabel[record.paymentDefaultRisk]} />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#EFF2F9] px-2.5 py-1.5">
          <span className="text-[#6E7F8D]">Cancelación</span>
          <StatusBadge color={riskColor(record.cancellationRisk)} text={riskLevelLabel[record.cancellationRisk]} />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#EFF2F9] px-2.5 py-1.5">
          <span className="text-[#6E7F8D]">Renovacion</span>
          <span style={{ color: record.renewalPropensity >= 70 ? '#69A481' : record.renewalPropensity >= 50 ? '#F7941D' : '#7C1F31' }}>
            {record.renewalPropensity}%
          </span>
        </div>
      </div>

      {record.flags.length > 0 && (
        <div className="rounded-xl bg-[#7C1F31]/8 p-2.5 space-y-1">
          {record.flags.map((f, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[10px] text-[#7C1F31]">
              <AlertTriangle size={10} className="mt-0.5 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export function CarrierRiskPage() {
  const [ramoFilter, setRamoFilter] = useState<string>('todos')
  const [minScore, setMinScore] = useState(0)

  const ramos = useMemo(() => ['todos', ...Array.from(new Set(riskScores.map(r => r.ramo)))], [])

  const filtered = useMemo(() => riskScores.filter(r => {
    const matchRamo = ramoFilter === 'todos' || r.ramo === ramoFilter
    const matchScore = r.riskScore >= minScore
    return matchRamo && matchScore
  }), [ramoFilter, minScore])

  const criticalCount = riskScores.filter(r => r.riskScore < 50).length
  const highFraud = riskScores.filter(r => r.fraudRisk === 'alto' || r.fraudRisk === 'critico').length
  const highCancellation = riskScores.filter(r => r.cancellationRisk === 'alto' || r.cancellationRisk === 'critico').length

  return (
    <div className="space-y-4">

      {/* KPIs de riesgo */}
      <Panel
        title="Inteligencia de riesgo"
        subtitle="Modelos predictivos de riesgo transversales: suscripcion, cartera activa y siniestros."
        right={<Zap size={16} className="text-[#F7941D]" />}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {riskKpis.map(kpi => (
            <Link key={kpi.id} href={kpi.drillPath ?? '/agent/aseguradora/riesgo'}
              className="group rounded-2xl bg-white/35 p-4 hover:bg-white/55 transition-all"
            >
              <div className="flex items-start justify-between">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">{kpi.label}</p>
                <ArrowUpRight size={12} className="text-[#B5BFC6] group-hover:text-[#F7941D] transition-colors" />
              </div>
              <p className="mt-1.5 text-[22px]" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="mt-1 text-[10px] text-[#6E7F8D]">{kpi.detail}</p>
            </Link>
          ))}
        </div>
      </Panel>

      {/* Resumen rápido */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/agent/aseguradora/underwriting" className="group rounded-3xl bg-[#EFF2F9] p-4 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.16)] hover:shadow-[-4px_-4px_12px_#FAFBFF,4px_4px_12px_rgba(22,27,29,0.20)] transition-all">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-[#7C1F31]" />
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Score critico (&lt;50)</p>
            <ArrowUpRight size={11} className="ml-auto text-[#B5BFC6] group-hover:text-[#7C1F31] transition-colors" />
          </div>
          <p className="text-[28px] text-[#7C1F31]">{criticalCount}</p>
          <p className="text-[10px] text-[#6E7F8D] mt-0.5">Requieren revision o rechazo inmediato</p>
        </Link>
        <Link href="/agent/aseguradora/antifraude" className="group rounded-3xl bg-[#EFF2F9] p-4 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.16)] hover:shadow-[-4px_-4px_12px_#FAFBFF,4px_4px_12px_rgba(22,27,29,0.20)] transition-all">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} className="text-[#F7941D]" />
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Fraude alto detectado</p>
            <ArrowUpRight size={11} className="ml-auto text-[#B5BFC6] group-hover:text-[#F7941D] transition-colors" />
          </div>
          <p className="text-[28px] text-[#F7941D]">{highFraud}</p>
          <p className="text-[10px] text-[#6E7F8D] mt-0.5">Expedientes con indicadores de fraude alto+</p>
        </Link>
        <Link href="/agent/aseguradora/polizas" className="group rounded-3xl bg-[#EFF2F9] p-4 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.16)] hover:shadow-[-4px_-4px_12px_#FAFBFF,4px_4px_12px_rgba(22,27,29,0.20)] transition-all">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-[#F7941D]" />
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">Riesgo cancelacion alto</p>
            <ArrowUpRight size={11} className="ml-auto text-[#B5BFC6] group-hover:text-[#F7941D] transition-colors" />
          </div>
          <p className="text-[28px] text-[#F7941D]">{highCancellation}</p>
          <p className="text-[10px] text-[#6E7F8D] mt-0.5">Polizas con alta propension a bajar</p>
        </Link>
      </div>

      {/* Scoring por expediente */}
      <Panel
        title="Scoring por expediente"
        subtitle="Score de riesgo individual con variables clave, flags y probabilidades predictivas."
        right={
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1">
              {ramos.map(r => (
                <button key={r} onClick={() => setRamoFilter(r)}
                  className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] transition-all ${ramoFilter === r ? 'bg-[#F7941D] text-white' : 'bg-white/35 text-[#6E7F8D] hover:bg-white/55'}`}>
                  {r}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#6E7F8D]">
              <span>Score min:</span>
              <input type="range" min={0} max={100} step={5} value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="w-20 accent-[#F7941D]" />
              <span className="text-[#1A1F2B]">{minScore}</span>
            </div>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(record => <ScoreCard key={record.id} record={record} />)}
          {filtered.length === 0 && (
            <p className="col-span-3 text-center text-[12px] text-[#6E7F8D] py-6">Sin expedientes con ese filtro.</p>
          )}
        </div>
      </Panel>

      {/* Segmentación de cartera por riesgo */}
      <Panel title="Cartera en riesgo — segmentacion" subtitle="Distribucion de score por ramo y nivel de criticidad.">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#B5BFC6]/30 text-[10px] uppercase tracking-[0.14em] text-[#6E7F8D]">
                <th className="py-2">Expediente</th>
                <th className="py-2">Asegurado</th>
                <th className="py-2">Tipo</th>
                <th className="py-2">Score</th>
                <th className="py-2">Impago</th>
                <th className="py-2">Cancelacion</th>
                <th className="py-2">Severidad siniestro</th>
                <th className="py-2">Valor esperado</th>
              </tr>
            </thead>
            <tbody>
              {riskScores.map(r => (
                <tr key={r.id} className="border-b border-[#B5BFC6]/20 text-[11px] text-[#1A1F2B] hover:bg-white/35">
                  <td className="py-2">
                    <p>{r.entityId}</p>
                    <p className="text-[10px] text-[#6E7F8D] capitalize">{r.entityType}</p>
                  </td>
                  <td className="py-2">
                    <p>{r.insuredName}</p>
                    <p className="text-[10px] text-[#6E7F8D]">{r.agentName}</p>
                  </td>
                  <td className="py-2 capitalize">{r.ramo}</td>
                  <td className="py-2">
                    <span style={{ color: scoreColor(r.riskScore) }} className="text-[14px]">{r.riskScore}</span>
                    <p className="text-[9px] text-[#6E7F8D]">/100</p>
                  </td>
                  <td className="py-2">
                    <StatusBadge color={riskColor(r.paymentDefaultRisk)} text={riskLevelLabel[r.paymentDefaultRisk]} />
                  </td>
                  <td className="py-2">
                    <StatusBadge color={riskColor(r.cancellationRisk)} text={riskLevelLabel[r.cancellationRisk]} />
                  </td>
                  <td className="py-2">
                    <StatusBadge color={riskColor(r.claimsSeverityForecast)} text={riskLevelLabel[r.claimsSeverityForecast]} />
                  </td>
                  <td className="py-2">
                    {r.expectedValue > 0 ? formatCurrencyMXN(r.expectedValue) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Xoria de riesgo */}
      <Panel
        title="Xoria — analisis de riesgo"
        subtitle="Consulta por voz o texto: scores, cartera en riesgo, flags y recomendaciones operativas."
        right={<Bot size={16} className="text-[#F7941D]" />}
      >
        <XoriaRiskChat />
      </Panel>
    </div>
  )
}
