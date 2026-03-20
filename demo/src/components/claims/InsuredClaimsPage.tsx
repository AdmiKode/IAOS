'use client'

import { useState } from 'react'
import {
  AlertTriangle, CheckCircle2, Clock, PhoneCall, ShieldCheck,
  ChevronRight, Camera, FileText, MapPin, Car, Activity,
  Upload, Phone, MessageSquare, ChevronLeft, User, X,
} from 'lucide-react'
import { MOCK_SINIESTROS } from '@/data/mock'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface InsuredClaimsPageProps {
  mapboxToken?: string
}

type ClaimType = 'auto' | 'gmm' | 'vida'
type ReportStep = 'select-type' | 'capture' | 'docs' | 'confirm' | 'done'

const STATUS_CONFIG = {
  en_proceso: { label: 'En proceso',  color: '#F7941D', bg: '#F7941D18' },
  cerrado:    { label: 'Resuelto',    color: '#69A481', bg: '#69A48118' },
  pendiente:  { label: 'Pendiente',   color: '#6E7F8D', bg: '#6E7F8D18' },
}

const CLAIM_TYPES: { id: ClaimType; icon: React.ElementType; label: string; desc: string; color: string }[] = [
  { id: 'auto', icon: Car,       label: 'Auto',                  desc: 'Choque, robo, daños', color: '#F7941D' },
  { id: 'gmm',  icon: Activity,  label: 'Gastos médicos',        desc: 'Hospitalización, urgencia', color: '#7C1F31' },
  { id: 'vida', icon: ShieldCheck, label: 'Vida',                desc: 'Notificación de siniestro', color: '#1A1F2B' },
]

const DOCS_REQUIRED: Record<ClaimType, string[]> = {
  auto: ['Identificación oficial', 'Fotos del accidente', 'Parte del accidente', 'Factura del vehículo'],
  gmm:  ['Identificación oficial', 'Receta médica', 'Informe del hospital', 'Facturas de servicios'],
  vida: ['Identificación oficial', 'Acta de defunción', 'Póliza original', 'CURP del beneficiario'],
}

// Timeline de progreso para siniestros auto
const AUTO_TIMELINE = [
  { key: 'reportado',    label: 'Reporte recibido',    done: true  },
  { key: 'asignado',     label: 'Ajustador asignado',  done: true  },
  { key: 'en_camino',    label: 'En camino',           done: true  },
  { key: 'en_sitio',     label: 'En sitio',            done: false },
  { key: 'valuacion',    label: 'Valuación',           done: false },
  { key: 'resolucion',   label: 'Resolución',          done: false },
]

const GMM_TIMELINE = [
  { key: 'reporte',      label: 'Reporte enviado',     done: true  },
  { key: 'evaluacion',   label: 'Evaluación médica',   done: true  },
  { key: 'autorizacion', label: 'Autorización',        done: true  },
  { key: 'cobertura',    label: 'Cobertura confirmada',done: false },
  { key: 'liquidacion',  label: 'Liquidación',         done: false },
]

