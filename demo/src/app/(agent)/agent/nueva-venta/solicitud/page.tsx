'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft, Send, Mic, MicOff, CheckCircle, Bot, User, Car,
  Shield, Heart, Home, Briefcase, FileText, Download, Loader2,
  X, AlertTriangle, ChevronDown, ChevronUp, RotateCcw
} from 'lucide-react'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { cn } from '@/lib/utils'

// ─── TIPOS ───────────────────────────────────────────────────────────────────
type RamoId = 'auto'|'gmm-individual'|'gmm-colectivo'|'vida'|'danos'|'rc'

interface Campo {
  key: string; label: string; section: string; tipo: string
  req?: boolean; opciones?: string[]; desc?: string
}

// ─── CAMPOS POR RAMO ──────────────────────────────────────────────────────────
const CAMPOS_AUTO: Campo[] = [
  // Contratante
  { key:'nombre',       label:'Nombre completo del contratante', section:'Contratante', tipo:'text',   req:true },
  { key:'rfc',          label:'RFC',                             section:'Contratante', tipo:'text',   req:true },
  { key:'curp',         label:'CURP',                            section:'Contratante', tipo:'text',   req:true },
  { key:'nacimiento',   label:'Fecha de nacimiento',             section:'Contratante', tipo:'date',   req:true },
  { key:'sexo',         label:'Sexo',                            section:'Contratante', tipo:'select', req:true,  opciones:['Masculino','Femenino'] },
  { key:'edo_civil',    label:'Estado civil',                    section:'Contratante', tipo:'select', req:false, opciones:['Soltero/a','Casado/a','Divorciado/a','Viudo/a','Unión libre'] },
  { key:'tel',          label:'Teléfono',                        section:'Contratante', tipo:'tel',    req:true },
  { key:'email',        label:'Correo electrónico',              section:'Contratante', tipo:'email',  req:true },
  // Domicilio
  { key:'calle',        label:'Calle y número',                  section:'Domicilio', tipo:'text', req:true },
  { key:'colonia',      label:'Colonia',                         section:'Domicilio', tipo:'text', req:true },
  { key:'municipio',    label:'Municipio / Alcaldía',            section:'Domicilio', tipo:'text', req:true },
  { key:'estado',       label:'Estado',                          section:'Domicilio', tipo:'select', req:true, opciones:['Aguascalientes','Baja California','CDMX','Jalisco','Nuevo León','Estado de México','Puebla','Querétaro','Sonora','Veracruz','Otro'] },
  { key:'cp',           label:'Código Postal',                   section:'Domicilio', tipo:'text', req:true },
  // Vehículo
  { key:'veh_marca',    label:'Marca',                           section:'Vehículo', tipo:'select', req:true, opciones:['Volkswagen','Nissan','Chevrolet','Toyota','Honda','Kia','Hyundai','Ford','Seat','Mazda','Audi','BMW','Mercedes-Benz','RAM','Jeep','Dodge','Renault','Peugeot','Otra'] },
  { key:'veh_modelo',   label:'Modelo',                          section:'Vehículo', tipo:'text', req:true },
  { key:'veh_anio',     label:'Año',                             section:'Vehículo', tipo:'text', req:true },
  { key:'veh_version',  label:'Versión / Trim',                  section:'Vehículo', tipo:'text', req:false },
  { key:'veh_color',    label:'Color',                           section:'Vehículo', tipo:'text', req:false },
  { key:'veh_placas',   label:'Placas',                          section:'Vehículo', tipo:'text', req:true },
  { key:'veh_vin',      label:'No. de serie (VIN)',              section:'Vehículo', tipo:'text', req:true },
  { key:'veh_uso',      label:'Uso del vehículo',                section:'Vehículo', tipo:'select', req:true, opciones:['Particular','Uber / DIDI','Negocio / empresa','Reparto / mensajería'] },
  { key:'veh_valor',    label:'Valor comercial estimado (MXN)',  section:'Vehículo', tipo:'text', req:true },
  // Cobertura
  { key:'plan',         label:'Plan solicitado',                 section:'Cobertura', tipo:'select', req:true, opciones:['Básica','Intermedia','Amplia'] },
  { key:'deducible',    label:'Deducible preferido',             section:'Cobertura', tipo:'select', req:false, opciones:['0% sin deducible','5% recomendado','10% prima menor'] },
  { key:'forma_pago',   label:'Forma de pago',                   section:'Cobertura', tipo:'select', req:true, opciones:['Anual','Semestral','Trimestral','Mensual'] },
  // Firma
  { key:'firma_nombre', label:'Nombre para firma',               section:'Firma', tipo:'text', req:true },
  { key:'firma_lugar',  label:'Lugar y fecha',                   section:'Firma', tipo:'text', req:true },
]

