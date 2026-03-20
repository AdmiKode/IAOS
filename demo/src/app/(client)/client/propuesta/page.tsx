'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, Check, Shield, User, MapPin, Heart, CreditCard, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const DATOS_MOCK = {
  nombre: 'María Elena',
  apellidos: 'González Ramírez',
  fechaNacimiento: '14/03/1985',
  sexo: 'Femenino',
  rfc: 'GORM850314AB3',
  estadoCivil: 'Casada',
  telefono: '55 1234 5678',
  email: 'maria.gonzalez@email.com',
  domicilio: 'Av. Insurgentes Sur 1234, Col. Del Valle, CP 03100, Ciudad de México',
  ocupacion: 'Médico General',
  sumaAsegurada: '$3,000,000',
  deducible: '$10,000',
  coaseguro: '15%',
  beneficiario: 'Carlos González Ruiz (Cónyuge, 100%)',
  formaPago: 'Mensual — Cargo a tarjeta de crédito',
}

const PLANES_MOCK: Record<string, { plan: string; aseguradora: string; prima: string; color: string }> = {
  'esencial': { plan: 'GMM Esencial', aseguradora: 'GNP Seguros', prima: '$1,890/mes', color: '#6B7280' },
  'plus': { plan: 'GMM Plus', aseguradora: 'BUPA México', prima: '$2,640/mes', color: '#F7941D' },
  'premium': { plan: 'GMM Premium Elite', aseguradora: 'AXA Seguros', prima: '$4,200/mes', color: '#69A481' },
  'colectivo-basico': { plan: 'Colectivo Base', aseguradora: 'Metlife México', prima: '$890/emp/mes', color: '#6B7280' },
  'colectivo-empresarial': { plan: 'Empresarial Plus', aseguradora: 'GNP Seguros', prima: '$1,490/emp/mes', color: '#F7941D' },
  'colectivo-premium': { plan: 'Colectivo Premium', aseguradora: 'BUPA México', prima: '$2,200/emp/mes', color: '#69A481' },
}

const SECCIONES = [
  {
    id: 'contratante', icon: User, label: 'Datos del Contratante',
    filas: [
      ['Nombre completo', `${DATOS_MOCK.nombre} ${DATOS_MOCK.apellidos}`],
      ['Fecha de nacimiento', DATOS_MOCK.fechaNacimiento],
      ['Sexo', DATOS_MOCK.sexo],
      ['RFC', DATOS_MOCK.rfc],
      ['Estado civil', DATOS_MOCK.estadoCivil],
    ],
  },
  {
    id: 'contacto', icon: MapPin, label: 'Contacto y Domicilio',
    filas: [
      ['Teléfono celular', DATOS_MOCK.telefono],
      ['Correo electrónico', DATOS_MOCK.email],
      ['Domicilio', DATOS_MOCK.domicilio],
    ],
  },
  {
    id: 'cobertura', icon: Shield, label: 'Cobertura Contratada',
    filas: [
      ['Suma asegurada', DATOS_MOCK.sumaAsegurada],
      ['Deducible', DATOS_MOCK.deducible],
      ['Coaseguro', DATOS_MOCK.coaseguro],
      ['Ocupación', DATOS_MOCK.ocupacion],
    ],
  },
  {
    id: 'beneficiarios', icon: Heart, label: 'Beneficiarios',
    filas: [
      ['Beneficiario principal', DATOS_MOCK.beneficiario],
    ],
  },
  {
    id: 'pago', icon: CreditCard, label: 'Forma de Pago',
    filas: [
      ['Forma de pago', DATOS_MOCK.formaPago],
    ],
  },
]

const PASOS = ['Propuesta', 'Firma digital', 'Pago', 'Confirmación']

