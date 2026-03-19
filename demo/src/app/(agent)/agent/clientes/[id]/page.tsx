'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  MOCK_CLIENTS, MOCK_POLICIES, MOCK_PAYMENTS, MOCK_TICKETS,
  MOCK_SINIESTROS, MOCK_CONVERSATIONS
} from '@/data/mock'
import {
  ArrowLeft, User, Mail, Phone, MapPin, Briefcase, FileText,
  CreditCard, MessageSquare, AlertTriangle, Plus, Download,
  CheckCircle, Clock, XCircle, Star, Edit2, Send, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const TABS = ['Resumen', 'Pólizas', 'Pagos', 'Tickets', 'Siniestros', 'Mensajes', 'Notas']

const STATUS_COLORS: Record<string, string> = {
  activa: '#69A481', vigente: '#69A481', pagado: '#69A481', cerrado: '#69A481',
  pendiente: '#F7941D', en_proceso: '#F7941D', abierto: '#F7941D',
  vencida: '#7C1F31', vencido: '#7C1F31',
}

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [tab, setTab] = useState('Resumen')
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState<string[]>([])

  const client = MOCK_CLIENTS.find(c => c.id === id) || MOCK_CLIENTS[0]
  const polizas = MOCK_POLICIES.filter(p => p.clientName === client.name)
  const pagos = MOCK_PAYMENTS.filter(p => p.clientName === client.name)
  const tickets = MOCK_TICKETS.filter(t => t.clientName === client.name)
  const siniestros = MOCK_SINIESTROS.filter(s => s.clientName === client.name)
  const conv = MOCK_CONVERSATIONS.find(c => c.clientName === client.name || c.clientName === client.name.split(' ')[0] + ' ' + client.name.split(' ')[1])

  const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const score = client.score
  const scoreColor = score >= 85 ? '#69A481' : score >= 65 ? '#F7941D' : '#9CA3AF'

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
          <ArrowLeft size={13} />
          Clientes
        </button>
        <span className="text-[#D1D5DB]">/</span>
        <span className="text-[12px] text-[#1A1F2B]">{client.name}</span>
      </div>

      {/* Header card */}
      <div className="bg-[#EFF2F9] rounded-2xl p-6 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.16)]">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar + info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-[20px] shrink-0"
              style={{ background: `linear-gradient(135deg, ${scoreColor}, ${scoreColor}88)` }}>
              {initials}
            </div>
            <div>
              <h1 className="text-[18px] text-[#1A1F2B] tracking-wide">{client.name}</h1>
              <p className="text-[13px] text-[#6B7280]">{client.ocupacion} · {client.estadoCivil || 'Empresa'}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {client.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-[#6B7280] bg-[#EFF2F9] px-2 py-0.5 rounded-lg shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Score + stats */}
          <div className="sm:ml-auto flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-1">
            <div className="text-right">
              <p className="text-[11px] text-[#9CA3AF]">Score de salud</p>
              <p className="text-[28px] leading-tight" style={{ color: scoreColor }}>{score}%</p>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-[16px] text-[#1A1F2B]">{polizas.length}</p>
                <p className="text-[10px] text-[#9CA3AF]">Pólizas</p>
              </div>
              <div className="text-center">
                <p className="text-[16px] text-[#F7941D]">{tickets.filter(t => t.status !== 'cerrado').length}</p>
                <p className="text-[10px] text-[#9CA3AF]">Tickets</p>
              </div>
              <div className="text-center">
                <p className="text-[16px] text-[#7C1F31]">{siniestros.length}</p>
                <p className="text-[10px] text-[#9CA3AF]">Siniestros</p>
              </div>
            </div>
          </div>
        </div>

        {/* Datos personales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#D1D5DB]/30">
          {[
            { icon: Mail, label: 'Email', val: client.email },
            { icon: Phone, label: 'Teléfono', val: client.phone },
            { icon: MapPin, label: 'Dirección', val: client.direccion },
            { icon: FileText, label: 'RFC', val: client.rfc || 'N/A' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-2">
              <item.icon size={13} className="text-[#9CA3AF] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{item.label}</p>
                <p className="text-[12px] text-[#1A1F2B] truncate">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#EFF2F9] rounded-2xl p-1.5 shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)] overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-3 py-2 rounded-xl text-[12px] whitespace-nowrap transition-all duration-200 flex-1',
              tab === t ? 'bg-[#EFF2F9] text-[#F7941D] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)]' : 'text-[#9CA3AF] hover:text-[#6B7280]')}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Resumen' && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Última actividad */}
          <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
            <h3 className="text-[13px] text-[#1A1F2B] mb-4">Actividad reciente</h3>
            <div className="relative flex flex-col gap-0">
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#D1D5DB]/50" />
              {[
                { icon: Shield, text: `Póliza ${polizas[0]?.policyNumber || 'N/A'} activa`, date: polizas[0]?.startDate || '', color: '#69A481' },
                { icon: MessageSquare, text: 'Último contacto por WhatsApp', date: client.lastContact, color: '#F7941D' },
                { icon: CreditCard, text: `Pago ${pagos[0]?.status || 'pendiente'} — ${pagos[0]?.amount || ''}`, date: pagos[0]?.dueDate || '', color: '#6B7280' },
                { icon: Star, text: 'Cliente registrado en sistema', date: client.createdAt, color: '#9CA3AF' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 pl-6 pb-4 relative">
                  <div className="absolute left-0 w-[19px] h-[19px] rounded-full flex items-center justify-center"
                    style={{ background: `${item.color}20`, border: `2px solid ${item.color}` }}>
                    <item.icon size={9} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-[12px] text-[#1A1F2B]">{item.text}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen financiero */}
          <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
            <h3 className="text-[13px] text-[#1A1F2B] mb-4">Resumen financiero</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Pólizas activas', val: polizas.filter(p => p.status === 'activa' || p.status === 'vigente').length, unit: 'pólizas', color: '#69A481' },
                { label: 'Pagos al corriente', val: pagos.filter(p => p.status === 'pagado').length, unit: 'recibos', color: '#69A481' },
                { label: 'Pagos pendientes', val: pagos.filter(p => p.status === 'pendiente').length, unit: 'recibos', color: '#F7941D' },
                { label: 'Tickets activos', val: tickets.filter(t => t.status !== 'cerrado').length, unit: 'tickets', color: '#7C1F31' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#D1D5DB]/20 last:border-0">
                  <p className="text-[12px] text-[#6B7280]">{item.label}</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[14px]" style={{ color: item.color }}>{item.val}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Pólizas' && (
        <div className="flex flex-col gap-3">
          {polizas.length === 0 ? (
            <div className="bg-[#EFF2F9] rounded-2xl p-8 text-center shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
              <p className="text-[13px] text-[#9CA3AF]">Sin pólizas registradas</p>
            </div>
          ) : polizas.map(p => (
            <Link key={p.id} href={`/agent/polizas/${p.id}`}
              className="group bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] hover:shadow-[-7px_-7px_16px_#FAFBFF,7px_7px_16px_rgba(22,27,29,0.18)] transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                    <Shield size={16} className="text-[#F7941D]" />
                  </div>
                  <div>
                    <p className="text-[13px] text-[#1A1F2B] group-hover:text-[#F7941D] transition-colors">{p.type}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{p.policyNumber} · {p.insurer}</p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-xl" style={{ color: STATUS_COLORS[p.status] || '#9CA3AF', background: `${STATUS_COLORS[p.status] || '#9CA3AF'}15` }}>
                  {p.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div><p className="text-[10px] text-[#9CA3AF]">Prima</p><p className="text-[13px] text-[#F7941D]">{p.premium}</p></div>
                <div><p className="text-[10px] text-[#9CA3AF]">Cobertura</p><p className="text-[13px] text-[#1A1F2B]">{p.coverage}</p></div>
                <div><p className="text-[10px] text-[#9CA3AF]">Vencimiento</p><p className="text-[13px] text-[#1A1F2B]">{p.endDate}</p></div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === 'Pagos' && (
        <div className="flex flex-col gap-3">
          {pagos.map(p => (
            <div key={p.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-4"
              style={{ borderLeft: `3px solid ${STATUS_COLORS[p.status] || '#9CA3AF'}` }}>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#1A1F2B] truncate">{p.concept}</p>
                <p className="text-[11px] text-[#9CA3AF]">Vence: {p.dueDate}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] text-[#F7941D]">{p.amount}</p>
                <p className="text-[11px]" style={{ color: STATUS_COLORS[p.status] || '#9CA3AF' }}>{p.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Tickets' && (
        <div className="flex flex-col gap-3">
          {tickets.length === 0 ? (
            <div className="bg-[#EFF2F9] rounded-2xl p-8 text-center shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
              <CheckCircle size={24} className="text-[#69A481] mx-auto mb-2" />
              <p className="text-[13px] text-[#9CA3AF]">Sin tickets activos</p>
            </div>
          ) : tickets.map(t => (
            <Link key={t.id} href={`/agent/tickets`}
              className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] hover:shadow-[-7px_-7px_16px_#FAFBFF,7px_7px_16px_rgba(22,27,29,0.18)] transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <MessageSquare size={14} className="text-[#9CA3AF] shrink-0" />
                  <p className="text-[13px] text-[#1A1F2B]">{t.subject}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-lg shrink-0" style={{ color: STATUS_COLORS[t.status] || '#9CA3AF', background: `${STATUS_COLORS[t.status] || '#9CA3AF'}15` }}>
                  {t.status}
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-1 ml-6">Creado: {t.createdAt} · Prioridad: {t.priority}</p>
            </Link>
          ))}
        </div>
      )}

      {tab === 'Siniestros' && (
        <div className="flex flex-col gap-3">
          {siniestros.length === 0 ? (
            <div className="bg-[#EFF2F9] rounded-2xl p-8 text-center shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
              <p className="text-[13px] text-[#9CA3AF]">Sin siniestros registrados</p>
            </div>
          ) : siniestros.map(s => (
            <div key={s.id} className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[13px] text-[#1A1F2B]">{s.tipo}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{s.descripcion}</p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-xl shrink-0" style={{ color: STATUS_COLORS[s.status] || '#9CA3AF', background: `${STATUS_COLORS[s.status] || '#9CA3AF'}15` }}>
                  {s.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                <span>{s.aseguradora} · {s.policyNumber}</span>
                <span className="text-[#F7941D]">{s.monto}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Mensajes' && (
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
          {conv ? (
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
              {conv.messages.map(m => (
                <div key={m.id} className={cn('flex gap-2 max-w-[80%]', m.from === 'agent' ? 'self-end flex-row-reverse' : 'self-start')}>
                  <div className={cn('rounded-2xl px-4 py-2.5 text-[13px]', m.from === 'agent' ? 'bg-[#F7941D] text-white rounded-tr-sm' : 'bg-white/60 text-[#1A1F2B] shadow-[0_2px_8px_rgba(22,27,29,0.08)] rounded-tl-sm')}>
                    {m.text}
                    <p className="text-[10px] opacity-60 mt-1">{m.time.split(' ')[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-[#9CA3AF] text-center py-8">Sin conversaciones registradas</p>
          )}
        </div>
      )}

      {tab === 'Notas' && (
        <div className="flex flex-col gap-3">
          {/* Notas existentes */}
          {[...client.notas, ...notes.map((n, i) => ({ id: `new_${i}`, text: n, date: 'Hoy', author: 'Carlos Mendoza' }))].map(nota => (
            <div key={nota.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
              <p className="text-[13px] text-[#1A1F2B] leading-relaxed">{nota.text}</p>
              <p className="text-[10px] text-[#9CA3AF] mt-2">{nota.author} · {nota.date}</p>
            </div>
          ))}

          {/* Nueva nota */}
          <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
              placeholder="Agregar nota sobre el cliente..."
              rows={3}
              className="w-full bg-[#EFF2F9] text-[13px] text-[#1A1F2B] outline-none resize-none placeholder:text-[#9CA3AF] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] rounded-xl p-3" />
            <button onClick={() => { if (newNote.trim()) { setNotes(prev => [...prev, newNote.trim()]); setNewNote('') } }}
              disabled={!newNote.trim()}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_3px_10px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] disabled:opacity-40 transition-all">
              <Send size={13} />
              Guardar nota
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