const CAMPOS_GMM_INDIVIDUAL: Campo[] = [
  { key:'nombre',       label:'Nombre completo',           section:'Titular', tipo:'text',   req:true },
  { key:'rfc',          label:'RFC',                       section:'Titular', tipo:'text',   req:true },
  { key:'curp',         label:'CURP',                      section:'Titular', tipo:'text',   req:true },
  { key:'nacimiento',   label:'Fecha de nacimiento',       section:'Titular', tipo:'date',   req:true },
  { key:'sexo',         label:'Sexo',                      section:'Titular', tipo:'select', req:true, opciones:['Masculino','Femenino'] },
  { key:'tel',          label:'Teléfono',                  section:'Titular', tipo:'tel',    req:true },
  { key:'email',        label:'Correo electrónico',        section:'Titular', tipo:'email',  req:true },
  { key:'calle',        label:'Domicilio',                 section:'Titular', tipo:'text',   req:true },
  { key:'cp',           label:'Código Postal',             section:'Titular', tipo:'text',   req:true },
  { key:'estado',       label:'Estado',                    section:'Titular', tipo:'select', req:true, opciones:['CDMX','Jalisco','Nuevo León','Estado de México','Puebla','Otro'] },
  // Salud
  { key:'peso',         label:'Peso (kg)',                 section:'Salud',   tipo:'text',   req:true },
  { key:'talla',        label:'Talla (cm)',                section:'Salud',   tipo:'text',   req:true },
  { key:'preexistencia',label:'Padecimientos preexistentes',section:'Salud', tipo:'select', req:true, opciones:['Ninguno','Diabetes','Hipertensión','Cardiopatía','Cáncer','Otro'] },
  { key:'medicamentos', label:'Toma medicamentos',         section:'Salud',   tipo:'select', req:true, opciones:['No','Sí — especifique'] },
  { key:'fumador',      label:'Fumador',                   section:'Salud',   tipo:'select', req:true, opciones:['No','Sí — activo','Ex-fumador'] },
  // Cobertura
  { key:'suma',         label:'Suma asegurada',            section:'Cobertura', tipo:'select', req:true, opciones:['$500,000','$1,000,000','$2,000,000','$3,000,000','Ilimitada'] },
  { key:'deducible',    label:'Deducible',                 section:'Cobertura', tipo:'select', req:true, opciones:['$5,000','$10,000','$20,000','$30,000','$50,000'] },
  { key:'coaseguro',    label:'Coaseguro',                 section:'Cobertura', tipo:'select', req:true, opciones:['5%','10%','15%','20%'] },
  { key:'maternidad',   label:'Cobertura maternidad',      section:'Cobertura', tipo:'select', req:false, opciones:['Sí','No'] },
  { key:'dental',       label:'Cobertura dental',          section:'Cobertura', tipo:'select', req:false, opciones:['Sí','No'] },
  { key:'forma_pago',   label:'Forma de pago',             section:'Cobertura', tipo:'select', req:true, opciones:['Anual','Semestral','Trimestral','Mensual'] },
  { key:'aseguradora',  label:'Aseguradora preferida',     section:'Cobertura', tipo:'select', req:false, opciones:['GNP','BUPA','AXA','Metlife','Cualquiera'] },
]

