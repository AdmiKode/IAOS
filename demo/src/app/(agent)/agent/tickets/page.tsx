'use client'
import { useState } from 'react'
import { MOCK_TICKETS, MOCK_TICKET_TIMELINE, MOCK_CLIENTS } from '@/data/mock'
import {
  MessageSquare, Search, Clock, CheckCircle,
  AlertTriangle, X, Send, Paperclip, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ClientLink } from '@/components/ui'
import { NeuSelect } from '@/components/ui'

const PRIORITY_ORDER = ['urgente', 'alta', 'media', 'baja']
const PRIORITY_COLOR: Record<string, string> = {
  urgente: '#7C1F31', alta: '#F7941D', media: '#6B7280', baja: '#69A481'
}
const STATUS_COLOR: Record<string, string> = {
  abierto: '#F7941D', en_proceso: '#69A481', cerrado: '#9CA3AF'
}
const STATUS_ICON: Record<string, typeof Clock> = {
  abierto: Clock, en_proceso: AlertTriangle, cerrado: CheckCircle
}

export default function TicketsPage() {
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({ cliente: '', asunto: '', prioridad: 'media', descripcion: '' })
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [kpiModal, setKpiModal] = useState<string | null>(null)

  const filtered = MOCK_TICKETS.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase())
    const matchPriority = !filterPriority || t.priority === filterPriority
    const matchStatus = !filterStatus || t.status === filterStatus
    return matchSearch && matchPriority && matchStatus
  }).sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority))

  const ticket = selected ? MOCK_TICKETS.find(t => t.id === selected) : null
  const timeline = ticket ? (MOCK_TICKET_TIMELINE[ticket.id] || []) : []

  const kpis = [
    { label: 'Total', val: MOCK_TICKETS.length, color: '#6B7280' },
    { label: 'Abiertos', val: MOCK_TICKETS.filter(t => t.status === 'abierto').length, color: '#F7941D' },
    { label: 'En proceso', val: MOCK_TICKETS.filter(t => t.status === 'en_proceso').length, color: '#69A481' },
    { label: 'Urgentes', val: MOCK_TICKETS.filter(t => (t.priority as string) === 'urgente').length, color: '#7C1F31' },
  ]

  const kpiConfigs: Record<string, { title: string; color: string; rows: { label: string; sub: string; badge?: string; badgeColor?: string }[] }> = {
    'Total': {
      title: 'Todos los tickets', color: '#6B7280',
      rows: MOCK_TICKETS.map(t => ({ label: t.subject, sub: t.clientName, badge: t.status.replace('_', ' '), badgeColor: STATUS_COLOR[t.status] }))
    },
    'Abiertos': {
      title: 'Tickets abiertos', color: '#F7941D',
      rows: MOCK_TICKETS.filter(t => t.status === 'abierto').map(t => ({ label: t.subject, sub: t.clientName, badge: t.priority, badgeColor: PRIORITY_COLOR[t.priority] }))
    },
    'En proceso': {
      title: 'Tickets en proceso', color: '#69A481',
      rows: MOCK_TICKETS.filter(t => t.status === 'en_proceso').map(t => ({ label: t.subject, sub: t.clientName, badge: t.priority, badgeColor: PRIORITY_COLOR[t.priority] }))
    },
    'Urgentes': {
      title: 'Tickets urgentes', color: '#7C1F31',
      rows: MOCK_TICKETS.filter(t => (t.priority as string) === 'urgente').map(t => ({ label: t.subject, sub: t.clientName, badge: t.status.replace('_', ' '), badgeColor: STATUS_COLOR[t.status] }))
    },
  }

  return (
    <>
      <div className="flex flex-col gap-4">

        {/* KPIs + botón nuevo */}
        <div className="flex items-start gap-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            {kpis.map(k => (
              <button key={k.label} onClick={() => setKpiModal(k.label)}
                className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] hover:shadow-[-7px_-7px_16px_#FAFBFF,7px_7px_16px_rgba(22,27,29,0.18)] transition-all flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: k.color + '15' }}>
                  <MessageSquare size={14} style={{ color: k.color }} />
                </div>
                <div>
                  <p className="text-[20px] leading-tight" style={{ color: k.color }}>{k.val}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => { setShowNewTicket(true); setTicketSubmitted(false); setNewTicket({ cliente: '', asunto: '', prioridad: 'media', descripcion: '' }) }}
            className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors shrink-0 mt-1">
            <Plus size={15} />
            Nuevo
          </button>
        </div>

        {/* Layout: lista + ficha */}
        <div className="flex gap-4">

          {/* Lista */}
          <div className={cn('flex flex-col gap-3', selected ? 'hidden md:flex md:w-[42%]' : 'w-full')}>
            <div className="bg-[#EFF2F9] rounded-2xl p-3 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[160px]">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ticket..."
                  className="w-full bg-[#EFF2F9] pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
              </div>
              {['urgente', 'alta', 'media', 'baja'].map(p => (
                <button key={p} onClick={() => setFilterPriority(filterPriority === p ? null : p)}
                  className="text-[11px] px-2.5 py-1.5 rounded-xl transition-all"
                  style={{ background: filterPriority === p ? PRIORITY_COLOR[p] + '20' : 'transparent', color: filterPriority === p ? PRIORITY_COLOR[p] : '#9CA3AF', border: '1px solid ' + (filterPriority === p ? PRIORITY_COLOR[p] : '#D1D5DB') }}>
                  {p}
                </button>
              ))}
              {['abierto', 'en_proceso', 'cerrado'].map(s => (
                <button key={s} onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                  className="text-[11px] px-2.5 py-1.5 rounded-xl transition-all"
                  style={{ background: filterStatus === s ? STATUS_COLOR[s] + '20' : 'transparent', color: filterStatus === s ? STATUS_COLOR[s] : '#9CA3AF', border: '1px solid ' + (filterStatus === s ? STATUS_COLOR[s] : '#D1D5DB') }}>
                  {s}
                </button>
              ))}
            </div>

            {filtered.map(t => {
              const Icon = STATUS_ICON[t.status] || Clock
              const isActive = selected === t.id
              return (
                <button key={t.id} onClick={() => setSelected(isActive ? null : t.id)}
                  className={cn('w-full text-left bg-[#EFF2F9] rounded-2xl p-4 transition-all',
                    isActive
                      ? 'shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)]'
                      : 'shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] hover:shadow-[-7px_-7px_16px_#FAFBFF,7px_7px_16px_rgba(22,27,29,0.18)]')}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Icon size={14} style={{ color: STATUS_COLOR[t.status] }} className="shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[13px] text-[#1A1F2B] truncate">{t.subject}</p>
                        <ClientLink name={t.clientName} plain className="text-[11px] text-[#9CA3AF]" />
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg shrink-0 mt-0.5"
                      style={{ background: PRIORITY_COLOR[t.priority] + '15', color: PRIORITY_COLOR[t.priority] }}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 ml-5">
                    <span className="text-[10px] text-[#9CA3AF]">{t.createdAt}</span>
                    <span className="text-[10px]" style={{ color: STATUS_COLOR[t.status] }}>{t.status}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Ficha lateral */}
          {selected && ticket && (
            <div className="flex-1 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex flex-col gap-4 md:max-h-[calc(100vh-160px)] overflow-y-auto">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] text-[#1A1F2B]">{ticket.subject}</p>
                  <p className="text-[12px] text-[#9CA3AF]">
                    <ClientLink name={ticket.clientName} plain className="text-[12px] text-[#9CA3AF]" />
                    {' '}· {ticket.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-xl" style={{ background: PRIORITY_COLOR[ticket.priority] + '15', color: PRIORITY_COLOR[ticket.priority] }}>{ticket.priority}</span>
                  <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                    <X size={13} />
                  </button>
                </div>
              </div>

              <div className="bg-white/40 rounded-xl p-3 text-[12px] text-[#6B7280] leading-relaxed">
                {(ticket as any).description || 'El cliente reporta un problema que requiere atención. Por favor revisar el historial de la póliza y responder en un plazo de 24 horas.'}
              </div>

              <div>
                <p className="text-[12px] text-[#1A1F2B] mb-3">Historial de actividad</p>
                <div className="relative flex flex-col gap-0">
                  <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#D1D5DB]/50" />
                  {(timeline.length > 0 ? (timeline as any[]) : [
                    { id: 't0', tipo: 'accion', texto: 'Ticket creado automáticamente', fecha: ticket.createdAt, autor: 'Sistema' },
                    { id: 't1', tipo: 'nota', texto: 'En revisión por el equipo', fecha: 'Hoy 10:30', autor: 'Carlos Mendoza' },
                  ]).map((ev: any) => (
                    <div key={ev.id} className="flex items-start gap-3 pl-6 pb-4 relative">
                      <div className={cn('absolute left-0 w-[19px] h-[19px] rounded-full flex items-center justify-center',
                        (ev.tipo || ev.type) === 'nota' ? 'bg-[#F7941D]/10 border-2 border-[#F7941D]' :
                          (ev.tipo || ev.type) === 'cliente' ? 'bg-[#69A481]/10 border-2 border-[#69A481]' :
                            'bg-[#6B7280]/10 border-2 border-[#6B7280]')} />
                      <div>
                        <p className="text-[12px] text-[#1A1F2B]">{ev.texto || ev.text}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{ev.autor || ev.author} · {ev.fecha || ev.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
                  <textarea value={reply} onChange={e => setReply(e.target.value)}
                    placeholder="Escribir respuesta al cliente..."
                    rows={2}
                    className="w-full bg-transparent text-[12px] text-[#1A1F2B] outline-none resize-none placeholder:text-[#9CA3AF]" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
                    <Paperclip size={12} />
                  </button>
                  <button onClick={() => setReply('')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_3px_10px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-all disabled:opacity-40"
                    disabled={!reply.trim()}>
                    <Send size={13} />
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal nuevo ticket */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <MessageSquare size={15} className="text-[#F7941D]" />
                </div>
                <p className="text-[15px] text-[#1A1F2B]">Nuevo ticket</p>
              </div>
              <button onClick={() => setShowNewTicket(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Cliente</label>
                <NeuSelect
                  value={newTicket.cliente}
                  onChange={v => setNewTicket(prev => ({ ...prev, cliente: v }))}
                  placeholder="Seleccionar cliente..."
                  options={MOCK_CLIENTS.map(c => ({ value: c.name, label: c.name }))}
                />
              </div>
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Asunto</label>
                <input value={newTicket.asunto} onChange={e => setNewTicket(prev => ({ ...prev, asunto: e.target.value }))}
                  placeholder="Describe brevemente el problema..."
                  className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
              </div>
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Prioridad</label>
                <div className="flex gap-2">
                  {['baja', 'media', 'alta', 'urgente'].map(p => (
                    <button key={p} onClick={() => setNewTicket(prev => ({ ...prev, prioridad: p }))}
                      className={cn('flex-1 py-2 rounded-xl text-[12px] transition-all capitalize', newTicket.prioridad === p ? 'text-white' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]')}
                      style={{ background: newTicket.prioridad === p ? PRIORITY_COLOR[p] : undefined }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Descripción</label>
                <textarea rows={3} value={newTicket.descripcion} onChange={e => setNewTicket(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Detalla el problema del cliente..."
                  className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
              </div>
              <button
                onClick={() => { setTicketSubmitted(true); setTimeout(() => { setShowNewTicket(false); setTicketSubmitted(false) }, 1800) }}
                disabled={ticketSubmitted || !newTicket.cliente || !newTicket.asunto}
                className={cn('w-full py-3.5 rounded-xl text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50',
                  ticketSubmitted ? 'bg-[#69A481]' : 'bg-[#F7941D] hover:bg-[#E8820A] shadow-[0_4px_12px_rgba(247,148,29,0.3)]')}>
                {ticketSubmitted ? <><CheckCircle size={15} /> Ticket creado</> : 'Crear ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Modal */}
      {kpiModal && (() => {
        const cfg = kpiConfigs[kpiModal]
        if (!cfg) return null
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.45)', backdropFilter: 'blur(10px)' }}>
            <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)]">
              <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: cfg.color + '18' }}>
                    <MessageSquare size={15} style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <p className="text-[15px] text-[#1A1F2B]">{cfg.title}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{cfg.rows.length} ticket{cfg.rows.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button onClick={() => setKpiModal(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                  <X size={13} />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-2 max-h-[380px] overflow-y-auto">
                {cfg.rows.length === 0 ? (
                  <p className="text-[13px] text-[#9CA3AF] text-center py-8">Sin resultados</p>
                ) : cfg.rows.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]">
                    <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: r.badgeColor || cfg.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#1A1F2B] truncate">{r.label}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{r.sub}</p>
                    </div>
                    {r.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-lg capitalize shrink-0"
                        style={{ color: r.badgeColor || cfg.color, background: (r.badgeColor || cfg.color) + '18' }}>
                        {r.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
