'use client'
import { MOCK_POLICIES } from '@/data/mock'
import { Badge } from '@/components/ui'
import { FileText, Plus, Search, X, Upload, Scan, CheckCircle, Loader2, FileCheck, TrendingUp, Clock, PieChart, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ClientLink } from '@/components/ui'

const STATUS_MAP = {
  activa:    { label: 'Activa',    variant: 'success' as const },
  vigente:   { label: 'Vigente',   variant: 'success' as const },
  pendiente: { label: 'Pendiente', variant: 'warning' as const },
  vencida:   { label: 'Vencida',   variant: 'danger' as const },
  cancelada: { label: 'Cancelada', variant: 'danger' as const },
}

// Datos simulados extraídos por OCR de carátula de póliza
const OCR_EXTRACTED = {
  numero: 'AUTO-2026-' + Math.floor(1000 + Math.random() * 9000),
  cliente: 'Roberto Sánchez',
  ramo: 'Automóvil',
  aseguradora: 'GNP Seguros',
  sumaAsegurada: '$320,000',
  prima: '$1,840',
  inicio: '19/03/2026',
  fin: '19/03/2027',
  cobertura: 'Amplia',
}

export default function PolizasPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [ocrStep, setOcrStep] = useState<'idle' | 'uploading' | 'scanning' | 'done'>('idle')
  const [ocrFile, setOcrFile] = useState<{ name: string; size: string } | null>(null)
  const [ocrData, setOcrData] = useState<typeof OCR_EXTRACTED | null>(null)
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [kpiModal, setKpiModal] = useState<null | 'activas' | 'vencer' | 'tipo' | 'prima'>(null)

  // KPI calculations
  const activas = MOCK_POLICIES.filter(p => p.status === 'activa' || p.status === 'vigente')
  const today = new Date()
  const in30 = new Date(today); in30.setDate(today.getDate() + 30)
  const porVencer = MOCK_POLICIES.filter(p => {
    if (p.status === 'vencida' || p.status === 'cancelada') return false
    const end = new Date(p.endDate)
    return end >= today && end <= in30
  })
  const byType = MOCK_POLICIES.reduce((acc, p) => {
    const ramo = p.type.replace(/ (Individual|Amplia|Plus|Colectivo|Integral|Temporal|Empresarial)/g, '').trim()
    const key = ramo.split(' ')[0]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const kpiCards = [
    {
      id: 'activas' as const,
      icon: CheckCircle,
      color: '#69A481',
      bg: 'bg-[#69A481]/10',
      label: 'Pólizas activas',
      value: activas.length.toString(),
      sub: `de ${MOCK_POLICIES.length} totales`,
    },
    {
      id: 'vencer' as const,
      icon: Clock,
      color: '#F7941D',
      bg: 'bg-[#F7941D]/10',
      label: 'Por vencer ≤30d',
      value: porVencer.length.toString(),
      sub: 'requieren atención',
    },
    {
      id: 'tipo' as const,
      icon: PieChart,
      color: '#1A1F2B',
      bg: 'bg-[#1A1F2B]/8',
      label: 'Por tipo de seguro',
      value: Object.keys(byType).length.toString(),
      sub: 'ramos en cartera',
    },
    {
      id: 'prima' as const,
      icon: DollarSign,
      color: '#7C1F31',
      bg: 'bg-[#7C1F31]/10',
      label: 'Objetivo cartera',
      value: '$184,320',
      sub: 'prima mensual total',
    },
  ]

  const kpiModalData = {
    activas: {
      title: 'Pólizas activas',
      records: activas,
      cols: ['clientName', 'type', 'insurer', 'endDate', 'premium'],
      headers: ['Cliente', 'Tipo', 'Aseguradora', 'Vence', 'Prima'],
    },
    vencer: {
      title: 'Por vencer ≤30 días',
      records: porVencer,
      cols: ['clientName', 'type', 'insurer', 'endDate', 'premium'],
      headers: ['Cliente', 'Tipo', 'Aseguradora', 'Vence', 'Prima'],
    },
    tipo: {
      title: 'Pólizas por tipo de seguro',
      records: MOCK_POLICIES,
      cols: ['clientName', 'type', 'insurer', 'status', 'premium'],
      headers: ['Cliente', 'Tipo', 'Aseguradora', 'Estado', 'Prima'],
    },
    prima: {
      title: 'Prima mensual — todas las pólizas',
      records: activas,
      cols: ['clientName', 'type', 'insurer', 'premium', 'endDate'],
      headers: ['Cliente', 'Tipo', 'Aseguradora', 'Prima', 'Vence'],
    },
  }

  const filtered = MOCK_POLICIES.filter(p =>
    p.clientName.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.policyNumber.toLowerCase().includes(search.toLowerCase())
  )

  function processFile(file: File | null) {
    if (!file) return
    const size = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / 1024 / 1024).toFixed(1)} MB`
    setOcrFile({ name: file.name, size })
    setOcrStep('uploading')
    setTimeout(() => {
      setOcrStep('scanning')
      setTimeout(() => {
        setOcrData({ ...OCR_EXTRACTED, numero: 'AUTO-2026-' + Math.floor(1000 + Math.random() * 9000) })
        setOcrStep('done')
      }, 2500)
    }, 1200)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    processFile(e.dataTransfer.files[0])
  }, [])

  function openModal() {
    setShowModal(true); setOcrStep('idle'); setOcrFile(null); setOcrData(null); setSubmitted(false)
  }

  function handleSubmit() {
    setSubmitted(true)
    setTimeout(() => { setShowModal(false); setOcrStep('idle'); setOcrFile(null); setOcrData(null); setSubmitted(false) }, 2000)
  }

  return (
    <>
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Pólizas</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">{MOCK_POLICIES.length} pólizas en cartera</p>
        </div>
        <button onClick={openModal} className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
          <Plus size={15} />
          Nueva póliza
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiCards.map(kpi => (
          <button key={kpi.id} onClick={() => setKpiModal(kpi.id)}
            className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex flex-col gap-3 text-left hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', kpi.bg)}>
              <kpi.icon size={16} style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-[22px] leading-none" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-[12px] text-[#6B7280] mt-1">{kpi.label}</p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">{kpi.sub}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="relative max-w-xs">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar pólizas..."
          className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.15)] placeholder:text-[#9CA3AF]" />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(policy => {
          const status = STATUS_MAP[policy.status] || { label: policy.status, variant: 'default' as const }
          return (
            <Link key={policy.id} href={`/agent/polizas/${policy.id}`}
              className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex items-center gap-4 cursor-pointer hover:scale-[1.01] transition-transform duration-150">
              <div className="w-11 h-11 rounded-xl bg-[#F7941D]/12 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-[#F7941D]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <ClientLink name={policy.clientName} plain className="text-[14px] text-[#1A1F2B]" />
                  <Badge label={status.label} variant={status.variant} size="sm" />
                </div>
                <p className="text-[12px] text-[#6B7280] truncate">{policy.type} · {policy.insurer}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{policy.policyNumber} · Vence {policy.endDate}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] text-[#F7941D]">{policy.premium}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Prima</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Modal nueva póliza con OCR */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20 sticky top-0 bg-[#EFF2F9] rounded-t-3xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <FileCheck size={15} className="text-[#F7941D]" />
                </div>
                <p className="text-[15px] text-[#1A1F2B]">Cargar póliza</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Zona PDF */}
              <div>
                <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide mb-2">Carátula de póliza (PDF)</p>
                <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden"
                  onChange={e => processFile(e.target.files?.[0] || null)} />

                {ocrStep === 'idle' && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onClick={() => fileRef.current?.click()}
                    className={cn('border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all',
                      dragging ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-[#D1D5DB] hover:border-[#F7941D]/50')}>
                    <div className="w-14 h-14 rounded-2xl bg-[#F7941D]/10 flex items-center justify-center">
                      <Upload size={26} className="text-[#F7941D]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[14px] text-[#1A1F2B]">Arrastra el PDF de la carátula</p>
                      <p className="text-[11px] text-[#9CA3AF] mt-1">o haz clic para seleccionar · PDF, JPG, PNG</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EFF2F9] rounded-xl shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[11px] text-[#F7941D]">
                      <Scan size={12} /> OCR extrae datos automáticamente
                    </div>
                  </div>
                )}

                {(ocrStep === 'uploading' || ocrStep === 'scanning') && (
                  <div className="border-2 border-[#F7941D]/40 rounded-2xl p-5 bg-[#F7941D]/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F7941D]/15 flex items-center justify-center">
                        <FileText size={16} className="text-[#F7941D]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-[#1A1F2B] truncate">{ocrFile?.name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{ocrFile?.size}</p>
                      </div>
                      <Loader2 size={16} className="text-[#F7941D] animate-spin" />
                    </div>
                    <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden mb-2">
                      <div className={cn('h-full rounded-full bg-[#F7941D] transition-all duration-700', ocrStep === 'scanning' ? 'w-3/4' : 'w-1/4')} />
                    </div>
                    <p className="text-[11px] text-[#F7941D] text-center">
                      {ocrStep === 'uploading' ? 'Subiendo PDF...' : 'Leyendo carátula · Extrayendo datos de póliza...'}
                    </p>
                  </div>
                )}

                {ocrStep === 'done' && ocrData && (
                  <div className="border-2 border-[#69A481]/30 rounded-2xl p-4 bg-[#69A481]/5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle size={13} className="text-[#69A481]" />
                      <p className="text-[12px] text-[#69A481]">Datos extraídos del PDF</p>
                      <button onClick={() => { setOcrStep('idle'); setOcrFile(null); setOcrData(null) }} className="ml-auto text-[11px] text-[#9CA3AF] hover:text-[#F7941D]">Cambiar</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(ocrData).map(([k, v]) => (
                        <div key={k} className="bg-white/60 rounded-xl p-2.5">
                          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{k}</p>
                          <input
                            defaultValue={v}
                            className="text-[12px] text-[#1A1F2B] bg-transparent outline-none w-full mt-0.5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {ocrStep !== 'done' && (
                <p className="text-[11px] text-[#9CA3AF] text-center">
                  Sube el PDF primero para completar los datos automáticamente con OCR
                </p>
              )}

              <button
                onClick={ocrStep === 'done' ? handleSubmit : () => fileRef.current?.click()}
                disabled={submitted || ocrStep === 'uploading' || ocrStep === 'scanning'}
                className={cn('w-full py-3.5 rounded-xl text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50',
                  submitted ? 'bg-[#69A481]' : 'bg-[#F7941D] hover:bg-[#E8820A] shadow-[0_4px_12px_rgba(247,148,29,0.3)]')}>
                {submitted ? <><CheckCircle size={15} /> Póliza registrada</> : ocrStep === 'done' ? 'Guardar póliza' : 'Seleccionar PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Modal */}
      {kpiModal && (() => {
        const data = kpiModalData[kpiModal]
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
            <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
              <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20 sticky top-0 bg-[#EFF2F9] rounded-t-3xl z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                    <FileText size={15} className="text-[#F7941D]" />
                  </div>
                  <p className="text-[15px] text-[#1A1F2B]">{data.title}</p>
                  <span className="px-2 py-0.5 rounded-full bg-[#F7941D]/10 text-[11px] text-[#F7941D]">{data.records.length}</span>
                </div>
                <button onClick={() => setKpiModal(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                  <X size={13} />
                </button>
              </div>
              {kpiModal === 'tipo' && (
                <div className="px-5 pt-4 grid grid-cols-3 gap-2">
                  {Object.entries(byType).map(([ramo, cnt]) => (
                    <div key={ramo} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-center">
                      <p className="text-[18px] text-[#F7941D]">{cnt}</p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">{ramo}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="p-5 flex flex-col gap-2">
                {data.records.length === 0 ? (
                  <p className="text-center text-[13px] text-[#9CA3AF] py-6">No hay pólizas en esta categoría.</p>
                ) : data.records.map((p: any) => (
                  <div key={p.id} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F7941D]/10 flex items-center justify-center shrink-0">
                      <FileText size={13} className="text-[#F7941D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#1A1F2B] truncate">{p.clientName}</p>
                      <p className="text-[11px] text-[#6B7280] truncate">{p.type} · {p.insurer}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[12px] text-[#F7941D]">{p.premium}</p>
                      <p className="text-[10px] text-[#9CA3AF]">Vence {p.endDate}</p>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px]',
                      p.status === 'activa' || p.status === 'vigente' ? 'bg-[#69A481]/15 text-[#69A481]' :
                      p.status === 'pendiente' ? 'bg-[#F7941D]/15 text-[#F7941D]' :
                      'bg-[#7C1F31]/15 text-[#7C1F31]')}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}
    </div>
    </>
  )
}