const CAMPOS_GMM_COLECTIVO: Campo[] = [
  { key:'empresa',      label:'Razón social de la empresa', section:'Empresa', tipo:'text',   req:true },
  { key:'rfc_emp',      label:'RFC empresa',                section:'Empresa', tipo:'text',   req:true },
  { key:'giro',         label:'Giro / actividad',           section:'Empresa', tipo:'text',   req:true },
  { key:'num_empleados',label:'Número de empleados',        section:'Empresa', tipo:'text',   req:true },
  { key:'contacto',     label:'Nombre del contacto RH',     section:'Empresa', tipo:'text',   req:true },
  { key:'tel',          label:'Teléfono',                   section:'Empresa', tipo:'tel',    req:true },
  { key:'email',        label:'Correo electrónico',         section:'Empresa', tipo:'email',  req:true },
  { key:'estado',       label:'Estado',                     section:'Empresa', tipo:'select', req:true, opciones:['CDMX','Jalisco','Nuevo León','Estado de México','Puebla','Otro'] },
  { key:'cp',           label:'Código Postal',              section:'Empresa', tipo:'text',   req:true },
  // Siniestralidad
  { key:'siniestros_prev', label:'Siniestros año anterior', section:'Siniestralidad', tipo:'select', req:true, opciones:['Ninguno','1-3','4-10','Más de 10'] },
  { key:'prima_anterior',  label:'Prima pagada año anterior (MXN)', section:'Siniestralidad', tipo:'text', req:false },
  // Cobertura
  { key:'suma',          label:'Suma asegurada por empleado',   section:'Cobertura', tipo:'select', req:true, opciones:['$500,000','$1,000,000','$2,000,000','Ilimitada'] },
  { key:'deducible',     label:'Deducible',                     section:'Cobertura', tipo:'select', req:true, opciones:['$3,000','$5,000','$10,000','$20,000'] },
  { key:'dependientes',  label:'Incluir dependientes',          section:'Cobertura', tipo:'select', req:true, opciones:['Sí','No'] },
  { key:'maternidad',    label:'Maternidad',                    section:'Cobertura', tipo:'select', req:false, opciones:['Sí','No'] },
  { key:'dental',        label:'Dental',                        section:'Cobertura', tipo:'select', req:false, opciones:['Sí','No'] },
  { key:'forma_pago',    label:'Forma de pago',                 section:'Cobertura', tipo:'select', req:true, opciones:['Anual','Semestral','Trimestral'] },
]

const CAMPOS_VIDA: Campo[] = [
  { key:'nombre',       label:'Nombre completo del asegurado', section:'Asegurado', tipo:'text',   req:true },
  { key:'rfc',          label:'RFC',                           section:'Asegurado', tipo:'text',   req:true },
  { key:'curp',         label:'CURP',                          section:'Asegurado', tipo:'text',   req:true },
  { key:'nacimiento',   label:'Fecha de nacimiento',           section:'Asegurado', tipo:'date',   req:true },
  { key:'sexo',         label:'Sexo',                          section:'Asegurado', tipo:'select', req:true, opciones:['Masculino','Femenino'] },
  { key:'ocupacion',    label:'Ocupación',                     section:'Asegurado', tipo:'text',   req:true },
  { key:'tel',          label:'Teléfono',                      section:'Asegurado', tipo:'tel',    req:true },
  { key:'email',        label:'Correo electrónico',            section:'Asegurado', tipo:'email',  req:true },
  { key:'estado',       label:'Estado de residencia',          section:'Asegurado', tipo:'select', req:true, opciones:['CDMX','Jalisco','Nuevo León','Estado de México','Puebla','Otro'] },
  // Salud
  { key:'peso',         label:'Peso (kg)',                     section:'Salud', tipo:'text',   req:true },
  { key:'talla',        label:'Talla (cm)',                    section:'Salud', tipo:'text',   req:true },
  { key:'fumador',      label:'Fumador',                       section:'Salud', tipo:'select', req:true, opciones:['No','Sí — activo','Ex-fumador'] },
  { key:'enfermedades', label:'Enfermedades preexistentes',    section:'Salud', tipo:'select', req:true, opciones:['Ninguna','Diabetes','Hipertensión','Cardiopatía','Cáncer','Otra'] },
  { key:'deporte',      label:'Practica deportes extremos',    section:'Salud', tipo:'select', req:true, opciones:['No','Sí'] },
  // Cobertura
  { key:'suma',         label:'Suma asegurada',                section:'Cobertura', tipo:'select', req:true, opciones:['$500,000','$1,000,000','$2,000,000','$5,000,000','$10,000,000'] },
  { key:'tipo_plan',    label:'Tipo de plan',                  section:'Cobertura', tipo:'select', req:true, opciones:['Temporal 10 años','Temporal 20 años','Vida entera','Dotal','Universal'] },
  { key:'adicionales',  label:'Coberturas adicionales',        section:'Cobertura', tipo:'select', req:false, opciones:['Invalidez total','Enfermedades graves','Accidentes','Gastos funerarios'] },
  { key:'forma_pago',   label:'Forma de pago',                 section:'Cobertura', tipo:'select', req:true, opciones:['Anual','Semestral','Trimestral','Mensual'] },
  // Beneficiarios
  { key:'benef1_nombre',label:'Beneficiario 1 — Nombre',      section:'Beneficiarios', tipo:'text', req:true },
  { key:'benef1_pct',   label:'Beneficiario 1 — Porcentaje',  section:'Beneficiarios', tipo:'text', req:true },
  { key:'benef1_rel',   label:'Beneficiario 1 — Parentesco',  section:'Beneficiarios', tipo:'select', req:true, opciones:['Cónyuge','Hijo/a','Padre/Madre','Hermano/a','Otro'] },
  { key:'benef2_nombre',label:'Beneficiario 2 — Nombre',      section:'Beneficiarios', tipo:'text', req:false },
  { key:'benef2_pct',   label:'Beneficiario 2 — Porcentaje',  section:'Beneficiarios', tipo:'text', req:false },
]

