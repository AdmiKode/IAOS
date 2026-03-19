'use client'
import { useState } from 'react'
import { Brain, Zap, DollarSign, Activity, Edit2, Save, X, Plus, ToggleLeft, ToggleRight, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const PROMPTS_MOCK = [
  { id: 'p1', nombre: 'Asistente principal XORIA', tipo: 'sistema', activo: true, tokens: 420, texto: 'Eres XORIA, un asistente de seguros experto. Respondes en espanol formal. Tienes acceso a pólizas, clientes, siniestros y pagos. Nunca inventas datos.' },
  { id: 'p2', nombre: 'Respuesta tickets', tipo: 'workflow', activo: true, tokens: 180, texto: 'Analiza el ticket del cliente y genera una respuesta profesional, clara y empática. Propone soluciones concretas en menos de 150 palabras.' },
  { id: 'p3', nombre: 'Resumen de cliente', tipo: 'analisis', activo: true, tokens: 95, texto: 'Genera un resumen ejecutivo del cliente incluyendo: portafolio de pólizas, score de salud, alertas activas y recomendaciones de cross-selling.' },
  { id: 'p4', nombre: 'Apertura de siniestro', tipo: 'workflow', activo: false, tokens: 220, texto: 'Recopila la información del siniestro paso a paso: tipo, fecha, descripcion, monto estimado. Valida los campos y prepara el expediente.' },
]

const LOGS_MOCK = [
  { id: 'l1', hora: '14:32', usuario: 'Carlos Mendoza', modelo: 'gpt-4o', tokens: 1240, costo: '$0.004', accion: 'Chat XORIA - consulta póliza', estado: 'ok' },
  { id: 'l2', hora: '14:18', usuario: 'Sistema', modelo: 'gpt-4o', tokens: 890, costo: '$0.003', accion: 'Resumen cliente Ana Lopez', estado: 'ok' },
  { id: 'l3', hora: '13:55', usuario: 'María García', modelo: 'gpt-4o-mini', tokens: 430, costo: '$0.001', accion: 'Respuesta ticket #T002', estado: 'ok' },
  { id: 'l4', hora: '13:40', usuario: 'Sistema', modelo: 'gpt-4o', tokens: 2100, costo: '$0.007', accion: 'Análisis portafolio semanal', estado: 'ok' },
  { id: 'l5', hora: '13:12', usuario: 'Carlos Mendoza', modelo: 'gpt-4o-realtime', tokens: 5800, costo: '$0.058', accion: 'Llamada de voz IA - 3min', estado: 'ok' },
]

const TIPO_COLOR: Record<string, string> = {
  sistema: '#7C1F31', workflow: '#F7941D', analisis: '#69A481'
}

export default function IAControlPage() {
  const [prompts, setPrompts] = useState(PROMPTS_MOCK)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [tab, setTab] = useState<'prompts' | 'logs' | 'costos'>('prompts')

  const totalTokens = LOGS_MOCK.reduce((acc, l) => acc + l.tokens, 0)
  const totalCost = LOGS_MOCK.reduce((acc, l) => acc + parseFloat(l.costo.replace('$', '')), 0).toFixed(3)

  const togglePrompt = (id: string) => setPrompts(prev => prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p))
  const startEdit = (p: typeof PROMPTS_MOCK[0]) => { setEditingId(p.id); setEditText(p.texto) }
  const saveEdit = () => {
    setPrompts(prev => prev.map(p => p.id === editingId ? { ...p, texto: editText } : p))
    setEditingId(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Prompts activos', val: prompts.filter(p => p.activo).length, color: '#69A481', icon: Brain },
          { label: 'Llamadas hoy', val: LOGS_MOCK.length, color: '#6B7280', icon: Activity },
          { label: 'Tokens usados', val: totalTokens.toLocaleString(), color: '#F7941D', icon: Zap },
          { label: 'Costo estimado', val: `$${totalCost}`, color: '#7C1F31', icon: DollarSign },
        ].map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.color}15` }}>
              <k.icon size={14} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-[18px] leading-tight" style={{ color: k.color }}>{k.val}</p>
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#EFF2F9] rounded-2xl p-1.5 shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)] w-fit">
        {[{ key: 'prompts', label: 'Prompts del sistema' }, { key: 'logs', label: 'Logs de IA' }, { key: 'costos', label: 'Consumo' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={cn('px-4 py-2 rounded-xl text-[12px] transition-all',
              tab === t.key ? 'bg-[#EFF2F9] text-[#F7941D] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)]' : 'text-[#9CA3AF] hover:text-[#6B7280]')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Prompts */}
      {tab === 'prompts' && (
        <div className="flex flex-col gap-3">
          {prompts.map(p => (
            <div key={p.id} className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${TIPO_COLOR[p.tipo] || '#9CA3AF'}15` }}>
                    <Brain size={14} style={{ color: TIPO_COLOR[p.tipo] || '#9CA3AF' }} />
                  </div>
                  <div>
                    <p className="text-[13px] text-[#1A1F2B]">{p.nombre}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: `${TIPO_COLOR[p.tipo]}15`, color: TIPO_COLOR[p.tipo] }}>{p.tipo}</span>
                      <span className="text-[10px] text-[#9CA3AF]">{p.tokens} tokens</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePrompt(p.id)}>
                    {p.activo ? <ToggleRight size={22} style={{ color: '#69A481' }} /> : <ToggleLeft size={22} className="text-[#9CA3AF]" />}
                  </button>
                  {editingId === p.id ? (
                    <>
                      <button onClick={saveEdit} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#69A481]/10 text-[#69A481] hover:bg-[#69A481]/20 transition-colors">
                        <Save size={12} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(p)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
                      <Edit2 size={12} />
                    </button>
                  )}
                </div>
              </div>
              {editingId === p.id ? (
                <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={4}
                  className="w-full bg-[#EFF2F9] p-3 text-[12px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]" />
              ) : (
                <p className="text-[12px] text-[#6B7280] leading-relaxed bg-white/30 rounded-xl p-3">{p.texto}</p>
              )}
            </div>
          ))}
          <button className="flex items-center gap-2 text-[12px] text-[#9CA3AF] hover:text-[#F7941D] transition-colors px-2">
            <Plus size={14} />
            Agregar prompt
          </button>
        </div>
      )}

      {/* Logs */}
      {tab === 'logs' && (
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
          <div className="grid grid-cols-6 gap-3 px-3 pb-2 border-b border-[#D1D5DB]/20">
            {['Hora', 'Usuario', 'Modelo', 'Accion', 'Tokens', 'Costo'].map(h => (
              <p key={h} className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{h}</p>
            ))}
          </div>
          {LOGS_MOCK.map(l => (
            <div key={l.id} className="grid grid-cols-6 gap-3 px-3 py-3 border-b border-[#D1D5DB]/10 last:border-0 hover:bg-white/30 rounded-xl transition-colors items-center">
              <p className="text-[11px] text-[#9CA3AF] font-mono">{l.hora}</p>
              <p className="text-[12px] text-[#1A1F2B] truncate">{l.usuario}</p>
              <p className="text-[11px] text-[#6B7280] truncate">{l.modelo}</p>
              <p className="text-[12px] text-[#6B7280] truncate">{l.accion}</p>
              <p className="text-[12px] text-[#F7941D]">{l.tokens.toLocaleString()}</p>
              <p className="text-[12px] text-[#69A481]">{l.costo}</p>
            </div>
          ))}
        </div>
      )}

      {/* Consumo */}
      {tab === 'costos' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
            <p className="text-[14px] text-[#1A1F2B] mb-4">Consumo por modelo</p>
            {[
              { modelo: 'gpt-4o', tokens: 4230, costo: '$0.014', porcentaje: 72 },
              { modelo: 'gpt-4o-mini', tokens: 430, costo: '$0.001', porcentaje: 8 },
              { modelo: 'gpt-4o-realtime', tokens: 5800, costo: '$0.058', porcentaje: 20 },
            ].map(m => (
              <div key={m.modelo} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[12px] text-[#6B7280]">{m.modelo}</p>
                  <p className="text-[12px] text-[#F7941D]">{m.costo}</p>
                </div>
                <div className="w-full h-1.5 bg-[#EFF2F9] rounded-full shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.10)]">
                  <div className="h-full rounded-full bg-[#F7941D]" style={{ width: `${m.porcentaje}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
            <p className="text-[14px] text-[#1A1F2B] mb-4">Proyeccion mensual</p>
            {[
              { label: 'Consumido (hoy)', val: `$${totalCost}`, color: '#F7941D' },
              { label: 'Proyeccion semanal', val: `$${(parseFloat(totalCost) * 7).toFixed(2)}`, color: '#6B7280' },
              { label: 'Proyeccion mensual', val: `$${(parseFloat(totalCost) * 30).toFixed(2)}`, color: '#7C1F31' },
              { label: 'Limite configurado', val: '$25.00', color: '#69A481' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-[#D1D5DB]/20 last:border-0">
                <p className="text-[12px] text-[#6B7280]">{item.label}</p>
                <p className="text-[14px]" style={{ color: item.color }}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
