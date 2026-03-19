'use client'
import { useState, useRef } from 'react'
import { Mail, Send, Inbox, Archive, Trash2, AlertOctagon, File, Plus, Search, Paperclip, Bold, Italic, Underline, AlignLeft, AlignCenter, Link as LinkIcon, Image as ImageIcon, X, ChevronRight, ChevronDown, Star, StarOff, Reply, ReplyAll, Forward, MoreHorizontal, Settings, Users, Sparkles, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const FOLDERS = [
  { id: 'inbox', label: 'Recibidos', icon: Inbox, count: 4 },
  { id: 'sent', label: 'Enviados', icon: Send, count: 0 },
  { id: 'drafts', label: 'Borradores', icon: File, count: 2 },
  { id: 'spam', label: 'Spam', icon: AlertOctagon, count: 1 },
  { id: 'trash', label: 'Papelera', icon: Trash2, count: 0 },
]

const LABELS = [
  { id: 'clientes', label: 'Clientes', color: '#69A481' },
  { id: 'siniestros', label: 'Siniestros', color: '#7C1F31' },
  { id: 'aseguradoras', label: 'Aseguradoras', color: '#1A4E8C' },
  { id: 'renovaciones', label: 'Renovaciones', color: '#F7941D' },
]

const GROUPS = [
  { id: 'g1', name: 'Clientes GNP', count: 3, members: ['Ana López', 'Miguel Ángel Cruz', 'Roberto Sánchez'] },
  { id: 'g2', name: 'Empresas corporativas', count: 1, members: ['Empresa XYZ S.A.'] },
  { id: 'g3', name: 'Aseguradoras', count: 3, members: ['GNP Seguros', 'AXA Seguros', 'Qualitas'] },
]

interface Email {
  id: string; folder: string; from: string; fromEmail: string; to: string
  subject: string; preview: string; body: string; date: string; time: string
  read: boolean; starred: boolean; labels: string[]; attachments?: string[]
}

const MOCK_EMAILS: Email[] = [
  {
    id: 'e1', folder: 'inbox', from: 'Ana López', fromEmail: 'ana.lopez@email.com', to: 'carlos@agencia.com',
    subject: 'RE: Aclaración de cobro duplicado — Marzo 2026',
    preview: 'Carlos, muchas gracias por la gestión. Entiendo que la devolución se hará en 3-5 días...',
    body: `Hola Carlos,\n\nMuchas gracias por la gestión tan rápida. Entiendo que la devolución del cargo duplicado se hará en 3 a 5 días hábiles por parte de GNP.\n\n¿Recibiré una confirmación cuando esté acreditado en mi cuenta?\n\nQuedo pendiente.\n\nSaludos,\nAna López`,
    date: '2026-03-17', time: '11:02', read: false, starred: true, labels: ['clientes'],
    attachments: [],
  },
  {
    id: 'e2', folder: 'inbox', from: 'GNP Seguros — Soporte Agentes', fromEmail: 'agentes@gnp.com.mx', to: 'carlos@agencia.com',
    subject: 'Confirmación carta aval — Folio SA-2026-3412',
    preview: 'Estimado agente Mendoza, le confirmamos la aprobación de la carta aval por $85,000 MXN...',
    body: `Estimado agente Mendoza,\n\nLe confirmamos la aprobación de la carta aval para el siniestro reportado.\n\nDetalles:\n• Asegurada: Ana López\n• Póliza: GNP-2025-001234\n• Hospital: Ángeles Lomas\n• Monto autorizado: $85,000 MXN\n• Folio: SA-2026-3412\n\nCualquier duda, contáctenos al 800-400-4000.\n\nAtentamente,\nGNP Seguros — Área de Siniestros`,
    date: '2026-03-18', time: '10:15', read: false, starred: false, labels: ['siniestros', 'aseguradoras'],
    attachments: ['Carta_Aval_SA-2026-3412.pdf'],
  },
  {
    id: 'e3', folder: 'inbox', from: 'Empresa XYZ — RH', fromEmail: 'rh@empresaxyz.com', to: 'carlos@agencia.com',
    subject: 'Bajas de empleados — Colectivo AXA',
    preview: 'Carlos, te enviamos los datos de las 3 bajas que necesitamos procesar en el colectivo...',
    body: `Carlos,\n\nTe enviamos la información de los 3 empleados que necesitamos dar de baja en el colectivo AXA:\n\n1. Nombre: Luis Mora | RFC: MOLU850312KL5 | Baja: 31/03/2026\n2. Nombre: Patricia Salas | RFC: SAPA900415JK9 | Baja: 31/03/2026\n3. Nombre: Raúl Gómez | RFC: GORR781020NM1 | Baja: 31/03/2026\n\nPor favor confirma cuando estén procesadas.\n\nGracias,\nRH Empresa XYZ`,
    date: '2026-03-18', time: '09:30', read: true, starred: false, labels: ['clientes'],
    attachments: ['Bajas_Empleados_XYZ.xlsx'],
  },
  {
    id: 'e4', folder: 'inbox', from: 'Roberto Sánchez', fromEmail: 'rsanchez@email.com', to: 'carlos@agencia.com',
    subject: '¿Cuándo me llega la póliza de vida?',
    preview: 'Hola Carlos, quería preguntarte si ya tienes noticias de Metlife sobre mi póliza...',
    body: `Hola Carlos,\n\nQuería preguntarte si ya tienes noticias de Metlife sobre mi póliza de Vida Temporal. Llevo dos semanas esperando y quisiera saber si hay algún inconveniente.\n\nGracias,\nRoberto`,
    date: '2026-03-17', time: '18:45', read: true, starred: false, labels: ['clientes'],
    attachments: [],
  },
  {
    id: 'e5', folder: 'sent', from: 'Carlos Mendoza', fromEmail: 'carlos@agencia.com', to: 'rh@empresaxyz.com',
    subject: 'Confirmación alta de 3 empleados — Colectivo AXA',
    preview: 'Buenos días, confirmamos el alta de los 3 empleados en el colectivo AXA...',
    body: `Buenos días,\n\nConfirmamos el alta de los 3 nuevos empleados en el colectivo AXA. Los cambios entrarán en vigor a partir del 1° de abril de 2026.\n\nAdjunto encontrará la confirmación de AXA y los certificados individuales de cada empleado.\n\nAtentamente,\nCarlos Mendoza\nAgente de Seguros`,
    date: '2026-03-14', time: '12:00', read: true, starred: false, labels: ['clientes'],
    attachments: ['Confirmacion_Altas_AXA.pdf', 'Certificados_Empleados.pdf'],
  },
  {
    id: 'e6', folder: 'drafts', from: 'Carlos Mendoza', fromEmail: 'carlos@agencia.com', to: 'rsanchez@email.com',
    subject: 'Actualización proceso póliza Vida Temporal — Metlife',
    preview: 'Roberto, te escribo para informarte sobre el estado de tu póliza...',
    body: `Roberto,\n\nTe escribo para informarte que tu póliza de Vida Temporal está en proceso de revisión por parte de Metlife. El tiempo estimado de emisión es de 5 a 7 días hábiles.\n\n[COMPLETAR CON MÁS DETALLES]`,
    date: '2026-03-17', time: '19:00', read: true, starred: false, labels: ['clientes'],
    attachments: [],
  },
]

type Panel = 'list' | 'compose' | 'read'

const TEXT_COLORS = ['#1A1F2B', '#7C1F31', '#69A481', '#F7941D', '#1A4E8C', '#6B7280']

export default function CorreoPage() {
  const [activeFolder, setActiveFolder] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [panel, setPanel] = useState<Panel>('list')
  const [search, setSearch] = useState('')
  const [composeTo, setComposeTo] = useState('')
  const [composeCc, setComposeCc] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [showCc, setShowCc] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [showGroups, setShowGroups] = useState(false)
  const [xoriaLoading, setXoriaLoading] = useState(false)
  const [xoriaDone, setXoriaDone] = useState(false)
  const [activeColor, setActiveColor] = useState(TEXT_COLORS[0])
  const [starred, setStarred] = useState<Set<string>>(new Set(['e1']))
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const emails = MOCK_EMAILS.filter(e => {
    if (e.folder !== activeFolder) return false
    if (!search) return true
    const q = search.toLowerCase()
    return e.subject.toLowerCase().includes(q) || e.from.toLowerCase().includes(q) || e.preview.toLowerCase().includes(q)
  })

  function openCompose(draft?: Email) {
    if (draft) {
      setComposeTo(draft.to); setComposeSubject(draft.subject); setComposeBody(draft.body)
    } else {
      setComposeTo(''); setComposeCc(''); setComposeSubject(''); setComposeBody('')
    }
    setXoriaDone(false); setPanel('compose')
  }

  function openEmail(email: Email) {
    setSelectedEmail(email); setPanel('read')
  }

  function handleReply() {
    if (!selectedEmail) return
    setComposeTo(selectedEmail.fromEmail)
    setComposeSubject(`RE: ${selectedEmail.subject}`)
    setComposeBody(`\n\n--- Mensaje original de ${selectedEmail.from} (${selectedEmail.date}) ---\n${selectedEmail.body}`)
    setPanel('compose')
  }

  function handleForward() {
    if (!selectedEmail) return
    setComposeTo('')
    setComposeSubject(`FWD: ${selectedEmail.subject}`)
    setComposeBody(`\n\n--- Reenviado de ${selectedEmail.from} (${selectedEmail.date}) ---\n${selectedEmail.body}`)
    setPanel('compose')
  }

  async function xoriaRedactar() {
    setXoriaLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    const sugerencia = composeSubject
      ? `Estimado/a,\n\nEspero que se encuentre bien. Le escribo en relación a: ${composeSubject}.\n\nQueremos confirmarle que estamos atendiendo su caso con la mayor prontitud posible. En caso de requerir información adicional, no dude en contactarnos.\n\nQuedamos a sus órdenes.\n\nAtentamente,\nCarlos Mendoza\nAgente de Seguros Certificado`
      : `Estimado/a,\n\nMe complace saludarle y agradecerle su confianza en nuestros servicios. Nos encontramos trabajando para brindarle la mejor atención posible.\n\nQuedamos a sus órdenes para cualquier consulta.\n\nAtentamente,\nCarlos Mendoza`
    setComposeBody(sugerencia)
    setXoriaLoading(false); setXoriaDone(true)
  }

  const unreadInFolder = (fid: string) => MOCK_EMAILS.filter(e => e.folder === fid && !e.read).length

  return (
    <div className="flex h-full gap-0 bg-[#EFF2F9] rounded-2xl shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] overflow-hidden" style={{ maxHeight: 'calc(100vh - 120px)' }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div className="w-[200px] shrink-0 flex flex-col border-r border-[#D1D5DB]/20 overflow-y-auto">
        {/* Compose */}
        <div className="p-3 pt-4">
          <button onClick={() => openCompose()}
            className="w-full flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#F7941D] text-white text-[12px] shadow-[0_4px_12px_rgba(247,148,29,0.35)] hover:bg-[#E8820A] transition-colors active:scale-95">
            <Plus size={13} /> Redactar
          </button>
        </div>

        {/* Folders */}
        <div className="px-2 pb-2">
          <p className="text-[9px] text-[#9CA3AF] uppercase tracking-widest px-2 mb-1 mt-2">Carpetas</p>
          {FOLDERS.map(f => {
            const unread = unreadInFolder(f.id)
            return (
              <button key={f.id} onClick={() => { setActiveFolder(f.id); setPanel('list'); setSelectedEmail(null) }}
                className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] transition-all duration-150 mb-0.5',
                  activeFolder === f.id
                    ? 'bg-[#F7941D]/10 text-[#F7941D]'
                    : 'text-[#6B7280] hover:text-[#1A1F2B] hover:bg-white/20')}>
                <f.icon size={13} className="shrink-0" />
                <span className="flex-1 text-left">{f.label}</span>
                {unread > 0 && <span className="w-4 h-4 rounded-full bg-[#F7941D] text-white text-[9px] flex items-center justify-center">{unread}</span>}
              </button>
            )
          })}
        </div>

        {/* Labels */}
        <div className="px-2 pb-2">
          <p className="text-[9px] text-[#9CA3AF] uppercase tracking-widest px-2 mb-1 mt-2">Etiquetas</p>
          {LABELS.map(l => (
            <button key={l.id} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] text-[#6B7280] hover:text-[#1A1F2B] hover:bg-white/20 transition-colors mb-0.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
              {l.label}
            </button>
          ))}
        </div>

        {/* Groups */}
        <div className="px-2 pb-2">
          <button onClick={() => setShowGroups(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] text-[#6B7280] hover:text-[#F7941D] hover:bg-white/20 transition-colors">
            <Users size={11} /> Grupos
          </button>
        </div>

        {/* Config */}
        <div className="mt-auto px-2 pb-3">
          <button onClick={() => setShowConfig(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-[#9CA3AF] hover:text-[#F7941D] hover:bg-white/10 transition-colors">
            <Settings size={12} /> Configuración
          </button>
        </div>
      </div>

      {/* ── Email List ──────────────────────────────────────── */}
      <div className={cn('flex flex-col border-r border-[#D1D5DB]/20 overflow-hidden transition-all', panel === 'read' || panel === 'compose' ? 'w-[260px] shrink-0 hidden md:flex' : 'flex-1')}>
        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar correos..."
              className="w-full bg-[#EFF2F9] rounded-xl pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#9CA3AF]" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#D1D5DB]/10">
          {emails.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <Mail size={22} className="text-[#D1D5DB]" />
              <p className="text-[12px] text-[#B5BFC6]">Sin correos</p>
            </div>
          )}
          {emails.map(email => (
            <button key={email.id} onClick={() => openEmail(email)}
              className={cn('w-full flex items-start gap-3 px-3 py-3 hover:bg-white/30 transition-colors text-left',
                selectedEmail?.id === email.id ? 'bg-white/30' : '')}>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#F7941D]/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] text-[#F7941D] font-medium">{email.from[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className={cn('text-[12px] truncate', !email.read ? 'text-[#1A1F2B] font-semibold' : 'text-[#6B7280]')}>{email.from}</p>
                  <span className="text-[10px] text-[#9CA3AF] shrink-0">{email.time}</span>
                </div>
                <p className={cn('text-[11px] truncate mb-0.5', !email.read ? 'text-[#1A1F2B]' : 'text-[#6B7280]')}>{email.subject}</p>
                <p className="text-[10px] text-[#9CA3AF] truncate">{email.preview}</p>
                {email.labels.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {email.labels.map(lid => {
                      const l = LABELS.find(x => x.id === lid)
                      return l ? <div key={lid} className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} /> : null
                    })}
                  </div>
                )}
              </div>
              {!email.read && <div className="w-1.5 h-1.5 rounded-full bg-[#F7941D] mt-1.5 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* ── Email Reader / Compose ──────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── COMPOSE ── */}
        {panel === 'compose' && (
          <div className="flex flex-col h-full">
            {/* Compose Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-2">
                <button onClick={() => setPanel('list')} className="text-[#9CA3AF] hover:text-[#1A1F2B] transition-colors">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <p className="text-[14px] text-[#1A1F2B]">Redactar mensaje</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={xoriaRedactar} disabled={xoriaLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[11px] text-[#F7941D] hover:text-[#E8820A] transition-all disabled:opacity-60">
                  {xoriaLoading ? <Loader2 size={11} className="animate-spin" /> : xoriaDone ? <CheckCircle size={11} /> : <Sparkles size={11} />}
                  {xoriaLoading ? 'Redactando...' : xoriaDone ? 'Listo' : 'Redactar con XORIA'}
                </button>
              </div>
            </div>

            {/* To / CC */}
            <div className="border-b border-[#D1D5DB]/15">
              <div className="flex items-center px-5 py-2 border-b border-[#D1D5DB]/10 gap-2">
                <span className="text-[11px] text-[#9CA3AF] w-6">Para</span>
                <input value={composeTo} onChange={e => setComposeTo(e.target.value)}
                  className="flex-1 bg-transparent text-[12px] text-[#1A1F2B] outline-none placeholder:text-[#B5BFC6]"
                  placeholder="destinatario@email.com" />
                <button onClick={() => setShowCc(!showCc)} className="text-[10px] text-[#9CA3AF] hover:text-[#F7941D]">CC</button>
              </div>
              {showCc && (
                <div className="flex items-center px-5 py-2 border-b border-[#D1D5DB]/10 gap-2">
                  <span className="text-[11px] text-[#9CA3AF] w-6">CC</span>
                  <input value={composeCc} onChange={e => setComposeCc(e.target.value)}
                    className="flex-1 bg-transparent text-[12px] text-[#1A1F2B] outline-none placeholder:text-[#B5BFC6]"
                    placeholder="copia@email.com" />
                </div>
              )}
              <div className="flex items-center px-5 py-2 gap-2">
                <span className="text-[11px] text-[#9CA3AF] w-6">Asunto</span>
                <input value={composeSubject} onChange={e => setComposeSubject(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] text-[#1A1F2B] outline-none placeholder:text-[#B5BFC6] font-medium"
                  placeholder="Escribe el asunto..." />
              </div>
            </div>

            {/* Rich text toolbar */}
            <div className="flex items-center gap-0.5 px-4 py-2 border-b border-[#D1D5DB]/10 flex-wrap">
              {[
                { icon: Bold, title: 'Negrita', cmd: 'bold' },
                { icon: Italic, title: 'Cursiva', cmd: 'italic' },
                { icon: Underline, title: 'Subrayado', cmd: 'underline' },
              ].map(btn => (
                <button key={btn.cmd} title={btn.title}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F7941D]/10 hover:text-[#F7941D] transition-colors">
                  <btn.icon size={12} />
                </button>
              ))}
              <div className="w-px h-4 bg-[#D1D5DB]/40 mx-1" />
              {TEXT_COLORS.map(c => (
                <button key={c} onClick={() => setActiveColor(c)}
                  className={cn('w-4 h-4 rounded-full transition-all', activeColor === c ? 'ring-2 ring-offset-1 ring-[#F7941D]' : '')}
                  style={{ background: c }} />
              ))}
              <div className="w-px h-4 bg-[#D1D5DB]/40 mx-1" />
              {[
                { icon: AlignLeft, title: 'Izquierda' },
                { icon: AlignCenter, title: 'Centro' },
              ].map(btn => (
                <button key={btn.title} title={btn.title}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F7941D]/10 hover:text-[#F7941D] transition-colors">
                  <btn.icon size={12} />
                </button>
              ))}
              <div className="w-px h-4 bg-[#D1D5DB]/40 mx-1" />
              {[
                { icon: LinkIcon, title: 'Enlace' },
                { icon: ImageIcon, title: 'Imagen' },
                { icon: Paperclip, title: 'Adjunto' },
              ].map(btn => (
                <button key={btn.title} title={btn.title}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F7941D]/10 hover:text-[#F7941D] transition-colors">
                  <btn.icon size={12} />
                </button>
              ))}
            </div>

            {/* Body */}
            <textarea ref={bodyRef} value={composeBody} onChange={e => setComposeBody(e.target.value)}
              className="flex-1 px-5 py-4 text-[13px] text-[#1A1F2B] leading-relaxed bg-transparent outline-none resize-none placeholder:text-[#B5BFC6]"
              placeholder="Escribe tu mensaje aquí..." />

            {/* Footer */}
            <div className="flex items-center gap-2 px-5 pb-5 pt-2">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F7941D] text-white text-[12px] shadow-[0_4px_12px_rgba(247,148,29,0.35)] hover:bg-[#E8820A] transition-colors active:scale-95">
                <Send size={13} /> Enviar
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-[12px] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
                <File size={13} /> Guardar borrador
              </button>
              <button className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}

        {/* ── EMAIL READER ── */}
        {panel === 'read' && selectedEmail && (
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Reader Header */}
            <div className="px-5 py-4 border-b border-[#D1D5DB]/20 sticky top-0 bg-[#EFF2F9] z-10">
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setPanel('list')} className="text-[#9CA3AF] hover:text-[#1A1F2B] md:hidden">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <h2 className="text-[15px] text-[#1A1F2B] flex-1 leading-snug">{selectedEmail.subject}</h2>
                <button onClick={() => setStarred(prev => { const n = new Set(prev); n.has(selectedEmail.id) ? n.delete(selectedEmail.id) : n.add(selectedEmail.id); return n })}>
                  {starred.has(selectedEmail.id)
                    ? <Star size={15} className="text-[#F7941D] fill-[#F7941D]" />
                    : <StarOff size={15} className="text-[#9CA3AF] hover:text-[#F7941D]" />}
                </button>
              </div>
              {/* Sender */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F7941D]/15 flex items-center justify-center shrink-0">
                  <span className="text-[12px] text-[#F7941D] font-medium">{selectedEmail.from[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1A1F2B]">{selectedEmail.from}</p>
                  <p className="text-[11px] text-[#9CA3AF] truncate">{selectedEmail.fromEmail} → {selectedEmail.to}</p>
                </div>
                <p className="text-[11px] text-[#9CA3AF] shrink-0">{selectedEmail.date} {selectedEmail.time}</p>
              </div>
              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {[
                  { icon: Reply, label: 'Responder', fn: handleReply },
                  { icon: ReplyAll, label: 'Resp. todos', fn: handleReply },
                  { icon: Forward, label: 'Reenviar', fn: handleForward },
                ].map(a => (
                  <button key={a.label} onClick={a.fn}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[11px] text-[#6B7280] hover:text-[#F7941D] transition-colors">
                    <a.icon size={11} /> {a.label}
                  </button>
                ))}
                <button className="ml-auto w-7 h-7 rounded-xl flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#1A1F2B]">
                  <MoreHorizontal size={13} />
                </button>
              </div>
            </div>

            {/* Attachments */}
            {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
              <div className="px-5 py-3 border-b border-[#D1D5DB]/15 flex gap-2 flex-wrap">
                {selectedEmail.attachments.map(att => (
                  <div key={att} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] text-[11px] text-[#6B7280] cursor-pointer hover:text-[#F7941D]">
                    <Paperclip size={10} /> {att}
                  </div>
                ))}
              </div>
            )}

            {/* Body */}
            <div className="px-5 py-5 text-[13px] text-[#1A1F2B] leading-relaxed whitespace-pre-wrap flex-1">
              {selectedEmail.body}
            </div>

            {/* Labels */}
            {selectedEmail.labels.length > 0 && (
              <div className="px-5 pb-4 flex gap-2 flex-wrap">
                {selectedEmail.labels.map(lid => {
                  const l = LABELS.find(x => x.id === lid)
                  return l ? (
                    <span key={lid} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] text-white"
                      style={{ background: l.color }}>
                      {l.label}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {panel === 'list' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Mail size={36} className="text-[#D1D5DB]" />
            <p className="text-[13px] text-[#B5BFC6]">Selecciona un correo para leer</p>
            <button onClick={() => openCompose()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F7941D]/10 text-[#F7941D] text-[12px] hover:bg-[#F7941D]/20">
              <Plus size={12} /> Redactar nuevo
            </button>
          </div>
        )}
      </div>

      {/* ── Modal Configuración ──────────────────────────────── */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20 sticky top-0 bg-[#EFF2F9] rounded-t-3xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <Settings size={15} className="text-[#F7941D]" />
                </div>
                <p className="text-[15px] text-[#1A1F2B]">Configuración de correo</p>
              </div>
              <button onClick={() => setShowConfig(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31]">
                <X size={13} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-5">
              {/* SMTP */}
              <div>
                <p className="text-[12px] text-[#1A1F2B] mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#F7941D]/10 flex items-center justify-center text-[10px] text-[#F7941D]">S</span>
                  Configuración SMTP (Envío)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['Servidor SMTP', 'Puerto', 'Usuario', 'Contraseña', 'Seguridad (TLS/SSL)', 'Correo de envío'].map(f => (
                    <div key={f} className={f === 'Servidor SMTP' || f === 'Correo de envío' ? 'col-span-2' : ''}>
                      <p className="text-[10px] text-[#9CA3AF] mb-1">{f}</p>
                      <input type={f === 'Contraseña' ? 'password' : 'text'}
                        placeholder={f === 'Puerto' ? '587' : f === 'Seguridad (TLS/SSL)' ? 'TLS' : f}
                        className="w-full bg-[#EFF2F9] rounded-xl px-3 py-2 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* IMAP */}
              <div>
                <p className="text-[12px] text-[#1A1F2B] mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#69A481]/10 flex items-center justify-center text-[10px] text-[#69A481]">I</span>
                  Configuración IMAP (Recepción)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['Servidor IMAP', 'Puerto', 'Usuario', 'Contraseña'].map(f => (
                    <div key={f} className={f === 'Servidor IMAP' ? 'col-span-2' : ''}>
                      <p className="text-[10px] text-[#9CA3AF] mb-1">{f}</p>
                      <input type={f === 'Contraseña' ? 'password' : 'text'}
                        placeholder={f === 'Puerto' ? '993' : f}
                        className="w-full bg-[#EFF2F9] rounded-xl px-3 py-2 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Firma */}
              <div>
                <p className="text-[12px] text-[#1A1F2B] mb-2">Firma de correo</p>
                <textarea rows={4}
                  defaultValue={`Carlos Mendoza\nAgente de Seguros Certificado\nTel: 55-1234-5678\ncarlos@agencia.com`}
                  className="w-full bg-[#EFF2F9] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] resize-none" />
              </div>

              {/* XORIA Auto-envío */}
              <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="text-[12px] text-[#1A1F2B]">XORIA Auto-envío</p>
                      <p className="text-[10px] text-[#9CA3AF]">XORIA redacta y envía respuestas automáticas</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-[#F7941D] relative cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-white absolute right-0.5 top-0.5 shadow-sm" />
                  </div>
                </div>
              </div>

              <button onClick={() => setShowConfig(false)}
                className="w-full py-3 rounded-xl bg-[#F7941D] text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A]">
                Guardar configuración
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Grupos ──────────────────────────────────────── */}
      {showGroups && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <Users size={15} className="text-[#F7941D]" />
                </div>
                <p className="text-[15px] text-[#1A1F2B]">Grupos de contactos</p>
              </div>
              <button onClick={() => setShowGroups(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31]">
                <X size={13} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {GROUPS.map(g => (
                <div key={g.id} className="bg-[#EFF2F9] rounded-xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] text-[#1A1F2B]">{g.name}</p>
                    <span className="px-2 py-0.5 rounded-full bg-[#F7941D]/10 text-[10px] text-[#F7941D]">{g.count} miembros</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {g.members.map(m => (
                      <p key={m} className="text-[11px] text-[#6B7280]">· {m}</p>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-1.5 rounded-lg text-[11px] text-[#F7941D] bg-[#F7941D]/10 hover:bg-[#F7941D]/20">
                      Enviar correo al grupo
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-[11px] text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#D1D5DB] text-[12px] text-[#9CA3AF] hover:border-[#F7941D] hover:text-[#F7941D] flex items-center justify-center gap-2 transition-colors">
                <Plus size={13} /> Nuevo grupo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