const CAMPOS_DANOS: Campo[] = [
  { key:'nombre',       label:'Nombre / Razón social',     section:'Contratante', tipo:'text',   req:true },
  { key:'rfc',          label:'RFC',                       section:'Contratante', tipo:'text',   req:true },
  { key:'tel',          label:'Teléfono',                  section:'Contratante', tipo:'tel',    req:true },
  { key:'email',        label:'Correo electrónico',        section:'Contratante', tipo:'email',  req:true },
  { key:'tipo_bien',    label:'Tipo de bien asegurado',    section:'Bien',        tipo:'select', req:true, opciones:['Hogar / Casa habitación','Edificio','Local comercial','Oficina','Bodega / Almacén','Construcción en proceso'] },
  { key:'uso_bien',     label:'Uso del bien',              section:'Bien',        tipo:'select', req:true, opciones:['Habitacional propio','Habitacional rentado','Comercial propio','Comercial rentado'] },
  { key:'calle',        label:'Dirección del bien',        section:'Bien',        tipo:'text',   req:true },
  { key:'cp',           label:'Código Postal',             section:'Bien',        tipo:'text',   req:true },
  { key:'estado',       label:'Estado',                    section:'Bien',        tipo:'select', req:true, opciones:['CDMX','Jalisco','Nuevo León','Estado de México','Puebla','Otro'] },
  { key:'valor_inmueble', label:'Valor del inmueble (MXN)',section:'Bien',        tipo:'text',   req:true },
  { key:'valor_contenidos',label:'Valor contenidos (MXN)', section:'Bien',        tipo:'text',   req:false },
  // Coberturas
  { key:'incendio',     label:'Cobertura incendio',        section:'Cobertura', tipo:'select', req:true, opciones:['Sí','No'] },
  { key:'robo',         label:'Cobertura robo',            section:'Cobertura', tipo:'select', req:true, opciones:['Sí','No'] },
  { key:'rc',           label:'RC hacia terceros',         section:'Cobertura', tipo:'select', req:false, opciones:['Sí','No'] },
  { key:'cristales',    label:'Cristales',                 section:'Cobertura', tipo:'select', req:false, opciones:['Sí','No'] },
  { key:'forma_pago',   label:'Forma de pago',             section:'Cobertura', tipo:'select', req:true, opciones:['Anual','Semestral','Trimestral','Mensual'] },
]

const CAMPOS_RC: Campo[] = [
  { key:'empresa',      label:'Razón social',                  section:'Empresa', tipo:'text',   req:true },
  { key:'rfc',          label:'RFC',                           section:'Empresa', tipo:'text',   req:true },
  { key:'giro',         label:'Giro / actividad profesional',  section:'Empresa', tipo:'text',   req:true },
  { key:'num_empleados',label:'Número de empleados',           section:'Empresa', tipo:'text',   req:true },
  { key:'tel',          label:'Teléfono',                      section:'Empresa', tipo:'tel',    req:true },
  { key:'email',        label:'Correo electrónico',            section:'Empresa', tipo:'email',  req:true },
  { key:'estado',       label:'Estado',                        section:'Empresa', tipo:'select', req:true, opciones:['CDMX','Jalisco','Nuevo León','Estado de México','Puebla','Otro'] },
  { key:'cp',           label:'Código Postal',                 section:'Empresa', tipo:'text',   req:true },
  { key:'ingresos',     label:'Ingresos anuales (MXN)',        section:'Empresa', tipo:'text',   req:true },
  // Cobertura
  { key:'limite',       label:'Límite de responsabilidad',     section:'Cobertura', tipo:'select', req:true, opciones:['$500,000','$1,000,000','$3,000,000','$5,000,000','$10,000,000'] },
  { key:'tipo_rc',      label:'Tipo de RC',                    section:'Cobertura', tipo:'select', req:true, opciones:['RC General','RC Profesional','RC Productos','RC Patronal','RC Directores y Funcionarios'] },
  { key:'siniestros',   label:'Siniestros previos',            section:'Cobertura', tipo:'select', req:true, opciones:['Ninguno','1-2','Más de 2'] },
  { key:'forma_pago',   label:'Forma de pago',                 section:'Cobertura', tipo:'select', req:true, opciones:['Anual','Semestral','Trimestral'] },
]

