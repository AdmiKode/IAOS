'use client'
import { useState } from 'react'
import { MOCK_CLIENTS, MOCK_POLICIES, MOCK_PAYMENTS, MOCK_TICKETS, MOCK_SINIESTROS } from '@/data/mock'
import { Users, Mail, Phone, Search, Plus, Star, Tag, ArrowRight, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const SCORE_COLOR = (s: number) => s >= 85 ? '#69A481' : s >= 65 ? '#F7941D' : '#9CA3AF'

export default function ClientesPage() {
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  const allTags = Array.from(new Set(MOCK_CLIENTS.flatMap(c => c.tags)))
  const filtered = MOCK_CLIENTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchTag = !tagFilter || c.tags.includes(tagFilter)
    return matchSearch && matchTag
  })

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Clientes</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">{MOCK_CLIENTS.length} clientes y prospectos registrados</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors self-start sm:self-auto">
          <Plus size={15} />
          Nuevo cliente
        </button>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total clientes', value: MOCK_CLIENTS.length.toString(), sub: 'registrados' },
          { label: 'Con pólizas activas', value: '5', sub: 'en cartera' },
          { label: 'Score promedio', value: '87%', sub: 'índice de salud' },
          { label: 'Tickets abiertos', value: MOCK_TICKETS.filter(t => t.status !== 'cerrado').length.toString(), sub: 'pendientes' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
            <p className="text-[11px] text-[#9CA3AF] tracking-wide">{kpi.label}</p>
            <p className="text-[22px] text-[#1A1F2B] mt-1">{kpi.value}</p>
            <p className="text-[11px] text-[#B5BFC6]">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email o ramo..."
            className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.15)] placeholder:text-[#9CA3AF]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTagFilter(null)}
            className={cn('px-3 py-1.5 rounded-xl text-[12px] transition-all', !tagFilter ? 'bg-[#F7941D] text-white shadow-[0_2px_8px_rgba(247,148,29,0.3)]' : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]')}>
            Todos
          </button>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setTagFilter(tag === tagFilter ? null : tag)}
              className={cn('px-3 py-1.5 rounded-xl text-[12px] transition-all', tagFilter === tag ? 'bg-[#F7941D] text-white shadow-[0_2px_8px_rgba(247,148,29,0.3)]' : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]')}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(client => {
          const polizas = MOCK_POLICIES.filter(p => p.clientName === client.name)
          const tickets = MOCK_TICKETS.filter(t => t.clientName === client.name && t.status !== 'cerrado')
          const siniestros = MOCK_SINIESTROS.filter(s => s.clientName === client.name && s.status === 'en_proceso')
          return (
            <Link key={client.id} href={`/agent/clientes/${client.id}`}
              className="group bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] hover:shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] transition-all duration-200 cursor-pointer">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[15px] shrink-0"
                  style={{ background: `linear-gradient(135deg, ${SCORE_COLOR(client.score)}, ${SCORE_COLOR(client.score)}99)` }}>
                  {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#1A1F2B] group-hover:text-[#F7941D] transition-colors truncate">{client.name}</p>
                  <p className="text-[11px] text-[#9CA3AF] truncate">{client.ocupacion}</p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={11} style={{ color: SCORE_COLOR(client.score) }} />
                  <span className="text-[12px]" style={{ color: SCORE_COLOR(client.score) }}>{client.score}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-3">
                <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
                  <Mail size={11} className="text-[#9CA3AF] shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
                  <Phone size={11} className="text-[#9CA3AF] shrink-0" />
                  {client.phone}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {client.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-[#6B7280] bg-[#EFF2F9] px-2 py-0.5 rounded-lg shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#D1D5DB]/30">
                <div className="flex gap-3">
                  <span className="text-[11px] text-[#69A481]">{polizas.length} póliza{polizas.length !== 1 ? 's' : ''}</span>
                  {tickets.length > 0 && <span className="text-[11px] text-[#F7941D]">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>}
                  {siniestros.length > 0 && <span className="text-[11px] text-[#7C1F31]">{siniestros.length} siniestro</span>}
                </div>
                <ArrowRight size={13} className="text-[#9CA3AF] group-hover:text-[#F7941D] group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
