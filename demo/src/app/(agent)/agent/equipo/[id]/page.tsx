"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_AGENTES_EQUIPO, MOCK_POLICIES, MOCK_LEADS, MOCK_TICKETS } from "@/data/mock";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Shield, Users, TrendingUp, Target, CreditCard,
  CheckCircle, Clock, Mail, Phone, BarChart3, Star, ChevronRight,
  AlertTriangle, FileText, RefreshCw
} from "lucide-react";
import Link from "next/link";

const TABS = ["Resumen", "Producción", "Cartera", "Pipeline", "Tickets"];

function fmt(n: number) {
  return n >= 1000000
    ? "$" + (n / 1000000).toFixed(1) + "M"
    : n >= 1000
    ? "$" + (n / 1000).toFixed(0) + "K"
    : "$" + n.toLocaleString("es-MX");
}

export default function AgenteDetalladoPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const ag = MOCK_AGENTES_EQUIPO.find(a => a.id === params.id) || MOCK_AGENTES_EQUIPO[0];

  // Datos simulados de cartera y pipeline del agente
  const polizas = MOCK_POLICIES.slice(0, ag.polizasActivas > 10 ? 10 : ag.polizasActivas);
  const leads = MOCK_LEADS.slice(0, ag.leads > 10 ? 8 : ag.leads);
  const tickets = MOCK_TICKETS.filter((_, i) => i < 4);

  const metaPct = ag.avanceMeta;
  const metaColor = metaPct >= 90 ? "#69A481" : metaPct >= 70 ? "#F7941D" : "#7C1F31";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#1A1F2B] transition-colors mb-4 text-[13px]"
      >
        <ArrowLeft size={15} /> Volver al equipo
      </button>

      {/* Header del agente */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 mb-4 shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)]">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1A1F2B] flex items-center justify-center text-white text-[18px] font-black shrink-0 shadow-[0_4px_14px_rgba(26,31,43,0.3)]">
            {ag.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[18px] text-[#1A1F2B] font-semibold tracking-wide">{ag.name}</h1>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold",
                ag.status === "activo" ? "bg-[#69A481]/15 text-[#69A481]" : "bg-[#7C1F31]/10 text-[#7C1F31]")}>
                {ag.status === "activo" ? "Activo" : "Inactivo"}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7941D]/12 text-[#F7941D] font-semibold">
                Plan {ag.plan}
              </span>
            </div>
            <p className="text-[12px] text-[#9CA3AF] mt-1">Cédula CNSF: {ag.cedula}</p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <a href={`mailto:${ag.email}`} className="flex items-center gap-1 text-[11px] text-[#6B7280] hover:text-[#F7941D] transition-colors">
                <Mail size={11} /> {ag.email}
              </a>
              <span className="text-[11px] text-[#9CA3AF]">Último acceso: {ag.ultimoAcceso}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {ag.ramos.map(r => (
                <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF2F9] shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.12)] text-[#6B7280]">
                  {r}
                </span>
              ))}
            </div>
          </div>
          {/* Meta mensual */}
          <div className="text-right shrink-0">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Meta mes</p>
            <p className="text-[20px] font-bold leading-tight" style={{ color: metaColor }}>{metaPct}%</p>
            <div className="w-20 h-2 bg-[#EFF2F9] rounded-full overflow-hidden shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] mt-1">
              <div className="h-full rounded-full transition-all" style={{ width: metaPct + "%", background: metaColor }} />
            </div>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">{fmt(ag.comisionMes)} / {fmt(ag.metaMes)}</p>
          </div>
        </div>

        {/* KPIs del agente */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {[
            { label: "Pólizas activas", val: ag.polizasActivas.toString(), icon: FileText, color: "#69A481" },
            { label: "Prima total", val: fmt(ag.primaTotal), icon: CreditCard, color: "#F7941D" },
            { label: "Leads activos", val: ag.leads.toString(), icon: Users, color: "#6B7280" },
            { label: "Tasa de cierre", val: ag.tasaCierre + "%", icon: TrendingUp, color: "#1A1F2B" },
          ].map(kpi => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.15)]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: kpi.color + "18" }}>
                    <Icon size={12} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider leading-tight">{kpi.label}</p>
                </div>
                <p className="text-[18px] text-[#1A1F2B] font-bold leading-none">{kpi.val}</p>
              </div>
            );
          })}
        </div>

        {/* Aseguradoras */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Aseguradoras:</span>
          {ag.aseguradoras.map(a => (
            <span key={a} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1A1F2B]/8 text-[#1A1F2B] font-medium">{a}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#EFF2F9] rounded-2xl shadow-[-8px_-8px_18px_#FAFBFF,8px_8px_18px_rgba(22,27,29,0.18)] overflow-hidden">
        <div className="flex border-b border-[#E5E7EB]/60">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={cn(
                "flex-1 py-3.5 text-[12px] font-semibold transition-colors tracking-wide",
                activeTab === i
                  ? "text-[#F7941D] border-b-2 border-[#F7941D] bg-white/30"
                  : "text-[#9CA3AF] hover:text-[#6B7280]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── Resumen ── */}
          {activeTab === 0 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Producción mensual */}
                <div>
                  <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-2">Producción últimos meses</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { mes: "Enero", prima: ag.primaTotal * 0.82, polizas: Math.floor(ag.polizasActivas * 0.9) },
                      { mes: "Febrero", prima: ag.primaTotal * 0.91, polizas: Math.floor(ag.polizasActivas * 0.95) },
                      { mes: "Marzo", prima: ag.primaTotal, polizas: ag.polizasActivas },
                    ].map(m => (
                      <div key={m.mes} className="flex items-center gap-3">
                        <span className="text-[11px] text-[#6B7280] w-14 shrink-0">{m.mes}</span>
                        <div className="flex-1 h-2.5 bg-[#EFF2F9] rounded-full overflow-hidden shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08)]">
                          <div className="h-full rounded-full bg-[#F7941D] transition-all"
                            style={{ width: (m.prima / (ag.primaTotal * 1.1)) * 100 + "%" }} />
                        </div>
                        <span className="text-[11px] text-[#F7941D] w-14 text-right shrink-0">{fmt(m.prima)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Distribución por ramo */}
                <div>
                  <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-2">Distribución por ramo</p>
                  <div className="flex flex-col gap-2">
                    {ag.ramos.map((ramo, i) => {
                      const pct = Math.round(100 / ag.ramos.length + (i === 0 ? 15 : i === 1 ? 5 : -5));
                      const colors = ["#F7941D", "#69A481", "#1A1F2B", "#6B7280", "#7C1F31"];
                      return (
                        <div key={ramo} className="flex items-center gap-3">
                          <span className="text-[11px] text-[#6B7280] w-20 shrink-0 truncate">{ramo}</span>
                          <div className="flex-1 h-2 bg-[#EFF2F9] rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]">
                            <div className="h-full rounded-full" style={{ width: Math.min(pct, 100) + "%", background: colors[i % colors.length] }} />
                          </div>
                          <span className="text-[11px] text-[#9CA3AF] w-8 text-right shrink-0">{Math.min(pct, 100)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Historial de actividad reciente */}
              <div>
                <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-2">Actividad reciente</p>
                <div className="flex flex-col gap-2">
                  {[
                    { ico: CheckCircle, color: "#69A481", text: "Emisión de póliza GNP-2026-004521 · Ana López", time: "Hoy 08:30" },
                    { ico: Users, color: "#F7941D", text: "Nuevo prospecto ingresado · Roberto Sánchez", time: "Ayer 17:45" },
                    { ico: RefreshCw, color: "#6B7280", text: "Renovación tramitada · María Torres · AXA", time: "Mar 18 14:00" },
                    { ico: Phone, color: "#1A1F2B", text: "Llamada de seguimiento · Empresa XYZ · 12 min", time: "Mar 18 11:30" },
                  ].map((item, i) => {
                    const Icon = item.ico;
                    return (
                      <div key={i} className="flex items-start gap-3 bg-white/40 rounded-xl px-3 py-2.5">
                        <Icon size={14} style={{ color: item.color }} className="shrink-0 mt-0.5" />
                        <p className="text-[12px] text-[#1A1F2B] flex-1 leading-tight">{item.text}</p>
                        <span className="text-[10px] text-[#9CA3AF] shrink-0 whitespace-nowrap">{item.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Producción ── */}
          {activeTab === 1 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: "Prima acumulada mes", val: fmt(ag.comisionMes * 6.67), sub: "Prima bruta emitida" },
                  { label: "Comisión del mes", val: fmt(ag.comisionMes), sub: "15% sobre prima" },
                  { label: "Meta mensual", val: fmt(ag.metaMes), sub: "Objetivo fijado" },
                  { label: "Avance meta", val: ag.avanceMeta + "%", sub: "% completado" },
                  { label: "Tasa de cierre", val: ag.tasaCierre + "%", sub: "Prospectos → emisión" },
                  { label: "Leads ingresados", val: ag.leads.toString(), sub: "Mes actual" },
                ].map(item => (
                  <div key={item.label} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
                    <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
                    <p className="text-[18px] text-[#1A1F2B] font-bold mt-1">{item.val}</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-2">Historial mensual</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="text-left border-b border-[#E5E7EB]/60">
                        <th className="pb-2 text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Mes</th>
                        <th className="pb-2 text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Pólizas</th>
                        <th className="pb-2 text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Prima</th>
                        <th className="pb-2 text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Comisión</th>
                        <th className="pb-2 text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Cierre</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]/40">
                      {[
                        { mes: "Enero 2026", pol: Math.floor(ag.polizasActivas * 0.88), prima: ag.primaTotal * 0.82, com: ag.comisionMes * 0.82, cierre: ag.tasaCierre - 5 },
                        { mes: "Febrero 2026", pol: Math.floor(ag.polizasActivas * 0.93), prima: ag.primaTotal * 0.91, com: ag.comisionMes * 0.91, cierre: ag.tasaCierre - 2 },
                        { mes: "Marzo 2026", pol: ag.polizasActivas, prima: ag.primaTotal, com: ag.comisionMes, cierre: ag.tasaCierre },
                      ].map(row => (
                        <tr key={row.mes} className="hover:bg-white/30 transition-colors">
                          <td className="py-2.5 text-[#1A1F2B] font-medium">{row.mes}</td>
                          <td className="py-2.5 text-[#6B7280]">{row.pol}</td>
                          <td className="py-2.5 text-[#F7941D] font-semibold">{fmt(row.prima)}</td>
                          <td className="py-2.5 text-[#69A481] font-semibold">{fmt(row.com)}</td>
                          <td className="py-2.5 text-[#6B7280]">{row.cierre}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Cartera ── */}
          {activeTab === 2 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#1A1F2B] font-medium">Pólizas en cartera <span className="text-[#9CA3AF] text-[11px]">({ag.polizasActivas} total · mostrando {polizas.length})</span></p>
                <Link href="/agent/polizas">
                  <button className="text-[11px] text-[#F7941D] hover:underline">Ver todas →</button>
                </Link>
              </div>
              {polizas.map(p => (
                <Link key={p.id} href={`/agent/polizas/${p.id}`}>
                  <div className="flex items-center gap-3 bg-white/50 rounded-xl px-4 py-3 hover:bg-white/80 transition-colors group">
                    <div className="w-8 h-8 rounded-xl bg-[#F7941D]/10 flex items-center justify-center shrink-0">
                      <Shield size={14} className="text-[#F7941D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#1A1F2B] font-medium truncate group-hover:text-[#F7941D] transition-colors">{p.clientName}</p>
                      <p className="text-[10px] text-[#9CA3AF] truncate">{p.type} · {p.insurer} · {p.policyNumber}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[12px] text-[#F7941D] font-semibold">{p.premium}</p>
                      <span className={cn("text-[9px] px-1.5 py-0.5 rounded-md",
                        p.status === "activa" || p.status === "vigente" ? "bg-[#69A481]/12 text-[#69A481]" : "bg-[#F7941D]/12 text-[#F7941D]")}>
                        {p.status}
                      </span>
                    </div>
                    <ChevronRight size={13} className="text-[#D1D5DB] shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ── Pipeline ── */}
          {activeTab === 3 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#1A1F2B] font-medium">Prospectos activos <span className="text-[#9CA3AF] text-[11px]">({ag.leads} total)</span></p>
                <Link href="/agent/pipeline">
                  <button className="text-[11px] text-[#F7941D] hover:underline">Ver pipeline →</button>
                </Link>
              </div>
              {leads.map(l => (
                <div key={l.id} className="flex items-center gap-3 bg-white/50 rounded-xl px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1A1F2B] font-medium truncate">{l.name}</p>
                    <p className="text-[10px] text-[#9CA3AF] truncate">{l.product} · {l.stage}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] text-[#F7941D] font-semibold">{l.value}</p>
                    <p className="text-[10px] text-[#9CA3AF]">Score {l.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Tickets ── */}
          {activeTab === 4 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#1A1F2B] font-medium">Tickets asignados</p>
                <Link href="/agent/tickets">
                  <button className="text-[11px] text-[#F7941D] hover:underline">Ver todos →</button>
                </Link>
              </div>
              {tickets.map(t => (
                <div key={t.id} className="flex items-center gap-3 bg-white/50 rounded-xl px-4 py-3">
                  <AlertTriangle size={14} className={cn(t.priority === "alta" || t.priority === "urgente" ? "text-[#7C1F31]" : t.priority === "media" ? "text-[#F7941D]" : "text-[#9CA3AF]")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1A1F2B] font-medium truncate">{t.subject}</p>
                    <p className="text-[10px] text-[#9CA3AF] truncate">{t.clientName} · {t.priority}</p>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium shrink-0",
                    t.status === "cerrado" ? "bg-[#69A481]/12 text-[#69A481]" : t.status === "en_proceso" ? "bg-[#F7941D]/12 text-[#F7941D]" : "bg-[#7C1F31]/10 text-[#7C1F31]")}>
                    {t.status === "en_proceso" ? "En proceso" : t.status}
                  </span>
                </div>
              ))}
              {tickets.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle size={32} className="text-[#69A481] mx-auto mb-2 opacity-50" />
                  <p className="text-[13px] text-[#9CA3AF]">Sin tickets activos</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <a href={`mailto:${ag.email}`}>
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1A1F2B] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(26,31,43,0.3)] hover:bg-[#2D3548] transition-colors">
            <Mail size={14} /> Enviar correo
          </button>
        </a>
        <Link href="/agent/equipo">
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl neu-sm text-[#6B7280] text-[13px] font-semibold hover:text-[#1A1F2B] transition-colors">
            <Users size={14} /> Volver al equipo
          </button>
        </Link>
      </div>
    </div>
  );
}
