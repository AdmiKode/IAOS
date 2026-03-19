'use client'
import { useState } from 'react'
import { MOCK_AUDIT_LOG } from '@/data/mock'
import { Shield, Search, Download, Filter, AlertTriangle, User, FileText, Brain, Settings, Activity, X, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ClientLink } from '@/components/ui'

type AuditEntry = typeof MOCK_AUDIT_LOG[0]

const TIPO_META: Record<string, { color: string; icon: typeof Shield; label: string }> = {
  acceso:     { color: '#69A481', icon: User, label: 'Acceso' },
  operacion:  { color: '#F7941D', icon: Activity, label: 'Operacion' },
  documento:  { color: '#6B7280', icon: FileText, label: 'Documento' },
  ia:         { color: '#7C1F31', icon: Brain, label: 'IA' },
  admin:      { color: '#1A1F2B', icon: Settings, label: 'Admin' },
  sistema:    { color: '#9CA3AF', icon: Shield, label: 'Sistema' },
}

export default function CompliancePage() {
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState<string | null>(null)
  const [detail, setDetail] = useState<AuditEntry | null>(null)

  const filtered = MOCK_AUDIT_LOG.filter(entry => {
    const detalle = (entry as any).detalle || (entry as any).modulo || ''
    const matchSearch = entry.usuario.toLowerCase().includes(search.toLowerCase()) ||
      entry.accion.toLowerCase().includes(search.toLowerCase()) ||
      detalle.toLowerCase().includes(search.toLowerCase())
    const matchTipo = !filterTipo || entry.tipo === filterTipo
    return matchSearch && matchTipo
  })

  const tiposUnicos = [...new Set(MOCK_AUDIT_LOG.map(e => e.tipo))]

  const kpis = [
    { label: 'Eventos hoy', val: MOCK_AUDIT_LOG.length, color: '#6B7280' },
    { label: 'Accesos', val: MOCK_AUDIT_LOG.filter(e => e.tipo === 'acceso').length, color: '#69A481' },
    { label: 'Ops IA', val: MOCK_AUDIT_LOG.filter(e => e.tipo === 'ia').length, color: '#7C1F31' },
    { label: 'Alertas', val: MOCK_AUDIT_LOG.filter(e => e.tipo === 'operacion').length, color: '#F7941D' },
  ]

  return (
    <>
    <div className="flex flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.color}15` }}>
              <Shield size={14} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-[20px] leading-tight" style={{ color: k.color }}>{k.val}</p>
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-[#EFF2F9] rounded-2xl p-3 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por usuario, accion, detalle..."
            className="w-full bg-[#EFF2F9] pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
        </div>
        {tiposUnicos.map(t => {
          const meta = TIPO_META[t] || { color: '#9CA3AF', label: t }
          return (
            <button key={t} onClick={() => setFilterTipo(filterTipo === t ? null : t)}
              className="text-[11px] px-2.5 py-1.5 rounded-xl transition-all"
              style={{ background: filterTipo === t ? `${meta.color}20` : 'transparent', color: filterTipo === t ? meta.color : '#9CA3AF', border: `1px solid ${filterTipo === t ? meta.color : '#D1D5DB'}` }}>
              {meta.label || t}
            </button>
          )
        })}
        <button className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors ml-auto">
          <Download size={13} />
        </button>
      </div>

      {/* Bitácora */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
        {/* Encabezado tabla */}
        <div className="grid grid-cols-6 gap-3 px-3 pb-2 border-b border-[#D1D5DB]/20">
          {['Hora', 'Tipo', 'Usuario', 'Accion', 'Detalle', 'IP'].map(h => (
            <p key={h} className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{h}</p>
          ))}
        </div>

        <div className="flex flex-col">
          {filtered.map(entry => {
            const meta = TIPO_META[entry.tipo] || { color: '#9CA3AF', icon: Shield, label: entry.tipo }
            const Icon = meta.icon
            return (
              <div key={entry.id} onClick={() => setDetail(entry)} className="grid grid-cols-6 gap-3 px-3 py-3 border-b border-[#D1D5DB]/10 last:border-0 hover:bg-white/40 rounded-xl transition-colors items-center cursor-pointer">
                <p className="text-[11px] text-[#9CA3AF] font-mono">{(entry as any).hora || (entry as any).fecha || ''}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${meta.color}15` }}>
                    <Icon size={10} style={{ color: meta.color }} />
                  </div>
                  <span className="text-[11px]" style={{ color: meta.color }}>{meta.label}</span>
                </div>
                <ClientLink name={entry.usuario} plain className="text-[12px] truncate" />
                <p className="text-[12px] text-[#6B7280] truncate">{entry.accion}</p>
                <p className="text-[11px] text-[#9CA3AF] truncate">{(entry as any).detalle || (entry as any).modulo || ''}</p>
                <p className="text-[11px] text-[#B5BFC6] font-mono">{entry.ip}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>

      {/* Modal detalle entrada */}
      {detail && (() => {
        const meta = TIPO_META[detail.tipo] || { color: '#9CA3AF', icon: Shield, label: detail.tipo }
        const Icon = meta.icon
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}>
            <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm p-6 shadow-[−20px_−20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4">
              <button onClick={() => setDetail(null)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors"><X size={16} /></button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${meta.color}18` }}>
                  <Icon size={18} style={{ color: meta.color }} />
                </div>
                <div>
                  <p className="text-[15px] text-[#1A1F2B]">Detalle de evento</p>
                  <p className="text-[11px]" style={{ color: meta.color }}>{meta.label}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Hora', val: (detail as any).hora || (detail as any).fecha || '' },
                  { label: 'Usuario', val: detail.usuario },
                  { label: 'Accion', val: detail.accion },
                  { label: 'Detalle', val: (detail as any).detalle || (detail as any).modulo || '' },
                  { label: 'IP', val: detail.ip },
                  { label: 'Tipo', val: meta.label },
                ].map(f => f.val ? (
                  <div key={f.label} className="flex items-start gap-3">
                    <p className="text-[11px] text-[#9CA3AF] w-16 shrink-0 pt-0.5">{f.label}</p>
                    <p className="text-[13px] text-[#1A1F2B] flex-1">{f.val}</p>
                  </div>
                ) : null)}
              </div>
              <button onClick={() => setDetail(null)}
                className="w-full py-2.5 rounded-2xl text-[13px] text-[#6B7280] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-colors bg-[#EFF2F9]">
                Cerrar
              </button>
            </div>
          </div>
        )
      })()}
  </>
  )
}