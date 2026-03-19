"use client";

import { useEffect, useRef } from "react";
import { X, AlertTriangle, Clock, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { clsx } from "clsx";

interface Notification {
  id: string;
  type: "alert" | "reminder" | "document" | "message" | "insight";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "alert",
    title: "Póliza próxima a vencer",
    body: "La póliza Auto GM-2024-001 de Carlos Mendoza vence en 5 días.",
    time: "Hace 10 min",
    read: false,
  },
  {
    id: "n2",
    type: "message",
    title: "Nuevo mensaje de cliente",
    body: "Ana López envió un mensaje: «¿Pueden enviarme el recibo de pago?»",
    time: "Hace 38 min",
    read: false,
  },
  {
    id: "n3",
    type: "reminder",
    title: "Llamada agendada",
    body: "Tienes una llamada con Roberto García a las 15:00 h.",
    time: "Hace 1 h",
    read: false,
  },
  {
    id: "n4",
    type: "document",
    title: "Documento listo para firma",
    body: "Endoso de incremento de suma asegurada pendiente de firma.",
    time: "Hace 2 h",
    read: true,
  },
  {
    id: "n5",
    type: "insight",
    title: "XORIA detectó oportunidad",
    body: "3 clientes con perfil ideal para Seguro de Vida. Ver sugerencias.",
    time: "Hace 3 h",
    read: true,
  },
];

const TYPE_ICON = {
  alert: AlertTriangle,
  reminder: Clock,
  document: FileText,
  message: MessageSquare,
  insight: TrendingUp,
};

const TYPE_COLOR = {
  alert: "text-[#7C1F31] bg-[#7C1F31]/10",
  reminder: "text-[#F7941D] bg-[#F7941D]/10",
  document: "text-[#6B7280] bg-[#6B7280]/10",
  message: "text-[#69A481] bg-[#69A481]/10",
  insight: "text-[#1A1F2B] bg-[#1A1F2B]/10",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) setTimeout(() => document.addEventListener("mousedown", handleClick), 50);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer */}
      <div
        ref={panelRef}
        className={clsx(
          "fixed top-0 right-0 z-50 h-full w-[360px] flex flex-col",
          "bg-[#EFF2F9] shadow-[-4px_0_32px_rgba(22,27,29,0.14)]",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#B5BFC6]/30">
          <div>
            <h2 className="text-[#1A1F2B] font-semibold text-base tracking-tight">
              Notificaciones
            </h2>
            {unread > 0 && (
              <p className="text-[#F7941D] text-xs mt-0.5">
                {unread} sin leer
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn-icon w-8 h-8 flex items-center justify-center rounded-full"
          >
            <X size={16} className="text-[#6B7280]" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-3 px-4 flex flex-col gap-2">
          {MOCK_NOTIFICATIONS.map((n) => {
            const Icon = TYPE_ICON[n.type];
            return (
              <div
                key={n.id}
                className={clsx(
                  "rounded-xl p-4 flex gap-3 transition-all cursor-pointer",
                  n.read
                    ? "neu-sm opacity-70 hover:opacity-100"
                    : "neu-md"
                )}
              >
                <div
                  className={clsx(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    TYPE_COLOR[n.type]
                  )}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#1A1F2B] text-sm font-semibold truncate">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#F7941D] shrink-0" />
                    )}
                  </div>
                  <p className="text-[#6B7280] text-xs mt-1 leading-relaxed line-clamp-2">
                    {n.body}
                  </p>
                  <p className="text-[#9CA3AF] text-xs mt-2">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#B5BFC6]/30">
          <button className="w-full text-center text-[#F7941D] text-sm font-semibold hover:text-[#d97c12] transition-colors">
            Marcar todas como leídas
          </button>
        </div>
      </div>
    </>
  );
}