function PropuestaContent() {
  const router = useRouter()
  const params = useSearchParams()
  const tipo = params.get('tipo') || 'gmm-individual'
  const planId = params.get('plan') || 'plus'
  const planInfo = PLANES_MOCK[planId] || PLANES_MOCK['plus']

  const [expandidas, setExpandidas] = useState<Record<string, boolean>>({ contratante: true })

  function toggle(id: string) {
    setExpandidas(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">

      {/* Header portal */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full overflow-hidden">
              <Image src="/Icono xoria.png" alt="XORIA" width={20} height={20} className="object-cover w-full h-full" />
            </div>
            <span className="text-[11px] text-[#F7941D] font-semibold tracking-[0.2em] uppercase">Portal del Asegurado</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Resumen de tu propuesta</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Revisa los datos capturados antes de proceder a la firma digital.</p>
        </div>
      </div>

      {/* Progreso */}
      <div className="flex items-center gap-0 overflow-x-auto bg-[#EFF2F9] rounded-2xl px-5 py-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        {PASOS.map((paso, i) => (
          <div key={paso} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1 px-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold',
                i === 0 ? 'bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.4)]' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)]'
              )}>
                {i === 0 ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn('text-[10px] whitespace-nowrap', i === 0 ? 'text-[#F7941D] font-semibold' : 'text-[#9CA3AF]')}>{paso}</span>
            </div>
            {i < PASOS.length - 1 && <div className="w-8 h-px bg-[#D1D5DB] shrink-0" />}
          </div>
        ))}
      </div>

      {/* Card del plan */}
      <div className="rounded-2xl p-5 flex items-center justify-between shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.16)]"
        style={{ background: `linear-gradient(135deg, ${planInfo.color}12, ${planInfo.color}06)`, border: `1px solid ${planInfo.color}30` }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${planInfo.color}20` }}>
            <Shield size={22} style={{ color: planInfo.color }} />
          </div>
          <div>
            <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest">{planInfo.aseguradora}</p>
            <h3 className="text-[17px] text-[#1A1F2B] font-bold">{planInfo.plan}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[22px] font-bold" style={{ color: planInfo.color }}>{planInfo.prima}</p>
          <p className="text-[10px] text-[#9CA3AF]">Prima estimada</p>
        </div>
      </div>

      {/* Secciones de datos */}
      <div className="flex flex-col gap-3">
        {SECCIONES.map(sec => {
          const Icon = sec.icon
          const open = expandidas[sec.id]
          return (
            <div key={sec.id} className="bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] overflow-hidden">
              <button
                onClick={() => toggle(sec.id)}
                className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-[#EFF2F9]/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                    <Icon size={14} className="text-[#F7941D]" />
                  </div>
                  <span className="text-[13px] text-[#1A1F2B] font-semibold">{sec.label}</span>
                </div>
                {open ? <ChevronUp size={14} className="text-[#9CA3AF]" /> : <ChevronDown size={14} className="text-[#9CA3AF]" />}
              </button>
              {open && (
                <div className="px-5 pb-4">
                  <div className="flex flex-col gap-2">
                    {sec.filas.map(([label, valor]) => (
                      <div key={label} className="flex items-start justify-between gap-4 py-2 border-t border-[#E5E7EB]">
                        <span className="text-[12px] text-[#9CA3AF] shrink-0">{label}</span>
                        <span className="text-[12px] text-[#1A1F2B] font-medium text-right">{valor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Aviso de privacidad */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <div className="flex items-start gap-3">
          <FileText size={16} className="text-[#F7941D] mt-0.5 shrink-0" />
          <div>
            <h3 className="text-[13px] text-[#1A1F2B] font-semibold mb-2">Aviso de Privacidad y Consentimiento</h3>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Los datos personales proporcionados son tratados conforme a la Ley Federal de Protección de Datos Personales
              en Posesión de los Particulares (LFPDPPP). El responsable del tratamiento es la agencia de seguros representada
              por el agente que gestiona esta solicitud. Los datos se utilizarán exclusivamente para la cotización,
              emisión y administración de la póliza de gastos médicos mayores. El titular tiene derecho de Acceso,
              Rectificación, Cancelación y Oposición (derechos ARCO).
            </p>
            <p className="text-[11px] text-[#6B7280] leading-relaxed mt-2">
              Al continuar con la firma digital, el asegurado declara que los datos son verídicos y otorga su consentimiento
              expreso para el tratamiento de datos personales, incluyendo datos de salud considerados como datos sensibles,
              en términos del Código de Comercio y la LFPDPPP.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)]">
        <div>
          <p className="text-[13px] text-[#1A1F2B] font-semibold">¿Todo correcto?</p>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Avanza a la firma digital para formalizar la solicitud.</p>
        </div>
        <button
          onClick={() => router.push(`/client/firma?tipo=${tipo}&plan=${planId}`)}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[13px] font-semibold text-white transition-all duration-200 hover:scale-[1.03] whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 6px 20px rgba(247,148,29,0.35)' }}
        >
          Ir a firma digital
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default function PropuestaPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-[#9CA3AF]">Cargando propuesta...</div>}>
      <PropuestaContent />
    </Suspense>
  )
}
