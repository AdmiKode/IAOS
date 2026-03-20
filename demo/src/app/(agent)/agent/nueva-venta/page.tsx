'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, ArrowLeft, Shield, Users, Heart, Car, ExternalLink, Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const SEGUROS = [
  {
    id: 'gmm-individual',
    icon: Shield,
    label: 'GMM Individual',
    desc: 'Gastos Médicos Mayores para una persona. Protección completa con hospitalización, cirugías y especialistas.',
    campos: 24,
    tiempo: '8–12 min',
    color: '#F7941D',
    bg: 'rgba(247,148,29,0.08)',
    border: 'rgba(247,148,29,0.25)',
    disponible: true,
  },
  {
    id: 'gmm-colectivo',
    icon: Users,
    label: 'GMM Colectivo',
    desc: 'Gastos Médicos para grupos empresariales. Incluye datos del contratante, empresa y dependientes.',
    campos: 32,
    tiempo: '12–18 min',
    color: '#69A481',
    bg: 'rgba(105,164,129,0.08)',
    border: 'rgba(105,164,129,0.25)',
    disponible: true,
  },
  {
    id: 'vida-individual',
    icon: Heart,
    label: 'Vida Individual',
    desc: 'Seguro de vida con beneficiarios designados. Suma asegurada, coberturas adicionales y método de pago.',
    campos: 20,
    tiempo: '6–10 min',
    color: '#7C1F31',
    bg: 'rgba(124,31,49,0.08)',
    border: 'rgba(124,31,49,0.25)',
    disponible: false,
  },
  {
    id: 'auto',
    icon: Car,
    label: 'Auto',
    desc: 'Seguro de automóvil individual. Incluye validación de placas REPUVE/RENAPO para verificar reporte de robo.',
    campos: 18,
    tiempo: '6–8 min',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    disponible: false,
  },
]