export function InsuredClaimsPage({ mapboxToken = '' }: InsuredClaimsPageProps) {
  const mySiniestros = MOCK_SINIESTROS.filter(s => s.clientName === 'Ana López')
  const [selected, setSelected] = useState(mySiniestros[0] ?? null)
  const [view, setView] = useState<'list' | 'detail' | 'report'>('list')
  const [reportStep, setReportStep] = useState<ReportStep>('select-type')
  const [claimType, setClaimType] = useState<ClaimType | null>(null)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({})

  // ── Reporte nuevo ─────────────────────────────────────────────────────────
  if (view === 'report') {
    return (
      <div className="flex flex-col gap-4 py-2">
        <div className="flex items-center gap-3">
          <button onClick={() => { setView('list'); setReportStep('select-type'); setClaimType(null) }}
            className="w-9 h-9 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)] flex items-center justify-center text-[#6B7280]">
            <ChevronLeft size={16} />
          </button>
          <div>
            <h2 className="text-[16px] text-[#1A1F2B]">Reportar siniestro</h2>
            <p className="text-[11px] text-[#9CA3AF]">Paso a paso, te guiamos</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1">
          {(['select-type','capture','docs','confirm'] as ReportStep[]).map((step, i) => (
            <div key={step} className="flex items-center gap-1 flex-1">
              <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0',
                reportStep === step ? 'bg-[#F7941D] text-white' :
                ['capture','docs','confirm','done'].indexOf(reportStep) > i ? 'bg-[#69A481] text-white' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[inset_-2px_-2px_4px_#FAFBFF,inset_2px_2px_4px_rgba(22,27,29,0.12)]'
              )}>{i + 1}</div>
              {i < 3 && <div className="flex-1 h-0.5 bg-[#D1D5DB]/60" />}
            </div>
          ))}
        </div>

        {/* Step: selección de tipo */}
        {reportStep === 'select-type' && (
          <div className="flex flex-col gap-3">
            <p className="text-[14px] text-[#1A1F2B]">¿Qué tipo de siniestro es?</p>
            {CLAIM_TYPES.map(t => {
              const Ic = t.icon
              return (
                <button key={t.id} onClick={() => { setClaimType(t.id); setReportStep('capture') }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#EFF2F9] shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)] text-left active:scale-[0.98] transition-transform">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${t.color}15` }}>
                    <Ic size={22} style={{ color: t.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] text-[#1A1F2B]">{t.label}</p>
                    <p className="text-[12px] text-[#9CA3AF]">{t.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#9CA3AF] shrink-0" />
                </button>
              )
            })}
          </div>
        )}

        {/* Step: captura de información */}
        {reportStep === 'capture' && claimType && (
          <div className="flex flex-col gap-4">
            <p className="text-[14px] text-[#1A1F2B]">Cuéntanos qué pasó</p>
            <div className="flex flex-col gap-3">
              {claimType === 'auto' && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F7941D]/10 border border-[#F7941D]/20">
                  <MapPin size={16} className="text-[#F7941D] shrink-0" />
                  <div className="flex-1">
                    <p className="text-[12px] text-[#1A1F2B]">Ubicación detectada</p>
                    <p className="text-[11px] text-[#6B7280]">Periférico Sur km 14, CDMX</p>
                  </div>
                  <span className="text-[10px] text-[#69A481]">GPS ✓</span>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-[#9CA3AF] uppercase tracking-wide">Fecha y hora del incidente</label>
                <input type="datetime-local" defaultValue="2026-03-20T10:00"
                  className="w-full bg-[#EFF2F9] rounded-xl px-4 py-3 text-[13px] text-[#1A1F2B] shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.15)] outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-[#9CA3AF] uppercase tracking-wide">Descripción del evento</label>
                <textarea rows={3} placeholder={
                  claimType === 'auto' ? 'Ej: Choque por alcance en Periférico Sur, daños en defensa trasera...' :
                  claimType === 'gmm' ? 'Ej: Hospitalización de urgencia por apendicitis, Hospital Ángeles...' :
                  'Describe el siniestro de vida...'
                }
                  className="w-full bg-[#EFF2F9] rounded-xl px-4 py-3 text-[13px] text-[#1A1F2B] shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.15)] outline-none resize-none placeholder:text-[#B5BFC6]" />
              </div>
              {/* Captura de foto */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#D1D5DB] text-[#9CA3AF]">
                  <Camera size={24} />
                  <p className="text-[11px] text-center">Tomar foto</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#D1D5DB] text-[#9CA3AF]">
                  <Upload size={24} />
                  <p className="text-[11px] text-center">Subir imagen</p>
                </div>
              </div>
            </div>
            <button onClick={() => setReportStep('docs')}
              className="w-full py-3.5 bg-[#F7941D] rounded-2xl text-white text-[14px] shadow-[0_4px_14px_rgba(247,148,29,0.35)] active:scale-[0.98] transition-transform">
              Continuar
            </button>
          </div>
        )}

        {/* Step: carga de documentos */}
        {reportStep === 'docs' && claimType && (
          <div className="flex flex-col gap-4">
            <p className="text-[14px] text-[#1A1F2B]">Documentos requeridos</p>
            <p className="text-[12px] text-[#9CA3AF]">Sube lo que tengas ahora. Puedes completar después.</p>
            <div className="flex flex-col gap-2">
              {DOCS_REQUIRED[claimType].map(doc => {
                const uploaded = uploadedDocs[doc]
                return (
                  <button key={doc} onClick={() => setUploadedDocs(prev => ({ ...prev, [doc]: !uploaded }))}
                    className={cn('flex items-center gap-3 p-3.5 rounded-xl text-left transition-all',
                      uploaded ? 'bg-[#69A481]/10 border border-[#69A481]/30' : 'bg-[#EFF2F9] shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.12)]')}>
                    <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                      uploaded ? 'bg-[#69A481]/20' : 'bg-[#EFF2F9] shadow-[inset_-2px_-2px_4px_#FAFBFF,inset_2px_2px_4px_rgba(22,27,29,0.12)]')}>
                      {uploaded ? <CheckCircle2 size={16} className="text-[#69A481]" /> : <Upload size={14} className="text-[#9CA3AF]" />}
                    </div>
                    <p className="text-[13px] text-[#1A1F2B] flex-1">{doc}</p>
                    {uploaded && <span className="text-[10px] text-[#69A481]">Subido</span>}
                  </button>
                )
              })}
            </div>
            <button onClick={() => setReportStep('confirm')}
              className="w-full py-3.5 bg-[#F7941D] rounded-2xl text-white text-[14px] shadow-[0_4px_14px_rgba(247,148,29,0.35)] active:scale-[0.98] transition-transform">
              Revisar y enviar
            </button>
          </div>
        )}

        {/* Step: confirmación */}
        {reportStep === 'confirm' && claimType && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
              <p className="text-[14px] text-[#1A1F2B] mb-4">Resumen del reporte</p>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#9CA3AF]">Tipo</span>
                  <span className="text-[#1A1F2B]">{CLAIM_TYPES.find(t => t.id === claimType)?.label}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#9CA3AF]">Póliza</span>
                  <span className="text-[#1A1F2B]">GNP-2025-001234</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#9CA3AF]">Fecha</span>
                  <span className="text-[#1A1F2B]">20 Mar 2026 10:00</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#9CA3AF]">Documentos</span>
                  <span className="text-[#69A481]">{Object.values(uploadedDocs).filter(Boolean).length} / {DOCS_REQUIRED[claimType].length}</span>
                </div>
              </div>
            </div>
            <p className="text-[12px] text-[#9CA3AF] text-center">Al enviar, tu agente y la aseguradora serán notificados de inmediato.</p>
            <button onClick={() => { setReportStep('done'); setView('list') }}
              className="w-full py-3.5 bg-[#1A1F2B] rounded-2xl text-white text-[14px] active:scale-[0.98] transition-transform">
              Enviar reporte
            </button>
            <button onClick={() => setReportStep('docs')} className="text-[12px] text-[#9CA3AF] text-center">Volver a documentos</button>
          </div>
        )}
      </div>
    )
  }

  // ── Detalle de siniestro ───────────────────────────────────────────────────
  if (view === 'detail' && selected) {
    const st = STATUS_CONFIG[selected.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pendiente
    const isAuto = selected.tipo.toLowerCase().includes('choque') || selected.tipo.toLowerCase().includes('auto')
    const timeline = isAuto ? AUTO_TIMELINE : GMM_TIMELINE

    return (
      <div className="flex flex-col gap-4 py-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')}
            className="w-9 h-9 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)] flex items-center justify-center text-[#6B7280]">
            <ChevronLeft size={16} />
          </button>
          <div>
            <h2 className="text-[16px] text-[#1A1F2B]">{selected.tipo}</h2>
            <p className="text-[11px] text-[#9CA3AF]">{selected.id} · {selected.fecha}</p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-full text-[11px]" style={{ background: st.bg, color: st.color }}>
            {st.label}
          </span>
        </div>

        {/* KPIs del siniestro — todos con drill-down */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Folio', value: selected.id, color: '#1A1F2B' },
            { label: 'Monto', value: selected.monto, color: '#F7941D' },
            { label: 'Aseguradora', value: selected.aseguradora, color: '#69A481' },
          ].map(k => (
            <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-3 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)]">
              <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">{k.label}</p>
              <p className="text-[12px] mt-1" style={{ color: k.color }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Timeline de progreso */}
        <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
          <p className="text-[13px] text-[#1A1F2B] mb-4">Estado del proceso</p>
          <div className="flex flex-col gap-3">
            {timeline.map((step, i) => (
              <div key={step.key} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                    step.done ? 'bg-[#69A481]' : 'bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)]')}>
                    {step.done ? <CheckCircle2 size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />}
                  </div>
                  {i < timeline.length - 1 && <div className={cn('w-0.5 h-5 mt-1', step.done ? 'bg-[#69A481]/40' : 'bg-[#D1D5DB]/60')} />}
                </div>
                <div className="pt-1">
                  <p className={cn('text-[13px]', step.done ? 'text-[#1A1F2B]' : 'text-[#9CA3AF]')}>{step.label}</p>
                  {step.done && <p className="text-[10px] text-[#9CA3AF]">Completado</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ajustador — Tracker tipo Uber (auto) */}
        {isAuto && (() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const s = selected as any
          const adj = s.adjuster ?? { nombre: 'Roberto Ibáñez', tel: '5512345678', empresa: 'Qualitas', eta: 18, distancia: '2.4 km' }
          const veh = s.vehiculo ?? { marca: 'Honda', modelo: 'CR-V 2023', placa: 'XTZ-123-B', color: 'Gris' }
          const ubi = s.ubicacion ?? 'Insurgentes Sur 1450, CDMX'
          return (
            <>
              {/* ── TRACKER ── */}
              <div className="bg-[#EFF2F9] rounded-2xl overflow-hidden shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
                {/* Header ETA */}
                <div className="bg-[#1A1F2B] px-4 pt-4 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7941D] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F7941D]" />
                    </span>
                    <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest">Ajustador en camino</p>
                  </div>
                  <div className="flex items-end gap-3">
                    <p className="text-[42px] leading-none text-[#F7941D] font-semibold">{adj.eta}</p>
                    <div className="pb-1">
                      <p className="text-[16px] text-white leading-tight">min</p>
                      <p className="text-[11px] text-[#9CA3AF]">{adj.distancia} de tu ubicación</p>
                    </div>
                  </div>
                </div>

                {/* Mapa estilizado */}
                <div className="relative h-36 bg-gradient-to-br from-[#2D3548] to-[#1A1F2B] overflow-hidden">
                  {/* Cuadrícula calles */}
                  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 144">
                    {[20,55,90,125].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#9CA3AF" strokeWidth="1"/>)}
                    {[40,100,160,220,280,340].map(x => <line key={x} x1={x} y1="0" x2={x} y2="144" stroke="#9CA3AF" strokeWidth="1"/>)}
                  </svg>
                  {/* Ruta */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 144">
                    <path d="M60 110 Q140 60 260 55 Q320 53 340 38" stroke="#F7941D" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="6 4"/>
                  </svg>
                  {/* Pin — tu ubicación */}
                  <div className="absolute bottom-4 left-12 flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#7C1F31] border-2 border-white flex items-center justify-center shadow-lg">
                      <MapPin size={13} className="text-white" />
                    </div>
                    <p className="text-[8px] text-white mt-0.5 bg-black/40 px-1 rounded">Tú</p>
                  </div>
                  {/* Pin — ajustador animado */}
                  <div className="absolute top-4 right-14 flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#F7941D] border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                      <Car size={13} className="text-white" />
                    </div>
                    <p className="text-[8px] text-white mt-0.5 bg-black/40 px-1 rounded">Ajustador</p>
                  </div>
                  {/* Barra de progreso ruta */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
                    <div className="h-full bg-[#F7941D]" style={{ width: '55%' }} />
                  </div>
                </div>

                {/* Datos del ajustador */}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A1F2B]/10 flex items-center justify-center shrink-0 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)]">
                      <User size={22} className="text-[#1A1F2B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] text-[#1A1F2B] font-medium">{adj.nombre}</p>
                      <p className="text-[11px] text-[#9CA3AF]">Ajustador certificado · {adj.empresa}</p>
                      <p className="text-[10px] text-[#6B7280] mt-0.5 truncate">{ubi}</p>
                    </div>
                    <a href={`tel:${adj.tel}`}
                      className="w-10 h-10 rounded-xl bg-[#69A481]/15 flex items-center justify-center text-[#69A481] shrink-0">
                      <PhoneCall size={16} />
                    </a>
                  </div>
                </div>

                {/* Progreso por etapas */}
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-0">
                    {['Reporte','Asignado','En camino','En sitio','Valuación'].map((lbl, i) => {
                      const done = i <= 2
                      const active = i === 2
                      return (
                        <div key={lbl} className="flex flex-col items-center flex-1">
                          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold',
                            done ? (active ? 'bg-[#F7941D] text-white' : 'bg-[#69A481] text-white') : 'bg-white/60 text-[#9CA3AF]')}>
                            {active ? '→' : done ? '✓' : String(i+1)}
                          </div>
                          <p className="text-[8px] text-center mt-0.5 leading-tight" style={{ color: done ? (active ? '#F7941D' : '#69A481') : '#9CA3AF' }}>{lbl}</p>
                          {i < 4 && <div className={cn('absolute hidden')} />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ── VEHÍCULO ── */}
              <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
                <div className="flex items-center gap-2 mb-3">
                  <Car size={14} className="text-[#F7941D]" />
                  <p className="text-[13px] text-[#1A1F2B] font-medium">Vehículo involucrado</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Marca / Modelo', value: `${veh.marca} ${veh.modelo}` },
                    { label: 'Placa',           value: veh.placa },
                    { label: 'Color',           value: veh.color },
                    { label: 'Póliza',          value: selected.policyNumber },
                  ].map(f => (
                    <div key={f.label} className="bg-white/60 rounded-xl p-2.5 border border-white/80">
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">{f.label}</p>
                      <p className="text-[12px] text-[#1A1F2B] mt-0.5 font-medium">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── EVIDENCIAS ── */}
              <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[13px] text-[#1A1F2B] font-medium">Evidencias del siniestro</p>
                  <span className="text-[10px] text-[#69A481] bg-[#69A481]/10 px-2 py-0.5 rounded-full">1 subida</span>
                </div>

                {/* Foto ya subida */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 border border-white/80 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B7280]/30 to-[#9CA3AF]/20 flex items-center justify-center shrink-0">
                    <Camera size={18} className="text-[#6B7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1A1F2B] truncate">foto_accidente_01.jpg</p>
                    <p className="text-[10px] text-[#9CA3AF]">1.4 MB · hace 12 min</p>
                  </div>
                  <CheckCircle2 size={16} className="text-[#69A481] shrink-0" />
                </div>

                {/* Botones de captura */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Camera,   label: 'Abrir cámara',      sub: 'Tomar foto / video',      color: '#F7941D' },
                    { icon: Upload,   label: 'Subir fotos',       sub: 'Galería del teléfono',    color: '#1A1F2B' },
                    { icon: Activity, label: 'Nota de voz',       sub: 'Grabar audio',            color: '#7C1F31' },
                    { icon: FileText, label: 'Escanear doc.',     sub: 'OCR automático',          color: '#69A481' },
                  ].map(btn => {
                    const Ic = btn.icon
                    return (
                      <button key={btn.label}
                        className="flex flex-col items-start gap-1 p-3 rounded-xl bg-white/60 border border-white/80 active:scale-95 transition-transform text-left">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: `${btn.color}15` }}>
                          <Ic size={16} style={{ color: btn.color }} />
                        </div>
                        <p className="text-[12px] text-[#1A1F2B] font-medium leading-tight">{btn.label}</p>
                        <p className="text-[10px] text-[#9CA3AF] leading-tight">{btn.sub}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )
        })()}

        {/* Monto cubierto (GMM) */}
        {!isAuto && (
          <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
            <p className="text-[13px] text-[#1A1F2B] mb-3">Cobertura</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
                <p className="text-[10px] text-[#9CA3AF] uppercase">Monto cubierto</p>
                <p className="text-[16px] text-[#69A481] mt-1">{selected.monto}</p>
              </div>
              <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
                <p className="text-[10px] text-[#9CA3AF] uppercase">Deducible</p>
                <p className="text-[16px] text-[#F7941D] mt-1">$8,500</p>
              </div>
            </div>
          </div>
        )}

        {/* Historial del timeline */}
        <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
          <p className="text-[13px] text-[#1A1F2B] mb-3">Historial del caso</p>
          <div className="flex flex-col gap-2">
            {selected.timeline.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-white/40">
                <CheckCircle2 size={13} className="text-[#69A481] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] text-[#1A1F2B]">{item.accion}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{item.fecha} · {item.responsable}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentos pendientes */}
        <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] text-[#1A1F2B]">Documentos</p>
            <span className="text-[10px] text-[#F7941D] bg-[#F7941D]/10 px-2 py-0.5 rounded-full">2 pendientes</span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { name: 'Identificación oficial', ok: true },
              { name: 'Fotos del accidente', ok: false },
              { name: 'Carta de hechos', ok: true },
              { name: 'Factura del vehículo', ok: false },
            ].map(doc => (
              <div key={doc.name} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/40">
                {doc.ok ? <CheckCircle2 size={14} className="text-[#69A481] shrink-0" /> : <Clock size={14} className="text-[#F7941D] shrink-0" />}
                <p className="text-[12px] text-[#1A1F2B] flex-1">{doc.name}</p>
                {!doc.ok && (
                  <button className="text-[10px] text-[#F7941D] bg-[#F7941D]/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Upload size={10} /> Subir
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contactos */}
        <div className="grid grid-cols-2 gap-3">
          <a href="tel:8004009000"
            className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#1A1F2B] text-white">
            <Phone size={16} />
            <div>
              <p className="text-[12px]">Emergencias</p>
              <p className="text-[10px] text-[#9CA3AF]">800 400 9000</p>
            </div>
          </a>
          <Link href="/client/mensajes"
            className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)] text-[#1A1F2B]">
            <MessageSquare size={16} className="text-[#F7941D]" />
            <div>
              <p className="text-[12px]">Mi agente</p>
              <p className="text-[10px] text-[#9CA3AF]">Carlos M.</p>
            </div>
          </Link>
        </div>
      </div>
    )
  }

  // ── Lista de siniestros ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] text-[#1A1F2B]">Mis siniestros</h2>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">Seguimiento de tus reportes</p>
        </div>
        <button onClick={() => { setView('report'); setReportStep('select-type') }}
          className="px-4 py-2 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_4px_12px_rgba(247,148,29,0.3)]">
          + Reportar
        </button>
      </div>

      {/* KPIs resumen */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Activos', value: mySiniestros.filter(s => s.status === 'en_proceso').length.toString(), color: '#F7941D' },
          { label: 'Cerrados', value: mySiniestros.filter(s => s.status === 'cerrado').length.toString(), color: '#69A481' },
          { label: 'Total', value: mySiniestros.length.toString(), color: '#1A1F2B' },
        ].map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-3 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-center">
            <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">{k.label}</p>
            <p className="text-[22px] mt-1" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Lista */}
      {mySiniestros.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-[#9CA3AF]">
          <ShieldCheck size={40} className="opacity-40" />
          <p className="text-[14px]">Sin siniestros registrados</p>
          <p className="text-[12px] text-center">Si tuviste un accidente o emergencia médica, repórtalo aquí</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {mySiniestros.map(s => {
            const st = STATUS_CONFIG[s.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pendiente
            return (
              <button key={s.id} onClick={() => { setSelected(s); setView('detail') }}
                className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.14)] text-left w-full active:scale-[0.98] transition-transform">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[15px] text-[#1A1F2B]">{s.tipo}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">{s.descripcion}</p>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full shrink-0 ml-2" style={{ background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <span>{s.id} · {s.fecha}</span>
                  <span style={{ color: '#F7941D' }} className="font-medium">{s.monto}</span>
                </div>
                {/* Mini timeline */}
                <div className="mt-3 flex gap-1">
                  {s.timeline.map((t, i) => (
                    <div key={t.id} className="flex-1 h-1 rounded-full"
                      style={{ background: i < s.timeline.length ? '#69A481' : '#D1D5DB' }} />
                  ))}
                </div>
                <p className="text-[10px] text-[#9CA3AF] mt-1">{s.timeline[s.timeline.length - 1]?.accion}</p>
              </button>
            )
          })}
        </div>
      )}

      {/* CTA reportar */}
      <button onClick={() => { setView('report'); setReportStep('select-type') }}
        className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#F7941D]/30 text-[#F7941D] text-[13px] hover:bg-[#F7941D]/5 transition-colors">
        <AlertTriangle size={16} />
        Reportar nuevo siniestro
      </button>

      {/* Contactos de emergencia */}
      <div className="bg-[#1A1F2B] rounded-2xl p-4">
        <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide mb-3">Contactos de emergencia</p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'GNP Emergencias 24/7', phone: '800 400 9000' },
            { label: 'Cabina siniestros auto', phone: '800 123 4567' },
            { label: 'Urgencias médicas GMM', phone: '800 987 6543' },
          ].map(c => (
            <a key={c.phone} href={`tel:${c.phone.replace(/\s/g, '')}`}
              className="flex items-center justify-between p-3 rounded-xl bg-white/8 hover:bg-white/12 transition-colors">
              <div>
                <p className="text-[12px] text-white">{c.label}</p>
                <p className="text-[11px] text-[#9CA3AF]">{c.phone}</p>
              </div>
              <Phone size={14} className="text-[#F7941D]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
