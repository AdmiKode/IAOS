'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Check, Shield, Star, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const OPCIONES_GMM_INDIVIDUAL = [
  {
    id: 'esencial',
    aseguradora: 'GNP Seguros',
    plan: 'GMM Esencial',
    prima_mensual: '$1,890',
    prima_anual: '$21,480',
    suma_asegurada: '$1,000,000',
    deducible: '$20,000',
    coaseguro: '20%',
    tope_coaseguro: '$30,000',
    highlight: false,
    tag: null,
    beneficios: [
      'Hospitalización ilimitada',
      'Médicos especialistas en red',
      'Urgencias en todo el país',
      'Medicamentos en hospitalización',
      'Maternidad (tiempo de espera 10 meses)',
    ],
    exclusiones: ['Preexistencias', 'Enf. congénitas', 'Salud mental'],
    color: '#6B7280',
    colorBg: 'rgba(107,114,128,0.07)',
  },
  {
    id: 'plus',
    aseguradora: 'BUPA México',
    plan: 'GMM Plus',
    prima_mensual: '$2,640',
    prima_anual: '$29,880',
    suma_asegurada: '$3,000,000',
    deducible: '$10,000',
    coaseguro: '15%',
    tope_coaseguro: '$20,000',
    highlight: true,
    tag: 'Más elegido',
    beneficios: [
      'Hospitalización ilimitada',
      'Red nacional + privados',
      'Médicos a domicilio incluidos',
      'Salud mental (10 sesiones/año)',
      'Reembolso en el extranjero',
      'Odontología de urgencias',
    ],
    exclusiones: ['Preexistencias conocidas'],
    color: '#F7941D',
    colorBg: 'rgba(247,148,29,0.07)',
  },
  {
    id: 'premium',
    aseguradora: 'AXA Seguros',
    plan: 'GMM Premium Elite',
    prima_mensual: '$4,200',
    prima_anual: '$47,040',
    suma_asegurada: 'Ilimitada',
    deducible: '$5,000',
    coaseguro: '10%',
    tope_coaseguro: '$10,000',
    highlight: false,
    tag: 'Mayor cobertura',
    beneficios: [
      'Suma asegurada ilimitada',
      'Cobertura internacional total',
      'Check-up anual incluido',
      'Salud mental sin límite',
      'Repatriación incluida',
      'Segunda opinión médica',
      'Médico virtual 24/7',
    ],
    exclusiones: [],
    color: '#69A481',
    colorBg: 'rgba(105,164,129,0.07)',
  },
]

const OPCIONES_GMM_COLECTIVO = [
  {
    id: 'colectivo-basico',
    aseguradora: 'Metlife México',
    plan: 'Colectivo Base',
    prima_mensual: '$890 /empleado',
    prima_anual: '$10,080 /empleado',
    suma_asegurada: '$500,000',
    deducible: '$10,000',
    coaseguro: '20%',
    tope_coaseguro: '$20,000',
    highlight: false,
    tag: null,
    beneficios: ['Hospitalización', 'Urgencias', 'Maternidad básica'],
    exclusiones: ['Preexistencias', 'Enf. congénitas'],
    color: '#6B7280',
    colorBg: 'rgba(107,114,128,0.07)',
  },
  {
    id: 'colectivo-empresarial',
    aseguradora: 'GNP Seguros',
    plan: 'Empresarial Plus',
    prima_mensual: '$1,490 /empleado',
    prima_anual: '$16,800 /empleado',
    suma_asegurada: '$2,000,000',
    deducible: '$5,000',
    coaseguro: '15%',
    tope_coaseguro: '$15,000',
    highlight: true,
    tag: 'Más solicitado',
    beneficios: ['Hospitalización', 'Red amplia', 'Dependientes incluidos', 'Dental básico', 'Salud mental'],
    exclusiones: ['Preexistencias graves'],
    color: '#F7941D',
    colorBg: 'rgba(247,148,29,0.07)',
  },
  {
    id: 'colectivo-premium',
    aseguradora: 'BUPA México',
    plan: 'Colectivo Premium',
    prima_mensual: '$2,200 /empleado',
    prima_anual: '$24,600 /empleado',
    suma_asegurada: 'Ilimitada',
    deducible: '$3,000',
    coaseguro: '10%',
    tope_coaseguro: '$8,000',
    highlight: false,
    tag: 'Mayor cobertura',
    beneficios: ['Suma ilimitada', 'Cobertura global', 'Dental completo', 'Bienestar', 'Check-up anual', 'Médico virtual 24/7'],
    exclusiones: [],
    color: '#69A481',
    colorBg: 'rgba(105,164,129,0.07)',
  },
]

