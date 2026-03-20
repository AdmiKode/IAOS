'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, Check, PenLine, RotateCcw, Shield, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

const PASOS = ['Propuesta', 'Firma digital', 'Pago', 'Confirmación']

function FirmaContent() {
  const router = useRouter()
  const params = useSearchParams()
  const tipo = params.get('tipo') || 'gmm-individual'
  const planId = params.get('plan') || 'plus'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dibujando, setDibujando] = useState(false)
  const [firmado, setFirmado] = useState(false)
  const [tieneFirma, setTieneFirma] = useState(false)
  const [aceptoTerminos, setAceptoTerminos] = useState(false)
  const [aceptoPrivacidad, setAceptoPrivacidad] = useState(false)
  const [timestamp, setTimestamp] = useState('')

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setDibujando(true)
    setTieneFirma(true)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!dibujando) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pos = getPos(e, canvas)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#1A1F2B'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  function stopDraw() { setDibujando(false) }

  function limpiarFirma() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setTieneFirma(false)
    setFirmado(false)
  }

  function confirmarFirma() {
    if (!tieneFirma || !aceptoTerminos || !aceptoPrivacidad) return
    const ts = new Date().toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'medium' })
    setTimestamp(ts)
    setFirmado(true)
  }

  const puedeConfirmar = tieneFirma && aceptoTerminos && aceptoPrivacidad && !firmado

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full overflow-hidden">
            <Image src="/Icono xoria.png" alt="XORIA" width={20} height={20} className="object-cover w-full h-full" />
          </div>
          <span className="text-[11px] text-[#F7941D] font-semibold tracking-[0.2em] uppercase">Portal del Asegurado</span>
        </div>
        <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Firma digital de solicitud</h1>
        <p className="text-[12px] text-[#9CA3AF] mt-0.5">Tu firma tiene validez jurídica conforme al Código de Comercio mexicano.</p>
      </div>

      {/* Progreso */}
      <div className="flex items-center gap-0 overflow-x-auto bg-[#EFF2F9] rounded-2xl px-5 py-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        {PASOS.map((paso, i) => (
          <div key={paso} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1 px-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold',
                i === 0 ? 'bg-[#69A481] text-white' : i === 1 ? 'bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.4)]' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)]'
              )}>
                {i === 0 ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn('text-[10px] whitespace-nowrap', i === 1 ? 'text-[#F7941D] font-semibold' : i === 0 ? 'text-[#69A481]' : 'text-[#9CA3AF]')}>{paso}</span>
            </div>
            {i < PASOS.length - 1 && <div className={cn('w-8 h-px shrink-0', i < 1 ? 'bg-[#69A481]' : 'bg-[#D1D5DB]')} />}
          </div>
        ))}
      </div>

      {/* Documento a firmar */}
      <div className="bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] overflow-hidden">
        <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-5 py-3 flex items-center gap-3">
          <Shield size={16} className="text-[#F7941D]" />
          <p className="text-[13px] text-white font-semibold">Solicitud de Gastos Médicos Mayores</p>
          <Lock size={12} className="text-white/40 ml-auto" />
        </div>
        <div className="px-6 py-5">
          <p className="text-[12px] text-[#6B7280] leading-relaxed">
            Yo, <strong className="text-[#1A1F2B]">María Elena González Ramírez</strong>, declaro bajo protesta de decir verdad que
            la información proporcionada en esta solicitud es verídica y completa. Entiendo que cualquier omisión o falsedad
            puede ser causa de rescisión de la póliza.
          </p>
          <p className="text-[12px] text-[#6B7280] leading-relaxed mt-3">
            Acepto los términos y condiciones del plan <strong className="text-[#1A1F2B]">GMM Plus — BUPA México</strong>,
            con suma asegurada de <strong className="text-[#1A1F2B]">$3,000,000</strong> y prima mensual de
            <strong className="text-[#1A1F2B]"> $2,640</strong>. Autorizo el cargo recurrente a mi método de pago elegido.
          </p>
          <p className="text-[11px] text-[#9CA3AF] mt-3">
            Firma electrónica en términos del Artículo 89 del Código de Comercio de los Estados Unidos Mexicanos.
            Generada el {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
        </div>
      </div>

      {/* Consentimientos */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex flex-col gap-3">
        <p className="text-[12px] text-[#1A1F2B] font-semibold">Consentimientos requeridos</p>
        {[
          { id: 'terminos', label: 'Acepto los términos y condiciones del seguro, condiciones generales y coberturas/exclusiones del plan seleccionado.', state: aceptoTerminos, set: setAceptoTerminos },
          { id: 'privacidad', label: 'Otorgo mi consentimiento expreso para el tratamiento de mis datos personales y datos de salud, conforme al Aviso de Privacidad y la LFPDPPP.', state: aceptoPrivacidad, set: setAceptoPrivacidad },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => item.set(!item.state)}
            className="flex items-start gap-3 text-left w-full"
          >
            <div className={cn(
              'w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200',
              item.state ? 'bg-[#F7941D] border-[#F7941D]' : 'border-[#D1D5DB] bg-[#EFF2F9]'
            )}>
              {item.state && <Check size={11} className="text-white" />}
            </div>
            <span className="text-[12px] text-[#6B7280] leading-relaxed">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Canvas firma */}
      <div className="bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <PenLine size={14} className="text-[#F7941D]" />
            <p className="text-[13px] text-[#1A1F2B] font-semibold">Área de firma</p>
          </div>
          <button onClick={limpiarFirma} className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] hover:text-[#7C1F31] transition-colors">
            <RotateCcw size={11} /> Limpiar
          </button>
        </div>

        {firmado ? (
          <div className="px-5 py-8 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#69A481]/15 flex items-center justify-center">
              <Check size={28} className="text-[#69A481]" />
            </div>
            <p className="text-[15px] text-[#1A1F2B] font-semibold">Firma registrada</p>
            <p className="text-[11px] text-[#9CA3AF] text-center">
              Firmado digitalmente el {timestamp}<br />
              Hash de evidencia: <span className="font-mono text-[#6B7280]">SHA-2a9f...c87d</span>
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#69A481]/10 border border-[#69A481]/20">
              <Lock size={10} className="text-[#69A481]" />
              <span className="text-[10px] text-[#69A481] font-semibold">Firma válida · Documento sellado</span>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4">
            <p className="text-[11px] text-[#9CA3AF] mb-2 text-center">Traza tu firma con el mouse o dedo</p>
            <div className="rounded-xl overflow-hidden border-2 border-dashed border-[#D1D5DB] bg-white/60 cursor-crosshair"
              style={{ touchAction: 'none' }}>
              <canvas
                ref={canvasRef}
                width={600}
                height={150}
                className="w-full"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
            {tieneFirma && (
              <p className="text-[10px] text-[#69A481] text-center mt-2">✓ Firma capturada</p>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)]">
        <div>
          {firmado ? (
            <>
              <p className="text-[13px] text-[#69A481] font-semibold">✓ Solicitud firmada correctamente</p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">Ahora define el método de pago para completar el proceso.</p>
            </>
          ) : (
            <>
              <p className="text-[13px] text-[#1A1F2B] font-semibold">Firma y acepta los términos para continuar</p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                {!aceptoTerminos || !aceptoPrivacidad ? 'Faltan consentimientos por aceptar.' : !tieneFirma ? 'Traza tu firma en el área de arriba.' : 'Listo para confirmar.'}
              </p>
            </>
          )}
        </div>
        {firmado ? (
          <button
            onClick={() => router.push(`/client/pago?tipo=${tipo}&plan=${planId}`)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[13px] font-semibold text-white transition-all duration-200 hover:scale-[1.03] whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#69A481,#4f8060)', boxShadow: '0 6px 20px rgba(105,164,129,0.35)' }}
          >
            Ir a método de pago
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={confirmarFirma}
            disabled={!puedeConfirmar}
            className={cn(
              'flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[13px] font-semibold text-white transition-all duration-200 whitespace-nowrap',
              puedeConfirmar ? 'hover:scale-[1.03]' : 'opacity-40 cursor-not-allowed'
            )}
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: puedeConfirmar ? '0 6px 20px rgba(247,148,29,0.35)' : 'none' }}
          >
            Confirmar firma
            <Check size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function FirmaPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-[#9CA3AF]">Cargando...</div>}>
      <FirmaContent />
    </Suspense>
  )
}
