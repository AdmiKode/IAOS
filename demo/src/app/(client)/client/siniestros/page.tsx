'use client'
import { useState, useRef, useCallback } from 'react'
import { Shield, Plus, Camera, Scan, Loader2, CheckCircle, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

type OcrStep = 'idle' | 'uploading' | 'scanning' | 'done'

const MOCK_CASES = [
  { id: '#SIN-2026-0021', tipo: 'Daños a terceros', poliza: 'AUTO-2024-0089', fecha: '12 Mar 2026', estado: 'En revisión', color: '#F7941D' },
]

function genCase() {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `#SIN-2026-${n}`
}

export default function ClientSiniestrosPage() {
  const [showModal, setShowModal] = useState(false)
  const [ocrStep, setOcrStep] = useState<OcrStep>('idle')
  const [ocrFile, setOcrFile] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [caseNum, setCaseNum] = useState('')
  const [form, setForm] = useState({ tipo: '', descripcion: '', fecha: '', poliza: '' })
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function openModal() {
    setOcrStep('idle'); setOcrFile(null); setDragging(false)
    setCaseNum(''); setSubmitted(false)
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
        setForm({ tipo: 'Daños materiales', descripcion: 'Colisión detectada en evidencia fotográfica', fecha: new Date().toISOString().split('T')[0], poliza: 'AUTO-2024-0089' })
      }, 2200)
    }, 1200)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
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

      {/* CTA */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#69A481]/12 flex items-center justify-center shrink-0">
          <Shield size={22} className="text-[#69A481]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-[#1A1F2B]">Tu cobertura está activa</p>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Reporta incidentes con evidencia fotográfica</p>
        </div>
        <button onClick={openModal} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F7941D] text-white text-[13px] hover:bg-[#E8820A] transition-colors shadow-[0_4px_12px_rgba(247,148,29,0.3)] shrink-0">
          <Plus size={14} />Reportar
        </button>
      </div>

      {/* Casos existentes */}
      {MOCK_CASES.map(c => (
        <div key={c.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.12)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}18` }}>
            <Shield size={16} style={{ color: c.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#1A1F2B]">{c.id}</p>
            <p className="text-[11px] text-[#9CA3AF]">{c.tipo} · {c.fecha}</p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-lg" style={{ background: `${c.color}18`, color: c.color }}>{c.estado}</span>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md shadow-[-16px_-16px_32px_#FAFBFF,16px_16px_32px_rgba(22,27,29,0.22)]">
            <div className="flex items-center justify-between p-5 border-b border-[#D1D5DB]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#7C1F31]/10 flex items-center justify-center">
                  <Camera size={15} className="text-[#7C1F31]" />
                </div>
                <p className="text-[15px] text-[#1A1F2B]">Reportar siniestro</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#7C1F31] transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#69A481]/15 flex items-center justify-center">
                    <CheckCircle size={28} className="text-[#69A481]" />
                  </div>
                  <p className="text-[15px] text-[#1A1F2B]">Caso registrado</p>
                  <p className="text-[22px] text-[#F7941D]">{caseNum}</p>
                  <p className="text-[12px] text-[#9CA3AF]">Tu agente te contactará en menos de 24 hrs</p>
                </div>
              ) : (
                <>
                  {/* Zona de evidencia */}
                  <div>
                    <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-2 block">Evidencia fotográfica</label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={e => { e.preventDefault(); setDragging(true) }}
                      onDragLeave={() => setDragging(false)}
                      onClick={() => ocrStep === 'idle' && fileRef.current?.click()}
                      className={cn('rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 py-5 cursor-pointer',
                        dragging ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-[#D1D5DB]/40 hover:border-[#F7941D]/50')}>
                      {ocrStep === 'idle' && (
                        <>
                          <Upload size={22} className="text-[#9CA3AF]" />
                          <p className="text-[12px] text-[#9CA3AF]">Arrastra foto o toca para seleccionar</p>
                        </>
                      )}
                      {ocrStep === 'uploading' && (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 size={22} className="text-[#F7941D] animate-spin" />
                          <p className="text-[12px] text-[#F7941D]">Subiendo {ocrFile}...</p>
                          <div className="w-40 h-1.5 bg-[#D1D5DB]/30 rounded-full overflow-hidden">
                            <div className="h-full bg-[#F7941D] rounded-full animate-[grow_1.2s_ease-in-out_forwards]" style={{ width: '60%' }} />
                          </div>
                        </div>
                      )}
                      {ocrStep === 'scanning' && (
                        <div className="flex flex-col items-center gap-2">
                          <Scan size={22} className="text-[#7C1F31] animate-pulse" />
                          <p className="text-[12px] text-[#7C1F31]">Analizando evidencia con IA...</p>
                          <div className="w-40 h-1.5 bg-[#D1D5DB]/30 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7C1F31] rounded-full" style={{ width: '80%', transition: 'width 2s ease' }} />
                          </div>
                        </div>
                      )}
                      {ocrStep === 'done' && (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle size={22} className="text-[#69A481]" />
                          <p className="text-[12px] text-[#69A481]">Evidencia analizada · Datos pre-llenados</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
                  </div>

                  {/* Campos */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Tipo de siniestro', key: 'tipo', placeholder: 'Ej. Robo, daños...' },
                      { label: 'Fecha del incidente', key: 'fecha', placeholder: 'YYYY-MM-DD' },
                      { label: 'Póliza afectada', key: 'poliza', placeholder: 'Núm. póliza' },
                    ].map(f => (
                      <div key={f.key} className={f.key === 'tipo' ? 'col-span-2' : ''}>
                        <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">{f.label}</label>
                        <input value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full bg-[#EFF2F9] px-3 py-2 text-[12px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                      </div>
                    ))}
                    <div className="col-span-2">
                      <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Descripción</label>
                      <textarea rows={2} value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                        placeholder="Describe qué ocurrió..."
                        className="w-full bg-[#EFF2F9] px-3 py-2 text-[12px] text-[#1A1F2B] rounded-xl outline-none resize-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
                    </div>
                  </div>

                  <button onClick={handleSubmit} disabled={!form.tipo || !form.descripcion}
                    className="w-full py-3.5 rounded-xl bg-[#7C1F31] text-white text-[13px] font-medium hover:bg-[#6A1A29] transition-colors shadow-[0_4px_12px_rgba(124,31,49,0.3)] disabled:opacity-50">
                    Enviar reporte
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
