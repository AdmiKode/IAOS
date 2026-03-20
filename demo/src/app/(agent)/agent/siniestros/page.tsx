'use client'
import { useState, useRef, useCallback } from 'react'
import { MOCK_SINIESTROS, MOCK_POLICIES } from '@/data/mock'
import { AlertTriangle, CheckCircle, Clock, FileText, Upload, X, Plus, Camera, Scan, Loader2, Download, ExternalLink, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ClientLink } from '@/components/ui'

const STATUS_COLOR: Record<string, string> = {
  en_proceso: '#F7941D', cerrado: '#69A481', abierto: '#7C1F31'
}

const TIPO_COLOR: Record<string, string> = {
  'Robo de vehículo': '#7C1F31',
  'Daño a terceros': '#F7941D',
  'Muerte accidental': '#7C1F31',
  'Incendio': '#F7941D',
  'Responsabilidad civil': '#6B7280',
  default: '#6B7280'
}

export default function SiniestrosPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [docModal, setDocModal] = useState<string | null>(null)
  const [descargado, setDescargado] = useState<string | null>(null)

  // — Modal nuevo siniestro —
  const [ocrStep, setOcrStep] = useState<'idle' | 'uploading' | 'scanning' | 'done'>('idle')
  const [ocrFile, setOcrFile] = useState<{ name: string; size: string } | null>(null)
  const [ocrData, setOcrData] = useState<Record<string, string> | null>(null)
  const [formData, setFormData] = useState({ cliente: '', poliza: '', tipo: '', monto: '', descripcion: '' })
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = filterStatus ? MOCK_SINIESTROS.filter(s => s.status === filterStatus) : MOCK_SINIESTROS
  const selectedSiniestro = selected ? MOCK_SINIESTROS.find(s => s.id === selected) : null

  const kpis = [
    { label: 'Total', val: MOCK_SINIESTROS.length, color: '#6B7280' },
    { label: 'En proceso', val: MOCK_SINIESTROS.filter(s => s.status === 'en_proceso').length, color: '#F7941D' },
    { label: 'Cerrados', val: MOCK_SINIESTROS.filter(s => s.status === 'cerrado').length, color: '#69A481' },
    { label: 'Monto total', val: '$' + MOCK_SINIESTROS.reduce((acc, s) => acc + parseInt(s.monto.replace(/\D/g, '') || '0'), 0).toLocaleString(), color: '#7C1F31' },
  ]

  // Simular proceso OCR al subir evidencia
  function simulateOCR(fileName: string, fileSize: string) {
    setOcrFile({ name: fileName, size: fileSize })
    setOcrStep('uploading')
    setOcrData(null)
    setTimeout(() => {
      setOcrStep('scanning')
      setTimeout(() => {
        // Datos extraídos por OCR simulado
        setOcrData({
          poliza: 'AUTO-2024-0291',
          aseguradora: 'GNP Seguros',
          tipo: 'Colisión / Daño a terceros',
          monto: '$24,500',
          fecha: new Date().toLocaleDateString('es-MX'),
          descripcion: 'Colisión frontal en intersección. Daños en parachoque y cofre. Sin lesionados. Se adjunta acta del MP y fotografías del lugar.',
        })
        setFormData(prev => ({
          ...prev,
          poliza: 'AUTO-2024-0291',
          tipo: 'Colisión / Daño a terceros',
          monto: '$24,500',
          descripcion: 'Colisión frontal en intersección. Daños en parachoque y cofre. Sin lesionados.',
        }))
        setOcrStep('done')
      }, 2200)
    }, 1200)
  }

  function handleFileChange(file: File | null) {
    if (!file) return
    const size = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / 1024 / 1024).toFixed(1)} MB`
    simulateOCR(file.name, size)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileChange(file)
  }, [])

  function handleSubmit() {
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setShowForm(false)
      setOcrStep('idle')
      setOcrFile(null)
      setOcrData(null)
      setFormData({ cliente: '', poliza: '', tipo: '', monto: '', descripcion: '' })
    }, 2000)
  }

  function openModal() {
    setShowForm(true)
    setOcrStep('idle')
    setOcrFile(null)
    setOcrData(null)
    setFormData({ cliente: '', poliza: '', tipo: '', monto: '', descripcion: '' })
    setSubmitted(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.color}15` }}>
              <AlertTriangle size={14} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-[18px] leading-tight font-medium" style={{ color: k.color }}>{k.val}</p>
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros + acción */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {[null, 'en_proceso', 'cerrado'].map(s => (
            <button key={String(s)} onClick={() => setFilterStatus(s)}
              className="text-[12px] px-3 py-1.5 rounded-xl transition-all"
              style={{
                background: filterStatus === s ? `${STATUS_COLOR[s || ''] || '#6B7280'}15` : 'transparent',
                color: filterStatus === s ? STATUS_COLOR[s || ''] || '#1A1F2B' : '#9CA3AF',
                border: `1px solid ${filterStatus === s ? STATUS_COLOR[s || ''] || '#D1D5DB' : '#D1D5DB'}`
              }}>
              {s === null ? 'Todos' : s === 'en_proceso' ? 'En proceso' : 'Cerrados'}
            </button>
          ))}
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_3px_10px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-all">
          <Plus size={13} />
          Nuevo siniestro
        </button>
      </div>

      {/* Layout: lista + ficha */}
      <div className="flex gap-4">
        {/* Lista */}
        <div className={cn('flex flex-col gap-3', selectedSiniestro ? 'hidden md:flex md:w-[45%]' : 'w-full')}>
          {filtered.map(s => {
            const tipoColor = TIPO_COLOR[s.tipo] || TIPO_COLOR.default
            const isActive = selected === s.id
            return (
              <button key={s.id} onClick={() => setSelected(isActive ? null : s.id)}
                className={cn('w-full text-left bg-[#EFF2F9] rounded-2xl p-5 transition-all',
                  isActive ? 'shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)]' : 'shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] hover:shadow-[-7px_-7px_16px_#FAFBFF,7px_7px_16px_rgba(22,27,29,0.18)]')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${tipoColor}15` }}>
                      <AlertTriangle size={16} style={{ color: tipoColor }} />
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] text-[#1A1F2B]">{s.tipo}</p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        <ClientLink name={s.clientName} plain className="text-[11px] text-[#9CA3AF]" /> · {s.aseguradora}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-xl shrink-0"
                    style={{ background: `${STATUS_COLOR[s.status] || '#9CA3AF'}15`, color: STATUS_COLOR[s.status] || '#9CA3AF' }}>
                    {s.status === 'en_proceso' ? 'En proceso' : s.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 text-[11px] text-[#9CA3AF]">
                  <span>Póliza: {s.policyNumber}</span>
                  <span className="text-[#F7941D]">{s.monto}</span>
                </div>
                {/* Mini timeline */}
                <div className="mt-3 flex gap-1.5">
                  {(s.timeline as any[])?.slice(0, 4).map((ev: any, i: number) => (
                    <div key={i} className="flex-1 h-1 rounded-full"
                      style={{ background: STATUS_COLOR[ev.status] || '#D1D5DB' }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Ficha siniestro */}
        {selectedSiniestro && (
          <div className="flex-1 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] flex flex-col gap-4 md:max-h-[calc(100vh-160px)] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] text-[#1A1F2B]">{selectedSiniestro.tipo}</p>
                <p className="text-[12px] text-[#9CA3AF]">
                  <ClientLink name={selectedSiniestro.clientName} plain className="text-[12px] text-[#9CA3AF]" />
                  {' '}· {(selectedSiniestro as any).fechaOcurrencia || selectedSiniestro.fecha}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>

            {/* Datos clave */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Aseguradora', val: selectedSiniestro.aseguradora },
                { label: 'Póliza', val: selectedSiniestro.policyNumber },
                { label: 'Monto reclamado', val: selectedSiniestro.monto },
                { label: 'Estado', val: selectedSiniestro.status === 'en_proceso' ? 'En proceso' : selectedSiniestro.status },
              ].map(item => (
                <div key={item.label} className="bg-white/40 rounded-xl p-3">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{item.label}</p>
                  <p className="text-[13px] text-[#1A1F2B]">{item.val}</p>
                </div>
              ))}
            </div>

            {/* Descripción */}
            <div className="bg-white/40 rounded-xl p-3">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1">Descripción</p>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">{selectedSiniestro.descripcion}</p>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-[12px] text-[#1A1F2B] mb-3">Seguimiento del siniestro</p>
              <div className="relative flex flex-col">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#D1D5DB]/50" />
                {((selectedSiniestro.timeline as any[]) || []).map((ev: any, i: number) => {
                  const evColor = STATUS_COLOR[ev.status] || '#9CA3AF'
                  return (
                    <div key={ev.id || i} className="flex items-start gap-3 pl-6 pb-4 relative">
                      <div className="absolute left-0 w-[19px] h-[19px] rounded-full flex items-center justify-center"
                        style={{ background: `${evColor}20`, border: `2px solid ${evColor}` }}>
                        {ev.status === 'cerrado' ? <CheckCircle size={9} style={{ color: evColor }} /> : <Clock size={9} style={{ color: evColor }} />}
                      </div>
                      <div>
                        <p className="text-[12px] text-[#1A1F2B]">{ev.label}</p>
                        {ev.nota && <p className="text-[11px] text-[#6B7280]">{ev.nota}</p>}
                        <p className="text-[10px] text-[#9CA3AF]">{ev.fecha}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Documentos */}
            <div>
              <p className="text-[12px] text-[#1A1F2B] mb-2">Documentos adjuntos</p>
              <div className="flex flex-col gap-2">
                {['Acta de siniestro.pdf', 'Fotos del incidente.zip', 'Dictamen aseguradora.pdf'].map(doc => (
                  <div key={doc} className="flex items-center gap-2 bg-white/40 rounded-xl p-2.5">
                    <FileText size={13} className="text-[#9CA3AF]" />
                    <p className="text-[12px] text-[#6B7280] flex-1">{doc}</p>
                    <button onClick={() => setDocModal(doc)} className="text-[10px] text-[#F7941D] hover:underline font-semibold">Ver</button>
                  </div>
                ))}
                <button className="flex items-center gap-2 text-[12px] text-[#9CA3AF] hover:text-[#F7941D] transition-colors mt-1">
                  <Upload size={13} />
                  Subir documento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal visor de documento */}
      {docModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.6)', backdropFilter: 'blur(12px)' }} onClick={() => setDocModal(null)}>
          <div className="w-full max-w-lg bg-[#EFF2F9] rounded-3xl shadow-[0_24px_80px_rgba(22,27,29,0.4)] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[#F7941D]" />
                <p className="text-white font-bold text-[13px] truncate">{docModal}</p>
              </div>
              <button onClick={() => setDocModal(null)} className="w-7 h-7 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"><X size={14} /></button>
            </div>
            {/* Simulación de visor PDF */}
            <div className="mx-5 my-4 bg-white rounded-2xl shadow-[inset_-2px_-2px_5px_#f0f0f0,inset_2px_2px_5px_rgba(0,0,0,0.07)] overflow-hidden" style={{ minHeight: 260 }}>
              <div className="bg-[#F3F4F6] px-4 py-2 flex items-center gap-2 border-b border-[#E5E7EB]">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#FC5C5C]" /><div className="w-2.5 h-2.5 rounded-full bg-[#FDBC40]" /><div className="w-2.5 h-2.5 rounded-full bg-[#34C749]" /></div>
                <p className="text-[10px] text-[#9CA3AF] flex-1 text-center truncate">{docModal}</p>
                <ExternalLink size={11} className="text-[#9CA3AF]" />
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-0.5">DOCUMENTO OFICIAL</p>
                    <p className="text-[16px] font-bold text-[#1A1F2B]">{docModal.replace('.pdf', '').replace('.zip', '')}</p>
                  </div>
                  <div className="w-10 h-10 bg-[#7C1F31]/10 rounded-xl flex items-center justify-center">
                    <AlertTriangle size={16} className="text-[#7C1F31]" />
                  </div>
                </div>
                <div className="border-t border-[#E5E7EB] pt-3 flex flex-col gap-1.5">
                  {['Asegurado: Ana López García', 'Póliza: AUTO-2024-0291', 'Siniestro: SIN-2024-001', 'Fecha: 15 Mar 2026', 'Aseguradora: GNP Seguros'].map(line => (
                    <div key={line} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#9CA3AF]" />
                      <p className="text-[11px] text-[#6B7280]">{line}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F9FAFB] rounded-xl p-3 mt-1">
                  <div className="h-2 bg-[#E5E7EB] rounded-full mb-2 w-full" />
                  <div className="h-2 bg-[#E5E7EB] rounded-full mb-2 w-4/5" />
                  <div className="h-2 bg-[#E5E7EB] rounded-full mb-2 w-3/4" />
                  <div className="h-2 bg-[#E5E7EB] rounded-full w-1/2" />
                </div>
                <p className="text-[10px] text-[#9CA3AF] text-center italic">Documento simulado para fines de demostración</p>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-2">
              <button onClick={() => setDocModal(null)} className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B] transition-all">Cerrar</button>
              <button onClick={() => { setDescargado(docModal); setTimeout(() => setDescargado(null), 3000) }}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                style={{ background: descargado === docModal ? 'linear-gradient(135deg,#69A481,#4d8060)' : 'linear-gradient(135deg,#1A1F2B,#2D3548)' }}>
                {descargado === docModal ? <><Check size={12} /> Descargado</> : <><Download size={12} /> Descargar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nuevo siniestro con OCR */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20 sticky top-0 bg-[#EFF2F9] rounded-t-3xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#7C1F31]/10 flex items-center justify-center">
                  <AlertTriangle size={15} className="text-[#7C1F31]" />
                </div>
                <p className="text-[15px] text-[#1A1F2B]">Apertura de siniestro</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Zona de carga de evidencia / OCR */}
              <div>
                <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide mb-2">Evidencia del siniestro</p>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={e => handleFileChange(e.target.files?.[0] || null)} />

                {ocrStep === 'idle' && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all',
                      dragging ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-[#D1D5DB] hover:border-[#F7941D]/50 hover:bg-[#F7941D]/3'
                    )}>
                    <div className="w-12 h-12 rounded-2xl bg-[#F7941D]/10 flex items-center justify-center">
                      <Camera size={22} className="text-[#F7941D]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] text-[#1A1F2B]">Arrastra fotos o PDF de evidencia</p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">O haz clic para seleccionar · JPG, PNG, PDF</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EFF2F9] rounded-xl shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[11px] text-[#F7941D]">
                      <Scan size={12} />
                      OCR automático activado
                    </div>
                  </div>
                )}

                {(ocrStep === 'uploading' || ocrStep === 'scanning') && (
                  <div className="border-2 border-[#F7941D]/40 rounded-2xl p-5 bg-[#F7941D]/5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F7941D]/15 flex items-center justify-center">
                        <FileText size={16} className="text-[#F7941D]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-[#1A1F2B] truncate">{ocrFile?.name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{ocrFile?.size}</p>
                      </div>
                      <Loader2 size={16} className="text-[#F7941D] animate-spin" />
                    </div>
                    <div className="w-full h-1.5 bg-[#EFF2F9] rounded-full shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.10)] overflow-hidden">
                      <div className={cn('h-full rounded-full bg-[#F7941D] transition-all duration-700', ocrStep === 'scanning' ? 'w-[70%]' : 'w-[30%]')} />
                    </div>
                    <p className="text-[11px] text-[#F7941D] text-center">
                      {ocrStep === 'uploading' ? 'Subiendo archivo...' : 'Procesando OCR · Extrayendo datos de evidencia...'}
                    </p>
                  </div>
                )}

                {ocrStep === 'done' && ocrData && (
                  <div className="border-2 border-[#69A481]/40 rounded-2xl p-4 bg-[#69A481]/5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle size={14} className="text-[#69A481]" />
                      <p className="text-[12px] text-[#69A481]">OCR completado · Datos extraídos automáticamente</p>
                      <button onClick={() => fileInputRef.current?.click()} className="ml-auto text-[11px] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">Cambiar</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(ocrData).filter(([k]) => k !== 'descripcion').map(([key, val]) => (
                        <div key={key} className="bg-white/50 rounded-xl p-2">
                          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{key}</p>
                          <p className="text-[11px] text-[#1A1F2B] mt-0.5">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Formulario */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'cliente', label: 'Cliente / Asegurado', placeholder: 'Nombre del cliente', full: true },
                  { key: 'poliza', label: 'Número de póliza', placeholder: 'POL-00000' },
                  { key: 'tipo', label: 'Tipo de siniestro', placeholder: 'Colisión, robo, incendio...' },
                  { key: 'monto', label: 'Monto estimado', placeholder: '$0.00' },
                ].map(f => (
                  <div key={f.key} className={f.full ? 'col-span-2' : ''}>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">{f.label}</label>
                    <input
                      value={formData[f.key as keyof typeof formData]}
                      onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Descripción del siniestro</label>
                <textarea rows={3}
                  value={formData.descripcion}
                  onChange={e => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Describe lo ocurrido con el mayor detalle posible..."
                  className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[13px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={submitted}
                className={cn('w-full py-3.5 rounded-xl text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2',
                  submitted ? 'bg-[#69A481] shadow-[0_4px_12px_rgba(105,164,129,0.3)]' : 'bg-[#F7941D] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A]')}>
                {submitted ? <><CheckCircle size={15} /> Siniestro registrado</> : 'Registrar siniestro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