const CAMPOS_POR_RAMO: Record<RamoId, Campo[]> = {
  'auto': CAMPOS_AUTO,
  'gmm-individual': CAMPOS_GMM_INDIVIDUAL,
  'gmm-colectivo': CAMPOS_GMM_COLECTIVO,
  'vida': CAMPOS_VIDA,
  'danos': CAMPOS_DANOS,
  'rc': CAMPOS_RC,
}

const RAMOS_CONFIG: Record<RamoId, { label: string; icon: React.ElementType; color: string; pdf?: string }> = {
  'auto':           { label:'Seguro de Auto',       icon: Car,       color:'#F7941D', pdf:'/Solicitud Auto .pdf' },
  'gmm-individual': { label:'GMM Individual',       icon: Shield,    color:'#69A481', pdf:'/MEX-Solicitud-GMM-individual-2024.pdf' },
  'gmm-colectivo':  { label:'GMM Colectivo',        icon: Shield,    color:'#69A481', pdf:'/Solicitud_Gastos_Medicos_Mayores_Colectivo_Centenario.pdf' },
  'vida':           { label:'Seguro de Vida',       icon: Heart,     color:'#7C1F31' },
  'danos':          { label:'Daños / Hogar',        icon: Home,      color:'#1A1F2B' },
  'rc':             { label:'RC Empresarial',       icon: Briefcase, color:'#6B7280' },
}

