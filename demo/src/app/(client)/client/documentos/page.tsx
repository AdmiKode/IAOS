"use client";

import { useState } from "react";
import { Download, FileText, Eye, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Doc {
  id: string;
  name: string;
  poliza: string;
  type: string;
  size: string;
  date: string;
  locked: boolean;
}

const DOCUMENTS: Doc[] = [
  { id: "d1", name: "Caratula de poliza — Auto", poliza: "AUTO-2024-0291", type: "PDF", size: "324 KB", date: "15 Ene 2024", locked: false },
  { id: "d2", name: "Condiciones generales", poliza: "AUTO-2024-0291", type: "PDF", size: "1.2 MB", date: "15 Ene 2024", locked: false },
  { id: "d3", name: "Recibo de pago — Ene 2024", poliza: "AUTO-2024-0291", type: "PDF", size: "89 KB", date: "15 Ene 2024", locked: false },
  { id: "d4", name: "Recibo de pago — Feb 2024", poliza: "AUTO-2024-0291", type: "PDF", size: "89 KB", date: "15 Feb 2024", locked: false },
  { id: "d5", name: "Caratula de poliza — GMM", poliza: "GMM-2023-0155", type: "PDF", size: "412 KB", date: "01 Mar 2023", locked: false },
  { id: "d6", name: "Condiciones generales — GMM", poliza: "GMM-2023-0155", type: "PDF", size: "2.1 MB", date: "01 Mar 2023", locked: false },
  { id: "d7", name: "Endoso de modificacion", poliza: "AUTO-2024-0291", type: "PDF", size: "210 KB", date: "20 Mar 2024", locked: true },
];

function handleMockDownload(name: string) {
  const content = `Documento: ${name}\nFecha: ${new Date().toLocaleDateString('es-MX')}\n\nEste es un documento de demostracion.`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name.replace(/\s+/g, "_") + ".txt";
  a.click();
  URL.revokeObjectURL(url);
}

export default function DocumentosPage() {
  const polizas = [...new Set(DOCUMENTS.map(d => d.poliza))];
  const [viewing, setViewing] = useState<Doc | null>(null);

  return (
    <>
    <div className="max-w-[430px] mx-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#EFF2F9] pt-6 pb-4 z-10">
        <h1 className="text-[#1A1F2B] text-xl tracking-tight">Mis documentos</h1>
        <p className="text-[#6B7280] text-sm mt-1">{DOCUMENTS.length} archivos disponibles</p>
      </div>

      {/* Group by poliza */}
      <div className="flex flex-col gap-6">
        {polizas.map((poliza) => {
          const docs = DOCUMENTS.filter(d => d.poliza === poliza);
          return (
            <div key={poliza}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-[#B5BFC6]/30" />
                <span className="text-[#9CA3AF] text-xs px-2">{poliza}</span>
                <div className="h-px flex-1 bg-[#B5BFC6]/30" />
              </div>
              <div className="flex flex-col gap-3">
                {docs.map((d) => (
                  <div key={d.id} className="neu-md rounded-2xl p-4 flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      d.locked ? "bg-[#9CA3AF]/15" : "bg-[#7C1F31]/10"
                    )}>
                      {d.locked
                        ? <Lock size={16} className="text-[#9CA3AF]" />
                        : <FileText size={16} className="text-[#7C1F31]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm truncate", d.locked ? "text-[#9CA3AF]" : "text-[#1A1F2B]")}>{d.name}</p>
                      <p className="text-[#9CA3AF] text-xs">{d.type} — {d.size} — {d.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!d.locked && (
                        <button onClick={() => setViewing(d)} className="w-8 h-8 flex items-center justify-center rounded-xl neu-sm text-[#6B7280] hover:text-[#F7941D] transition-colors">
                          <Eye size={14} />
                        </button>
                      )}
                      <button
                        disabled={d.locked}
                        onClick={() => !d.locked && handleMockDownload(d.name)}
                        className={cn("w-8 h-8 flex items-center justify-center rounded-xl transition-colors",
                          d.locked
                            ? "text-[#9CA3AF] neu-sm opacity-40 cursor-not-allowed"
                            : "neu-sm text-[#F7941D] hover:text-[#e08019]")}>
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="mt-6 rounded-2xl p-4 border border-[#F7941D]/20"
        style={{ background: "rgba(247,148,29,0.08)" }}>
        <p className="text-[#F7941D] text-xs mb-1">Documentos bloqueados</p>
        <p className="text-[#6B7280] text-xs leading-relaxed">
          Algunos documentos requieren validacion adicional. Contacta a tu agente para acceder.
        </p>
      </div>
    </div>

      {/* Modal visor de documento */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm p-6 shadow-[−20px_−20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4">
            <button onClick={() => setViewing(null)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors"><X size={16} /></button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#7C1F31]/10 flex items-center justify-center">
                <FileText size={22} className="text-[#7C1F31]" />
              </div>
              <div>
                <p className="text-[15px] text-[#1A1F2B]">{viewing.name}</p>
                <p className="text-[12px] text-[#9CA3AF]">{viewing.poliza} — {viewing.type} — {viewing.size}</p>
              </div>
            </div>
            {/* Mock PDF preview area */}
            <div className="bg-[#EFF2F9] rounded-2xl shadow-[inset_-4px_-4px_10px_#FAFBFF,inset_4px_4px_10px_rgba(22,27,29,0.12)] h-48 flex flex-col items-center justify-center gap-2">
              <FileText size={32} className="text-[#D1D5DB]" />
              <p className="text-[12px] text-[#9CA3AF]">Vista previa — {viewing.name}</p>
              <p className="text-[11px] text-[#B5BFC6]">{viewing.date}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleMockDownload(viewing.name)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#F7941D] text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
                <Download size={13} /> Descargar
              </button>
              <button onClick={() => setViewing(null)}
                className="flex-1 flex items-center justify-center py-2.5 rounded-2xl bg-[#EFF2F9] text-[#6B7280] text-[13px] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
