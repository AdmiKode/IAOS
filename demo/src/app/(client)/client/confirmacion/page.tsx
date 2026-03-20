'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  CheckCircle2, Download, ArrowRight, Loader2, Shield, FileText,
  Clock, Star, Share2, Home
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PLANES: Record<string, { nombre: string; aseguradora: string; color: string }> = {
  gnp: { nombre: 'GNP Esencial', aseguradora: 'GNP Seguros', color: '#0057A8' },
  bupa: { nombre: 'BUPA National Plus', aseguradora: 'BUPA México', color: '#003DA5' },
  axa: { nombre: 'AXA Premium', aseguradora: 'AXA Seguros', color: '#00008F' },
  metlife: { nombre: 'MetLife Grupal', aseguradora: 'MetLife México', color: '#3E86B4' },
  gnp_col: { nombre: 'GNP Colectivo Plus', aseguradora: 'GNP Seguros', color: '#0057A8' },
  bupa_col: { nombre: 'BUPA Empresarial', aseguradora: 'BUPA México', color: '#003DA5' },
}

const DOCS_EXPEDIENTE = [
  { id: 'solicitud', label: 'Solicitud firmada', desc: 'Formato oficial MEX-SSEG-V24.01' },
  { id: 'id_oficial', label: 'Identificación oficial', desc: 'INE / Pasaporte validado' },
  { id: 'comprobante_dom', label: 'Comprobante de domicilio', desc: 'Verificado · Reciente' },
  { id: 'firma', label: 'Firma electrónica', desc: 'Art. 89 Código de Comercio' },
  { id: 'consentimiento', label: 'Consentimiento LFPDPPP', desc: 'Aviso de privacidad aceptado' },
  { id: 'pago', label: 'Recibo de primer pago', desc: 'Prima inicial registrada' },
]

const PASOS_EMISION = [
  { label: 'Solicitud recibida', done: true, desc: 'Datos completos y verificados' },
  { label: 'Firma digital validada', done: true, desc: 'Hash registrado en blockchain' },
  { label: 'Pago autorizado', done: true, desc: 'Cargo procesado exitosamente' },
  { label: 'En proceso de emisión', done: false, active: true, desc: 'La aseguradora está generando tu póliza' },
  { label: 'Póliza emitida', done: false, desc: 'Recibirás el número de póliza por correo' },
]

