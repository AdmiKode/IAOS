'use client'
import { useState } from 'react'
import { MOCK_CLIENTS, MOCK_POLICIES, MOCK_PAYMENTS, MOCK_TICKETS, MOCK_SINIESTROS, MOCK_RAMOS } from '@/data/mock'
import { Users, Mail, Phone, Search, Plus, ArrowRight, TrendingUp, X, CheckCircle, FileText, MessageSquare, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { NeuSelect } from '@/components/ui'

const SCORE_COLOR = (s: number) => s >= 85 ? '#69A481' : s >= 65 ? '#F7941D' : '#9CA3AF'

type KpiKey = 'total' | 'polizas' | 'score' | 'tickets' | null

export default function ClientesPage() {
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', rfc: '', direccion: '', ramo: '' })
  const [kpiModal, setKpiModal] = useState<KpiKey>(null)

  function openNew() { setShowNew(true); setSaved(false); setForm({ nombre: '', email: '', telefono: '', rfc: '', direccion: '', ramo: '' }) }
  function handleSave() { setSaved(true); setTimeout(() => setShowNew(false), 1800) }

  const allTags = Array.from(new Set(MOCK_CLIENTS.flatMap(c => c.tags)))
  const filtered = MOCK_CLIENTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchTag = !tagFilter || c.tags.includes(tagFilter)
    return matchSearch && matchTag
  })

  return (
    <>
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Clientes</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">{MOCK_CLIENTS.length} clientes y prospectos registrados</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors self-start sm:self-auto">
          <Plus size={15} />
          Nuevo cliente
        </button>
      </div>

      {/* KPIs rápidos */}
      {(() => {
        const clientesConPoliza = MOCK_CLIENTS.filter(c => MOCK_POLICIES.some(p => p.clientName === c.name && (p.status === 'activa' || p.status === 'vigente')))
        const scoresProm = Math.round(MOCK_CLIENTS.reduce((a, c) => a + c.score, 0) / MOCK_CLIENTS.length)
        const ticketsAbiertos = MOCK_TICKETS.filter(t => t.status !== 'cerrado')
        const kpis = [
          { key: 'total' as KpiKey, label: 'Total clientes', value: MOCK_CLIENTS.length.toString(), sub: 'registrados', color: '#6B7280', icon: Users },
          { key: 'polizas' as KpiKey, label: 'Con pólizas activas', value: clientesConPoliza.length.toString(), sub: 'en cartera', color: '#69A481', icon: FileText },
          { key: 'score' as KpiKey, label: 'Score promedio', value: `${scoresProm}%`, sub: 'índice de salud', color: '#F7941D', icon: TrendingUp },
          { key: 'tickets' as KpiKey, label: 'Tickets abiertos', value: ticketsAbiertos.length.toString(), sub: 'pendientes', color: '#7C1F31', icon: MessageSquare },
        ]
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpis.map(kpi => (
              <button key={kpi.label} onClick={() => setKpiModal(kpi.key)}
                className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] hover:shadow-[-7px_-7px_16px_#FAFBFF,7px_7px_16px_rgba(22,27,29,0.18)] transition-all text-left group">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}15` }}>
                    <kpi.icon size={13} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] tracking-wide">{kpi.label}</p>
                </div>
                <p className="text-[22px] text-[#1A1F2B] mt-1">{kpi.value}</p>
                <p className="text-[11px] text-[#B5BFC6]">{kpi.sub}</p>
              </button>
            ))}
          </div>
        )
      })()}

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

      {/* Modal nuevo cliente */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md p-6 shadow-[−20px_−20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowNew(false)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
              <X size={16} />
            </button>
            <div>
              <h2 className="text-[16px] text-[#1A1F2B]">Nuevo cliente</h2>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">Registra los datos del cliente o prospecto</p>
            </div>
            {saved ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle size={40} className="text-[#69A481]" />
                <p className="text-[14px] text-[#1A1F2B]">Cliente registrado</p>
                <p className="text-[12px] text-[#9CA3AF]">El cliente ha sido agregado a tu cartera</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {[
                    { key: 'nombre', label: 'Nombre completo *', placeholder: 'Ej. Ana Martinez' },
                    { key: 'email', label: 'Email *', placeholder: 'correo@ejemplo.com' },
                    { key: 'telefono', label: 'Telefono', placeholder: '55 1234 5678' },
                    { key: 'rfc', label: 'RFC', placeholder: 'MARA900101XXX' },
                    { key: 'direccion', label: 'Direccion', placeholder: 'Calle, Col., Ciudad' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-[11px] text-[#9CA3AF] mb-1 block">{f.label}</label>
                      <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                        className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6]" />
                    </div>
                  ))}
                  <div>
                    <label className="text-[11px] text-[#9CA3AF] mb-1 block">Ramo de interes</label>
                    <NeuSelect
                      value={form.ramo}
                      onChange={v => setForm(p => ({ ...p, ramo: v }))}
                      placeholder="Seleccionar ramo"
                      options={MOCK_RAMOS.map(r => ({ value: r.nombre, label: r.nombre }))}
                    />
                  </div>
                </div>
                <button onClick={handleSave} disabled={!form.nombre || !form.email}
                  className="w-full py-3 rounded-2xl text-white text-[13px] transition-all disabled:opacity-40 shadow-[0_4px_14px_rgba(247,148,29,0.3)] hover:brightness-110"
                  style={{ background: '#F7941D' }}>
                  Registrar cliente
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* KPI Modal */}
      {kpiModal && (() => {
        const clientesConPoliza = MOCK_CLIENTS.filter(c => MOCK_POLICIES.some(p => p.clientName === c.name && (p.status === 'activa' || p.status === 'vigente')))
        const ticketsAbiertos = MOCK_TICKETS.filter(t => t.status !== 'cerrado')

        const configs: Record<string, { title: string; color: string; icon: typeof Users; content: React.ReactNode }> = {
          total: {
            title: 'Todos los clientes', color: '#6B7280', icon: Users,
            content: (
              <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto">
                {MOCK_CLIENTS.map(c => (
                  <Link key={c.id} href={`/agent/clientes/${c.id}`} onClick={() => setKpiModal(null)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.14)] transition-all">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] shrink-0"
                      style={{ background: SCORE_COLOR(c.score) }}>
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#1A1F2B] truncate">{c.name}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{c.ocupacion}</p>
                    </div>
                    <span className="text-[12px] font-semibold shrink-0" style={{ color: SCORE_COLOR(c.score) }}>{c.score}%</span>
                  </Link>
                ))}
              </div>
            )
          },
          polizas: {
            title: 'Clientes con pólizas activas', color: '#69A481', icon: FileText,
            content: (
              <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto">
                {clientesConPoliza.map(c => {
                  const polizas = MOCK_POLICIES.filter(p => p.clientName === c.name && (p.status === 'activa' || p.status === 'vigente'))
                  return (
                    <Link key={c.id} href={`/agent/clientes/${c.id}`} onClick={() => setKpiModal(null)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.14)] transition-all">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] shrink-0"
                        style={{ background: SCORE_COLOR(c.score) }}>
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-[#1A1F2B] truncate">{c.name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{polizas.length} póliza{polizas.length !== 1 ? 's' : ''} · {polizas.map(p => p.type).join(', ')}</p>
                      </div>
                      <ArrowRight size={13} className="text-[#9CA3AF] shrink-0" />
                    </Link>
                  )
                })}
              </div>
            )
          },
          score: {
            title: 'Score de salud por cliente', color: '#F7941D', icon: TrendingUp,
            content: (
              <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto">
                {[...MOCK_CLIENTS].sort((a, b) => b.score - a.score).map(c => (
                  <Link key={c.id} href={`/agent/clientes/${c.id}`} onClick={() => setKpiModal(null)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.14)] transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#1A1F2B] truncate">{c.name}</p>
                      <div className="mt-1.5 h-1.5 rounded-full bg-[#D1D5DB]/40 overflow-hidden w-full">
                        <div className="h-full rounded-full transition-all" style={{ width: `${c.score}%`, background: SCORE_COLOR(c.score) }} />
                      </div>
                    </div>
                    <span className="text-[13px] font-bold ml-3 shrink-0" style={{ color: SCORE_COLOR(c.score) }}>{c.score}%</span>
                  </Link>
                ))}
              </div>
            )
          },
          tickets: {
            title: 'Tickets abiertos', color: '#7C1F31', icon: MessageSquare,
            content: (
              <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto">
                {ticketsAbiertos.length === 0 ? (
                  <p className="text-[13px] text-[#9CA3AF] text-center py-6">Sin tickets abiertos</p>
                ) : ticketsAbiertos.map(t => (
                  <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: t.priority === 'urgente' ? '#7C1F31' : t.priority === 'alta' ? '#F7941D' : '#9CA3AF' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#1A1F2B] truncate">{t.subject}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{t.clientName} · {t.priority}</p>
                    </div>
                    <Link href="/agent/tickets" onClick={() => setKpiModal(null)}
                      className="text-[11px] text-[#F7941D] hover:underline shrink-0">Ver</Link>
                  </div>
                ))}
              </div>
            )
          },
        }
        const cfg = configs[kpiModal]
        const Icon = cfg.icon
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.45)', backdropFilter: 'blur(10px)' }}>
            <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)]">
              <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${cfg.color}18` }}>
                    <Icon size={15} style={{ color: cfg.color }} />
                  </div>
                  <p className="text-[15px] text-[#1A1F2B]">{cfg.title}</p>
                </div>
                <button onClick={() => setKpiModal(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                  <X size={13} />
                </button>
              </div>
              <div className="p-5">{cfg.content}</div>
            </div>
          </div>
        )
      })()}
  </>
  )
}
