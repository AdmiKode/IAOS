'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Clock, AlertCircle,
  FileText, User, MapPin, Heart, Activity, Mic, MicOff, Send,
  Loader2, Shield, Briefcase, Users2
} from 'lucide-react'
import { cn } from '@/lib/utils'

function ZapIcon({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
}

// ─── GRUPOS GMM INDIVIDUAL — campos reales MEX-SSEG-V24.01 ───────────────────
const GRUPOS_GMM_INDIVIDUAL = [
  {
    id: 'cobertura', label: 'Tipo de solicitud', icon: Shield,
    campos: [
      { id: 'tipo_solicitud', label: 'Tipo de solicitud', tipo: 'select', placeholder: '', opciones: ['Póliza nueva', 'Dependiente adicional', 'Cambio de plan'] },
      { id: 'fecha_inicio', label: 'Fecha de inicio de cobertura', tipo: 'date', placeholder: '' },
    ],
  },
  {
    id: 'identificacion', label: 'Identificación del contratante', icon: User,
    campos: [
      { id: 'nombre', label: 'Nombre(s)', tipo: 'text', placeholder: 'Ej. María Elena' },
      { id: 'apellido_paterno', label: 'Apellido paterno', tipo: 'text', placeholder: 'Ej. González' },
      { id: 'apellido_materno', label: 'Apellido materno', tipo: 'text', placeholder: 'Ej. Ramírez' },
      { id: 'fecha_nacimiento', label: 'Fecha de nacimiento', tipo: 'date', placeholder: '' },
      { id: 'sexo', label: 'Sexo', tipo: 'select', placeholder: '', opciones: ['Femenino', 'Masculino'] },
      { id: 'estado_civil', label: 'Estado civil', tipo: 'select', placeholder: '', opciones: ['Soltero(a)', 'Casado(a)', 'Unión libre', 'Divorciado(a)', 'Viudo(a)'] },
      { id: 'nacionalidad', label: 'Nacionalidad', tipo: 'select', placeholder: '', opciones: ['Mexicana', 'Extranjera'] },
      { id: 'rfc', label: 'RFC con homoclave', tipo: 'text', placeholder: 'Ej. GORM850314AB3' },
      { id: 'curp', label: 'CURP', tipo: 'text', placeholder: 'Ej. GORM850314MDFNMR09' },
      { id: 'pais_nacimiento', label: 'País de nacimiento', tipo: 'text', placeholder: 'México' },
    ],
  },
  {
    id: 'domicilio', label: 'Domicilio de residencia', icon: MapPin,
    campos: [
      { id: 'calle', label: 'Calle', tipo: 'text', placeholder: 'Av. Insurgentes Sur' },
      { id: 'num_ext', label: 'No. Exterior', tipo: 'text', placeholder: '1234' },
      { id: 'num_int', label: 'No. Interior', tipo: 'text', placeholder: 'Piso 3 (opcional)' },
      { id: 'colonia', label: 'Colonia', tipo: 'text', placeholder: 'Del Valle' },
      { id: 'municipio', label: 'Municipio / Delegación', tipo: 'text', placeholder: 'Benito Juárez' },
      { id: 'entidad', label: 'Entidad federativa', tipo: 'select', placeholder: '', opciones: ['Ciudad de México','Jalisco','Nuevo León','Estado de México','Puebla','Guanajuato','Veracruz','Chihuahua','Baja California','Sonora','Otro'] },
      { id: 'cp', label: 'Código postal', tipo: 'text', placeholder: '03100' },
      { id: 'telefono', label: 'Teléfono particular', tipo: 'text', placeholder: '55 1234 5678' },
      { id: 'email', label: 'Correo electrónico', tipo: 'text', placeholder: 'nombre@correo.com' },
    ],
  },
  {
    id: 'actividad', label: 'Actividad y origen de recursos', icon: Briefcase,
    campos: [
      { id: 'ocupacion', label: 'Profesión u ocupación', tipo: 'text', placeholder: 'Ej. Médico, Contador, Ingeniero' },
      { id: 'origen_recursos', label: 'Origen de recursos para la prima', tipo: 'select', placeholder: '', opciones: ['Actividad económica','Recursos de cónyuge','Recursos de padre o madre','Herencia/Donación','Pensión/Inversiones','Otro'] },
    ],
  },
  {
    id: 'antecedentes', label: 'Historial médico', icon: Activity,
    campos: [
      { id: 'enf_5anos', label: 'Enfermedad o accidente en últimos 5 años', tipo: 'select', placeholder: '', opciones: ['No', 'Sí — especificar'] },
      { id: 'hospitalizado', label: 'Hospitalizado u operado alguna vez', tipo: 'select', placeholder: '', opciones: ['No', 'Sí — especificar'] },
      { id: 'tratamiento_actual', label: 'Tratamiento médico actual', tipo: 'select', placeholder: '', opciones: ['No', 'Sí — especificar'] },
      { id: 'enf_corazon', label: 'Enf. del corazón o sistema vascular', tipo: 'select', placeholder: '', opciones: ['No', 'Sí — especificar'] },
      { id: 'diabetes', label: 'Diabetes o enf. del sistema endócrino', tipo: 'select', placeholder: '', opciones: ['No', 'Sí — especificar'] },
      { id: 'respiratorio', label: 'Asma, EPOC u enf. respiratoria', tipo: 'select', placeholder: '', opciones: ['No', 'Sí — especificar'] },
      { id: 'fuma', label: '¿Fuma o ha fumado?', tipo: 'select', placeholder: '', opciones: ['No', 'Sí, actualmente', 'Ex fumador(a)'] },
      { id: 'alcohol', label: '¿Ingiere bebidas alcohólicas?', tipo: 'select', placeholder: '', opciones: ['No', 'Ocasionalmente', 'Frecuentemente'] },
    ],
  },
  {
    id: 'beneficiarios', label: 'Beneficiarios', icon: Heart,
    campos: [
      { id: 'benef_nombre', label: 'Nombre del beneficiario principal', tipo: 'text', placeholder: 'Nombre completo' },
      { id: 'benef_parentesco', label: 'Parentesco con el asegurado', tipo: 'select', placeholder: '', opciones: ['Cónyuge','Hijo(a)','Padre','Madre','Hermano(a)','Otro'] },
      { id: 'benef_pct', label: 'Porcentaje asignado', tipo: 'select', placeholder: '', opciones: ['100%','50%','25%'] },
    ],
  },
  {
    id: 'plan', label: 'Plan y suma asegurada', icon: Shield,
    campos: [
      { id: 'zona', label: 'Zona geográfica de atención', tipo: 'select', placeholder: '', opciones: ['Zona 1 (CDMX, GDL, MTY)','Zona 2 (Resto del país)'] },
      { id: 'suma_asegurada', label: 'Suma asegurada', tipo: 'select', placeholder: '', opciones: ['$1,000,000','$3,000,000','$5,000,000','$10,000,000','Ilimitada'] },
      { id: 'deducible', label: 'Deducible', tipo: 'select', placeholder: '', opciones: ['$5,000','$10,000','$14,000','$17,000','$35,000'] },
      { id: 'coaseguro', label: 'Coaseguro', tipo: 'select', placeholder: '', opciones: ['0%','10%','15%','20%'] },
      { id: 'forma_pago', label: 'Periodicidad de pago', tipo: 'select', placeholder: '', opciones: ['Mensual','Trimestral','Semestral','Anual'] },
    ],
  },
]

// ─── GRUPOS GMM COLECTIVO — campos reales Colectivo Centenario ────────────────
const GRUPOS_GMM_COLECTIVO = [
  {
    id: 'empresa', label: 'Datos del proponente (empresa)', icon: Briefcase,
    campos: [
      { id: 'razon_social', label: 'Denominación o Razón Social', tipo: 'text', placeholder: 'Empresa S.A. de C.V.' },
      { id: 'rfc_empresa', label: 'RFC con homoclave', tipo: 'text', placeholder: 'EMP850314AB3' },
      { id: 'actividad_empresa', label: 'Actividad principal de la colectividad', tipo: 'text', placeholder: 'Ej. Servicios tecnológicos' },
      { id: 'nombre_colectividad', label: 'Nombre de la colectividad asegurable', tipo: 'text', placeholder: 'Empleados Corp.' },
    ],
  },
  {
    id: 'contratante', label: 'Representante / Contacto RH', icon: User,
    campos: [
      { id: 'nombre_rep', label: 'Nombre completo del representante', tipo: 'text', placeholder: 'Nombre Apellido' },
      { id: 'cargo', label: 'Cargo en la empresa', tipo: 'text', placeholder: 'Director RH, Gerente, etc.' },
      { id: 'email_rep', label: 'Correo electrónico', tipo: 'text', placeholder: 'rh@empresa.com' },
      { id: 'telefono_rep', label: 'Teléfono de contacto', tipo: 'text', placeholder: '55 0000 0000' },
    ],
  },
  {
    id: 'domicilio_emp', label: 'Domicilio de la empresa', icon: MapPin,
    campos: [
      { id: 'calle_emp', label: 'Calle y número', tipo: 'text', placeholder: 'Av. Reforma 500' },
      { id: 'colonia_emp', label: 'Colonia', tipo: 'text', placeholder: 'Cuauhtémoc' },
      { id: 'cp_emp', label: 'Código postal', tipo: 'text', placeholder: '06600' },
      { id: 'entidad_emp', label: 'Entidad federativa', tipo: 'select', placeholder: '', opciones: ['Ciudad de México','Jalisco','Nuevo León','Estado de México','Otro'] },
    ],
  },
  {
    id: 'colectividad', label: 'Datos de la colectividad', icon: Users2,
    campos: [
      { id: 'num_empleados', label: 'Número de empleados a asegurar', tipo: 'text', placeholder: 'Ej. 25' },
      { id: 'tipo_contratacion', label: 'Tipo de contratación del seguro', tipo: 'select', placeholder: '', opciones: ['Contractuales (Legales)','Voluntarias empresa','Voluntarias empleado','Mixta'] },
      { id: 'dependientes', label: '¿Incluye dependientes?', tipo: 'select', placeholder: '', opciones: ['No','Sí — cónyuge','Sí — hijos','Sí — cónyuge e hijos'] },
      { id: 'pct_contribucion', label: '% que aporta la empresa a la prima', tipo: 'select', placeholder: '', opciones: ['100% empresa','80% empresa / 20% empleado','50% / 50%','Empleado paga el 100%'] },
    ],
  },
  {
    id: 'plan_col', label: 'Plan y cobertura', icon: Shield,
    campos: [
      { id: 'suma_col', label: 'Suma asegurada por empleado', tipo: 'select', placeholder: '', opciones: ['$500,000','$1,000,000','$2,000,000','$5,000,000'] },
      { id: 'deducible_col', label: 'Deducible por evento', tipo: 'select', placeholder: '', opciones: ['$3,000','$5,000','$10,000','$20,000'] },
      { id: 'inicio_vigencia', label: 'Fecha de inicio de vigencia', tipo: 'date', placeholder: '' },
      { id: 'forma_pago_col', label: 'Periodicidad de pago', tipo: 'select', placeholder: '', opciones: ['Mensual','Trimestral','Semestral','Anual'] },
    ],
  },
]

// ─── Preguntas XORIA por campo ────────────────────────────────────────────────
const PREGUNTAS: Record<string, string> = {
  tipo_solicitud: '¿Es una póliza nueva, un dependiente adicional o un cambio de plan?',
  fecha_inicio: '¿Qué fecha deseas como inicio de cobertura?',
  nombre: '¿Cuál es el nombre del asegurado?',
  apellido_paterno: 'Perfecto. ¿Cuál es el apellido paterno?',
  apellido_materno: '¿Y el apellido materno?',
  fecha_nacimiento: '¿Cuál es su fecha de nacimiento?',
  sexo: '¿Cuál es el sexo registrado del asegurado?',
  estado_civil: '¿Cuál es su estado civil actual?',
  nacionalidad: '¿De qué nacionalidad es el asegurado?',
  rfc: '¿Puedes proporcionarme el RFC con homoclave?',
  curp: '¿Tienes el CURP del asegurado a la mano?',
  pais_nacimiento: '¿En qué país nació?',
  calle: '¿Cuál es la calle del domicilio de residencia?',
  num_ext: '¿Número exterior?',
  num_int: '¿Hay número interior? (piso, depto.) — si no, escribe "sin interior"',
  colonia: '¿En qué colonia vive?',
  municipio: '¿Municipio o delegación?',
  entidad: '¿En qué entidad federativa?',
  cp: '¿Código postal?',
  telefono: '¿Teléfono de contacto?',
  email: '¿Correo electrónico del asegurado?',
  ocupacion: '¿Cuál es la profesión u ocupación?',
  origen_recursos: '¿De dónde provienen los recursos para pagar la prima?',
  enf_5anos: '¿Ha padecido alguna enfermedad o accidente en los últimos 5 años?',
  hospitalizado: '¿Ha sido hospitalizado u operado alguna vez?',
  tratamiento_actual: '¿Está bajo algún tratamiento médico actualmente?',
  enf_corazon: '¿Tiene antecedentes de enfermedades del corazón o sistema vascular?',
  diabetes: '¿Padece diabetes, tiroides u otra enfermedad endócrina?',
  respiratorio: '¿Asma, EPOC u otra condición respiratoria?',
  fuma: '¿El asegurado fuma o ha fumado?',
  alcohol: '¿Ingiere bebidas alcohólicas?',
  benef_nombre: '¿Nombre completo del beneficiario principal?',
  benef_parentesco: '¿Qué parentesco tiene con el asegurado?',
  benef_pct: '¿Qué porcentaje le corresponde?',
  zona: '¿En qué zona geográfica se atenderá principalmente?',
  suma_asegurada: '¿Qué suma asegurada deseas contratar?',
  deducible: '¿Qué deducible prefieres?',
  coaseguro: '¿Qué porcentaje de coaseguro aplica?',
  forma_pago: '¿Con qué periodicidad desea pagar?',
  razon_social: '¿Cuál es la denominación o razón social de la empresa?',
  rfc_empresa: '¿Cuál es el RFC con homoclave de la empresa?',
  actividad_empresa: '¿A qué se dedica principalmente la empresa?',
  nombre_colectividad: '¿Con qué nombre se designará el grupo asegurable?',
  nombre_rep: '¿Nombre completo del representante o contacto de RH?',
  cargo: '¿Cuál es su cargo en la empresa?',
  email_rep: '¿Correo electrónico de contacto?',
  telefono_rep: '¿Teléfono directo?',
  calle_emp: '¿Dirección de la empresa?',
  colonia_emp: '¿En qué colonia está la empresa?',
  cp_emp: '¿Código postal de la empresa?',
  entidad_emp: '¿En qué estado está ubicada?',
  num_empleados: '¿Cuántos empleados aproximadamente se van a asegurar?',
  tipo_contratacion: '¿El seguro es contractual, voluntario o mixto?',
  dependientes: '¿Se incluirán dependientes de los empleados?',
  pct_contribucion: '¿Qué porcentaje del costo absorberá la empresa?',
  suma_col: '¿Qué suma asegurada por empleado?',
  deducible_col: '¿Cuál es el deducible por evento?',
  inicio_vigencia: '¿Desde qué fecha inicia la vigencia?',
  forma_pago_col: '¿Con qué periodicidad pagará la empresa?',
}

const DOCUMENTOS_REQUERIDOS = [
  { id: 'id_oficial', label: 'Identificación oficial vigente' },
  { id: 'comprobante_dom', label: 'Comprobante de domicilio' },
  { id: 'rfc_doc', label: 'RFC / CURP' },
  { id: 'solicitud', label: 'Solicitud firmada' },
  { id: 'consentimiento', label: 'Consentimiento datos personales' },
  { id: 'firma_digital', label: 'Firma electrónica' },
]

type StatusDoc = 'pendiente' | 'recibido' | 'validando' | 'observado' | 'completo'
const STATUS_COLOR: Record<StatusDoc, string> = { pendiente: '#9CA3AF', recibido: '#6B7280', validando: '#F7941D', observado: '#7C1F31', completo: '#69A481' }
const STATUS_LABEL: Record<StatusDoc, string> = { pendiente: 'Pendiente', recibido: 'Recibido', validando: 'Validando', observado: 'Observado', completo: 'Completo' }

function getAllCampos(grupos: { campos: { id: string; label: string; tipo: string; placeholder: string; opciones?: string[] }[] }[]) {
  return grupos.flatMap(g => g.campos)
}

function OriginacionContent() {
  const router = useRouter()
  const params = useSearchParams()
  const tipo = params.get('tipo') || 'gmm-individual'
  const grupos = tipo === 'gmm-colectivo' ? GRUPOS_GMM_COLECTIVO : GRUPOS_GMM_INDIVIDUAL
  const tipoLabel = tipo === 'gmm-colectivo' ? 'GMM Colectivo' : 'GMM Individual'
  const allCampos = getAllCampos(grupos)
  const totalCampos = allCampos.length

  const [valores, setValores] = useState<Record<string, string>>({})
  const [campoActual, setCampoActual] = useState(0)
  const [mensajes, setMensajes] = useState<{ from: 'xoria' | 'user'; text: string }[]>([
    { from: 'xoria', text: `Hola, soy XORIA. Voy a guiarte campo por campo para completar la solicitud oficial de **${tipoLabel}**. Cada respuesta se registra automáticamente en el formulario. ¿Empezamos?` },
    { from: 'xoria', text: PREGUNTAS[allCampos[0]?.id] || '¿Cuál es el primer dato?' },
  ])
  const [inputUsuario, setInputUsuario] = useState('')
  const [escuchando, setEscuchando] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [docStatus, setDocStatus] = useState<Record<string, StatusDoc>>({
    id_oficial: 'pendiente', comprobante_dom: 'pendiente', rfc_doc: 'pendiente',
    solicitud: 'pendiente', consentimiento: 'pendiente', firma_digital: 'pendiente',
  })
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const completados = Object.keys(valores).length
  const porcentaje = Math.round((completados / totalCampos) * 100)
  const campoActualObj = allCampos[campoActual]
  const terminado = campoActual >= allCampos.length

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes])

  useEffect(() => {
    const p = porcentaje
    setDocStatus({
      id_oficial: p > 15 ? 'recibido' : 'pendiente',
      comprobante_dom: p > 30 ? 'recibido' : 'pendiente',
      rfc_doc: valores['rfc'] || valores['rfc_empresa'] ? 'completo' : p > 20 ? 'validando' : 'pendiente',
      solicitud: p > 60 ? 'validando' : p > 30 ? 'recibido' : 'pendiente',
      consentimiento: p > 80 ? 'recibido' : 'pendiente',
      firma_digital: p === 100 ? 'recibido' : 'pendiente',
    })
  }, [porcentaje, valores])

  function responder(valor: string) {
    if (!valor.trim() || terminado) return
    setProcesando(true)
    const nuevoValores = { ...valores, [campoActualObj.id]: valor }
    setValores(nuevoValores)
    setMensajes(prev => [...prev, { from: 'user', text: valor }])
    setInputUsuario('')

    setTimeout(() => {
      const sig = campoActual + 1
      const completadosNew = Object.keys(nuevoValores).length
      const pct = Math.round((completadosNew / totalCampos) * 100)
      let confirmacion = `✓ Registrado: **${valor}**`
      if (pct === 25) confirmacion += '\n\n📋 Ya llené el 25% de la solicitud.'
      if (pct === 50) confirmacion += '\n\n🎯 ¡Mitad completada! Seguimos.'
      if (pct === 75) confirmacion += '\n\n⚡ El 75% listo — casi terminamos.'
      if (sig >= allCampos.length) {
        setMensajes(prev => [...prev,
          { from: 'xoria', text: confirmacion },
          { from: 'xoria', text: '✅ **¡Solicitud completa al 100%!** He llenado todos los campos del formato oficial. Con esta información ya puedo generar las opciones de cotización comparables.' },
        ])
        setCampoActual(sig)
      } else {
        const siguienteCampo = allCampos[sig]
        setMensajes(prev => [...prev,
          { from: 'xoria', text: confirmacion },
          { from: 'xoria', text: PREGUNTAS[siguienteCampo.id] || `¿${siguienteCampo.label}?` },
        ])
        setCampoActual(sig)
      }
      setProcesando(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }, 500)
  }

  function saltar() {
    if (terminado) return
    const sig = campoActual + 1
    setMensajes(prev => [...prev,
      { from: 'user', text: '(campo omitido)' },
      { from: 'xoria', text: sig < allCampos.length ? `OK, lo dejamos pendiente. ${PREGUNTAS[allCampos[sig].id] || '¿Siguiente dato?'}` : '✅ Solicitud completada (con algunos campos omitidos).' },
    ])
    setCampoActual(sig)
  }

  const puedeIrCotizacion = porcentaje >= 60

  return (
    <div className="flex flex-col gap-3" style={{ height: 'calc(100vh - 90px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.14)] text-[#6B7280] hover:text-[#1A1F2B]">
            <ArrowLeft size={14} />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <Image src="/Icono xoria.png" alt="XORIA" width={14} height={14} className="object-cover rounded-full" />
              <span className="text-[11px] text-[#F7941D] font-semibold tracking-[0.15em] uppercase">XORIA · Originación</span>
            </div>
            <h1 className="text-[17px] text-[#1A1F2B] font-bold">Solicitud {tipoLabel}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[20px] font-bold text-[#F7941D] leading-none">{porcentaje}%</p>
              <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{completados}/{totalCampos} campos</p>
            </div>
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#E5E7EB" strokeWidth="4" />
              <circle cx="20" cy="20" r="16" fill="none" stroke="#F7941D" strokeWidth="4"
                strokeDasharray={`${porcentaje * 1.005} 100.5`} strokeLinecap="round" />
            </svg>
          </div>
          {puedeIrCotizacion && (
            <button onClick={() => router.push(`/agent/nueva-venta/cotizacion?tipo=${tipo}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[12px] font-semibold hover:scale-[1.03] transition-all"
              style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 4px 14px rgba(247,148,29,0.4)' }}>
              Cotizar <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 3 columnas */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">

        {/* COL 1: Chat XORIA */}
        <div className="col-span-12 lg:col-span-4 flex flex-col bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="text-[12px] text-white font-semibold">XORIA</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#69A481] animate-pulse" />
                <p className="text-[10px] text-white/60">Motor de originación activo</p>
              </div>
            </div>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5 min-h-0">
            {mensajes.map((msg, i) => (
              <div key={i} className={cn('flex gap-2', msg.from === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.from === 'xoria' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mt-0.5">
                    <Image src="/Icono xoria.png" alt="X" width={24} height={24} className="object-cover w-full h-full" />
                  </div>
                )}
                <div className={cn('max-w-[82%] rounded-2xl px-3 py-2.5 text-[12px] leading-relaxed',
                  msg.from === 'xoria' ? 'bg-white/80 text-[#1A1F2B] rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'text-white rounded-tr-sm')}
                  style={msg.from === 'user' ? { background: 'linear-gradient(135deg,#F7941D,#e08019)' } : {}}>
                  {msg.text.split('\n').map((line, j) => <p key={j} className={line === '' ? 'mt-1' : ''}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>)}
                </div>
              </div>
            ))}
            {procesando && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                  <Image src="/Icono xoria.png" alt="X" width={24} height={24} className="object-cover w-full h-full" />
                </div>
                <div className="bg-white/80 rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin text-[#F7941D]" />
                  <span className="text-[11px] text-[#9CA3AF]">Procesando...</span>
                </div>
              </div>
            )}
          </div>
          {campoActualObj?.tipo === 'select' && !procesando && !terminado && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {campoActualObj.opciones?.map(op => (
                <button key={op} onClick={() => responder(op)}
                  className="px-2.5 py-1.5 rounded-full text-[11px] font-medium bg-[#F7941D]/10 text-[#F7941D] border border-[#F7941D]/20 hover:bg-[#F7941D]/20 transition-colors">
                  {op}
                </button>
              ))}
            </div>
          )}
          <div className="px-3 pb-3 shrink-0">
            <div className="flex gap-1.5 bg-white/70 rounded-xl border border-[#E5E7EB] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              {campoActualObj?.tipo === 'date' ? (
                <input type="date" ref={inputRef as React.RefObject<HTMLInputElement>}
                  className="flex-1 px-3 py-2.5 text-[12px] text-[#1A1F2B] bg-transparent outline-none"
                  onChange={e => setInputUsuario(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && responder(inputUsuario)} />
              ) : (
                <input type="text" ref={inputRef} value={inputUsuario}
                  onChange={e => setInputUsuario(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && responder(inputUsuario)}
                  placeholder={terminado ? 'Solicitud completa' : campoActualObj?.placeholder || 'Escribe tu respuesta...'}
                  disabled={terminado}
                  className="flex-1 px-3 py-2.5 text-[12px] text-[#1A1F2B] bg-transparent outline-none placeholder-[#D1D5DB] disabled:opacity-50" />
              )}
              <button onClick={() => setEscuchando(!escuchando)}
                className={cn('px-2.5 transition-colors', escuchando ? 'text-[#7C1F31]' : 'text-[#9CA3AF] hover:text-[#F7941D]')}>
                {escuchando ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
              <button onClick={() => responder(inputUsuario)} disabled={!inputUsuario.trim() || terminado}
                className="px-2.5 text-[#F7941D] hover:text-[#e08019] disabled:opacity-30 transition-colors">
                <Send size={14} />
              </button>
            </div>
            {!terminado && (
              <button onClick={saltar} className="mt-1 text-[10px] text-[#9CA3AF] hover:text-[#6B7280] w-full text-center transition-colors">
                Omitir este campo →
              </button>
            )}
          </div>
        </div>

        {/* COL 2: Solicitud llenándose */}
        <div className="col-span-12 lg:col-span-5 flex flex-col bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={13} className="text-[#F7941D]" />
              <p className="text-[13px] text-[#1A1F2B] font-semibold">Solicitud en tiempo real</p>
            </div>
            <span className="text-[9px] text-[#9CA3AF] px-2 py-0.5 rounded-full bg-[#EFF2F9] shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.1)]">
              {tipo === 'gmm-colectivo' ? 'Colectivo Centenario' : 'MEX-SSEG-V24.01'}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
            {grupos.map(grupo => {
              const Icon = grupo.icon
              const gc = grupo.campos.filter(c => valores[c.id]).length
              const esCampoActivo = grupo.campos.some(c => c.id === campoActualObj?.id)
              return (
                <div key={grupo.id} className={cn('mb-3 rounded-xl overflow-hidden border transition-all duration-300', esCampoActivo ? 'border-[#F7941D]/35' : 'border-transparent')}>
                  <div className={cn('flex items-center justify-between px-3 py-2', esCampoActivo ? 'bg-[#F7941D]/06' : 'bg-white/30')}>
                    <div className="flex items-center gap-2">
                      <Icon size={12} className={esCampoActivo ? 'text-[#F7941D]' : gc === grupo.campos.length ? 'text-[#69A481]' : 'text-[#9CA3AF]'} />
                      <p className="text-[11px] font-semibold text-[#1A1F2B]">{grupo.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 rounded-full bg-[#E5E7EB] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((gc / grupo.campos.length) * 100)}%`, background: gc === grupo.campos.length ? '#69A481' : '#F7941D' }} />
                      </div>
                      <span className={cn('text-[10px] font-semibold', gc === grupo.campos.length ? 'text-[#69A481]' : 'text-[#9CA3AF]')}>{gc}/{grupo.campos.length}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-[#F0F0F0]">
                    {grupo.campos.map(campo => {
                      const val = valores[campo.id]
                      const esActivo = campo.id === campoActualObj?.id
                      return (
                        <div key={campo.id} className={cn('flex items-center justify-between px-3 py-1.5 transition-colors', esActivo ? 'bg-[#FFF8F0]' : 'bg-white/25')}>
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {val ? <CheckCircle2 size={11} className="text-[#69A481] shrink-0" /> : esActivo ? <div className="w-2.5 h-2.5 rounded-full bg-[#F7941D] animate-pulse shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-[#D1D5DB] shrink-0" />}
                            <span className="text-[10px] text-[#6B7280] truncate">{campo.label}</span>
                          </div>
                          <div className="shrink-0 ml-2 max-w-[130px]">
                            {val ? <span className="text-[10px] text-[#1A1F2B] font-medium truncate block text-right">{val}</span>
                              : esActivo ? <span className="text-[9px] text-[#F7941D] font-semibold">completando...</span>
                              : <span className="text-[9px] text-[#D1D5DB]">—</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* COL 3: Progreso + Expediente */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
          <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider mb-2.5">Progreso por sección</p>
            <div className="flex flex-col gap-2">
              {grupos.map(grupo => {
                const gc = grupo.campos.filter(c => valores[c.id]).length
                const pct = Math.round((gc / grupo.campos.length) * 100)
                const Icon = grupo.icon
                return (
                  <div key={grupo.id}>
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <Icon size={9} className={pct === 100 ? 'text-[#69A481]' : 'text-[#9CA3AF]'} />
                        <span className="text-[9px] text-[#6B7280] truncate max-w-[110px]">{grupo.label}</span>
                      </div>
                      <span className={cn('text-[9px] font-bold', pct === 100 ? 'text-[#69A481]' : 'text-[#F7941D]')}>{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-[#E5E7EB] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: pct === 100 ? '#69A481' : '#F7941D' }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Image src="/Icono xoria.png" alt="X" width={14} height={14} className="object-cover rounded-full mt-0.5 shrink-0" />
                <p className="text-[10px] text-white/70 leading-relaxed">
                  {terminado ? '✅ Solicitud completa. Lista para cotización.'
                    : porcentaje >= 75 ? `Faltan ${totalCampos - completados} campos. ¡Casi listo!`
                    : porcentaje >= 50 ? `${completados} campos listos. Seguimos.`
                    : porcentaje >= 25 ? `Ya llené ${completados} de ${totalCampos} campos.`
                    : 'Iniciando captura guiada de datos.'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex-1">
            <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider mb-2.5">Expediente</p>
            <div className="flex flex-col gap-2">
              {DOCUMENTOS_REQUERIDOS.map(doc => {
                const status = docStatus[doc.id]
                const color = STATUS_COLOR[status]
                return (
                  <div key={doc.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {status === 'completo' ? <CheckCircle2 size={11} style={{ color }} className="shrink-0" />
                        : status === 'validando' ? <Loader2 size={11} style={{ color }} className="shrink-0 animate-spin" />
                        : status === 'observado' ? <AlertCircle size={11} style={{ color }} className="shrink-0" />
                        : status === 'recibido' ? <Check size={11} style={{ color }} className="shrink-0" />
                        : <Clock size={11} style={{ color }} className="shrink-0" />}
                      <span className="text-[10px] text-[#6B7280] truncate">{doc.label}</span>
                    </div>
                    <span className="text-[9px] font-semibold shrink-0 px-1.5 py-0.5 rounded-full" style={{ color, background: `${color}18` }}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          {puedeIrCotizacion && (
            <button onClick={() => router.push(`/agent/nueva-venta/cotizacion?tipo=${tipo}`)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white text-[12px] font-semibold hover:scale-[1.02] transition-all"
              style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 6px 20px rgba(247,148,29,0.4)' }}>
              <ZapIcon size={13} /> Ver cotización
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OriginacionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-[#F7941D]" />
          <span className="text-[13px] text-[#9CA3AF]">Iniciando XORIA...</span>
        </div>
      </div>
    }>
      <OriginacionContent />
    </Suspense>
  )
}
