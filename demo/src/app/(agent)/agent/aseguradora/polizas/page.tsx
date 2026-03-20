'use client'
import { useState } from 'react'
import { ArrowLeft, Search, FileText, Download, ChevronRight, RefreshCw, Edit, X, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { exportCSV } from '@/lib/exportCSV'

type PolizaStatus = 'activa' | 'en_endoso' | 'por_renovar' | 'cancelada' | 'vencida'

const MOCK_POLIZAS_CORE = [
  { id: 'POL-2026-0101', asegurado: 'Carlos Méndez Ruiz', agente: 'Valeria Castillo', ramo: 'GMM Individual', aseguradora: 'AXA', prima: '$8,400', inicio: '01 Ene 2026', vence: '31 Dic 2026', status: 'activa' as PolizaStatus },
  { id: 'POL-2026-0100', asegurado: 'Empresa Textil S.A.', agente: 'Diego Pacheco', ramo: 'GMM Colectivo', aseguradora: 'GNP', prima: '$42,000', inicio: '01 Feb 2026', vence: '31 Ene 2027', status: 'en_endoso' as PolizaStatus },
  { id: 'POL-2026-0099', asegurado: 'Sofía Torres García', agente: 'Luis Ramírez', ramo: 'GMM Individual', aseguradora: 'Mapfre', prima: '$6,100', inicio: '15 Feb 2026', vence: '14 Feb 2027', status: 'activa' as PolizaStatus },
  { id: 'POL-2025-0088', asegurado: 'Patricia Leal', agente: 'Héctor Ríos', ramo: 'GMM Individual', aseguradora: 'Seguros Monterrey', prima: '$9,200', inicio: '01 Mar 2025', vence: '28 Feb 2026', status: 'por_renovar' as PolizaStatus },
  { id: 'POL-2025-0076', asegurado: 'Roberto Sánchez', agente: 'Ana Domínguez', ramo: 'Vida Individual', aseguradora: 'Metlife', prima: '$3,200', inicio: '01 Jun 2025', vence: '31 May 2026', status: 'por_renovar' as PolizaStatus },
  { id: 'POL-2025-0070', asegurado: 'Grupo Comercial Norte', agente: 'Diego Pacheco', ramo: 'GMM Colectivo', aseguradora: 'GNP', prima: '$78,000', inicio: '01 Jul 2025', vence: '30 Jun 2026', status: 'activa' as PolizaStatus },
  { id: 'POL-2024-0055', asegurado: 'Juan Pablo Reyes', agente: 'Valeria Castillo', ramo: 'Vida Individual', aseguradora: 'Metlife', prima: '$5,500', inicio: '01 Sep 2024', vence: '31 Ago 2025', status: 'vencida' as PolizaStatus },
  { id: 'POL-2024-0040', asegurado: 'Constructora Omega', agente: 'Ana Domínguez', ramo: 'GMM Colectivo', aseguradora: 'AXA', prima: '$55,000', inicio: '01 Ene 2024', vence: '31 Dic 2024', status: 'cancelada' as PolizaStatus },
]

const STATUS_MAP: Record<PolizaStatus, { label: string; color: string; bg: string }> = {
  activa:      { label: 'Activa',       color: '#69A481', bg: 'rgba(105,164,129,0.10)' },
  en_endoso:   { label: 'En endoso',    color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  por_renovar: { label: 'Por renovar',  color: '#F7941D', bg: 'rgba(247,148,29,0.10)' },
  cancelada:   { label: 'Cancelada',    color: '#7C1F31', bg: 'rgba(124,31,49,0.10)' },
  vencida:     { label: 'Vencida',      color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)' },
}

export default function CorePolizasPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<PolizaStatus | 'todos'>('todos')
  const [selected, setSelected] = useState<typeof MOCK_POLIZAS_CORE[0] | null>(null)
  const [endosoModal, setEndosoModal] = useState(false)
  const [endosoNote, setEndosoNote] = useState('')
  const [endosoDone, setEndosoDone] = useState<string[]>([])

  const filtered = MOCK_POLIZAS_CORE.filter(p => {
    const matchStatus = filterStatus === 'todos' || p.status === filterStatus
    const matchSearch = !search || p.asegurado.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.agente.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/agent/dashboard')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] text-[#F7941D] font-semibold tracking-[0.2em] uppercase">Core Asegurador</span>
            <span className="text-[10px] text-[#D1D5DB]">·</span>
            <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">Policy Admin</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Administración de pólizas</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Cartera completa · endosos · renovaciones · cancelaciones</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => exportCSV(MOCK_POLIZAS_CORE.map(p => ({ ID: p.id, Asegurado: p.asegurado, Agente: p.agente, Ramo: p.ramo, Aseguradora: p.aseguradora, Prima: p.prima, Inicio: p.inicio, Vence: p.vence, Estatus: p.status })), 'polizas-core')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total en cartera', val: MOCK_POLIZAS_CORE.length, color: '#1A1F2B' },
          { label: 'Activas', val: MOCK_POLIZAS_CORE.filter(p => p.status === 'activa').length, color: '#69A481' },
          { label: 'Por renovar', val: MOCK_POLIZAS_CORE.filter(p => p.status === 'por_renovar').length, color: '#F7941D' },
          { label: 'En endoso', val: MOCK_POLIZAS_CORE.filter(p => p.status === 'en_endoso').length, color: '#3B82F6' },
          { label: 'Canceladas/Vencidas', val: MOCK_POLIZAS_CORE.filter(p => p.status === 'cancelada' || p.status === 'vencida').length, color: '#7C1F31' },
        ].map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl px-4 py-3 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex flex-col gap-1">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider leading-tight">{k.label}</p>
            <p className="text-[24px] font-bold leading-none" style={{ color: k.color }}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Filtros + búsqueda */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#EFF2F9] rounded-xl px-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.08)]">
          <Search size={14} className="text-[#9CA3AF] shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar asegurado, agente, ID..."
            className="flex-1 bg-transparent py-2.5 text-[13px] text-[#1A1F2B] outline-none placeholder:text-[#9CA3AF]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['todos', 'activa', 'en_endoso', 'por_renovar', 'vencida', 'cancelada'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn('px-3 py-2 rounded-xl text-[11px] font-semibold transition-all', filterStatus === s
                ? 'text-white shadow-[0_3px_10px_rgba(247,148,29,0.35)]'
                : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B]')}
              style={filterStatus === s ? { background: s === 'todos' ? '#F7941D' : (STATUS_MAP[s as PolizaStatus]?.color ?? '#F7941D') } : {}}>
              {s === 'todos' ? 'Todas' : STATUS_MAP[s as PolizaStatus]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de pólizas */}
      <div className="bg-[#EFF2F9] rounded-2xl shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)] overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_80px_90px_100px_110px_40px] gap-x-3 px-5 py-3 border-b border-[#D1D5DB]/20">
          {['ID', 'Asegurado', 'Agente', 'Ramo', 'Prima', 'Vigencia', 'Estatus', ''].map(h => (
            <span key={h} className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">{h}</span>
          ))}
        </div>
        {filtered.map(p => {
          const st = STATUS_MAP[p.status]
          const isEndosado = endosoDone.includes(p.id)
          return (
            <div key={p.id} onClick={() => setSelected(p)}
              className="grid grid-cols-[1.2fr_1fr_1fr_80px_90px_100px_110px_40px] gap-x-3 px-5 py-3.5 border-b border-[#D1D5DB]/10 hover:bg-white/40 transition-colors cursor-pointer items-center">
              <div>
                <p className="text-[11px] text-[#1A1F2B] font-semibold">{p.id}</p>
                <p className="text-[10px] text-[#9CA3AF]">{p.aseguradora}</p>
              </div>
              <p className="text-[12px] text-[#1A1F2B] truncate">{p.asegurado}</p>
              <p className="text-[11px] text-[#6B7280] truncate">{p.agente}</p>
              <p className="text-[10px] text-[#6B7280] truncate">{p.ramo.replace(' Individual', ' Ind.').replace(' Colectivo', ' Col.')}</p>
              <p className="text-[12px] text-[#F7941D] font-semibold">{p.prima}</p>
              <div>
                <p className="text-[10px] text-[#9CA3AF]">{p.inicio}</p>
                <p className="text-[10px] text-[#9CA3AF]">{p.vence}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold w-fit" style={{ color: isEndosado ? '#3B82F6' : st.color, background: isEndosado ? 'rgba(59,130,246,0.10)' : st.bg }}>
                {isEndosado ? 'En endoso' : st.label}
              </span>
              <ChevronRight size={13} className="text-[#D1D5DB] justify-self-end" />
            </div>
          )
        })}
      </div>

      {/* Modal detalle póliza */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-lg shadow-[-20px_-20px_50px_#FAFBFF,20px_20px_50px_rgba(22,27,29,0.25)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div>
                <p className="text-[16px] text-[#1A1F2B] font-bold">{selected.id}</p>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{selected.aseguradora} · {selected.inicio} → {selected.vence}</p>
              </div>
              <button onClick={() => { setSelected(null); setEndosoModal(false); setEndosoNote('') }}
                className="w-8 h-8 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] flex items-center justify-center text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Asegurado', val: selected.asegurado },
                  { label: 'Agente', val: selected.agente },
                  { label: 'Ramo', val: selected.ramo },
                  { label: 'Prima anual', val: selected.prima },
                ].map(item => (
                  <div key={item.label} className="bg-white/50 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-[13px] text-[#1A1F2B] font-semibold">{item.val}</p>
                  </div>
                ))}
              </div>

              {endosoModal ? (
                <div className="flex flex-col gap-3">
                  <p className="text-[12px] text-[#6B7280]">Describe el cambio o endoso solicitado:</p>
                  <textarea rows={3} value={endosoNote} onChange={e => setEndosoNote(e.target.value)}
                    placeholder="Ej. Cambio de suma asegurada de $3M a $5M, agrega cobertura de maternidad..."
                    className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[12px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  <div className="flex gap-2">
                    <button onClick={() => setEndosoModal(false)}
                      className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
                      Cancelar
                    </button>
                    <button onClick={() => { setEndosoDone(prev => [...prev, selected.id]); setSelected(null); setEndosoModal(false); setEndosoNote('') }}
                      className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all flex items-center justify-center gap-1.5"
                      style={{ background: '#3B82F6', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>
                      <Check size={13} /> Registrar endoso
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEndosoModal(true)}
                    className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-[#3B82F6] bg-[#3B82F6]/8 border border-[#3B82F6]/20 hover:bg-[#3B82F6]/15 transition-all flex items-center justify-center gap-1.5">
                    <Edit size={13} /> Endoso
                  </button>
                  <button onClick={() => setSelected(null)}
                    className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-[#F7941D] bg-[#F7941D]/8 border border-[#F7941D]/20 hover:bg-[#F7941D]/15 transition-all flex items-center justify-center gap-1.5">
                    <RefreshCw size={13} /> Renovación
                  </button>
                  <button onClick={() => setSelected(null)}
                    className="flex-1 py-3 rounded-xl text-[12px] font-semibold text-[#7C1F31] bg-[#7C1F31]/8 border border-[#7C1F31]/20 hover:bg-[#7C1F31]/15 transition-all flex items-center justify-center gap-1.5">
                    <X size={13} /> Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
