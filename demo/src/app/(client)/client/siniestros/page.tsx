'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Plus, Camera, Scan, Loader2, CheckCircle, X, Upload, Phone, MessageCircle, AlertTriangle, Mic, MicOff, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type OcrStep = 'idle' | 'uploading' | 'scanning' | 'done'

const MOCK_CASES = [
  { id: '#SIN-2026-0021', tipo: 'Daños a terceros', poliza: 'AUTO-2024-0089', fecha: '12 Mar 2026', estado: 'En revisión', color: '#F7941D' },
]

// Datos de contacto simulados (en producción vendrían del perfil del agente/aseguradora)
const ASEGURADORA_800 = '8001234567'
const AGENTE_TEL = '3312345678'
const AGENTE_NOMBRE = 'Juan Pérez'

function genCase() {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `#SIN-2026-${n}`
}

export default function ClientSiniestrosPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [ocrStep, setOcrStep] = useState<OcrStep>('idle')
  const [ocrFile, setOcrFile] = useState<string | null>(null)
  const [ocrFiles, setOcrFiles] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [caseNum, setCaseNum] = useState('')
  const [form, setForm] = useState({ tipo: '', descripcion: '', fecha: '', poliza: '' })
  const [submitted, setSubmitted] = useState(false)
  const [recording, setRecording] = useState(false)
  const [audioNote, setAudioNote] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const multiFileRef = useRef<HTMLInputElement>(null)

  function openModal() {
    setOcrStep('idle'); setOcrFile(null); setOcrFiles([]); setDragging(false)
    setCaseNum(''); setSubmitted(false); setRecording(false); setAudioNote(null)
    setForm({ tipo: '', descripcion: '', fecha: '', poliza: '' })
    setShowModal(true)
  }

  function processFile(file: File) {
    setOcrFile(file.name)
    setOcrStep('uploading')
    setTimeout(() => {
      setOcrStep('scanning')
      setTimeout(() => {
        setOcrStep('done')
        setForm({ tipo: 'Daños materiales', descripcion: 'Colisión detectada en evidencia fotográfica. Daños en zona delantera. Sin lesionados visibles.', fecha: new Date().toISOString().split('T')[0], poliza: 'AUTO-2024-0089' })
      }, 2200)
    }, 1200)
  }

  function handleMultiFiles(files: FileList) {
    const names = Array.from(files).map(f => f.name)
    setOcrFiles(prev => [...prev, ...names])
    if (files[0]) processFile(files[0])
  }

  function toggleAudio() {
    if (recording) {
      setRecording(false)
      setAudioNote('Nota de voz · 0:12')
    } else {
      setRecording(true)
      setTimeout(() => {
        setRecording(false)
        setAudioNote('Nota de voz · 0:08')
      }, 8000)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const files = e.dataTransfer.files
    if (files.length) handleMultiFiles(files)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit() {
    setCaseNum(genCase())
    setSubmitted(true)
    setTimeout(() => setShowModal(false), 2500)
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      <div>
        <h2 className="text-[18px] text-[#1A1F2B] tracking-wide">Siniestros</h2>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">Reportes y seguimiento</p>
      </div>

      {/* Card cobertura activa */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#69A481]/12 flex items-center justify-center shrink-0">
            <Shield size={20} className="text-[#69A481]" />
          </div>
          <div>
            <p className="text-[14px] text-[#1A1F2B] font-semibold">Tu cobertura está activa</p>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">¿Ocurrió un incidente? Actúa rápido:</p>
          </div>
        </div>

        {/* 4 acciones de siniestro */}
        <div className="grid grid-cols-2 gap-3">
          {/* 1. Llamar aseguradora 800 */}
          <a
            href={`tel:${ASEGURADORA_800}`}
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl bg-[#7C1F31]/8 border border-[#7C1F31]/20 text-center transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#7C1F31]/12">
              <Phone size={18} className="text-[#7C1F31]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#7C1F31]">Llamar aseguradora</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">800 123 4567 · 24/7</p>
            </div>
          </a>

          {/* 2. Llamar al agente */}
          <a
            href={`tel:${AGENTE_TEL}`}
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl bg-[#F7941D]/8 border border-[#F7941D]/20 text-center transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F7941D]/12">
              <Phone size={18} className="text-[#F7941D]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#F7941D]">Llamar a mi agente</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{AGENTE_NOMBRE}</p>
            </div>
          </a>

          {/* 3. Mensaje al agente */}
          <button
            onClick={() => router.push('/client/mensajes')}
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl bg-[#69A481]/8 border border-[#69A481]/20 text-center transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#69A481]/12">
              <MessageCircle size={18} className="text-[#69A481]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#69A481]">Mensaje al agente</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Chat interno IAOS</p>
            </div>
          </button>

          {/* 4. Reportar con evidencias */}
          <button
            onClick={openModal}
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl bg-[#1A1F2B]/5 border border-[#1A1F2B]/10 text-center transition-all active:scale-95 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.18)]"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1A1F2B]/8">
              <AlertTriangle size={18} className="text-[#1A1F2B]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#1A1F2B]">Reportar siniestro</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Fotos, audio y OCR</p>
            </div>
          </button>
        </div>
      </div>

      {/* Casos existentes */}
      {MOCK_CASES.length > 0 && (
        <div>
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-2 px-1">Mis reportes</p>
          {MOCK_CASES.map(c => (
            <div key={c.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.12)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}18` }}>
                <Shield size={16} style={{ color: c.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#1A1F2B] font-medium">{c.id}</p>
                <p className="text-[11px] text-[#9CA3AF]">{c.tipo} · {c.poliza} · {c.fecha}</p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg font-medium" style={{ background: `${c.color}18`, color: c.color }}>{c.estado}</span>
            </div>
          ))}
        </div>
      )}

      {/* Modal — Reportar siniestro con evidencias */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(26,31,43,0.6)', backdropFilter: 'blur(12px)' }}>
          <div className="bg-[#EFF2F9] rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)] max-h-[90dvh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20 sticky top-0 bg-[#EFF2F9] z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#7C1F31]/10 flex items-center justify-center">
                  <Camera size={15} className="text-[#7C1F31]" />
                </div>
                <div>
                  <p className="text-[15px] text-[#1A1F2B] font-semibold">Reportar siniestro</p>
                  <p className="text-[11px] text-[#9CA3AF]">Sube evidencias y describe el incidente</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#69A481]/15 flex items-center justify-center">
                    <CheckCircle size={32} className="text-[#69A481]" />
                  </div>
                  <p className="text-[15px] text-[#1A1F2B] font-semibold">Reporte enviado</p>
                  <p className="text-[26px] font-bold text-[#F7941D]">{caseNum}</p>
                  <p className="text-[12px] text-[#9CA3AF]">Tu agente recibirá las evidencias y te contactará en menos de 24 hrs</p>
                </div>
              ) : (
                <>
                  {/* Sección evidencias — Fotos/Video */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">Evidencia fotográfica / video</label>
                      {ocrFiles.length > 0 && (
                        <span className="text-[10px] text-[#F7941D] font-semibold">{ocrFiles.length} archivo{ocrFiles.length > 1 ? 's' : ''}</span>
                      )}
                    </div>
                    <div
                      onDrop={handleDrop}
                      onDragOver={e => { e.preventDefault(); setDragging(true) }}
                      onDragLeave={() => setDragging(false)}
                      onClick={() => ocrStep === 'idle' && multiFileRef.current?.click()}
                      className={cn('rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 py-5 cursor-pointer',
                        dragging ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-[#D1D5DB]/40 hover:border-[#F7941D]/50')}>
                      {ocrStep === 'idle' && (
                        <>
                          <div className="flex gap-2">
                            <ImageIcon size={20} className="text-[#9CA3AF]" />
                            <Upload size={20} className="text-[#9CA3AF]" />
                          </div>
                          <p className="text-[12px] text-[#9CA3AF]">Arrastra fotos/video o toca para seleccionar</p>
                          <p className="text-[10px] text-[#C4C9D4]">Múltiples archivos · JPG, PNG, MP4, MOV</p>
                        </>
                      )}
                      {ocrStep === 'uploading' && (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 size={22} className="text-[#F7941D] animate-spin" />
                          <p className="text-[12px] text-[#F7941D]">Subiendo {ocrFile}...</p>
                          <div className="w-40 h-1.5 bg-[#D1D5DB]/30 rounded-full overflow-hidden">
                            <div className="h-full bg-[#F7941D] rounded-full" style={{ width: '60%', transition: 'width 1.2s ease' }} />
                          </div>
                        </div>
                      )}
                      {ocrStep === 'scanning' && (
                        <div className="flex flex-col items-center gap-2">
                          <Scan size={22} className="text-[#7C1F31] animate-pulse" />
                          <p className="text-[12px] text-[#7C1F31]">Analizando evidencia con IA (OCR)...</p>
                          <div className="w-40 h-1.5 bg-[#D1D5DB]/30 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7C1F31] rounded-full" style={{ width: '80%', transition: 'width 2.2s ease' }} />
                          </div>
                        </div>
                      )}
                      {ocrStep === 'done' && (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle size={22} className="text-[#69A481]" />
                          <p className="text-[12px] text-[#69A481] font-medium">IA detectó y pre-llenó los datos del siniestro</p>
                          <p className="text-[10px] text-[#9CA3AF]">Revisa y ajusta si es necesario</p>
                        </div>
                      )}
                    </div>
                    <input ref={multiFileRef} type="file" accept="image/*,video/*" multiple className="hidden"
                      onChange={e => { if (e.target.files?.length) handleMultiFiles(e.target.files) }} />
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
                  </div>

                  {/* Nota de voz */}
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-2 block">Nota de voz (descripción hablada)</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleAudio}
                        className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all',
                          recording
                            ? 'bg-[#7C1F31] text-white shadow-[0_4px_12px_rgba(124,31,49,0.4)] animate-pulse'
                            : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B]'
                        )}
                      >
                        {recording ? <MicOff size={14} /> : <Mic size={14} />}
                        {recording ? 'Detener grabación' : 'Grabar nota de voz'}
                      </button>
                      {audioNote && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#69A481]/10 border border-[#69A481]/20">
                          <Mic size={12} className="text-[#69A481]" />
                          <span className="text-[11px] text-[#69A481] font-medium">{audioNote}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Campos del formulario */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Tipo de siniestro', key: 'tipo', placeholder: 'Ej. Robo, daños, accidente...' },
                      { label: 'Fecha del incidente', key: 'fecha', placeholder: 'YYYY-MM-DD' },
                      { label: 'Póliza afectada', key: 'poliza', placeholder: 'Núm. póliza' },
                    ].map(f => (
                      <div key={f.key} className={f.key === 'tipo' ? 'col-span-2' : ''}>
                        <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">{f.label}</label>
                        <input value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[12px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                      </div>
                    ))}
                    <div className="col-span-2">
                      <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Descripción del incidente</label>
                      <textarea rows={3} value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                        placeholder="Describe qué ocurrió, dónde y cómo..."
                        className="w-full bg-[#EFF2F9] px-3 py-2.5 text-[12px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                    </div>
                  </div>

                  {/* Contacto rápido dentro del modal */}
                  <div className="flex gap-2 pt-1">
                    <a href={`tel:${ASEGURADORA_800}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#7C1F31]/20 bg-[#7C1F31]/6 text-[11px] font-semibold text-[#7C1F31] transition-all active:scale-95">
                      <Phone size={12} />Llamar 800
                    </a>
                    <a href={`tel:${AGENTE_TEL}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#F7941D]/20 bg-[#F7941D]/6 text-[11px] font-semibold text-[#F7941D] transition-all active:scale-95">
                      <Phone size={12} />Llamar agente
                    </a>
                    <button onClick={() => { setShowModal(false); router.push('/client/mensajes') }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#69A481]/20 bg-[#69A481]/6 text-[11px] font-semibold text-[#69A481] transition-all active:scale-95">
                      <MessageCircle size={12} />Mensaje
                    </button>
                  </div>

                  <button onClick={handleSubmit} disabled={!form.tipo || !form.descripcion}
                    className="w-full py-3.5 rounded-xl bg-[#7C1F31] text-white text-[13px] font-semibold tracking-wide hover:bg-[#6A1A29] transition-colors shadow-[0_4px_14px_rgba(124,31,49,0.35)] disabled:opacity-40 disabled:cursor-not-allowed">
                    Enviar reporte al agente
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
