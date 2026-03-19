"use client";

import { useState } from "react";
import { MOCK_AGENDA } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Plus, Phone, Users, ArrowRight, CheckSquare, Clock } from "lucide-react";

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

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

export default function AgendaPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#1A1F2B] text-2xl font-bold tracking-tight">Agenda</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            {selectedDay} de {MONTHS[viewMonth]} de {viewYear}
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
          <Plus size={16} />
          Nuevo evento
        </button>
      </div>

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
                                {ev.client && <p className="text-[#6B7280] text-xs mt-0.5">{ev.client}</p>}
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
    </div>
  );
}