function ConfirmacionContent() {
  const router = useRouter()
  const params = useSearchParams()
  const tipo = params.get('tipo') || 'gmm-individual'
  const planId = params.get('plan') || 'bupa'
  const monto = params.get('monto') || '2,640'
  const periodo = params.get('periodo') || 'mensual'
  const plan = PLANES[planId] || PLANES['bupa']

  const [animado, setAnimado] = useState(false)
  const [noPol] = useState(`GMM-${Date.now().toString().slice(-8).toUpperCase()}`)
  const [fecha] = useState(new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }))
  const vigenciaFin = new Date(); vigenciaFin.setFullYear(vigenciaFin.getFullYear() + 1)
  const vigenciaStr = vigenciaFin.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })

  useEffect(() => {
    const t = setTimeout(() => setAnimado(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#EFF2F9]">
      {/* Header */}
      <div className="bg-[#EFF2F9] border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between shadow-[0_2px_8px_rgba(22,27,29,0.06)]">
        <div className="flex items-center gap-2">
          <Image src="/Icono xoria.png" alt="IAOS" width={22} height={22} className="object-cover rounded-full" onError={() => {}} />
          <span className="text-[13px] text-[#1A1F2B] font-semibold">Portal del Asegurado</span>
        </div>
        <button onClick={() => router.push('/agent/dashboard')}
          className="flex items-center gap-1.5 text-[11px] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
          <Home size={12} /> Ir al dashboard
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">

        {/* ✅ Success hero */}
        <div className={cn('bg-[#EFF2F9] rounded-3xl p-8 text-center shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.13)] transition-all duration-700', animado ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute w-20 h-20 rounded-full bg-[#69A481]/15 animate-ping" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#69A481] to-[#4d8060] flex items-center justify-center shadow-[0_8px_24px_rgba(105,164,129,0.45)]">
              <CheckCircle2 size={30} className="text-white" />
            </div>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold mb-1">¡Solicitud completada!</h1>
          <p className="text-[13px] text-[#6B7280] mb-4">Tu póliza está en proceso de emisión con {plan.aseguradora}.</p>
          <div className="inline-flex items-center gap-2 bg-[#69A481]/10 border border-[#69A481]/20 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-[#69A481] animate-pulse" />
            <span className="text-[11px] text-[#69A481] font-semibold">Recibirás confirmación por correo en 24-48 hrs hábiles</span>
          </div>
        </div>

        {/* Número de solicitud */}
        <div className={cn('bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] transition-all duration-700 delay-100', animado ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-0.5">Número de solicitud</p>
              <p className="text-[18px] font-bold text-[#1A1F2B] font-mono tracking-wider">{noPol}</p>
            </div>
            <button className="flex items-center gap-1.5 text-[10px] text-[#F7941D] hover:opacity-75 transition-opacity">
              <Share2 size={11} /> Compartir
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Plan', value: plan.nombre },
              { label: 'Aseguradora', value: plan.aseguradora },
              { label: 'Tipo', value: tipo === 'gmm-colectivo' ? 'GMM Colectivo' : 'GMM Individual' },
              { label: 'Prima', value: `MXN $${Number(monto).toLocaleString()} / ${periodo === 'anual' ? 'año' : 'mes'}` },
              { label: 'Fecha de inicio', value: fecha },
              { label: 'Vigencia hasta', value: vigenciaStr },
            ].map(item => (
              <div key={item.label} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
                <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
                <p className="text-[12px] text-[#1A1F2B] font-semibold mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progreso de emisión */}
        <div className={cn('bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] transition-all duration-700 delay-200', animado ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-3">Proceso de emisión</p>
          <div className="flex flex-col gap-2">
            {PASOS_EMISION.map((paso, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-0 mt-0.5">
                  <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                    paso.done ? 'bg-[#69A481]' : paso.active ? 'bg-[#F7941D] shadow-[0_0_10px_rgba(247,148,29,0.4)]' : 'bg-[#E5E7EB]')}>
                    {paso.done ? <CheckCircle2 size={11} className="text-white" /> : paso.active ? <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />}
                  </div>
                  {i < PASOS_EMISION.length - 1 && <div className={cn('w-0.5 h-4 mt-0.5', paso.done ? 'bg-[#69A481]' : 'bg-[#E5E7EB]')} />}
                </div>
                <div className="pb-1">
                  <p className={cn('text-[12px] font-semibold', paso.done ? 'text-[#1A1F2B]' : paso.active ? 'text-[#F7941D]' : 'text-[#9CA3AF]')}>{paso.label}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expediente completo */}
        <div className={cn('bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] transition-all duration-700 delay-300', animado ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-semibold">Expediente digital</p>
            <span className="text-[9px] text-[#69A481] font-bold px-2 py-0.5 rounded-full bg-[#69A481]/10 border border-[#69A481]/20">6/6 documentos</span>
          </div>
          <div className="flex flex-col gap-2">
            {DOCS_EXPEDIENTE.map(doc => (
              <div key={doc.id} className="flex items-center justify-between py-2 border-b border-[#F0F0F0] last:border-0">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={13} className="text-[#69A481] shrink-0" />
                  <div>
                    <p className="text-[11px] text-[#1A1F2B] font-medium">{doc.label}</p>
                    <p className="text-[9px] text-[#9CA3AF]">{doc.desc}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[10px] text-[#6B7280] hover:text-[#F7941D] transition-colors">
                  <Download size={11} />
                </button>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full py-2.5 rounded-xl text-[12px] text-[#6B7280] font-semibold border border-[#E5E7EB] hover:border-[#F7941D]/30 hover:text-[#F7941D] transition-all flex items-center justify-center gap-2">
            <Download size={13} /> Descargar expediente completo (PDF)
          </button>
        </div>

        {/* XORIA cierre */}
        <div className={cn('bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] rounded-2xl p-5 transition-all duration-700 delay-[400ms]', animado ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
              <Image src="/Icono xoria.png" alt="XORIA" width={36} height={36} className="object-cover w-full h-full" onError={() => {}} />
            </div>
            <div>
              <p className="text-[12px] text-white font-semibold mb-1">XORIA · Resumen del proceso</p>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Excelente trabajo. Completamos la solicitud oficial, generamos la cotización, obtuvimos la firma digital y procesamos el primer pago — todo en una sola sesión.
                El expediente queda registrado en el sistema. Recibirás el número de póliza en cuanto {plan.aseguradora} emita la cobertura.
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-[#F7941D] fill-[#F7941D]" />)}
                <span className="text-[10px] text-white/50 ml-1">Proceso completo</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs finales */}
        <div className={cn('grid grid-cols-2 gap-3 transition-all duration-700 delay-500', animado ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
          <button onClick={() => router.push('/agent/nueva-venta')}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-[12px] font-semibold hover:scale-[1.02] transition-all"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 6px 20px rgba(247,148,29,0.35)' }}>
            Nueva venta <ArrowRight size={12} />
          </button>
          <button onClick={() => router.push('/agent/dashboard')}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[#1A1F2B] text-[12px] font-semibold bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:scale-[1.02] transition-all">
            <Home size={12} /> Dashboard
          </button>
        </div>

        <p className="text-center text-[9px] text-[#9CA3AF] pb-2">
          Insurance Agent OS · © 2026 Live Kode® · Documento generado el {fecha}
        </p>
      </div>
    </div>
  )
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#EFF2F9]">
        <Loader2 size={20} className="animate-spin text-[#F7941D]" />
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  )
}
