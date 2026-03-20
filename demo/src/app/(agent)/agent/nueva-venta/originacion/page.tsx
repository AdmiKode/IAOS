'use client'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Clock, AlertCircle,
  FileText, User, MapPin, Heart, Activity, Mic, MicOff, Send,
  Loader2, Shield, Briefcase, Users2, Volume2, VolumeX
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useVoiceIO } from '@/lib/useVoiceIO'

function ZapIcon({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
}

// ─── GRUPOS GMM INDIVIDUAL ────────────────────────────────────────────────────
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

// ─── GRUPOS GMM COLECTIVO ─────────────────────────────────────────────────────
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

// ─── Preguntas XORIA ──────────────────────────────────────────────────────────
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
  num_int: '¿Hay número interior? Si no, di sin interior.',
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

// ─── Indicador de onda de audio ───────────────────────────────────────────────
function AudioWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[2px] h-4">
      {[1, 2, 3, 4, 3].map((h, i) => (
        <div key={i}
          className={cn('w-[3px] rounded-full transition-all', active ? 'bg-[#F7941D]' : 'bg-[#D1D5DB]')}
          style={{
            height: active ? `${h * 4}px` : '4px',
            animationName: active ? 'audiobar' : 'none',
            animationDuration: `${0.4 + i * 0.1}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
          }} />
      ))}
      <style>{`
        @keyframes audiobar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
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
  const [mensajes, setMensajes] = useState<{ from: 'xoria' | 'user'; text: string }[]>([])
  const [inputUsuario, setInputUsuario] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [docStatus, setDocStatus] = useState<Record<string, StatusDoc>>({
    id_oficial: 'pendiente', comprobante_dom: 'pendiente', rfc_doc: 'pendiente',
    solicitud: 'pendiente', consentimiento: 'pendiente', firma_digital: 'pendiente',
  })
  // Firma digital
  const [firmaModal, setFirmaModal] = useState(false)
  const [firmaStep, setFirmaStep] = useState<'prep' | 'firma' | 'done'>('prep')
  const [polizaGenerada, setPolizaGenerada] = useState<string | null>(null)
  const [firmaConfirmada, setFirmaConfirmada] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const drawingRef = useRef(false)
  const lastPtRef = useRef<{ x: number; y: number } | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingRespuesta = useRef('')
  const initialized = useRef(false)

  const completados = Object.keys(valores).length
  const porcentaje = Math.round((completados / totalCampos) * 100)
  const campoActualObj = allCampos[campoActual]
  const terminado = campoActual >= allCampos.length

  // ── Hook de voz ─────────────────────────────────────────────────────────────
  const { speak, stopSpeaking, toggleListen, isListening, isSpeaking, supported, transcript } =
    useVoiceIO({
      lang: 'es-MX',
      rate: 0.9,
      pitch: 1.1,
      onTranscript: (text, isFinal) => {
        setInputUsuario(text)
        if (isFinal && text.trim()) {
          pendingRespuesta.current = text.trim()
        }
      },
      onSpeechEnd: () => {
        // Al terminar de hablar el usuario → auto-enviar si hay texto
        if (pendingRespuesta.current) {
          const r = pendingRespuesta.current
          pendingRespuesta.current = ''
          setTimeout(() => responder(r), 150)
        }
      },
    })

  // ── Hablar mensaje XORIA ──────────────────────────────────────────────────
  const xoriaHabla = useCallback((texto: string, luegoBotones = false) => {
    if (!voiceEnabled) return
    // Limpiar markdown antes de leer
    const limpio = texto.replace(/\*\*(.*?)\*\*/g, '$1').replace(/[✓✅📋🎯⚡]/g, '')
    speak(limpio, luegoBotones ? undefined : undefined)
  }, [voiceEnabled, speak])

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const intro = `Hola, soy XORIA. Voy a guiarte campo por campo para completar la solicitud oficial de ${tipoLabel}. Cada respuesta se registra automáticamente en el formulario.`
    const pregunta1 = PREGUNTAS[allCampos[0]?.id] || '¿Cuál es el primer dato?'
    setMensajes([
      { from: 'xoria', text: `Hola, soy XORIA. Voy a guiarte campo por campo para completar la solicitud oficial de **${tipoLabel}**. Cada respuesta se registra automáticamente en el formulario. ¿Empezamos?` },
      { from: 'xoria', text: pregunta1 },
    ])
    // Hablar intro + primera pregunta
    setTimeout(() => {
      speak(`${intro} ¿Empezamos? ${pregunta1}`)
    }, 600)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // ── Responder campo ────────────────────────────────────────────────────────
  function responder(valor: string) {
    if (!valor.trim() || terminado) return
    stopSpeaking()
    setProcesando(true)
    const nuevoValores = { ...valores, [campoActualObj.id]: valor }
    setValores(nuevoValores)
    setMensajes(prev => [...prev, { from: 'user', text: valor }])
    setInputUsuario('')
    pendingRespuesta.current = ''

    setTimeout(() => {
      const sig = campoActual + 1
      const completadosNew = Object.keys(nuevoValores).length
      const pct = Math.round((completadosNew / totalCampos) * 100)
      let confirmacion = `✓ Registrado: **${valor}**`
      if (pct === 25) confirmacion += '\n\n📋 Ya llené el 25% de la solicitud.'
      if (pct === 50) confirmacion += '\n\n🎯 ¡Mitad completada! Seguimos.'
      if (pct === 75) confirmacion += '\n\n⚡ El 75% listo — casi terminamos.'

      if (sig >= allCampos.length) {
        const final = '✅ ¡Solicitud completa al 100%! He llenado todos los campos del formato oficial. Con esta información ya puedo generar las opciones de cotización.'
        setMensajes(prev => [...prev,
          { from: 'xoria', text: confirmacion },
          { from: 'xoria', text: final },
        ])
        xoriaHabla(`Registrado. ${final}`)
        setCampoActual(sig)
      } else {
        const siguienteCampo = allCampos[sig]
        const nextQ = PREGUNTAS[siguienteCampo.id] || `¿${siguienteCampo.label}?`
        setMensajes(prev => [...prev,
          { from: 'xoria', text: confirmacion },
          { from: 'xoria', text: nextQ },
        ])
        xoriaHabla(nextQ)
        setCampoActual(sig)
      }
      setProcesando(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }, 400)
  }

  function saltar() {
    if (terminado) return
    stopSpeaking()
    const sig = campoActual + 1
    const nextQ = sig < allCampos.length ? `OK, lo dejamos pendiente. ${PREGUNTAS[allCampos[sig].id] || '¿Siguiente dato?'}` : '✅ Solicitud completada (con algunos campos omitidos).'
    setMensajes(prev => [...prev,
      { from: 'user', text: '(campo omitido)' },
      { from: 'xoria', text: nextQ },
    ])
    if (sig < allCampos.length) xoriaHabla(nextQ)
    setCampoActual(sig)
  }

  const puedeIrCotizacion = porcentaje >= 60

  // ── Firma Digital ─────────────────────────────────────────────────────────
  async function abrirFirma() {
    setFirmaStep('prep')
    setFirmaConfirmada(false)
    setPolizaGenerada(null)
    setFirmaModal(true)
    // pequeño delay para que el modal monte el video element
    setTimeout(startCamera, 400)
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch { /* sin cámara: solo muestra placeholder */ }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  function closeFirma() {
    stopCamera()
    setFirmaModal(false)
    setFirmaStep('prep')
  }

  function clearCanvas() {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, c.width, c.height)
    setFirmaConfirmada(false)
  }

  function getPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
    const scaleX = c.width / rect.width
    const scaleY = c.height / rect.height
    if ('touches' in e) {
      const t = e.touches[0]
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY }
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  function canvasStart(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault()
    drawingRef.current = true
    lastPtRef.current = getPos(e)
  }

  function canvasMove(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (!drawingRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    const pt = getPos(e)
    const last = lastPtRef.current ?? pt
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(pt.x, pt.y)
    ctx.strokeStyle = '#1A1F2B'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPtRef.current = pt
  }

  function canvasEnd(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault()
    drawingRef.current = false
    lastPtRef.current = null
    // Check if there's something drawn
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const data = ctx.getImageData(0, 0, c.width, c.height).data
    const hasDrawing = Array.from(data).some((v, i) => i % 4 === 3 && v > 0)
    if (hasDrawing) setFirmaConfirmada(true)
  }

  function confirmarFirma() {
    const num = `GNP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
    setPolizaGenerada(num)
    setFirmaStep('done')
    stopCamera()
    setDocStatus(prev => ({ ...prev, firma_digital: 'completo', solicitud: 'completo' }))
  }

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
          {/* Toggle voz */}
          <button onClick={() => { stopSpeaking(); setVoiceEnabled(v => !v) }}
            title={voiceEnabled ? 'Desactivar voz XORIA' : 'Activar voz XORIA'}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all', voiceEnabled ? 'bg-[#F7941D]/10 text-[#F7941D] border border-[#F7941D]/20' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]')}>
            {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            {voiceEnabled ? 'Voz activa' : 'Voz off'}
          </button>
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

        {/* COL 1: Chat XORIA con voz */}
        <div className="col-span-12 lg:col-span-4 flex flex-col bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] overflow-hidden">
          {/* Header del chat */}
          <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full border-2 border-[#F7941D] animate-ping opacity-75" />
                )}
              </div>
              <div>
                <p className="text-[12px] text-white font-semibold">XORIA</p>
                <div className="flex items-center gap-1.5">
                  <AudioWave active={isSpeaking} />
                  <p className="text-[9px] text-white/50">
                    {isSpeaking ? 'Hablando...' : isListening ? 'Escuchando...' : 'Motor de originación activo'}
                  </p>
                </div>
              </div>
            </div>
            {/* Estado de voz */}
            {isSpeaking && (
              <button onClick={stopSpeaking} className="text-[9px] text-white/50 hover:text-white/80 transition-colors">
                Silenciar
              </button>
            )}
          </div>

          {/* Mensajes */}
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
            {/* Transcripción en vivo */}
            {isListening && transcript && (
              <div className="flex justify-end">
                <div className="max-w-[82%] rounded-2xl rounded-tr-sm px-3 py-2.5 text-[12px] text-white/80 italic border border-[#F7941D]/30"
                  style={{ background: 'rgba(247,148,29,0.15)' }}>
                  {transcript}...
                </div>
              </div>
            )}
          </div>

          {/* Opciones rápidas tipo select */}
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

          {/* Input + botones de voz */}
          <div className="px-3 pb-3 shrink-0">
            {/* Barra de input */}
            <div className={cn('flex gap-1.5 rounded-xl border overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all',
              isListening ? 'bg-[#FFF8F0] border-[#F7941D]/40' : 'bg-white/70 border-[#E5E7EB]')}>
              {campoActualObj?.tipo === 'date' ? (
                <input type="date" ref={inputRef as React.RefObject<HTMLInputElement>}
                  className="flex-1 px-3 py-2.5 text-[12px] text-[#1A1F2B] bg-transparent outline-none"
                  value={inputUsuario}
                  onChange={e => setInputUsuario(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && responder(inputUsuario)} />
              ) : (
                <input type="text" ref={inputRef} value={inputUsuario}
                  onChange={e => setInputUsuario(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && responder(inputUsuario)}
                  placeholder={
                    isListening ? '🎤 Escuchando...'
                    : terminado ? 'Solicitud completa'
                    : campoActualObj?.placeholder || 'Escribe o habla...'
                  }
                  disabled={terminado}
                  className="flex-1 px-3 py-2.5 text-[12px] text-[#1A1F2B] bg-transparent outline-none placeholder-[#D1D5DB] disabled:opacity-50" />
              )}

              {/* Botón micrófono */}
              {supported && (
                <button
                  onClick={toggleListen}
                  disabled={terminado || isSpeaking}
                  title={isListening ? 'Detener grabación' : 'Hablar respuesta'}
                  className={cn('px-3 flex items-center justify-center transition-all relative', isListening ? 'text-[#7C1F31]' : 'text-[#9CA3AF] hover:text-[#F7941D]')}>
                  {isListening ? (
                    <span className="relative flex items-center justify-center">
                      <span className="absolute w-8 h-8 rounded-full bg-[#7C1F31]/10 animate-ping" />
                      <MicOff size={15} />
                    </span>
                  ) : <Mic size={15} />}
                </button>
              )}

              <button onClick={() => responder(inputUsuario)} disabled={!inputUsuario.trim() || terminado}
                className="px-2.5 text-[#F7941D] hover:text-[#e08019] disabled:opacity-30 transition-colors">
                <Send size={14} />
              </button>
            </div>

            {/* Estado de voz y omitir */}
            <div className="mt-1.5 flex items-center justify-between">
              {isListening ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C1F31] animate-pulse" />
                  <span className="text-[10px] text-[#7C1F31] font-semibold">Grabando · habla ahora</span>
                </div>
              ) : isSpeaking ? (
                <div className="flex items-center gap-1.5">
                  <AudioWave active />
                  <span className="text-[10px] text-[#F7941D]">XORIA hablando...</span>
                </div>
              ) : (
                <span className="text-[10px] text-[#9CA3AF]">
                  {supported ? '🎤 Toca el mic o escribe' : 'Escribe tu respuesta'}
                </span>
              )}
              {!terminado && (
                <button onClick={saltar} className="text-[10px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                  Omitir →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* COL 2: Solicitud llenándose en tiempo real */}
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
                      const transcribiendo = esActivo && isListening
                      return (
                        <div key={campo.id} className={cn('flex items-center justify-between px-3 py-1.5 transition-colors', esActivo ? 'bg-[#FFF8F0]' : 'bg-white/25')}>
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {val ? <CheckCircle2 size={11} className="text-[#69A481] shrink-0" />
                              : esActivo ? <div className="w-2.5 h-2.5 rounded-full bg-[#F7941D] animate-pulse shrink-0" />
                              : <div className="w-2.5 h-2.5 rounded-full border border-[#D1D5DB] shrink-0" />}
                            <span className="text-[10px] text-[#6B7280] truncate">{campo.label}</span>
                          </div>
                          <div className="shrink-0 ml-2 max-w-[130px]">
                            {transcribiendo && transcript ? (
                              <span className="text-[10px] text-[#F7941D] italic truncate block text-right">{transcript}</span>
                            ) : val ? (
                              <span className="text-[10px] text-[#1A1F2B] font-medium truncate block text-right">{val}</span>
                            ) : esActivo ? (
                              <span className="text-[9px] text-[#F7941D] font-semibold">completando...</span>
                            ) : (
                              <span className="text-[9px] text-[#D1D5DB]">—</span>
                            )}
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
                    : isListening ? '🎤 Grabando voz del asegurado...'
                    : isSpeaking ? '🔊 XORIA hablando...'
                    : porcentaje >= 75 ? `Faltan ${totalCampos - completados} campos.`
                    : porcentaje >= 50 ? `${completados} campos listos.`
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

          {terminado && (
            <button onClick={abrirFirma}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white text-[12px] font-semibold hover:scale-[1.02] transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#69A481,#4d8060)', boxShadow: '0 6px 20px rgba(105,164,129,0.45)' }}>
              <Shield size={13} /> Generar Póliza · Firma Digital
            </button>
          )}
        </div>
      </div>

      {/* ── MODAL FIRMA DIGITAL ────────────────────────────────────────────── */}
      {firmaModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-3xl bg-[#EFF2F9] rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.35)] overflow-hidden">

            {/* Header del modal */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between"
              style={{ background: 'linear-gradient(90deg,#1A1F2B,#2D3548)' }}>
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-[#69A481]" />
                <div>
                  <p className="text-white text-[14px] font-bold">Firma Digital Biométrica</p>
                  <p className="text-white/50 text-[10px] tracking-wider">
                    {firmaStep === 'prep' ? 'VERIFICACIÓN · PASO 1 DE 2'
                      : firmaStep === 'firma' ? 'CAPTURA DE FIRMA · PASO 2 DE 2'
                      : '✅ PÓLIZA GENERADA'}
                  </p>
                </div>
              </div>
              <button onClick={closeFirma}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-[18px] font-light">
                ×
              </button>
            </div>

            {/* Pasos indicadores */}
            {firmaStep !== 'done' && (
              <div className="flex items-center gap-0 px-6 py-3 bg-white/30 border-b border-[#E5E7EB]">
                {['prep', 'firma'].map((step, i) => (
                  <div key={step} className="flex items-center gap-0 flex-1">
                    <div className={cn('flex items-center gap-1.5',
                      firmaStep === step ? 'text-[#F7941D]' : i < ['prep','firma'].indexOf(firmaStep) ? 'text-[#69A481]' : 'text-[#9CA3AF]')}>
                      <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold',
                        firmaStep === step ? 'bg-[#F7941D] text-white' : i < ['prep','firma'].indexOf(firmaStep) ? 'bg-[#69A481] text-white' : 'bg-[#E5E7EB] text-[#9CA3AF]')}>
                        {i < ['prep','firma'].indexOf(firmaStep) ? '✓' : i + 1}
                      </div>
                      <span className="text-[10px] font-semibold">{i === 0 ? 'Preparar cámara' : 'Firmar documento'}</span>
                    </div>
                    {i < 1 && <div className="flex-1 h-px bg-[#E5E7EB] mx-3" />}
                  </div>
                ))}
              </div>
            )}

            {/* PASO 1: Preparar */}
            {firmaStep === 'prep' && (
              <div className="p-6 flex flex-col items-center gap-5">
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="w-full max-w-sm aspect-video rounded-2xl overflow-hidden bg-[#1A1F2B] relative shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center">
                      <div className="bg-[#69A481]/20 border border-[#69A481]/40 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#69A481] animate-pulse" />
                        <span className="text-[10px] text-white font-semibold">Cámara activa — Verificación biométrica</span>
                      </div>
                    </div>
                    {/* Overlay guía de cara */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-28 h-36 rounded-full border-2 border-dashed border-[#F7941D]/40" />
                    </div>
                  </div>
                  <div className="bg-[#F7941D]/08 border border-[#F7941D]/20 rounded-xl px-4 py-3 max-w-sm w-full">
                    <p className="text-[11px] text-[#6B7280] leading-relaxed text-center">
                      Asegúrate de que el cliente esté frente a la cámara.<br />
                      El rostro debe ser claramente visible durante todo el proceso de firma.<br />
                      <span className="text-[#F7941D] font-semibold">Esta sesión queda registrada como verificación biométrica.</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setFirmaStep('firma')}
                  className="px-10 py-3.5 rounded-2xl text-white text-[13px] font-semibold hover:opacity-90 transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 6px 20px rgba(247,148,29,0.4)' }}>
                  Cliente listo — Continuar a firma
                </button>
              </div>
            )}

            {/* PASO 2: Firmar */}
            {firmaStep === 'firma' && (
              <div className="p-6 flex gap-5">
                {/* Cámara */}
                <div className="flex flex-col gap-2 shrink-0" style={{ width: '42%' }}>
                  <div className="rounded-2xl overflow-hidden bg-[#1A1F2B] relative shadow-[0_6px_20px_rgba(0,0,0,0.25)]" style={{ aspectRatio: '4/3' }}>
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#7C1F31]/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      <span className="text-[9px] text-white font-bold">REC</span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1.5 text-center">
                        <p className="text-[9px] text-white/80">Verificación biométrica activa</p>
                        <p className="text-[8px] text-white/50">El cliente firma frente a cámara</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1A1F2B] rounded-xl px-3 py-2">
                    <p className="text-[9px] text-white/60 text-center leading-relaxed">
                      Sesión de firma registrada con verificación facial biométrica conforme a la NOM-151-SCFI-2016
                    </p>
                  </div>
                </div>

                {/* Pad de firma */}
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <p className="text-[13px] text-[#1A1F2B] font-bold mb-0.5">Firma del asegurado</p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      {valores.nombre || 'Cliente'} {valores.apellido_paterno || ''} — GMM {tipoLabel}
                    </p>
                  </div>

                  {/* Canvas */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-[#D1D5DB] bg-white/80 flex-1 min-h-[180px]">
                    <canvas ref={canvasRef} width={500} height={220}
                      className="w-full h-full cursor-crosshair touch-none"
                      onMouseDown={canvasStart} onMouseMove={canvasMove} onMouseUp={canvasEnd} onMouseLeave={canvasEnd}
                      onTouchStart={canvasStart} onTouchMove={canvasMove} onTouchEnd={canvasEnd} />
                    {!firmaConfirmada && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-[11px] text-[#D1D5DB] select-none">Firma aquí</p>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E5E7EB] mx-4" />
                  </div>

                  <div className="flex gap-2">
                    <button onClick={clearCanvas}
                      className="flex-1 py-2.5 rounded-xl text-[11px] text-[#6B7280] font-semibold bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
                      Limpiar
                    </button>
                    <button onClick={confirmarFirma} disabled={!firmaConfirmada}
                      className="flex-[2] py-2.5 rounded-xl text-[12px] text-white font-semibold transition-all active:scale-95 disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg,#69A481,#4d8060)', boxShadow: firmaConfirmada ? '0 4px 16px rgba(105,164,129,0.4)' : 'none' }}>
                      <div className="flex items-center justify-center gap-2">
                        <Shield size={13} /> Confirmar y generar póliza
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: Confirmado */}
            {firmaStep === 'done' && (
              <div className="p-8 flex flex-col items-center gap-5 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#69A481,#4d8060)', boxShadow: '0 8px 30px rgba(105,164,129,0.4)' }}>
                  <CheckCircle2 size={36} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[22px] text-[#1A1F2B] font-bold mb-1">¡Póliza Generada!</h3>
                  <p className="text-[13px] text-[#6B7280] mb-3">La firma biométrica fue capturada y validada correctamente.</p>
                  <div className="bg-[#1A1F2B] rounded-2xl px-8 py-4 inline-block">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Número de póliza</p>
                    <p className="text-[22px] text-[#F7941D] font-bold font-mono">{polizaGenerada}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm text-left">
                  {[
                    { label: 'Asegurado', val: `${valores.nombre || '—'} ${valores.apellido_paterno || ''}` },
                    { label: 'Producto', val: `GMM ${tipoLabel}` },
                    { label: 'Verificación', val: 'Biométrica ✓' },
                  ].map(item => (
                    <div key={item.label} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]">
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-[11px] text-[#1A1F2B] font-semibold leading-tight">{item.val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => router.push('/agent/polizas')}
                    className="px-6 py-3 rounded-2xl text-[12px] font-semibold text-white transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 4px 16px rgba(247,148,29,0.4)' }}>
                    Ver en Pólizas
                  </button>
                  <button onClick={() => { closeFirma(); router.push('/agent/dashboard') }}
                    className="px-6 py-3 rounded-2xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-3px_-3px_6px_#FAFBFF,3px_3px_6px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
                    Ir al Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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