function CotizacionContent() {
  const router = useRouter()
  const params = useSearchParams()
  const tipo = params.get('tipo') || 'gmm-individual'
  const opciones = tipo === 'gmm-colectivo' ? OPCIONES_GMM_COLECTIVO : OPCIONES_GMM_INDIVIDUAL
  const tipoLabel = tipo === 'gmm-colectivo' ? 'GMM Colectivo' : 'GMM Individual'

  const [seleccionada, setSeleccionada] = useState<string | null>(null)
  const [expandida, setExpandida] = useState<string | null>(opciones[1].id)

  function handleSeleccionar() {
    if (!seleccionada) return
    router.push(`/client/propuesta?tipo=${tipo}&plan=${seleccionada}`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.14)] text-[#6B7280] hover:text-[#1A1F2B]"
        >
          <ArrowLeft size={14} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-5 h-5 rounded-full overflow-hidden">
              <Image src="/Icono xoria.png" alt="XORIA" width={20} height={20} className="object-cover w-full h-full" />
            </div>
            <span className="text-[11px] text-[#F7941D] font-semibold tracking-[0.2em] uppercase">XORIA · Cotizador</span>
          </div>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold tracking-tight">Opciones de {tipoLabel}</h1>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">
            Con base en la información capturada, aquí están las opciones más adecuadas.
          </p>
        </div>
      </div>

      {/* Banner XORIA */}
      <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-[0_4px_12px_rgba(247,148,29,0.3)]">
          <Image src="/Icono xoria.png" alt="XORIA" width={40} height={40} className="object-cover w-full h-full" />
        </div>
        <p className="text-[12px] text-white/80 leading-relaxed flex-1">
          <span className="text-[#F7941D] font-semibold">XORIA analizó el perfil capturado</span> y generó 3 opciones comparables.
          Con esta información ya puedo preparar la propuesta formal para firma digital. Selecciona la opción preferida.
        </p>
      </div>

      {/* Paso actual en el flujo */}
      <div className="flex items-center gap-0 overflow-x-auto">
        {['Tipo', 'Captura', 'Cotización', 'Revisión', 'Firma', 'Pago', 'Expediente'].map((step, i) => (
          <div key={step} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1 px-2">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold',
                i < 2 ? 'bg-[#69A481] text-white' : i === 2 ? 'bg-[#F7941D] text-white shadow-[0_4px_12px_rgba(247,148,29,0.4)]' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)]'
              )}>
                {i < 2 ? <Check size={12} /> : i + 1}
              </div>
              <span className={cn('text-[9px] whitespace-nowrap', i <= 2 ? 'text-[#1A1F2B]' : 'text-[#9CA3AF]')}>{step}</span>
            </div>
            {i < 6 && <div className={cn('w-5 h-px shrink-0', i < 2 ? 'bg-[#69A481]' : 'bg-[#D1D5DB]')} />}
          </div>
        ))}
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {opciones.map(op => {
          const isSelected = seleccionada === op.id
          const isExpanded = expandida === op.id
          return (
            <div
              key={op.id}
              className={cn(
                'rounded-2xl border transition-all duration-200 overflow-hidden',
                isSelected
                  ? 'shadow-[-6px_-6px_16px_#FAFBFF,6px_6px_16px_rgba(22,27,29,0.22)] scale-[1.02]'
                  : 'shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]'
              )}
              style={{
                background: isSelected ? op.colorBg : '#EFF2F9',
                borderColor: isSelected ? op.color : 'transparent',
              }}
            >
              {/* Tag */}
              {op.tag && (
                <div className="px-4 py-1.5 text-center text-[10px] font-bold tracking-widest uppercase text-white"
                  style={{ background: op.color }}>
                  {op.highlight && <Star size={9} className="inline mr-1 -mt-px" />}
                  {op.tag}
                </div>
              )}

              <div className="p-5">
                {/* Aseguradora + plan */}
                <div className="mb-4">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">{op.aseguradora}</p>
                  <h3 className="text-[15px] text-[#1A1F2B] font-bold mt-0.5">{op.plan}</h3>
                </div>

                {/* Prima */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[28px] font-bold leading-none" style={{ color: op.color }}>{op.prima_mensual}</span>
                    <span className="text-[11px] text-[#9CA3AF]">/mes</span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{op.prima_anual} al año</p>
                </div>

                {/* Datos clave */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: 'Suma asegurada', value: op.suma_asegurada },
                    { label: 'Deducible', value: op.deducible },
                    { label: 'Coaseguro', value: op.coaseguro },
                    { label: 'Tope coaseguro', value: op.tope_coaseguro },
                  ].map(item => (
                    <div key={item.label} className="bg-[#EFF2F9] rounded-xl px-2.5 py-2 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.08)]">
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
                      <p className="text-[12px] text-[#1A1F2B] font-semibold mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Beneficios colapsables */}
                <button
                  onClick={() => setExpandida(isExpanded ? null : op.id)}
                  className="flex items-center justify-between w-full text-[11px] text-[#6B7280] mb-2 hover:text-[#1A1F2B] transition-colors"
                >
                  <span>Beneficios ({op.beneficios.length})</span>
                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                {isExpanded && (
                  <div className="flex flex-col gap-1.5 mb-3">
                    {op.beneficios.map(b => (
                      <div key={b} className="flex items-start gap-2">
                        <Check size={11} className="mt-0.5 shrink-0" style={{ color: op.color }} />
                        <span className="text-[11px] text-[#6B7280]">{b}</span>
                      </div>
                    ))}
                    {op.exclusiones.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#E5E7EB]">
                        <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider mb-1">Excluye</p>
                        {op.exclusiones.map(e => (
                          <p key={e} className="text-[10px] text-[#9CA3AF]">• {e}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Botón seleccionar */}
                <button
                  onClick={() => setSeleccionada(op.id)}
                  className={cn(
                    'w-full py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                    isSelected
                      ? 'text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]'
                      : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B]'
                  )}
                  style={isSelected ? { background: op.color } : {}}
                >
                  {isSelected ? <><Check size={13} /> Seleccionada</> : 'Seleccionar opción'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer acción */}
      <div className="flex items-center justify-between bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)]">
        <div>
          {seleccionada ? (
            <>
              <p className="text-[13px] text-[#1A1F2B] font-semibold">
                Opción seleccionada: {opciones.find(o => o.id === seleccionada)?.plan}
              </p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                XORIA preparará la propuesta y la enviará al asegurado para revisión y firma digital.
              </p>
            </>
          ) : (
            <p className="text-[13px] text-[#6B7280]">Selecciona una opción para continuar al portal del asegurado.</p>
          )}
        </div>
        <button
          onClick={handleSeleccionar}
          disabled={!seleccionada}
          className={cn(
            'flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[13px] font-semibold text-white transition-all duration-200 whitespace-nowrap',
            seleccionada ? 'hover:scale-[1.03]' : 'opacity-40 cursor-not-allowed'
          )}
          style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: seleccionada ? '0 6px 20px rgba(247,148,29,0.35)' : 'none' }}
        >
          Enviar al asegurado
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default function CotizacionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-[#9CA3AF]">Generando cotización...</div>}>
      <CotizacionContent />
    </Suspense>
  )
}