// ─── XORIA MESSAGES ───────────────────────────────────────────────────────────
const XORIA_PROMPTS: Record<RamoId, string[]> = {
  'auto': [
    '¡Hola! Voy a guiarte para llenar la solicitud de seguro de Auto. Empecemos con los datos del contratante. ¿Cuál es el nombre completo del asegurado?',
    'Perfecto. Ahora dame el RFC y CURP del contratante.',
    'Bien. ¿Cuáles son los datos del vehículo? Marca, modelo y año.',
    'Ya casi terminamos. Dame el número de serie (VIN) y las placas del vehículo.',
    'Excelente. ¿Qué plan prefieres: Básica, Intermedia o Amplia? Y ¿cuál es la forma de pago?',
  ],
  'gmm-individual': [
    '¡Hola! Voy a ayudarte con la solicitud de GMM Individual. Primero necesito los datos del titular. ¿Nombre completo?',
    'Ahora los datos de salud: peso, talla y si tiene algún padecimiento preexistente.',
    'Finalmente la cobertura: suma asegurada, deducible y forma de pago.',
  ],
  'gmm-colectivo': [
    '¡Hola! Para GMM Colectivo necesito los datos de la empresa. ¿Cuál es la razón social?',
    'Número de empleados y contacto de RH.',
    'Datos de cobertura: suma asegurada por empleado, deducible e incluir dependientes.',
  ],
  'vida': [
    '¡Hola! Vamos con Seguro de Vida. Necesito datos del asegurado. ¿Nombre completo?',
    'Datos de salud: peso, talla, si fuma y enfermedades preexistentes.',
    'Suma asegurada, tipo de plan y beneficiarios.',
  ],
  'danos': [
    '¡Hola! Para Daños / Hogar necesito el tipo de bien asegurado. ¿Es casa habitación, local comercial u otro?',
    'Dirección completa del inmueble y valor estimado.',
    'Coberturas requeridas: incendio, robo, RC hacia terceros.',
  ],
  'rc': [
    '¡Hola! Para RC Empresarial necesito la razón social y giro de la empresa.',
    'Número de empleados, ingresos anuales y estado.',
    'Límite de responsabilidad y tipo de RC requerido.',
  ],
}

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] text-[#6B7280] tracking-widest uppercase font-medium">
        {label}{required && <span className="text-[#F7941D] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/30 backdrop-blur-sm border border-white/50 rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] placeholder:text-[#B5BFC6] outline-none focus:border-[#F7941D]/60 focus:bg-[#F7941D]/3 transition-all duration-200 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]"
    />
  )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
function SolicitudContent() {
  const router = useRouter()
  const params = useSearchParams()
  const tipoParam = (params.get('tipo') || 'auto') as RamoId
  const [ramo, setRamo] = useState<RamoId>(tipoParam)
  const campos = CAMPOS_POR_RAMO[ramo]
  const config = RAMOS_CONFIG[ramo]
  const sections = [...new Set(campos.map(c => c.section))]

  const [datos, setDatos] = useState<Record<string, string>>({})
  const [seccionAbierta, setSeccionAbierta] = useState<string>(sections[0])
  const [xoriaStep, setXoriaStep] = useState(0)
  const [xoriaMsg, setXoriaMsg] = useState(XORIA_PROMPTS[ramo][0])
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role:'user'|'xoria'; msg:string }[]>([
    { role:'xoria', msg: XORIA_PROMPTS[ramo][0] }
  ])
  const [isListening, setIsListening] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const totalCampos = campos.length
  const camposLlenos = campos.filter(c => datos[c.key]?.trim()).length
  const progreso = Math.round((camposLlenos / totalCampos) * 100)
  const completo = progreso === 100

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  useEffect(() => {
    setDatos({})
    setXoriaStep(0)
    setXoriaMsg(XORIA_PROMPTS[ramo][0])
    setChatHistory([{ role:'xoria', msg: XORIA_PROMPTS[ramo][0] }])
    setSeccionAbierta(CAMPOS_POR_RAMO[ramo][0]?.section || '')
  }, [ramo])

  function set(key: string, val: string) {
    setDatos(d => ({ ...d, [key]: val }))
  }

  async function enviarChat() {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setIsSending(true)
    setChatHistory(h => [...h, { role:'user', msg: userMsg }])

    try {
      const res = await fetch('/api/xoria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...chatHistory.map(m => ({ role: m.role === 'xoria' ? 'assistant' : 'user', content: m.msg })),
            { role: 'user', content: userMsg }
          ],
          context: {
            perfil: `agente_solicitud_${ramo}`,
            ramo: config.label,
            datos_actuales: datos,
            campos_requeridos: campos.filter(c => c.req).map(c => c.label),
            instruccion: `Eres XORIA ayudando a llenar una solicitud de ${config.label}. Extrae datos de la respuesta del usuario y confirma qué campos quedaron registrados. Si detectas datos concretos (nombre, RFC, datos del vehículo, etc.) indícalo explícitamente. Sé breve y directo.`
          }
        })
      })
      const json = await res.json()
      const reply = json.reply || json.response || 'Entendido, continúa con el formulario.'
      setChatHistory(h => [...h, { role:'xoria', msg: reply }])
      const nextStep = Math.min(xoriaStep + 1, XORIA_PROMPTS[ramo].length - 1)
      setXoriaStep(nextStep)
    } catch {
      setChatHistory(h => [...h, { role:'xoria', msg: 'Entendido. Por favor completa los campos del formulario.' }])
    }
    setIsSending(false)
  }

  function toggleMic() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz.')
      return
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.lang = 'es-MX'
    recognition.continuous = false
    recognition.interimResults = false
    setIsListening(true)
    recognition.start()
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setChatInput(transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
  }

  function guardarSolicitud() {
    const id = `SOL-${Date.now()}`
    const solicitud = { id, ramo, config: config.label, datos, fecha: new Date().toLocaleDateString('es-MX'), estado: 'en_revision' }
    const prev = JSON.parse(localStorage.getItem('iaos_solicitudes') || '[]')
    localStorage.setItem('iaos_solicitudes', JSON.stringify([solicitud, ...prev].slice(0, 50)))
    setGuardado(true)
    setTimeout(() => router.push('/agent/nueva-venta'), 2000)
  }

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B]">
          <ArrowLeft size={15} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-[#F7941D] font-bold tracking-widest uppercase">XORIA · Solicitud con dictado</p>
          <h1 className="text-[20px] text-[#1A1F2B] font-bold">{config.label}</h1>
        </div>
        {config.pdf && (
          <a href={config.pdf} target="_blank" download
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] text-[#6B7280] font-semibold bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-all">
            <Download size={12} /> Formato PDF
          </a>
        )}
      </div>

      {/* Selector de ramo */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(RAMOS_CONFIG) as RamoId[]).map(r => {
          const rc = RAMOS_CONFIG[r]
          const Icon = rc.icon
          const sel = ramo === r
          return (
            <button key={r} onClick={() => setRamo(r)}
              className={cn('flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all',
                sel ? 'text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)]' : 'text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B]'
              )}
              style={sel ? { background: rc.color } : {}}>
              <Icon size={12} /> {rc.label}
            </button>
          )
        })}
      </div>

      {/* Layout: formulario + chat */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Formulario — 3 columnas */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Progreso */}
          <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <div className="flex justify-between text-[11px] mb-2">
              <span className="text-[#6B7280]">{camposLlenos} de {totalCampos} campos</span>
              <span className={cn('font-bold', completo ? 'text-[#69A481]' : 'text-[#F7941D]')}>{progreso}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#EFF2F9] shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.12)]">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progreso}%`, background: completo ? 'linear-gradient(90deg,#69A481,#4a7a5d)' : 'linear-gradient(90deg,#F7941D,#e08019)' }} />
            </div>
          </div>

          {/* REPUVE — solo Auto */}
          {ramo === 'auto' && (
            <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#1A1F2B] text-white text-[9px] font-bold">R</div>
                  <p className="text-[11px] font-bold text-[#1A1F2B] tracking-wide">REPUVE — Validación vehicular</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F7941D]/10 text-[#F7941D]">OBLIGATORIO</span>
              </div>
              <p className="text-[11px] text-[#6B7280] mb-3">Verifica el VIN, placas y reportes de robo antes de emitir.</p>
              <div className="flex gap-2 flex-wrap">
                <a href="https://car-buddy.co/vinmxes" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg,#1A1F2B,#2D3548)', boxShadow:'0 4px 12px rgba(28,35,51,0.25)' }}>
                  <Shield size={12} /> Consultar REPUVE
                </a>
                <a href="https://car-buddy.co/vinmxes" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#7C1F31] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-all">
                  <AlertTriangle size={12} /> Verificar robo
                </a>
              </div>
            </div>
          )}

          {/* Secciones del formulario */}
          {sections.map(sec => {
            const camposSeccion = campos.filter(c => c.section === sec)
            const abierta = seccionAbierta === sec
            const llenados = camposSeccion.filter(c => datos[c.key]?.trim()).length
            return (
              <div key={sec} className="bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] overflow-hidden">
                <button
                  onClick={() => setSeccionAbierta(abierta ? '' : sec)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white',
                      llenados === camposSeccion.length ? 'bg-[#69A481]' : 'bg-[#F7941D]')}>
                      {llenados === camposSeccion.length ? <CheckCircle size={12} /> : llenados}
                    </div>
                    <p className="text-[13px] font-bold text-[#1A1F2B]">{sec}</p>
                    <span className="text-[10px] text-[#9CA3AF]">{llenados}/{camposSeccion.length}</span>
                  </div>
                  {abierta ? <ChevronUp size={14} className="text-[#9CA3AF]" /> : <ChevronDown size={14} className="text-[#9CA3AF]" />}
                </button>
                {abierta && (
                  <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {camposSeccion.map(campo => (
                      <Field key={campo.key} label={campo.label} required={campo.req}>
                        {campo.tipo === 'select' ? (
                          <NeuSelect
                            value={datos[campo.key] || ''}
                            onChange={v => set(campo.key, v)}
                            options={(campo.opciones || []).map(o => ({ value: o, label: o }))}
                            placeholder="Selecciona"
                          />
                        ) : (
                          <TextInput
                            value={datos[campo.key] || ''}
                            onChange={v => set(campo.key, v)}
                            placeholder={campo.label}
                            type={campo.tipo}
                          />
                        )}
                      </Field>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Botón guardar */}
          {guardado ? (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#69A481]/10 border border-[#69A481]/30 text-[#69A481] font-semibold text-[13px]">
              <CheckCircle size={16} /> Solicitud guardada. Redirigiendo...
            </div>
          ) : (
            <button onClick={guardarSolicitud} disabled={!completo}
              className={cn('flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-[14px] transition-all',
                completo ? 'hover:scale-[1.02] hover:shadow-[0_10px_32px_rgba(247,148,29,0.5)]' : 'opacity-40 cursor-not-allowed'
              )}
              style={{ background: 'linear-gradient(135deg,#F7941D,#c8600a)', boxShadow: completo ? '0 6px 24px rgba(247,148,29,0.4)' : undefined }}>
              <FileText size={16} />
              {completo ? 'Guardar y enviar solicitud' : `Completa ${totalCampos - camposLlenos} campos más`}
            </button>
          )}
        </div>

        {/* XORIA Chat — 2 columnas */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex flex-col" style={{ height: '70vh', minHeight: 400 }}>

            {/* Header chat */}
            <div className="flex items-center gap-2 p-4 border-b border-[#E4EBF1]">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#1A1F2B]">XORIA</p>
                <p className="text-[10px] text-[#69A481]">Asistente de solicitud activo</p>
              </div>
              <button onClick={() => {
                setDatos({})
                setChatHistory([{ role:'xoria', msg: XORIA_PROMPTS[ramo][0] }])
                setXoriaStep(0)
              }}
                className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#1A1F2B] bg-[#EFF2F9] shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.10)]">
                <RotateCcw size={12} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {chatHistory.map((m, i) => (
                <div key={i} className={cn('flex gap-2 max-w-[90%]', m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start')}>
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                    m.role === 'xoria' ? 'overflow-hidden' : 'bg-[#F7941D]')}>
                    {m.role === 'xoria'
                      ? <Image src="/Icono xoria.png" alt="X" width={24} height={24} className="object-cover w-full h-full" />
                      : <User size={11} className="text-white" />}
                  </div>
                  <div className={cn('rounded-2xl px-3 py-2 text-[12px] leading-relaxed',
                    m.role === 'xoria'
                      ? 'bg-[#EFF2F9] text-[#1A1F2B] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] rounded-tl-sm'
                      : 'text-white rounded-tr-sm'
                  )}
                    style={m.role === 'user' ? { background: 'linear-gradient(135deg,#F7941D,#e08019)' } : {}}>
                    {m.msg}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex gap-2 self-start">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image src="/Icono xoria.png" alt="X" width={24} height={24} className="object-cover w-full h-full" />
                  </div>
                  <div className="bg-[#EFF2F9] rounded-2xl rounded-tl-sm px-3 py-2 shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]">
                    <Loader2 size={14} className="text-[#F7941D] animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#E4EBF1]">
              <div className="flex gap-2">
                <button onClick={toggleMic}
                  className={cn('w-9 h-9 flex items-center justify-center rounded-xl shrink-0 transition-all',
                    isListening ? 'text-white shadow-[0_4px_14px_rgba(247,148,29,0.4)]' : 'text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#F7941D]'
                  )}
                  style={isListening ? { background: 'linear-gradient(135deg,#F7941D,#e08019)' } : {}}>
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviarChat()}
                  placeholder="Responde a XORIA o dicta los datos..."
                  className="flex-1 bg-white/30 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-2 text-[12px] text-[#1A1F2B] placeholder:text-[#B5BFC6] outline-none focus:border-[#F7941D]/50 shadow-[inset_-2px_-2px_4px_#FAFBFF,inset_2px_2px_4px_rgba(22,27,29,0.08)]"
                />
                <button onClick={enviarChat} disabled={isSending || !chatInput.trim()}
                  className={cn('w-9 h-9 flex items-center justify-center rounded-xl shrink-0 transition-all',
                    chatInput.trim() ? 'text-white hover:scale-105 shadow-[0_4px_14px_rgba(247,148,29,0.4)]' : 'text-[#B5BFC6] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]'
                  )}
                  style={chatInput.trim() ? { background: 'linear-gradient(135deg,#F7941D,#e08019)' } : {}}>
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[9px] text-[#B5BFC6] mt-1.5 text-center">Puedes hablar o escribir — XORIA completa los campos automáticamente</p>
            </div>
          </div>

          {/* Botones de formato */}
          <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest font-semibold mb-3">Formatos oficiales</p>
            <div className="flex flex-col gap-2">
              <a href="/Solicitud Auto .pdf" target="_blank" download
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#1A1F2B] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#F7941D] transition-all">
                <Download size={12} /> Solicitud Seguro Auto
              </a>
              <a href="/MEX-Solicitud-GMM-individual-2024.pdf" target="_blank" download
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#1A1F2B] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#F7941D] transition-all">
                <Download size={12} /> Solicitud GMM Individual
              </a>
              <a href="/Solicitud_Gastos_Medicos_Mayores_Colectivo_Centenario.pdf" target="_blank" download
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#1A1F2B] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#F7941D] transition-all">
                <Download size={12} /> Solicitud GMM Colectivo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SolicitudPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-[#9CA3AF]"><Loader2 className="animate-spin mr-2" size={18}/>Cargando solicitud...</div>}>
      <SolicitudContent />
    </Suspense>
  )
}
