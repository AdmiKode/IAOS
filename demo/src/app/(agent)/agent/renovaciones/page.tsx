"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw, AlertTriangle, Clock, CheckCircle, X } from "lucide-react";
import { ClientLink } from "@/components/ui";

interface Renovacion {
  id: string;
  poliza: string;
  cliente: string;
  ramo: string;
  aseguradora: string;
  prima: string;
  vencimiento: string;
  diasRestantes: number;
}

const RENOVACIONES: Renovacion[] = [
  { id: "r1", poliza: "GM-2024-001", cliente: "Carlos Mendoza", ramo: "Auto", aseguradora: "GNP", prima: "$1,840", vencimiento: "2025-01-15", diasRestantes: 4 },
  { id: "r2", poliza: "VI-2023-088", cliente: "Laura Sánchez", ramo: "Vida", aseguradora: "MetLife", prima: "$2,100", vencimiento: "2025-01-18", diasRestantes: 7 },
  { id: "r3", poliza: "HO-2023-044", cliente: "Roberto García", ramo: "Hogar", aseguradora: "AXA", prima: "$980", vencimiento: "2025-01-22", diasRestantes: 11 },
  { id: "r4", poliza: "GM-2023-119", cliente: "Patricia López", ramo: "GMM", aseguradora: "Bupa", prima: "$3,400", vencimiento: "2025-01-26", diasRestantes: 15 },
  { id: "r5", poliza: "AU-2023-203", cliente: "Grupo Textil SA", ramo: "RC", aseguradora: "HDI", prima: "$5,200", vencimiento: "2025-02-01", diasRestantes: 21 },
  { id: "r6", poliza: "VI-2024-012", cliente: "Miguel Torres", ramo: "Vida", aseguradora: "Sura", prima: "$1,750", vencimiento: "2025-02-10", diasRestantes: 30 },
  { id: "r7", poliza: "GM-2024-055", cliente: "Ana Flores", ramo: "Auto", aseguradora: "Quálitas", prima: "$1,540", vencimiento: "2025-02-20", diasRestantes: 40 },
  { id: "r8", poliza: "HO-2024-078", cliente: "Sergio Hernández", ramo: "Hogar", aseguradora: "GNP", prima: "$850", vencimiento: "2025-03-05", diasRestantes: 53 },
];

function getBadge(dias: number) {
  if (dias <= 7) return { label: "Urgente", color: "#7C1F31", bg: "#7C1F3118" };
  if (dias <= 15) return { label: "Próximo", color: "#F7941D", bg: "#F7941D18" };
  if (dias <= 30) return { label: "Pronto", color: "#F7941D", bg: "#F7941D0F" };
  return { label: "Normal", color: "#69A481", bg: "#69A48118" };
}

