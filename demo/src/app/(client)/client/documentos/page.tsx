"use client";

import { Download, FileText, Eye, Lock } from "lucide-react";
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
  { id: "d1", name: "Carátula de póliza — Auto", poliza: "AUTO-2024-0291", type: "PDF", size: "324 KB", date: "15 Ene 2024", locked: false },
  { id: "d2", name: "Condiciones generales", poliza: "AUTO-2024-0291", type: "PDF", size: "1.2 MB", date: "15 Ene 2024", locked: false },
  { id: "d3", name: "Recibo de pago — Ene 2024", poliza: "AUTO-2024-0291", type: "PDF", size: "89 KB", date: "15 Ene 2024", locked: false },
  { id: "d4", name: "Recibo de pago — Feb 2024", poliza: "AUTO-2024-0291", type: "PDF", size: "89 KB", date: "15 Feb 2024", locked: false },
  { id: "d5", name: "Carátula de póliza — GMM", poliza: "GMM-2023-0155", type: "PDF", size: "412 KB", date: "01 Mar 2023", locked: false },
  { id: "d6", name: "Condiciones generales — GMM", poliza: "GMM-2023-0155", type: "PDF", size: "2.1 MB", date: "01 Mar 2023", locked: false },
  { id: "d7", name: "Endoso de modificación", poliza: "AUTO-2024-0291", type: "PDF", size: "210 KB", date: "20 Mar 2024", locked: true },
];

function handleMockDownload(name: string) {
  // Simulate download by creating a blob
  const content = `Documento: ${name}\nFecha: ${new Date().toLocaleDateString('es-MX')}\n\nEste es un documento de demostración.`;
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

  return (
    <div className="max-w-[430px] mx-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#EFF2F9] pt-6 pb-4 z-10">
        <h1 className="text-[#1A1F2B] text-xl font-bold tracking-tight">Mis documentos</h1>
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
                <span className="text-[#9CA3AF] text-xs font-semibold px-2">{poliza}</span>
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
                      <p className={cn("text-sm font-semibold truncate", d.locked ? "text-[#9CA3AF]" : "text-[#1A1F2B]")}>{d.name}</p>
                      <p className="text-[#9CA3AF] text-xs">{d.type} — {d.size} — {d.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!d.locked && (
                        <button className="w-8 h-8 flex items-center justify-center rounded-xl neu-sm text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
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
      <div className="mt-6 rounded-2xl p-4 bg-[#F7941D]/8 border border-[#F7941D]/20"
        style={{ background: "rgba(247,148,29,0.08)" }}>
        <p className="text-[#F7941D] text-xs font-semibold mb-1">Documentos bloqueados</p>
        <p className="text-[#6B7280] text-xs leading-relaxed">
          Algunos documentos requieren validación adicional. Contacta a tu agente para acceder.
        </p>
      </div>
    </div>
  );
}
