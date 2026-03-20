"use client";

import { useState } from "react";
import { MOCK_AGENDA, MOCK_CLIENTS } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Plus, Phone, Users, ArrowRight, CheckSquare, Clock, X, CheckCircle, Star, Gift, CalendarDays, BookUser, Search } from "lucide-react";
import { ClientLink, NeuSelect } from "@/components/ui";

const DAYS_OF_WEEK = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  call: { label: "Llamada", icon: Phone, color: "#F7941D", bg: "#F7941D18" },
  meeting: { label: "Reunión", icon: Users, color: "#69A481", bg: "#69A48118" },
  followup: { label: "Seguimiento", icon: ArrowRight, color: "#7C1F31", bg: "#7C1F3118" },
  task: { label: "Tarea", icon: CheckSquare, color: "#6B7280", bg: "#6B728018" },
  renewal: { label: "Renovación", icon: Clock, color: "#1A1F2B", bg: "#1A1F2B18" },
};

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7;
  const days: (number | null)[] = Array(offset).fill(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

const EXTRA_EVENTS = [
  { id: "e5", time: "09:00", title: "Revisión de cartera Q2", type: "meeting" as const, client: "Equipo" },
  { id: "e6", time: "11:30", title: "Propuesta póliza empresarial", type: "call" as const, client: "Grupo Textil SA" },
  { id: "e7", time: "16:00", title: "Cierre endoso vehículo", type: "task" as const, client: "María Torres" },
];

const ALL_EVENTS = [...MOCK_AGENDA, ...EXTRA_EVENTS];

// ─── DIRECTORIO DE CONTACTOS PERSONALES ──────────────────────────────────────
const MOCK_CONTACTS = [
  { id: 'c1', nombre: 'María Elena Garza', relacion: 'Esposa', telefono: '33-1234-5678', email: 'mgarza@personal.com', categoria: 'familia' },
  { id: 'c2', nombre: 'Jorge Mendoza', relacion: 'Padre', telefono: '33-5555-1234', email: '', categoria: 'familia' },
  { id: 'c3', nombre: 'Dr. Alejandro Ramírez', relacion: 'Médico familiar', telefono: '33-9876-5432', email: 'drrm@clinica.com', categoria: 'servicios' },
  { id: 'c4', nombre: 'Lic. Patricia Torres', relacion: 'Abogada fiscal', telefono: '33-7890-1234', email: 'ptorres@despacho.mx', categoria: 'profesional' },
  { id: 'c5', nombre: 'Gerente GNP Zona Occ.', relacion: 'Aseguradora', telefono: '33-4567-8901', email: 'zona.occ@gnp.com.mx', categoria: 'aseguradora' },
  { id: 'c6', nombre: 'Contador Enrique Salinas', relacion: 'Contador', telefono: '33-2345-6789', email: 'esalinas@conta.mx', categoria: 'profesional' },
  { id: 'c7', nombre: 'Mario Ruiz — AXA', relacion: 'Ejecutivo aseguradora', telefono: '33-3456-7890', email: 'mario.r@axa.com.mx', categoria: 'aseguradora' },
]

// ─── FECHAS IMPORTANTES ────────────────────────────────────────────────────────
const MOCK_FECHAS = [
  { id: 'f1', titulo: 'Cumpleaños María Elena', categoria: 'cumpleaños', fecha: '15 de julio', persona: 'Esposa', diasFaltan: 118 },
  { id: 'f2', titulo: 'Aniversario de bodas', categoria: 'aniversario', fecha: '23 de septiembre', persona: 'María Elena Garza', diasFaltan: 188 },
  { id: 'f3', titulo: 'Cumpleaños papá Jorge', categoria: 'cumpleaños', fecha: '3 de mayo', persona: 'Jorge Mendoza', diasFaltan: 45 },
  { id: 'f4', titulo: 'Renovación contrato agencia', categoria: 'negocio', fecha: '1 de agosto', persona: 'Seguros Premier', diasFaltan: 135 },
  { id: 'f5', titulo: 'Vencimiento licencia CNSF', categoria: 'profesional', fecha: '30 de junio', persona: 'Cédula propia', diasFaltan: 103 },
  { id: 'f6', titulo: 'Cumpleaños Ana López (cliente VIP)', categoria: 'cliente', fecha: '28 de abril', persona: 'Cliente VIP', diasFaltan: 40 },
]

const CATEGORIA_COLORS: Record<string, { color: string; bg: string }> = {
  familia:     { color: '#7C1F31', bg: 'rgba(124,31,49,0.10)' },
  profesional: { color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  servicios:   { color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
  aseguradora: { color: '#F7941D', bg: 'rgba(247,148,29,0.10)' },
  cumpleaños:  { color: '#7C1F31', bg: 'rgba(124,31,49,0.10)' },
  aniversario: { color: '#69A481', bg: 'rgba(105,164,129,0.10)' },
  negocio:     { color: '#F7941D', bg: 'rgba(247,148,29,0.10)' },
  cliente:     { color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

export default function AgendaPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [showModal, setShowModal] = useState(false);
  const [eventSaved, setEventSaved] = useState(false);
  const [newEvent, setNewEvent] = useState({ titulo: '', tipo: 'call', cliente: '', fecha: '', hora: '', notas: '' });
  const [activeTab, setActiveTab] = useState<'agenda' | 'directorio' | 'fechas'>('agenda');
  const [contactSearch, setContactSearch] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFechaModal, setShowFechaModal] = useState(false);

  function openModal() {
    setShowModal(true); setEventSaved(false);
    setNewEvent({ titulo: '', tipo: 'call', cliente: '', fecha: `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`, hora: '09:00', notas: '' });
  }
  function handleSaveEvent() {
    setEventSaved(true);
    setTimeout(() => setShowModal(false), 1800);
  }

  const calDays = getCalendarDays(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const eventsBySlot: Record<string, typeof ALL_EVENTS> = {};
  ALL_EVENTS.forEach((ev) => {
    const hour = ev.time.slice(0, 5);
    if (!eventsBySlot[hour]) eventsBySlot[hour] = [];
    eventsBySlot[hour].push(ev);
  });

  return (
    <>
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#1A1F2B] text-2xl font-bold tracking-tight">Agenda</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            {selectedDay} de {MONTHS[viewMonth]} de {viewYear}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'directorio' && (
            <button onClick={() => setShowContactModal(true)} className="flex items-center gap-2 text-sm px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:bg-[#2563EB] transition-colors">
              <Plus size={16} /> Contacto
            </button>
          )}
          {activeTab === 'fechas' && (
            <button onClick={() => setShowFechaModal(true)} className="flex items-center gap-2 text-sm px-4 py-2.5 bg-[#7C1F31] text-white rounded-xl shadow-[0_4px_12px_rgba(124,31,49,0.3)] hover:bg-[#6b1a2a] transition-colors">
              <Plus size={16} /> Fecha importante
            </button>
          )}
          {activeTab === 'agenda' && (
            <button onClick={openModal} className="flex items-center gap-2 text-sm px-4 py-2.5 bg-[#F7941D] text-white rounded-xl shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
              <Plus size={16} /> Nuevo evento
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#EFF2F9] p-1.5 rounded-2xl shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.08)] w-fit">
        {([
          { id: 'agenda', label: 'Agenda', icon: CalendarDays },
          { id: 'directorio', label: 'Directorio', icon: BookUser },
          { id: 'fechas', label: 'Fechas importantes', icon: Gift },
        ] as const).map(tab => {
          const TIcon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all',
                activeTab === tab.id
                  ? 'bg-white text-[#1A1F2B] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]'
                  : 'text-[#9CA3AF] hover:text-[#6B7280]')}>
              <TIcon size={13} />{tab.label}
            </button>
          )
        })}
      </div>

      {/* TAB: AGENDA */}
      {activeTab === 'agenda' && (
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="flex flex-col gap-4">
          <div className="neu-md rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="text-[#1A1F2B] text-sm font-semibold">{MONTHS[viewMonth]} {viewYear}</span>
              <button onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="text-center text-[10px] text-[#9CA3AF] py-1 font-semibold">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {calDays.map((day, i) => {
                const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                const isSelected = day === selectedDay && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                const hasEvent = day !== null && [3, 8, 12, 15, 21, 26].includes(day);
                return (
                  <button key={i} onClick={() => day && setSelectedDay(day)} disabled={!day}
                    className={cn("relative h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-xs transition-all",
                      !day && "invisible",
                      isSelected ? "bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.4)]"
                        : isToday ? "text-[#F7941D] font-bold"
                        : "text-[#6B7280] hover:text-[#1A1F2B] hover:bg-white/50")}>
                    {day}
                    {hasEvent && !isSelected && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F7941D]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="neu-md rounded-2xl p-5">
            <h3 className="text-[#1A1F2B] text-sm font-semibold mb-4">Tipos de evento</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: cfg.bg }}>
                      <Icon size={13} style={{ color: cfg.color }} />
                    </div>
                    <span className="text-[#6B7280] text-sm">{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="neu-md rounded-2xl p-5">
            <h3 className="text-[#1A1F2B] text-sm font-semibold mb-4">Próximos 7 días</h3>
            <div className="flex flex-col gap-2">
              {ALL_EVENTS.slice(0, 4).map((ev) => {
                const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.task;
                return (
                  <div key={ev.id} className="flex items-center gap-2.5 py-1">
                    <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: cfg.color }} />
                    <div>
                      <p className="text-[#1A1F2B] text-xs font-semibold truncate max-w-[160px]">{ev.title}</p>
                      <p className="text-[#9CA3AF] text-xs">{ev.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="neu-md rounded-2xl p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#1A1F2B] text-base font-semibold">{selectedDay} de {MONTHS[viewMonth]}</h2>
            <div className="flex items-center gap-2">
              {["Día", "Semana", "Mes"].map((v) => (
                <button key={v} className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  v === "Día" ? "bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)]" : "text-[#9CA3AF] hover:text-[#6B7280]")}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-y-auto max-h-[600px] pr-2">
            {TIME_SLOTS.map((slot) => {
              const events = eventsBySlot[slot] || [];
              return (
                <div key={slot} className="flex gap-4 min-h-[72px]">
                  <div className="w-12 shrink-0 pt-1">
                    <span className="text-[#9CA3AF] text-xs">{slot}</span>
                  </div>
                  <div className="flex-1 border-t border-[#B5BFC6]/20 pt-2 pb-4">
                    {events.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {events.map((ev) => {
                          const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.task;
                          const Icon = cfg.icon;
                          return (
                            <div key={ev.id} className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity"
                              style={{ background: cfg.bg, borderLeft: "3px solid " + cfg.color }}>
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: cfg.color + "22" }}>
                                <Icon size={13} style={{ color: cfg.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[#1A1F2B] text-sm font-semibold truncate">{ev.title}</p>
                                {ev.client && (
                                  <ClientLink name={ev.client} plain className="text-[#6B7280] text-xs mt-0.5" />
                                )}
                              </div>
                              <span className="text-xs font-semibold shrink-0" style={{ color: cfg.color }}>{ev.time}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full flex items-center"><div className="h-[1px] w-full bg-[#B5BFC6]/10" /></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )} {/* end agenda tab */}

      {/* TAB: DIRECTORIO */}
      {activeTab === 'directorio' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-[#EFF2F9] rounded-xl px-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.08)]">
            <Search size={14} className="text-[#9CA3AF] shrink-0" />
            <input value={contactSearch} onChange={e => setContactSearch(e.target.value)} placeholder="Buscar contacto..."
              className="flex-1 bg-transparent py-2.5 text-[13px] text-[#1A1F2B] outline-none placeholder:text-[#9CA3AF]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {MOCK_CONTACTS.filter(c => !contactSearch || c.nombre.toLowerCase().includes(contactSearch.toLowerCase()) || c.relacion.toLowerCase().includes(contactSearch.toLowerCase())).map(c => {
              const cat = CATEGORIA_COLORS[c.categoria] ?? { color: '#6B7280', bg: 'rgba(107,114,128,0.10)' }
              return (
                <div key={c.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[15px] font-bold text-white shrink-0"
                      style={{ background: cat.color }}>
                      {c.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider" style={{ color: cat.color, background: cat.bg }}>
                      {c.categoria}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#1A1F2B] font-semibold leading-tight">{c.nombre}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">{c.relacion}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {c.telefono && (
                      <a href={`tel:${c.telefono.replace(/-/g,'')}`} className="flex items-center gap-2 text-[11px] text-[#6B7280] hover:text-[#F7941D] transition-colors">
                        <Phone size={11} />{c.telefono}
                      </a>
                    )}
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-[11px] text-[#6B7280] hover:text-[#3B82F6] transition-colors truncate">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg>
                        {c.email}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
            {/* Agregar nuevo contacto */}
            <button onClick={() => setShowContactModal(true)} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.10)] border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center gap-2 text-[#9CA3AF] hover:text-[#F7941D] hover:border-[#F7941D]/40 transition-all min-h-[140px]">
              <Plus size={20} />
              <span className="text-[11px] font-semibold">Agregar contacto</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB: FECHAS IMPORTANTES */}
      {activeTab === 'fechas' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {MOCK_FECHAS.map(f => {
              const cat = CATEGORIA_COLORS[f.categoria] ?? { color: '#6B7280', bg: 'rgba(107,114,128,0.10)' }
              const isUrgente = f.diasFaltan <= 30
              return (
                <div key={f.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cat.bg }}>
                      {f.categoria === 'cumpleaños' ? <Gift size={16} style={{ color: cat.color }} /> : <Star size={16} style={{ color: cat.color }} />}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider" style={{ color: cat.color, background: cat.bg }}>
                        {f.categoria}
                      </span>
                      {isUrgente && (
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-semibold bg-[#7C1F31]/10 text-[#7C1F31]">
                          ¡Pronto!
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#1A1F2B] font-semibold leading-tight">{f.titulo}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">{f.persona}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={11} className="text-[#9CA3AF]" />
                      <span className="text-[11px] text-[#6B7280]">{f.fecha}</span>
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: isUrgente ? '#7C1F31' : cat.color }}>
                      En {f.diasFaltan} días
                    </span>
                  </div>
                </div>
              )
            })}
            <button onClick={() => setShowFechaModal(true)} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.10)] border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center gap-2 text-[#9CA3AF] hover:text-[#7C1F31] hover:border-[#7C1F31]/40 transition-all min-h-[160px]">
              <Plus size={20} />
              <span className="text-[11px] font-semibold">Agregar fecha importante</span>
            </button>
          </div>
        </div>
      )}
    </div>

      {/* Modal nuevo evento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <Clock size={15} className="text-[#F7941D]" />
                </div>
                <p className="text-[15px] text-[#1A1F2B]">Nuevo evento</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {eventSaved ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#69A481]/15 flex items-center justify-center">
                    <CheckCircle size={28} className="text-[#69A481]" />
                  </div>
                  <p className="text-[15px] text-[#1A1F2B]">Evento guardado</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Titulo</label>
                    <input value={newEvent.titulo} onChange={e => setNewEvent(p => ({ ...p, titulo: e.target.value }))}
                      placeholder="Nombre del evento..."
                      className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Tipo</label>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                        <button key={key} onClick={() => setNewEvent(p => ({ ...p, tipo: key }))}
                          className="px-3 py-1.5 rounded-xl text-[11px] transition-all capitalize"
                          style={{ background: newEvent.tipo === key ? cfg.color : 'transparent', color: newEvent.tipo === key ? '#fff' : '#9CA3AF', border: `1px solid ${newEvent.tipo === key ? cfg.color : '#D1D5DB'}` }}>
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Cliente</label>
                    <NeuSelect
                      value={newEvent.cliente}
                      onChange={v => setNewEvent(p => ({ ...p, cliente: v }))}
                      placeholder="Sin cliente asignado"
                      options={MOCK_CLIENTS.map(c => ({ value: c.name, label: c.name }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Fecha</label>
                      <input type="date" value={newEvent.fecha} onChange={e => setNewEvent(p => ({ ...p, fecha: e.target.value }))}
                        className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]" />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Hora</label>
                      <input type="time" value={newEvent.hora} onChange={e => setNewEvent(p => ({ ...p, hora: e.target.value }))}
                        className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Notas</label>
                    <textarea rows={2} value={newEvent.notas} onChange={e => setNewEvent(p => ({ ...p, notas: e.target.value }))}
                      placeholder="Detalles adicionales..."
                      className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  </div>
                  <button onClick={handleSaveEvent} disabled={!newEvent.titulo}
                    className="w-full py-3.5 rounded-xl bg-[#F7941D] text-white text-[13px] font-medium hover:bg-[#E8820A] transition-colors shadow-[0_4px_12px_rgba(247,148,29,0.3)] disabled:opacity-50">
                    Guardar evento
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal nuevo contacto */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <p className="text-[15px] text-[#1A1F2B] font-semibold">Nuevo contacto</p>
              <button onClick={() => setShowContactModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#7C1F31] transition-colors"><X size={13} /></button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {(['Nombre completo', 'Relación', 'Teléfono', 'Correo electrónico'] as const).map(field => (
                <div key={field}>
                  <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">{field}</label>
                  <input placeholder={`${field}...`} className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                </div>
              ))}
              <button onClick={() => setShowContactModal(false)} className="w-full py-3 rounded-xl bg-[#3B82F6] text-white text-[13px] font-semibold mt-1">Guardar contacto</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nueva fecha importante */}
      {showFechaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <p className="text-[15px] text-[#1A1F2B] font-semibold">Nueva fecha importante</p>
              <button onClick={() => setShowFechaModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#7C1F31] transition-colors"><X size={13} /></button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {(['Título', 'Persona / Descripción', 'Fecha (ej: 15 de julio)'] as const).map(field => (
                <div key={field}>
                  <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">{field}</label>
                  <input placeholder={`${field}...`} className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                </div>
              ))}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Categoría</label>
                <div className="flex gap-2 flex-wrap">
                  {['cumpleaños', 'aniversario', 'negocio', 'profesional', 'cliente'].map(cat => (
                    <button key={cat} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize border border-[#D1D5DB] text-[#9CA3AF] hover:border-[#7C1F31] hover:text-[#7C1F31] transition-colors">{cat}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowFechaModal(false)} className="w-full py-3 rounded-xl bg-[#7C1F31] text-white text-[13px] font-semibold mt-1">Guardar fecha</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