export default function RenovacionesPage() {
  const [confirmModal, setConfirmModal] = useState<Renovacion | null>(null);
  const [renovadas, setRenovadas] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"todos" | "urgente" | "proximo" | "normal">("todos");

  function handleRenovar() {
    if (confirmModal) {
      setRenovadas(prev => new Set([...prev, confirmModal.id]));
      setConfirmModal(null);
    }
  }

  const filtered = RENOVACIONES.filter(r => {
    if (filter === "urgente") return r.diasRestantes <= 7;
    if (filter === "proximo") return r.diasRestantes > 7 && r.diasRestantes <= 15;
    if (filter === "normal") return r.diasRestantes > 15;
    return true;
  }).sort((a, b) => a.diasRestantes - b.diasRestantes);

  const urgentes = RENOVACIONES.filter(r => r.diasRestantes <= 7).length;
  const proximos = RENOVACIONES.filter(r => r.diasRestantes > 7 && r.diasRestantes <= 15).length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#1A1F2B] text-2xl font-bold tracking-tight">Renovaciones</h1>
          <p className="text-[#6B7280] text-sm mt-1">Pólizas próximas a vencer</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="neu-sm rounded-xl px-4 py-2 flex items-center gap-2">
            <AlertTriangle size={14} className="text-[#7C1F31]" />
            <span className="text-[#7C1F31] text-sm font-semibold">{urgentes} urgentes</span>
          </div>
          <div className="neu-sm rounded-xl px-4 py-2 flex items-center gap-2">
            <Clock size={14} className="text-[#F7941D]" />
            <span className="text-[#F7941D] text-sm font-semibold">{proximos} próximos</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(["todos", "urgente", "proximo", "normal"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize",
              filter === f
                ? "bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)]"
                : "neu-sm text-[#6B7280] hover:text-[#1A1F2B]")}>
            {f === "todos" ? "Todos" : f === "urgente" ? "Urgentes (≤7d)" : f === "proximo" ? "Próximos (≤15d)" : "Normal (>15d)"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="neu-md rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_80px_100px_100px_80px_120px] gap-0 px-6 py-3 border-b border-[#B5BFC6]/20">
          {["Cliente", "Póliza", "Ramo", "Aseguradora", "Prima", "Días", "Acción"].map((h) => (
            <div key={h} className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">{h}</div>
          ))}
        </div>

        {filtered.map((r) => {
          const badge = getBadge(r.diasRestantes);
          const done = renovadas.has(r.id);
          return (
            <div key={r.id} className={cn(
              "grid grid-cols-[1fr_1fr_80px_100px_100px_80px_120px] gap-0 px-6 py-4 border-b border-[#B5BFC6]/10 items-center transition-all",
              done && "opacity-50"
            )}>
              <div>
                <ClientLink name={r.cliente} plain className="text-[#1A1F2B] text-sm font-semibold" />
                <p className="text-[#9CA3AF] text-xs">{r.vencimiento}</p>
              </div>
              <p className="text-[#6B7280] text-sm font-mono">{r.poliza}</p>
              <p className="text-[#6B7280] text-sm">{r.ramo}</p>
              <p className="text-[#6B7280] text-sm">{r.aseguradora}</p>
              <p className="text-[#1A1F2B] text-sm font-semibold">{r.prima}</p>
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ color: badge.color, background: badge.bg }}>
                  {r.diasRestantes}d
                </span>
              </div>
              <div>
                {done ? (
                  <div className="flex items-center gap-1.5 text-[#69A481]">
                    <CheckCircle size={14} />
                    <span className="text-xs font-semibold">Renovada</span>
                  </div>
                ) : (
                  <button onClick={() => setConfirmModal(r)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7941D] text-white text-xs font-semibold shadow-[0_3px_10px_rgba(247,148,29,0.35)] hover:bg-[#e08019] transition-all">
                    <RefreshCw size={11} />
                    Renovar
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="text-[#9CA3AF] text-sm">No hay pólizas en este filtro</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="neu-lg rounded-3xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#1A1F2B] text-lg font-bold">Confirmar renovación</h3>
              <button onClick={() => setConfirmModal(null)}
                className="w-8 h-8 rounded-xl neu-sm flex items-center justify-center text-[#6B7280] hover:text-[#1A1F2B]">
                <X size={14} />
              </button>
            </div>

            <div className="bg-[#EFF2F9] rounded-2xl p-4 mb-6 shadow-[inset_-3px_-3px_6px_#FAFBFF,inset_3px_3px_6px_rgba(22,27,29,0.10)]">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Cliente", value: confirmModal.cliente, isClient: true },
                  { label: "Póliza", value: confirmModal.poliza },
                  { label: "Prima", value: confirmModal.prima },
                  { label: "Vencimiento", value: confirmModal.vencimiento },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[#9CA3AF] text-xs">{f.label}</p>
                    {f.isClient
                      ? <ClientLink name={f.value} plain className="text-[#1A1F2B] text-sm font-semibold" />
                      : <p className="text-[#1A1F2B] text-sm font-semibold">{f.value}</p>
                    }
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[#6B7280] text-sm mb-6">
              Se iniciará el proceso de renovación y se notificará al asegurado por correo.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)}
                className="flex-1 py-3 rounded-xl neu-sm text-sm font-semibold text-[#6B7280] hover:text-[#1A1F2B] transition-all">
                Cancelar
              </button>
              <button onClick={handleRenovar}
                className="flex-1 py-3 rounded-xl bg-[#F7941D] text-white text-sm font-bold shadow-[0_4px_16px_rgba(247,148,29,0.4)] hover:bg-[#e08019] transition-all">
                Confirmar renovación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
