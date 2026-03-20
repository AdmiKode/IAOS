"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Car, Heart, Home, Briefcase, Plane, Shield, Users, Zap, X, Download, Printer, FileText } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const RAMOS = [
  { id: "auto", label: "Automóvil", icon: Car, color: "#F7941D" },
  { id: "vida", label: "Vida", icon: Heart, color: "#7C1F31" },
  { id: "hogar", label: "Hogar", icon: Home, color: "#69A481" },
  { id: "gmm", label: "Gastos Médicos", icon: Shield, color: "#1A1F2B" },
  { id: "negocio", label: "Negocio", icon: Briefcase, color: "#F7941D" },
  { id: "viaje", label: "Viaje", icon: Plane, color: "#69A481" },
  { id: "vida-grupo", label: "Vida Grupo", icon: Users, color: "#7C1F31" },
  { id: "rc", label: "Resp. Civil", icon: Zap, color: "#6B7280" },
];

const ASEGURADORAS = [
  { id: "gnp", name: "GNP Seguros", prima: "$1,840", cobertura: "Amplia", rating: 4.8 },
  { id: "axa", name: "AXA Seguros", prima: "$1,720", cobertura: "Amplia", rating: 4.7 },
  { id: "qualitas", name: "Quálitas", prima: "$1,540", cobertura: "Básica", rating: 4.5 },
  { id: "hdi", name: "HDI Seguros", prima: "$1,680", cobertura: "Amplia", rating: 4.6 },
  { id: "atlas", name: "Atlas", prima: "$1,590", cobertura: "Básica", rating: 4.3 },
];

const STEPS = ["Ramo", "Aseguradora", "Datos del asegurado", "Cotización"];

type FormData = { nombre: string; email: string; telefono: string; rfc: string; valor: string };

