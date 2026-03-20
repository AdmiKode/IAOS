"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_POLICIES, MOCK_PAYMENTS } from "@/data/mock";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, FileText, CreditCard, Phone, Download,
  CheckCircle, Clock, AlertTriangle, Shield, X, Printer
} from "lucide-react";
import { ClientLink } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";

const TABS = ["Resumen", "Documentos", "Pagos", "Contacto"];

const TIMELINE = [
  { date: "15 Ene 2024", event: "Póliza emitida", type: "emision", desc: "Emisión exitosa. Prima calculada con cobertura amplia." },
  { date: "15 Feb 2024", event: "Pago recibido", type: "pago", desc: "Pago de prima mensual procesado correctamente." },
  { date: "15 Mar 2024", event: "Pago recibido", type: "pago", desc: "Pago de prima mensual procesado correctamente." },
  { date: "20 Mar 2024", event: "Endoso aplicado", type: "endoso", desc: "Incremento de suma asegurada a petición del asegurado." },
  { date: "15 Abr 2024", event: "Pago recibido", type: "pago", desc: "Pago de prima mensual procesado correctamente." },
  { date: "02 May 2024", event: "Siniestro registrado", type: "siniestro", desc: "Colisión menor. Expediente #SIN-2024-0841. Resuelto." },
  { date: "15 May 2024", event: "Pago recibido", type: "pago", desc: "Pago de prima mensual procesado correctamente." },
];

const DOCS = [
  { name: "Carátula de póliza", size: "324 KB", type: "PDF" },
  { name: "Condiciones generales", size: "1.2 MB", type: "PDF" },
  { name: "Recibo de pago — Ene 2024", size: "89 KB", type: "PDF" },
  { name: "Recibo de pago — Feb 2024", size: "89 KB", type: "PDF" },
  { name: "Endoso de incremento", size: "210 KB", type: "PDF" },
];

const TIMELINE_ICONS = {
  emision: { icon: Shield, color: "#69A481" },
  pago: { icon: CheckCircle, color: "#F7941D" },
  endoso: { icon: Clock, color: "#6B7280" },
  siniestro: { icon: AlertTriangle, color: "#7C1F31" },
};

