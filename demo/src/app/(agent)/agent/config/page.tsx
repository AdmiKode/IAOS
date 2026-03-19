"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { Camera, Bell, Moon, Globe, Shield, LogOut, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const IDIOMAS = ["Español (México)", "Español (España)", "English (US)"];

export default function ConfigPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [nombre, setNombre] = useState(user?.name || "Agente Demo");
  const [email, setEmail] = useState(user?.email || "agente@demo.com");
  const [idioma, setIdioma] = useState(IDIOMAS[0]);
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState({
    notifEmail: true,
    notifPush: true,
    notifRenovaciones: true,
    modoOscuro: false,
    dobleAuth: false,
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const initials = nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-[#1A1F2B] text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-[#6B7280] text-sm mt-1">Gestiona tu perfil y preferencias</p>
      </div>

      {/* Profile card */}
      <div className="neu-md rounded-2xl p-6">
        <h2 className="text-[#1A1F2B] font-semibold mb-5">Perfil</h2>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#F7941D]/12 flex items-center justify-center overflow-hidden cursor-pointer"
              style={{ background: "rgba(247,148,29,0.12)" }}
              onClick={() => fileRef.current?.click()}>
              {avatar
                ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                : <span className="text-[#F7941D] text-2xl font-bold">{initials}</span>
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#F7941D] flex items-center justify-center shadow-[0_4px_12px_rgba(247,148,29,0.4)] hover:bg-[#e08019] transition-colors">
              <Camera size={13} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="text-[#1A1F2B] font-semibold">{nombre}</p>
            <p className="text-[#6B7280] text-sm">{email}</p>
            <p className="text-[#9CA3AF] text-xs mt-1 capitalize">{user?.role === "agent" ? "Agente" : "Administrador"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[#6B7280] text-xs font-semibold tracking-wider uppercase">Nombre</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} className="input-neu text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#6B7280] text-xs font-semibold tracking-wider uppercase">Correo</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="input-neu text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#6B7280] text-xs font-semibold tracking-wider uppercase">Teléfono</label>
            <input defaultValue="+52 55 1234 5678" className="input-neu text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#6B7280] text-xs font-semibold tracking-wider uppercase">Idioma</label>
            <select value={idioma} onChange={e => setIdioma(e.target.value)}
              className="input-neu text-sm appearance-none bg-[#EFF2F9]">
              {IDIOMAS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleSave}
          className={cn("mt-5 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
            saved
              ? "bg-[#69A481] text-white shadow-[0_4px_12px_rgba(105,164,129,0.4)]"
              : "bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.35)] hover:bg-[#e08019]")}>
          {saved ? <><Check size={14} /> Guardado</> : "Guardar cambios"}
        </button>
      </div>

      {/* Notifications */}
      <div className="neu-md rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={16} className="text-[#F7941D]" />
          <h2 className="text-[#1A1F2B] font-semibold">Notificaciones</h2>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { key: "notifEmail", label: "Notificaciones por correo", desc: "Recibe alertas importantes en tu bandeja" },
            { key: "notifPush", label: "Notificaciones push", desc: "Alertas en tiempo real en el navegador" },
            { key: "notifRenovaciones", label: "Alertas de renovaciones", desc: "Aviso 30, 15 y 7 días antes del vencimiento" },
          ].map((t) => (
            <div key={t.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[#1A1F2B] text-sm font-semibold">{t.label}</p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">{t.desc}</p>
              </div>
              <button
                onClick={() => setToggles(prev => ({ ...prev, [t.key]: !prev[t.key as keyof typeof prev] }))}
                className={cn("relative w-11 h-6 rounded-full transition-all shrink-0",
                  toggles[t.key as keyof typeof toggles]
                    ? "bg-[#F7941D] shadow-[0_2px_8px_rgba(247,148,29,0.35)]"
                    : "bg-[#B5BFC6]/40 shadow-[inset_-2px_-2px_4px_#FAFBFF,inset_2px_2px_4px_rgba(22,27,29,0.1)]")}>
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                  toggles[t.key as keyof typeof toggles] ? "left-6" : "left-1")} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="neu-md rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={16} className="text-[#69A481]" />
          <h2 className="text-[#1A1F2B] font-semibold">Preferencias</h2>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { key: "modoOscuro", label: "Modo oscuro", desc: "Interfaz oscura para trabajo nocturno", icon: Moon },
            { key: "dobleAuth", label: "Doble autenticación", desc: "Mayor seguridad en el acceso", icon: Shield },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.key} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EFF2F9] shadow-[inset_-2px_-2px_4px_#FAFBFF,inset_2px_2px_4px_rgba(22,27,29,0.1)] flex items-center justify-center">
                    <Icon size={14} className="text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="text-[#1A1F2B] text-sm font-semibold">{t.label}</p>
                    <p className="text-[#9CA3AF] text-xs mt-0.5">{t.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setToggles(prev => ({ ...prev, [t.key]: !prev[t.key as keyof typeof prev] }))}
                  className={cn("relative w-11 h-6 rounded-full transition-all shrink-0",
                    toggles[t.key as keyof typeof toggles]
                      ? "bg-[#F7941D] shadow-[0_2px_8px_rgba(247,148,29,0.35)]"
                      : "bg-[#B5BFC6]/40 shadow-[inset_-2px_-2px_4px_#FAFBFF,inset_2px_2px_4px_rgba(22,27,29,0.1)]")}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                    toggles[t.key as keyof typeof toggles] ? "left-6" : "left-1")} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger zone */}
      <div className="neu-md rounded-2xl p-6 border border-[#7C1F31]/20">
        <h2 className="text-[#7C1F31] font-semibold mb-4">Sesión</h2>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#7C1F31] bg-[#7C1F31]/8 hover:bg-[#7C1F31]/15 transition-all"
          style={{ background: "rgba(124,31,49,0.08)" }}>
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