export default function EmisionPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedRamo, setSelectedRamo] = useState<string | null>(null);
  const [selectedAseg, setSelectedAseg] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ nombre: "", email: "", telefono: "", rfc: "", valor: "" });
  const [emitida, setEmitida] = useState(false);
  const [verPoliza, setVerPoliza] = useState(false);
  const [polizaNum] = useState(() => `AUTO-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`);
  const polizaRef = useRef<HTMLDivElement>(null);

  const canNext = [
    () => selectedRamo !== null,
    () => selectedAseg !== null,
    () => !!(form.nombre && form.email && form.telefono),
    () => true,
  ];

  function next() { if (canNext[step]()) setStep(s => Math.min(s + 1, 3)); }
  function back() { setStep(s => Math.max(s - 1, 0)); }

  const selectedAsegData = ASEGURADORAS.find(a => a.id === selectedAseg);
  const selectedRamoData = RAMOS.find(r => r.id === selectedRamo);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[#1A1F2B] text-2xl font-bold tracking-tight">Emisión / Cotizador</h1>
        <p className="text-[#6B7280] text-sm mt-1">Cotiza y emite una nueva póliza en minutos</p>
      </div>

      {/* Stepper */}
      <div className="flex items-start gap-0 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                i < step ? "bg-[#69A481] text-white shadow-[0_4px_12px_rgba(105,164,129,0.4)]"
                  : i === step ? "bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.4)]"
                  : "bg-[#EFF2F9] text-[#9CA3AF] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)]"
              )}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn("text-xs text-center max-w-[60px]", i === step ? "text-[#F7941D] font-semibold" : i < step ? "text-[#69A481]" : "text-[#9CA3AF]")}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-2 mt-4 transition-all", i < step ? "bg-[#69A481]" : "bg-[#B5BFC6]/40")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Ramo */}
      {step === 0 && (
        <div className="neu-md rounded-2xl p-8">
          <h2 className="text-[#1A1F2B] text-lg font-semibold mb-6">Selecciona el ramo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {RAMOS.map((r) => {
              const Icon = r.icon;
              const sel = selectedRamo === r.id;
              return (
                <button key={r.id} onClick={() => setSelectedRamo(r.id)}
                  className={cn("flex flex-col items-center gap-3 p-5 rounded-2xl transition-all border-2",
                    sel
                      ? "border-[#F7941D] bg-[#F7941D]/5 shadow-[0_4px_16px_rgba(247,148,29,0.2)]"
                      : "border-transparent neu-sm hover:border-[#F7941D]/20")}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: r.color + "18" }}>
                    <Icon size={22} style={{ color: r.color }} />
                  </div>
                  <span className="text-[#1A1F2B] text-sm font-semibold">{r.label}</span>
                  {sel && <div className="w-5 h-5 rounded-full bg-[#F7941D] flex items-center justify-center"><Check size={11} className="text-white" /></div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Aseguradora */}
      {step === 1 && (
        <div className="neu-md rounded-2xl p-8">
          <h2 className="text-[#1A1F2B] text-lg font-semibold mb-2">Elige aseguradora</h2>
          <p className="text-[#6B7280] text-sm mb-6">Ramo: <span className="font-semibold text-[#F7941D]">{selectedRamoData?.label}</span></p>
          <div className="flex flex-col gap-3">
            {ASEGURADORAS.map((a) => {
              const sel = selectedAseg === a.id;
              return (
                <button key={a.id} onClick={() => setSelectedAseg(a.id)}
                  className={cn("flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                    sel ? "border-[#F7941D] bg-[#F7941D]/5" : "border-transparent neu-sm hover:border-[#F7941D]/20")}>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1F2B]/8 flex items-center justify-center shrink-0"
                    style={{ background: "rgba(26,31,43,0.08)" }}>
                    <span className="text-[#1A1F2B] text-xs font-bold">{a.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1A1F2B] font-semibold text-sm">{a.name}</p>
                    <p className="text-[#6B7280] text-xs mt-0.5">Cobertura {a.cobertura} — {a.rating}/5 estrellas</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[#F7941D] font-bold">{a.prima}</p>
                    <p className="text-[#9CA3AF] text-xs">/ mes</p>
                  </div>
                  {sel && <Check size={16} className="text-[#F7941D] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Datos */}
      {step === 2 && (
        <div className="neu-md rounded-2xl p-8">
          <h2 className="text-[#1A1F2B] text-lg font-semibold mb-6">Datos del asegurado</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {([
              { key: "nombre", label: "Nombre completo", placeholder: "Juan García López", type: "text", full: false },
              { key: "email", label: "Correo electrónico", placeholder: "juan@email.com", type: "email", full: false },
              { key: "telefono", label: "Teléfono", placeholder: "+52 55 1234 5678", type: "tel", full: false },
              { key: "rfc", label: "RFC", placeholder: "GALO800101XXX", type: "text", full: false },
              { key: "valor", label: "Valor del bien / Suma asegurada", placeholder: "$500,000", type: "text", full: true },
            ] as const).map((f) => (
              <div key={f.key} className={cn("flex flex-col gap-2", f.full && "sm:col-span-2")}>
                <label className="text-[#6B7280] text-xs font-semibold tracking-wider uppercase">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="input-neu text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Resultado */}
      {step === 3 && !emitida && (
        <div className="neu-md rounded-2xl p-8">
          <h2 className="text-[#1A1F2B] text-lg font-semibold mb-6">Resumen de cotización</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: "Asegurado", value: form.nombre || "—" },
              { label: "Ramo", value: selectedRamoData?.label || "—" },
              { label: "Aseguradora", value: selectedAsegData?.name || "—" },
              { label: "Cobertura", value: selectedAsegData?.cobertura || "—" },
              { label: "Prima mensual", value: selectedAsegData?.prima || "—" },
              {
                label: "Prima anual",
                value: selectedAsegData
                  ? `$${(parseInt(selectedAsegData.prima.replace(/\D/g, '')) * 12).toLocaleString('es-MX')}`
                  : "—"
              },
            ].map((r) => (
              <div key={r.label} className="rounded-xl p-4 shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.10)]">
                <p className="text-[#9CA3AF] text-xs mb-1">{r.label}</p>
                <p className="text-[#1A1F2B] font-semibold text-sm">{r.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-4 bg-[#69A481]/10 border border-[#69A481]/30 mb-6">
            <p className="text-[#69A481] text-sm font-semibold">Prima competitiva</p>
            <p className="text-[#6B7280] text-xs mt-1">
              La prima seleccionada es un 8% menor al promedio del mercado para este tipo de cobertura.
            </p>
          </div>
          <button onClick={() => setEmitida(true)}
            className="w-full py-4 rounded-2xl bg-[#F7941D] text-white font-bold text-base shadow-[0_8px_24px_rgba(247,148,29,0.4)] hover:bg-[#e08019] transition-all">
            Emitir póliza
          </button>
        </div>
      )}

      {/* Éxito */}
      {emitida && (
        <div className="neu-md rounded-2xl p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-[#69A481] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_rgba(105,164,129,0.4)]">
            <Check size={36} className="text-white" />
          </div>
          <h2 className="text-[#1A1F2B] text-2xl font-bold mb-3">Póliza emitida</h2>
          <p className="text-[#6B7280] mb-2">No. de póliza: <span className="font-bold text-[#1A1F2B]">{polizaNum}</span></p>
          <p className="text-[#9CA3AF] text-sm mb-8">El asegurado recibirá la póliza por correo electrónico.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => { setStep(0); setSelectedRamo(null); setSelectedAseg(null); setForm({ nombre:"", email:"", telefono:"", rfc:"", valor:"" }); setEmitida(false); }}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-[#6B7280] neu-sm hover:text-[#1A1F2B] transition-all">
              Nueva cotización
            </button>
            <button onClick={() => setVerPoliza(true)}
              className="px-6 py-3 rounded-xl bg-[#F7941D] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(247,148,29,0.35)] hover:bg-[#e08019] transition-all flex items-center gap-2">
              <FileText size={14} /> Ver póliza
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL CARÁTULA DE PÓLIZA ── */}
      {verPoliza && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(6px)' }}>
          <div className="relative w-full max-w-2xl my-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-[#1A1F2B] rounded-t-2xl px-5 py-3">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[#F7941D]" />
                <span className="text-white text-[13px] font-semibold">Carátula de Póliza — {polizaNum}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <Printer size={13} /> Imprimir
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <Download size={13} /> Descargar
                </button>
                <button onClick={() => setVerPoliza(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-2">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Documento */}
            <div ref={polizaRef} className="bg-white rounded-b-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">

              {/* Encabezado oficial */}
              <div className="px-8 pt-8 pb-5 border-b-4 border-[#1A1F2B]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-10 h-10 rounded-lg bg-[#1A1F2B] flex items-center justify-center">
                        <Shield size={20} className="text-[#F7941D]" />
                      </div>
                      <div>
                        <p className="text-[#1A1F2B] font-black text-[16px] leading-tight">{selectedAsegData?.name || 'GNP Seguros'}</p>
                        <p className="text-[#6B7280] text-[9px] tracking-wider uppercase">Institución de Seguros autorizada por la CNSF</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#9CA3AF] text-[9px] uppercase tracking-widest">No. de póliza</p>
                    <p className="text-[#F7941D] text-[22px] font-black font-mono leading-tight">{polizaNum}</p>
                    <p className="text-[#9CA3AF] text-[9px]">Emitida: {new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric' })}</p>
                  </div>
                </div>
                <div className="mt-4 py-2 px-4 bg-[#1A1F2B] rounded-xl text-center">
                  <p className="text-white text-[13px] font-bold tracking-wider uppercase">
                    PÓLIZA DE SEGURO DE {selectedRamoData?.label?.toUpperCase() || 'AUTOMÓVIL'}
                  </p>
                  <p className="text-[#F7941D] text-[10px] tracking-widest mt-0.5">
                    CARÁTULA — DOCUMENTO INFORMATIVO OFICIAL
                  </p>
                </div>
              </div>

              {/* Datos del contratante */}
              <div className="px-8 py-5 border-b border-[#E5E7EB]">
                <p className="text-[10px] font-black text-[#1A1F2B] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#1A1F2B] flex items-center justify-center text-white text-[8px]">1</span>
                  Datos del contratante / asegurado
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { label: 'Nombre completo', val: form.nombre || 'Carlos Alberto Pérez Gómez' },
                    { label: 'R.F.C.', val: form.rfc || 'PEGC880512HDF' },
                    { label: 'Correo electrónico', val: form.email || 'asegurado@email.com' },
                    { label: 'Teléfono', val: form.telefono || '55 1234 5678' },
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
                    { label: 'Inicio de vigencia', val: new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'2-digit', year:'numeric' }) + ' 12:00 hrs' },
                    { label: 'Fin de vigencia', val: new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-MX', { day:'2-digit', month:'2-digit', year:'numeric' }) + ' 12:00 hrs' },
                    { label: 'Forma de pago', val: 'Anual' },
                    { label: 'Prima neta', val: selectedAsegData?.prima ? `${selectedAsegData.prima} / mes` : '$1,840 / mes' },
                    { label: 'Derecho de póliza', val: '$184.00' },
                    { label: 'Prima total anual', val: selectedAsegData ? `$${(parseInt(selectedAsegData.prima.replace(/\D/g,'')) * 12 + 184).toLocaleString('es-MX')}` : '$22,264.00' },
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
                      <th className="text-center px-3 py-2 text-[9px] uppercase tracking-wider font-semibold">Coaseguro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cob: 'Daños materiales', sa: 'Valor comercial', ded: '5% min. $3,000', co: 'N/A' },
                      { cob: 'Robo total', sa: 'Valor comercial', ded: '10%', co: 'N/A' },
                      { cob: 'Responsabilidad civil', sa: '$3,000,000', ded: '$0', co: 'N/A' },
                      { cob: 'Gastos médicos ocupantes', sa: '$200,000 por persona', ded: '$0', co: 'N/A' },
                      { cob: 'Asistencia vial 24hrs', sa: 'Incluida', ded: '$0', co: 'N/A' },
                      { cob: 'Auto sustituto', sa: '15 días / año', ded: '$0', co: 'N/A' },
                    ].map((row, i) => (
                      <tr key={row.cob} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}>
                        <td className="px-3 py-2 text-[#1A1F2B] font-medium">{row.cob}</td>
                        <td className="px-3 py-2 text-center text-[#6B7280]">{row.sa}</td>
                        <td className="px-3 py-2 text-center text-[#6B7280]">{row.ded}</td>
                        <td className="px-3 py-2 text-center text-[#6B7280]">{row.co}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Agente y datos adicionales */}
              <div className="px-8 py-5 border-b border-[#E5E7EB]">
                <p className="text-[10px] font-black text-[#1A1F2B] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#1A1F2B] flex items-center justify-center text-white text-[8px]">4</span>
                  Datos del agente y canal
                </p>
                <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                  {[
                    { label: 'Nombre del agente', val: user?.name || 'Carlos Mendoza' },
                    { label: 'Clave CNSF', val: 'CNSF-MX-2019-04521' },
                    { label: 'Organización', val: user?.agency || 'Seguros Premier' },
                    { label: 'Teléfono agente', val: '55 9876 5432' },
                    { label: 'Correo agente', val: 'agente@demo.com' },
                    { label: 'Fecha de emisión', val: new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric' }) },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
                      <p className="text-[11px] text-[#1A1F2B] font-semibold border-b border-dashed border-[#E5E7EB] pb-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leyendas legales */}
              <div className="px-8 py-5 bg-[#F9FAFB]">
                <p className="text-[10px] font-black text-[#1A1F2B] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#6B7280] flex items-center justify-center text-white text-[8px]">!</span>
                  Notas y leyendas legales
                </p>
                <ul className="text-[9px] text-[#6B7280] leading-relaxed list-disc list-inside space-y-1">
                  <li>Esta carátula forma parte integral de la póliza y debe conservarse durante toda la vigencia.</li>
                  <li>La presente póliza se expide conforme a las condiciones generales registradas ante la CNSF.</li>
                  <li>En caso de siniestro, comuníquese a la línea de atención: 800-123-4567 disponible 24/7.</li>
                  <li>El pago de la prima deberá realizarse en las fechas indicadas para mantener la cobertura vigente.</li>
                  <li>Este documento fue generado electrónicamente y tiene plena validez conforme a la LFEA.</li>
                  <li>Documento generado por Insurance Agent OS · livekode.online · {new Date().toLocaleString('es-MX')}</li>
                </ul>
              </div>

              {/* Firmas */}
              <div className="px-8 py-6 border-t-2 border-[#1A1F2B]">
                <div className="grid grid-cols-3 gap-8 text-center">
                  {['Firma del contratante', 'Firma del agente', 'Sello de la compañía'].map(f => (
                    <div key={f}>
                      <div className="h-12 border-b-2 border-[#1A1F2B] mb-1 flex items-end justify-center pb-1">
                        {f === 'Firma del agente' && (
                          <p className="text-[10px] text-[#9CA3AF] italic">Firma digital verificada ✓</p>
                        )}
                        {f === 'Sello de la compañía' && (
                          <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#9CA3AF] flex items-center justify-center mb-1">
                            <Shield size={16} className="text-[#9CA3AF]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{f}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[9px] text-[#B5BFC6] mt-5">
                  {selectedAsegData?.name || 'GNP Seguros'} · Institución de Seguros · Autorización CNSF · Póliza {polizaNum}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!emitida && (
        <div className="flex items-center justify-between mt-6">
          <button onClick={back} disabled={step === 0}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#6B7280] disabled:opacity-30 neu-sm hover:text-[#1A1F2B] transition-all">
            Atrás
          </button>
          <span className="text-[#9CA3AF] text-sm">{step + 1} / {STEPS.length}</span>
          <button onClick={next} disabled={!canNext[step]()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)] hover:bg-[#e08019] disabled:opacity-40 transition-all">
            {step === 3 ? "Emitir" : "Siguiente"}
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