export default function PolizaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [verCaratula, setVerCaratula] = useState(false);

  const policy = MOCK_POLICIES.find(p => p.id === params.id) || MOCK_POLICIES[0];
  const payments = MOCK_PAYMENTS.filter(p => p.policyId === policy.id);

  const statusColor =
    policy.status === "activa" || policy.status === "vigente"
      ? { text: "text-[#69A481]", bg: "bg-[#69A481]/10" }
      : policy.status === "vencida"
      ? { text: "text-[#7C1F31]", bg: "bg-[#7C1F31]/10" }
      : { text: "text-[#F7941D]", bg: "bg-[#F7941D]/10" };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-[#6B7280] text-sm mb-6 hover:text-[#1A1F2B] transition-colors">
        <ArrowLeft size={16} />
        Volver a pólizas
      </button>

      {/* Policy header card */}
      <div className="neu-md rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7941D]/12 flex items-center justify-center"
              style={{ background: "rgba(247,148,29,0.12)" }}>
              <Shield size={24} className="text-[#F7941D]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[#1A1F2B] text-xl font-bold">{policy.policyNumber}</h1>
                <span className={cn("px-2.5 py-1 rounded-lg text-xs font-bold capitalize", statusColor.text, statusColor.bg)}>
                  {policy.status}
                </span>
              </div>
              <ClientLink name={policy.clientName} className="text-[#6B7280] text-sm" />
              <p className="text-[#9CA3AF] text-xs mt-0.5">{policy.type} — {policy.insurer}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[#9CA3AF] text-xs">Prima mensual</p>
            <p className="text-[#F7941D] text-2xl font-bold">{policy.premium}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Vigencia inicio", value: policy.startDate },
            { label: "Vigencia fin", value: policy.endDate },
            { label: "Cobertura", value: policy.coverage || "Amplia" },
            { label: "Aseguradora", value: policy.insurer },
          ].map((f) => (
            <div key={f.label} className="rounded-xl p-3 shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.10)]">
              <p className="text-[#9CA3AF] text-xs mb-1">{f.label}</p>
              <p className="text-[#1A1F2B] text-sm font-semibold">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)}
            className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
              activeTab === i
                ? "bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)]"
                : "neu-sm text-[#6B7280] hover:text-[#1A1F2B]")}>
            {t === "Documentos" && <FileText size={13} />}
            {t === "Pagos" && <CreditCard size={13} />}
            {t === "Contacto" && <Phone size={13} />}
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Resumen — Timeline */}
      {activeTab === 0 && (
        <div className="neu-md rounded-2xl p-6">
          <h3 className="text-[#1A1F2B] font-semibold mb-6">Historial de la póliza</h3>
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[#B5BFC6]/30" />
            <div className="flex flex-col gap-6">
              {TIMELINE.map((t, i) => {
                const cfg = TIMELINE_ICONS[t.type as keyof typeof TIMELINE_ICONS] || TIMELINE_ICONS.pago;
                const Icon = cfg.icon;
                return (
                  <div key={i} className="flex gap-4 relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10"
                      style={{ background: cfg.color + "18" }}>
                      <Icon size={16} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[#1A1F2B] text-sm font-semibold">{t.event}</p>
                        <span className="text-[#9CA3AF] text-xs shrink-0">{t.date}</span>
                      </div>
                      <p className="text-[#6B7280] text-xs mt-1 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Documentos */}
      {activeTab === 1 && (
        <div className="neu-md rounded-2xl p-6">
          <h3 className="text-[#1A1F2B] font-semibold mb-6">Documentos</h3>
          <div className="flex flex-col gap-3">
            {DOCS.map((d) => (
              <div key={d.name} className="flex items-center gap-4 p-4 rounded-xl shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.10)]">
                <div className="w-10 h-10 rounded-xl bg-[#7C1F31]/10 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-[#7C1F31]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1A1F2B] text-sm font-semibold truncate">{d.name}</p>
                  <p className="text-[#9CA3AF] text-xs">{d.type} — {d.size}</p>
                </div>
                {d.name === 'Carátula de póliza' ? (
                  <button onClick={() => setVerCaratula(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#F7941D] neu-sm hover:text-[#e08019] transition-colors">
                    <FileText size={12} /> Ver
                  </button>
                ) : (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#F7941D] neu-sm hover:text-[#e08019] transition-colors">
                    <Download size={12} /> Descargar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Pagos */}
      {activeTab === 2 && (
        <div className="neu-md rounded-2xl p-6">
          <h3 className="text-[#1A1F2B] font-semibold mb-6">Historial de pagos</h3>
          {payments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.10)]">
                  <div className={cn("w-2 h-10 rounded-full shrink-0",
                    p.status === "pagado" ? "bg-[#69A481]" : p.status === "vencido" ? "bg-[#7C1F31]" : "bg-[#F7941D]")} />
                  <div className="flex-1">
                    <p className="text-[#1A1F2B] text-sm font-semibold">{p.concept}</p>
                    <p className="text-[#9CA3AF] text-xs">{p.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1A1F2B] font-bold">{p.amount}</p>
                    <p className={cn("text-xs capitalize", p.status === "pagado" ? "text-[#69A481]" : p.status === "vencido" ? "text-[#7C1F31]" : "text-[#F7941D]")}>{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard size={32} className="text-[#B5BFC6] mx-auto mb-3" />
              <p className="text-[#9CA3AF] text-sm">Sin pagos registrados para esta póliza</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Contacto */}
      {activeTab === 3 && (
        <div className="neu-md rounded-2xl p-6">
          <h3 className="text-[#1A1F2B] font-semibold mb-6">Contacto del asegurado</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#F7941D]/12 flex items-center justify-center text-[#F7941D] text-2xl font-bold"
              style={{ background: "rgba(247,148,29,0.12)" }}>
              {policy.clientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <ClientLink name={policy.clientName} className="text-[#1A1F2B] text-lg font-bold" />
              <p className="text-[#6B7280] text-sm">Asegurado principal</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Teléfono", value: "+52 55 " + Math.floor(1000 + Math.random() * 9000) + " " + Math.floor(1000 + Math.random() * 9000) },
              { label: "Correo electrónico", value: policy.clientName.split(" ")[0].toLowerCase() + "@email.com" },
              { label: "RFC", value: "MERC" + Math.floor(800000 + Math.random() * 199999) + "H1A" },
              { label: "Dirección", value: "Av. Insurgentes Sur 1234, CDMX" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl p-4 shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.10)]">
                <p className="text-[#9CA3AF] text-xs mb-1">{f.label}</p>
                <p className="text-[#1A1F2B] text-sm font-semibold">{f.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F7941D] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(247,148,29,0.35)] hover:bg-[#e08019] transition-all">
              <Phone size={14} />
              Llamar
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl neu-sm text-[#6B7280] text-sm font-semibold hover:text-[#1A1F2B] transition-all">
              Enviar mensaje
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL CARÁTULA DE PÓLIZA ── */}
      {verCaratula && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(6px)' }}>
          <div className="relative w-full max-w-2xl my-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-[#1A1F2B] rounded-t-2xl px-5 py-3">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[#F7941D]" />
                <span className="text-white text-[13px] font-semibold">Carátula — {policy.policyNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <Printer size={13} /> Imprimir
                </button>
                <button onClick={() => setVerCaratula(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-2">
                  <X size={15} />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-b-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              {/* Encabezado */}
              <div className="px-8 pt-8 pb-5 border-b-4 border-[#1A1F2B]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#1A1F2B] flex items-center justify-center">
                      <Shield size={20} className="text-[#F7941D]" />
                    </div>
                    <div>
                      <p className="text-[#1A1F2B] font-black text-[16px] leading-tight">{policy.insurer}</p>
                      <p className="text-[#6B7280] text-[9px] tracking-wider uppercase">Institución de Seguros autorizada por la CNSF</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#9CA3AF] text-[9px] uppercase tracking-widest">No. de póliza</p>
                    <p className="text-[#F7941D] text-[22px] font-black font-mono leading-tight">{policy.policyNumber}</p>
                    <p className="text-[#9CA3AF] text-[9px]">Inicio: {policy.startDate}</p>
                  </div>
                </div>
                <div className="mt-4 py-2 px-4 bg-[#1A1F2B] rounded-xl text-center">
                  <p className="text-white text-[13px] font-bold tracking-wider uppercase">PÓLIZA DE SEGURO — {policy.type.toUpperCase()}</p>
                  <p className="text-[#F7941D] text-[10px] tracking-widest mt-0.5">CARÁTULA — DOCUMENTO INFORMATIVO OFICIAL</p>
                </div>
              </div>
              {/* Contratante */}
              <div className="px-8 py-5 border-b border-[#E5E7EB]">
                <p className="text-[10px] font-black text-[#1A1F2B] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#1A1F2B] flex items-center justify-center text-white text-[8px]">1</span>
                  Datos del contratante / asegurado
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { label: 'Nombre completo', val: policy.clientName },
                    { label: 'R.F.C.', val: 'PEGC880512HDF' },
                    { label: 'Correo electrónico', val: 'asegurado@email.com' },
                    { label: 'Teléfono', val: '55 1234 5678' },
                    { label: 'Domicilio', val: 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX' },
                    { label: 'C.P.', val: '03100' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
                      <p className="text-[12px] text-[#1A1F2B] font-semibold border-b border-dashed border-[#E5E7EB] pb-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Vigencia */}
              <div className="px-8 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <p className="text-[10px] font-black text-[#1A1F2B] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#1A1F2B] flex items-center justify-center text-white text-[8px]">2</span>
                  Vigencia y prima
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Inicio de vigencia', val: policy.startDate + ' 12:00 hrs' },
                    { label: 'Fin de vigencia', val: policy.endDate + ' 12:00 hrs' },
                    { label: 'Forma de pago', val: 'Mensual' },
                    { label: 'Prima mensual', val: policy.premium },
                    { label: 'Derecho de póliza', val: '$184.00' },
                    { label: 'Prima anual aprox.', val: policy.premium },
                  ].map(item => (
                    <div key={item.label} className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
                      <p className="text-[12px] text-[#1A1F2B] font-bold mt-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Coberturas */}
              <div className="px-8 py-5 border-b border-[#E5E7EB]">
                <p className="text-[10px] font-black text-[#1A1F2B] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#1A1F2B] flex items-center justify-center text-white text-[8px]">3</span>
                  Coberturas contratadas
                </p>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-[#1A1F2B] text-white">
                      <th className="text-left px-3 py-2 text-[9px] uppercase tracking-wider font-semibold">Cobertura</th>
                      <th className="text-center px-3 py-2 text-[9px] uppercase tracking-wider font-semibold">Suma asegurada</th>
                      <th className="text-center px-3 py-2 text-[9px] uppercase tracking-wider font-semibold">Deducible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cob: 'Cobertura principal', sa: policy.coverage || 'Amplia', ded: '5% min. $3,000' },
                      { cob: 'Responsabilidad civil', sa: '$3,000,000', ded: '$0' },
                      { cob: 'Gastos médicos', sa: '$200,000 por persona', ded: '$0' },
                      { cob: 'Asistencia 24hrs', sa: 'Incluida', ded: '$0' },
                    ].map((row, i) => (
                      <tr key={row.cob} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}>
                        <td className="px-3 py-2 text-[#1A1F2B] font-medium">{row.cob}</td>
                        <td className="px-3 py-2 text-center text-[#6B7280]">{row.sa}</td>
                        <td className="px-3 py-2 text-center text-[#6B7280]">{row.ded}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Agente */}
              <div className="px-8 py-5 border-b border-[#E5E7EB]">
                <p className="text-[10px] font-black text-[#1A1F2B] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#1A1F2B] flex items-center justify-center text-white text-[8px]">4</span>
                  Datos del agente
                </p>
                <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                  {[
                    { label: 'Nombre del agente', val: user?.name || 'Carlos Mendoza' },
                    { label: 'Clave CNSF', val: 'CNSF-MX-2019-04521' },
                    { label: 'Organización', val: user?.agency || 'Seguros Premier' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
                      <p className="text-[11px] text-[#1A1F2B] font-semibold border-b border-dashed border-[#E5E7EB] pb-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Leyendas */}
              <div className="px-8 py-4 bg-[#F9FAFB]">
                <ul className="text-[9px] text-[#6B7280] leading-relaxed list-disc list-inside space-y-1">
                  <li>Esta carátula forma parte integral de la póliza y debe conservarse durante toda la vigencia.</li>
                  <li>La presente póliza se expide conforme a las condiciones generales registradas ante la CNSF.</li>
                  <li>En caso de siniestro, comuníquese a la línea 800-123-4567 disponible 24/7.</li>
                  <li>Documento generado por Insurance Agent OS · livekode.online</li>
                </ul>
              </div>
              {/* Firmas */}
              <div className="px-8 py-6 border-t-2 border-[#1A1F2B]">
                <div className="grid grid-cols-3 gap-8 text-center">
                  {['Firma del contratante', 'Firma del agente', 'Sello de la compañía'].map(f => (
                    <div key={f}>
                      <div className="h-10 border-b-2 border-[#1A1F2B] mb-1" />
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{f}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[9px] text-[#B5BFC6] mt-4">
                  {policy.insurer} · Póliza {policy.policyNumber} · Insurance Agent OS
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