export default function NuevaVentaPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [hovering, setHovering] = useState<string | null>(null)

  function handleStart() {
    if (!selected) return
    router.push(`/agent/nueva-venta/originacion?tipo=${selected}`)
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/agent/dashboard')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors"
        >
          <ArrowLeft size={15} />
        </button>
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image src="/Icono xoria.png" alt="XORIA" width={24} height={24} className="object-cover w-full h-full" />
            </div>
            <span className="text-[11px] text-[#F7941D] font-semibold tracking-[0.2em] uppercase">XORIA · Motor de originación</span>
          </div>
          <h1 className="text-[24px] text-[#1A1F2B] font-bold tracking-tight">Nueva venta asistida</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">
            Selecciona el tipo de seguro. XORIA guiará la captura campo por campo.
          </p>
        </div>
      </div>

      {/* Proceso visual */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)]">
        <p className="text-[11px] text-[#9CA3AF] font-semibold tracking-widest uppercase mb-4">El flujo de originación</p>
        <div className="flex items-center gap-0 overflow-x-auto">
          {['Tipo de seguro', 'Captura guiada', 'Cotización', 'Revisión', 'Firma digital', 'Pago', 'Expediente'].map((step, i) => (
            <div key={step} className="flex items-center shrink-0">
              <div className={cn(
                'flex flex-col items-center gap-1 px-3',
                i === 0 ? 'opacity-100' : 'opacity-40'
              )}>
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold',
                  i === 0
                    ? 'bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.4)]'
                    : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)]'
                )}>
                  {i === 0 ? <Check size={13} /> : i + 1}
                </div>
                <span className="text-[9px] text-[#6B7280] whitespace-nowrap">{step}</span>
              </div>
              {i < 6 && <div className="w-6 h-px bg-[#D1D5DB] shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Cards de tipo de seguro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {SEGUROS.map(seg => {
          const Icon = seg.icon
          const isSelected = selected === seg.id
          const isHover = hovering === seg.id
          return (
            <button
              key={seg.id}
              disabled={!seg.disponible}
              onClick={() => seg.disponible && setSelected(seg.id)}
              onMouseEnter={() => setHovering(seg.id)}
              onMouseLeave={() => setHovering(null)}
              className={cn(
                'relative text-left rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 border',
                seg.disponible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
                isSelected
                  ? 'shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.22)] scale-[1.02]'
                  : isHover && seg.disponible
                  ? 'shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.15)] scale-[1.01]'
                  : 'shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]'
              )}
              style={{
                background: isSelected ? seg.bg : '#EFF2F9',
                borderColor: isSelected ? seg.border : 'transparent',
              }}
            >
              {/* Seleccionado */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: seg.color }}>
                  <Check size={11} className="text-white" />
                </div>
              )}

              {/* Próximamente */}
              {!seg.disponible && (
                <span className="absolute top-3 right-3 text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#D1D5DB]/50 text-[#9CA3AF]">
                  Próximamente
                </span>
              )}

              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: seg.bg }}>
                <Icon size={20} style={{ color: seg.color }} />
              </div>

              <div>
                <h3 className="text-[15px] text-[#1A1F2B] font-semibold tracking-wide">{seg.label}</h3>
                <p className="text-[12px] text-[#6B7280] mt-1.5 leading-relaxed">{seg.desc}</p>
              </div>

              <div className="flex gap-3 mt-auto">
                <div className="text-center">
                  <p className="text-[16px] font-bold" style={{ color: seg.color }}>{seg.campos}</p>
                  <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">campos</p>
                </div>
                <div className="w-px bg-[#D1D5DB]" />
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-[#1A1F2B]">{seg.tiempo}</p>
                  <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">con XORIA</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* REPUVE — Herramienta de validación para seguro de Auto */}
      <div className="rounded-2xl overflow-hidden shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <div className="bg-[#3B82F6]/8 border border-[#3B82F6]/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#3B82F6]/10">
              <Car size={22} className="text-[#3B82F6]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[13px] font-semibold text-[#1A1F2B]">REPUVE — Validación de placas y robo vehicular</h3>
                <span className="text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">Seguro Auto</span>
              </div>
              <p className="text-[12px] text-[#6B7280] leading-relaxed mb-3">
                Consulta obligatoria AMIS/CNBV antes de emitir cualquier seguro de automóvil. Verifica el número de serie (VIN), placas y si el vehículo tiene reporte de robo activo.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.repuve.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white transition-all hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]"
                  style={{ background: 'linear-gradient(135deg,#3B82F6,#2563EB)', boxShadow: '0 4px_14px_rgba(59,130,246,0.3)' }}
                >
                  <ExternalLink size={12} />
                  Consultar REPUVE
                </a>
                <a
                  href="https://www.repuve.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#3B82F6] border border-[#3B82F6]/30 bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] transition-all hover:scale-[1.02]"
                >
                  <AlertTriangle size={12} />
                  Verificar reporte de robo
                </a>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#3B82F6]/10 grid grid-cols-3 gap-3">
            {[
              { label: 'VIN / No. de serie', desc: 'Verificación de chasis y motor' },
              { label: 'Placas', desc: 'Consulta por número de placas' },
              { label: 'Reporte de robo', desc: 'Base de datos SNSP/ANI' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-[11px] font-semibold text-[#1A1F2B]">{item.label}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA iniciar */}
      <div className="flex items-center justify-between bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)]">
        <div>
          {selected ? (
            <>
              <p className="text-[13px] text-[#1A1F2B] font-semibold">
                {SEGUROS.find(s => s.id === selected)?.label} seleccionado
              </p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                XORIA iniciará la entrevista guiada. Puedes pausar y continuar en cualquier momento.
              </p>
            </>
          ) : (
            <>
              <p className="text-[13px] text-[#1A1F2B] font-semibold">Selecciona un tipo de seguro para comenzar</p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">XORIA adaptará las preguntas al producto elegido.</p>
            </>
          )}
        </div>
        <button
          onClick={handleStart}
          disabled={!selected}
          className={cn(
            'flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[13px] font-semibold text-white transition-all duration-200',
            selected
              ? 'hover:scale-[1.03] hover:shadow-[0_8px_28px_rgba(247,148,29,0.45)]'
              : 'opacity-40 cursor-not-allowed'
          )}
          style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: selected ? '0 6px 20px rgba(247,148,29,0.35)' : 'none' }}
        >
          Iniciar con XORIA
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
