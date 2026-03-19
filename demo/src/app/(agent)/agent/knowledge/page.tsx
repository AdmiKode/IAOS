'use client'
import { useState } from 'react'
import { MOCK_ASEGURADORAS, MOCK_KB_DOCS } from '@/data/mock'
import { Search, Download, BookOpen, FileText, Shield, ChevronRight, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

const TIPO_COLOR: Record<string, string> = {
  circular: '#7C1F31',
  clausula: '#F7941D',
  manual: '#69A481',
  formato: '#6B7280',
  contrato: '#1A1F2B',
}

export default function KnowledgePage() {
  const [search, setSearch] = useState('')
  const [selectedRamo, setSelectedRamo] = useState<string | null>(null)
  const [selectedAseg, setSelectedAseg] = useState<string | null>(null)
  const [tab, setTab] = useState<'docs' | 'aseguradoras'>('docs')

  const ramos = [...new Set(MOCK_KB_DOCS.map(d => d.ramo))]

  const filteredDocs = MOCK_KB_DOCS.filter(d => {
    const title = (d as any).title || (d as any).nombre || ''
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) ||
      d.ramo.toLowerCase().includes(search.toLowerCase())
    const matchRamo = !selectedRamo || d.ramo === selectedRamo
    return matchSearch && matchRamo
  })

  const filteredAseg = MOCK_ASEGURADORAS.filter(a => {
    const name = (a as any).name || (a as any).nombre || ''
    return name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Header stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Documentos', val: MOCK_KB_DOCS.length, color: '#6B7280' },
          { label: 'Aseguradoras', val: MOCK_ASEGURADORAS.length, color: '#F7941D' },
          { label: 'Ramos cubiertos', val: ramos.length, color: '#69A481' },
          { label: 'Docs circulares', val: MOCK_KB_DOCS.filter(d => d.tipo === 'circular').length, color: '#7C1F31' },
        ].map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.color}15` }}>
              <BookOpen size={14} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-[20px] leading-tight" style={{ color: k.color }}>{k.val}</p>
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar documentos, ramos, aseguradoras..."
          className="w-full bg-[#EFF2F9] pl-10 pr-4 py-3 text-[13px] text-[#1A1F2B] rounded-2xl outline-none shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)] placeholder:text-[#9CA3AF]" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#EFF2F9] rounded-2xl p-1.5 shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)] w-fit">
        {[{ key: 'docs', label: 'Documentos' }, { key: 'aseguradoras', label: 'Aseguradoras' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={cn('px-5 py-2 rounded-xl text-[12px] transition-all',
              tab === t.key ? 'bg-[#EFF2F9] text-[#F7941D] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)]' : 'text-[#9CA3AF] hover:text-[#6B7280]')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'docs' && (
        <div className="flex gap-4">
          {/* Filtros ramos */}
          <div className="w-[180px] shrink-0 flex flex-col gap-2">
            <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide px-1">Ramos</p>
            {[null, ...ramos].map(r => (
              <button key={String(r)} onClick={() => setSelectedRamo(r)}
                className={cn('text-left text-[12px] px-3 py-2 rounded-xl transition-all',
                  selectedRamo === r ? 'bg-[#EFF2F9] text-[#F7941D] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]' : 'text-[#9CA3AF] hover:text-[#6B7280]')}>
                {r === null ? 'Todos' : r}
              </button>
            ))}
          </div>

          {/* Lista docs */}
          <div className="flex-1 flex flex-col gap-3">
            {filteredDocs.map(doc => {
              const title = (doc as any).title || (doc as any).nombre || 'Sin título'
              const aseguradora = (doc as any).aseguradora || ''
              const tipo = (doc as any).tipo || ''
              return (
              <div key={doc.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-4 group hover:shadow-[-7px_-7px_16px_#FAFBFF,7px_7px_16px_rgba(22,27,29,0.18)] transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${TIPO_COLOR[tipo] || '#6B7280'}15` }}>
                  <FileText size={16} style={{ color: TIPO_COLOR[tipo] || '#6B7280' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#1A1F2B] truncate">{title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-[#9CA3AF]">{aseguradora}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: `${TIPO_COLOR[tipo] || '#6B7280'}15`, color: TIPO_COLOR[tipo] || '#6B7280' }}>{tipo}</span>
                    <span className="text-[10px] text-[#9CA3AF]">{doc.ramo}</span>
                    <span className="text-[10px] text-[#B5BFC6]">{doc.version}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#9CA3AF]">{doc.size}</span>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
                    <Download size={12} />
                  </button>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'aseguradoras' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAseg.map(a => {
            const name = (a as any).name || (a as any).nombre || ''
            return (
            <div key={a.id} className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                    <Shield size={16} className="text-[#F7941D]" />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#1A1F2B]">{name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{a.docs} documentos</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {a.ramos.map(r => (
                  <span key={r} className="text-[10px] text-[#6B7280] bg-[#EFF2F9] px-2 py-0.5 rounded-lg shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]">
                    {r}
                  </span>
                ))}
              </div>
              <button className="flex items-center justify-between text-[12px] text-[#9CA3AF] hover:text-[#F7941D] transition-colors pt-2 border-t border-[#D1D5DB]/20">
                <span>Ver documentos</span>
                <ChevronRight size={14} />
              </button>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
