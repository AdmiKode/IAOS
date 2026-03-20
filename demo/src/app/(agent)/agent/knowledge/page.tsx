'use client'
import { useState, useRef } from 'react'
import { MOCK_ASEGURADORAS, MOCK_KB_DOCS, MOCK_RAMOS } from '@/data/mock'
import { Search, Download, BookOpen, FileText, Shield, ChevronRight, Upload, X, CheckCircle, Plus, Eye, Tag, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuSelect } from '@/components/ui'

const TIPO_COLOR: Record<string, string> = {
  circular:'#7C1F31', clausula:'#F7941D', manual:'#69A481', formato:'#6B7280',
  contrato:'#1A1F2B', Condiciones:'#7C1F31', Tabla:'#F7941D', Manual:'#69A481',
  Guía:'#1A1F2B', Cláusula:'#F7941D', Procedimiento:'#69A481',
}

// Contenido simulado realista por documento
const CONTENIDO_DOCS: Record<string, { titulo:string; cuerpo:string; vigencia?:string; clausulas?:{num:string;texto:string}[] }> = {
  kb1: {
    titulo:'Condiciones Generales GMM GNP 2025',
    vigencia:'Vigencia: 1 enero 2025 — 31 diciembre 2025',
    cuerpo:'El presente contrato ampara los gastos médicos mayores del asegurado y sus beneficiarios designados conforme a lo establecido en la carátula de la póliza. GNP Seguros actúa como Compañía Aseguradora y el Contratante como persona física o moral que suscribe el contrato.',
    clausulas:[
      { num:'Cláusula 1', texto:'COBERTURA BÁSICA — Se cubren hospitalizaciones, cirugías, honorarios médicos, estudios de laboratorio e imagen dentro de la Red Médica de GNP.' },
      { num:'Cláusula 2', texto:'SUMA ASEGURADA — La suma asegurada mínima es de $1,000,000 MXN y máxima ilimitada conforme al plan contratado.' },
      { num:'Cláusula 3', texto:'DEDUCIBLE — El deducible aplicable es del 10% del monto del siniestro, con un mínimo de $5,000 MXN por evento cubierto.' },
      { num:'Cláusula 4', texto:'COASEGURO — El asegurado participará con el 10% de los gastos cubiertos una vez cubierto el deducible, hasta un tope del 5% de la suma asegurada.' },
      { num:'Cláusula 5', texto:'PREEXISTENCIAS — Enfermedades o padecimientos anteriores a la fecha de inicio de vigencia quedan excluidas durante los primeros 24 meses de la póliza.' },
      { num:'Cláusula 6', texto:'MATERNIDAD — Se cubre parto, cesárea y complicaciones del embarazo a partir del segundo año de antigüedad de la póliza.' },
      { num:'Cláusula 7', texto:'CANCELACIÓN — El asegurado puede cancelar la póliza en cualquier momento. GNP reembolsará la prima no devengada conforme a tabla de corto plazo.' },
    ]
  },
  kb2: {
    titulo:'Tabla de Deducibles GMM GNP 2025',
    vigencia:'Vigencia: 1 enero 2025',
    cuerpo:'Tabla oficial de deducibles aplicables a los planes de Gastos Médicos Mayores GNP para el ejercicio 2025. Los montos están expresados en pesos mexicanos (MXN) y aplican por evento y por asegurado.',
    clausulas:[
      { num:'Plan Básico',       texto:'Deducible: $10,000 MXN | Coaseguro: 10% | Tope coaseguro: 5% SA' },
      { num:'Plan Intermedio',   texto:'Deducible: $20,000 MXN | Coaseguro: 10% | Tope coaseguro: 10% SA' },
      { num:'Plan Ejecutivo',    texto:'Deducible: $30,000 MXN | Coaseguro: 10% | Tope coaseguro: 10% SA' },
      { num:'Plan Premier',      texto:'Deducible: $50,000 USD | Coaseguro: 20% | Tope coaseguro: $10,000 USD' },
      { num:'Maternidad',        texto:'Deducible adicional: $5,000 MXN aplicable a partir del 2do año de póliza' },
      { num:'Dental / Visión',   texto:'No aplica deducible en planes con cobertura dental y visión incluida' },
    ]
  },
  kb3: {
    titulo:'Manual Operativo Agentes GNP 2025',
    vigencia:'Versión 2025-v1 — Revisado 01/Feb/2025',
    cuerpo:'Este manual establece los procesos, responsabilidades y herramientas disponibles para los agentes certificados ante GNP Seguros. Su cumplimiento es obligatorio y forma parte del Código de Conducta del Agente.',
    clausulas:[
      { num:'Sección 1 — Proceso de Cotización',     texto:'Toda cotización debe generarse a través del Sistema de Cotización GNP (SCG) o la plataforma IAOS. Cotizaciones manuales requieren autorización del Promotor.' },
      { num:'Sección 2 — Emisión de Pólizas',        texto:'La emisión debe completarse dentro de los 30 días naturales posteriores a la aceptación del cliente. Documentación requerida: INE, CURP, comprobante de domicilio y solicitud firmada.' },
      { num:'Sección 3 — Cobranza',                  texto:'El agente es responsable de gestionar el pago de la prima en tiempo y forma. Se permiten hasta 2 recibos vencidos antes de la suspensión automática de cobertura.' },
      { num:'Sección 4 — Comisiones',                texto:'Las comisiones se pagan los días 5 y 20 de cada mes. El porcentaje base es del 20% sobre prima neta para GMM, 15% para Auto y 25% para Vida.' },
      { num:'Sección 5 — Siniestros',                texto:'El agente debe notificar el siniestro dentro de las 24 horas de conocido. Se debe llenar el formato F-SIN-01 y enviarlo al área de Siniestros.' },
      { num:'Sección 6 — Capacitación',              texto:'El agente debe completar al menos 20 horas de capacitación continua al año para mantener su certificación activa ante AMIS y CNSF.' },
    ]
  },
  kb4: {
    titulo:'Condiciones Generales GMM Colectivo AXA',
    vigencia:'Vigencia: 1 marzo 2025',
    cuerpo:'Contrato colectivo de Gastos Médicos Mayores para grupos de 5 o más personas. El Contratante es la empresa o persona moral que suscribe la póliza en beneficio de sus colaboradores.',
    clausulas:[
      { num:'Art. 1 — Grupo Mínimo',     texto:'El mínimo de asegurados para contratar GMM Colectivo AXA es de 5 personas. Grupos de 3-4 aplican tarifa individual más comisión de gestión.' },
      { num:'Art. 2 — Altas y Bajas',    texto:'Las altas deben notificarse antes del día 15 del mes para tener vigencia el día 1 del mes siguiente. Las bajas aplican el último día del mes en que se notifican.' },
      { num:'Art. 3 — Maternidad',       texto:'Cobertura de maternidad desde el primer evento sin periodo de espera para grupos de 10 o más asegurados con al menos 30% de mujeres en edad fértil.' },
      { num:'Art. 4 — Siniestralidad',   texto:'Si la siniestralidad supera el 80% de la prima cobrada, AXA se reserva el derecho a proponer reclasificación de tarifas al momento de la renovación.' },
      { num:'Art. 5 — Renovación',       texto:'La renovación automática aplica salvo aviso de no renovación con 60 días de anticipación. AXA informará la nueva prima 90 días antes del vencimiento.' },
    ]
  },
  kb5: {
    titulo:'Guía de Altas y Bajas Colectivo AXA',
    vigencia:'Revisado: junio 2025',
    cuerpo:'Procedimiento paso a paso para gestionar movimientos de asegurados en pólizas GMM Colectivo AXA. Aplica para agentes y administradores de cuenta.',
    clausulas:[
      { num:'Paso 1 — Alta nueva',          texto:'Solicita el formato F-ALTA-AXA al agente o descárgalo de la plataforma IAOS. Llena: nombre, fecha de nacimiento, CURP, parentesco y fecha de alta solicitada.' },
      { num:'Paso 2 — Documentación',       texto:'Adjunta: INE del asegurado, acta de nacimiento (si es menor de edad) y CURP. Para cónyuge: acta de matrimonio o concubinato.' },
      { num:'Paso 3 — Envío',               texto:'Envía el formato y documentos al correo colectivos@axa.mx antes del día 15 del mes. Recibirás confirmación en 3 días hábiles.' },
      { num:'Paso 4 — Baja de asegurado',   texto:'Completa el formato F-BAJA-AXA indicando nombre, número de póliza y fecha de baja. Las bajas aplican el último día del mes indicado.' },
      { num:'Paso 5 — Ajuste de prima',     texto:'AXA emitirá un endoso de ajuste de prima dentro de los 10 días hábiles posteriores al movimiento confirmado.' },
    ]
  },
  kb6: {
    titulo:'Cláusula de Cobertura Amplia Qualitas 2026',
    vigencia:'Vigencia: 1 enero 2026',
    cuerpo:'Descripción técnica de las coberturas incluidas en el plan Amplia de Qualitas para vehículos particulares. Este documento es de uso exclusivo del agente para comparativas y argumentación de ventas.',
    clausulas:[
      { num:'Daños Materiales',        texto:'Cubre daños al vehículo asegurado por colisión, vuelco, caída de objetos, inundación, granizo, terremoto y eventos especiales. Sin límite de suma.' },
      { num:'Robo Total',              texto:'Indemnización por robo total del vehículo. Aplica valor comercial menos 20% de deducible. Tiempo de resolución: 30 días hábiles.' },
      { num:'Responsabilidad Civil',   texto:'Límite RC: $3,000,000 MXN. Cubre daños a terceros en bienes y personas causados por el vehículo asegurado.' },
      { num:'Gastos Médicos Ocupantes',texto:'Hasta $150,000 MXN por persona para gastos médicos de conductor y pasajeros derivados de un accidente de tránsito.' },
      { num:'Asistencia Vial 24/7',    texto:'Grúa hasta 100 km, paso de corriente, cambio de llanta, combustible de emergencia y cerrajería sin costo adicional.' },
      { num:'Auto Sustituto',          texto:'Vehículo de reemplazo hasta 30 días mientras el asegurado no tenga resolución de siniestro de pérdida total.' },
    ]
  },
  kb7: {
    titulo:'Procedimiento de Siniestros Auto Qualitas',
    vigencia:'Versión 2025-v3 — septiembre 2025',
    cuerpo:'Protocolo oficial para la apertura y seguimiento de siniestros en el ramo Auto de Qualitas. El agente debe conocer y comunicar este proceso al asegurado.',
    clausulas:[
      { num:'Paso 1 — Reporte inmediato',  texto:'Llamar al 800 288 QUALITAS (800 288 7825) dentro de las primeras 24 horas del siniestro. Tener a la mano: número de póliza, placas, descripción del accidente.' },
      { num:'Paso 2 — Ajustador',          texto:'Qualitas enviará un ajustador en menos de 2 horas en zonas metropolitanas. En zonas rurales hasta 4 horas. El ajustador tomará fotos y levantará el reporte.' },
      { num:'Paso 3 — Taller',             texto:'Qualitas tiene red de talleres certificados en más de 200 ciudades. El asegurado puede usar taller fuera de red con reembolso hasta el 80% del costo de red.' },
      { num:'Paso 4 — Resolución',         texto:'Daños parciales: resolución en 5-10 días hábiles. Pérdida total: 30 días hábiles a partir de entrega de documentación completa.' },
      { num:'Paso 5 — Documentación requerida', texto:'INE del asegurado, licencia de conducir vigente, tarjeta de circulación, denuncia ante MP (si aplica), carta de hechos firmada.' },
    ]
  },
  kb8: {
    titulo:'Condiciones Generales Hogar MAPFRE 2025',
    vigencia:'Vigencia: 1 enero 2025',
    cuerpo:'El seguro de Hogar MAPFRE ampara la estructura del inmueble, contenidos, responsabilidad civil familiar y asistencias del hogar. Aplica para casas y departamentos en México.',
    clausulas:[
      { num:'Cobertura — Estructura',          texto:'Daños al inmueble por incendio, explosión, caída de rayo, huracán, terremoto, inundación, robo con violencia y daños por agua.' },
      { num:'Cobertura — Contenidos',          texto:'Bienes muebles dentro del inmueble hasta el 50% de la suma asegurada del inmueble. Electrodomésticos, ropa, electrónicos y mobiliario.' },
      { num:'RC Familiar',                     texto:'Hasta $500,000 MXN por daños que los miembros del hogar causen involuntariamente a terceros.' },
      { num:'Asistencia del Hogar 24/7',       texto:'Plomería, electricidad, cerrajería y vidriería de urgencia sin costo hasta 2 eventos por año de vigencia.' },
      { num:'Suma Asegurada Mínima',           texto:'$500,000 MXN. MAPFRE aplica cláusula de infraseguro proporcional si el valor real del inmueble supera la suma asegurada en más del 20%.' },
    ]
  },
  kb9: {
    titulo:'Tabla de Primas Vida Temporal Metlife 2026',
    vigencia:'Vigencia: 1 enero 2026',
    cuerpo:'Tarifas anuales para el plan Vida Temporal renovable MetLife. Las primas están expresadas en MXN por cada $100,000 de suma asegurada. Las tarifas no incluyen derechos de póliza ($350 anuales) ni recargos fraccionarios.',
    clausulas:[
      { num:'Edad 18-25 H/M', texto:'Prima anual: $420 / $390 por $100K SA | Plazo máximo: 30 años | Renovable hasta edad 75' },
      { num:'Edad 26-35 H/M', texto:'Prima anual: $580 / $510 por $100K SA | Plazo máximo: 25 años | Renovable hasta edad 75' },
      { num:'Edad 36-45 H/M', texto:'Prima anual: $890 / $760 por $100K SA | Plazo máximo: 20 años | Renovable hasta edad 75' },
      { num:'Edad 46-55 H/M', texto:'Prima anual: $1,540 / $1,210 por $100K SA | Plazo máximo: 15 años | Renovable hasta edad 75' },
      { num:'Edad 56-65 H/M', texto:'Prima anual: $2,980 / $2,340 por $100K SA | Plazo máximo: 10 años | Renovable hasta edad 75' },
      { num:'Suma asegurada mínima', texto:'$500,000 MXN para edades 18-55. $300,000 MXN para edades 56-65.' },
    ]
  },
  kb10: {
    titulo:'Proceso de Expedición Vida Metlife',
    vigencia:'Versión 2025-v2 — julio 2025',
    cuerpo:'Proceso oficial para la expedición de pólizas de Vida Temporal en MetLife. Aplica para agentes certificados ante CNSF y vinculados a MetLife México.',
    clausulas:[
      { num:'Paso 1 — Solicitud',         texto:'Llenar solicitud F-VIDA-MET firmada por el solicitante. Indicar suma asegurada, plazo, beneficiarios y porcentajes.' },
      { num:'Paso 2 — Cuestionario médico',texto:'Para sumas hasta $3,000,000 MXN: cuestionario médico simplificado. Más de $3M: exámenes médicos en clínica designada por MetLife.' },
      { num:'Paso 3 — Suscripción',       texto:'MetLife responde en 5 días hábiles si aplican exclusiones o sobreprimas. El agente notifica al cliente y obtiene conformidad por escrito.' },
      { num:'Paso 4 — Pago inicial',      texto:'El cliente paga la primera fracción de prima. MetLife no emite carátula sin pago acreditado. Se acepta transferencia, cheque certificado o domiciliación.' },
      { num:'Paso 5 — Emisión',           texto:'Póliza emitida y enviada al correo del agente en 3 días hábiles tras pago acreditado. El agente entrega copia física firmada al asegurado.' },
      { num:'Comisión del agente',        texto:'25% del primer año, 15% años 2-5, 10% años 6-10. Bono de permanencia anual para agentes con menos del 5% de caducidad en cartera vida.' },
    ]
  },
}

type Tab = 'docs'|'aseguradoras'
interface DocModal {
  id: string
  nombre: string
  tipo: string
  ramo: string
  version: string
  fecha: string
  size: string
}

export default function KnowledgePage() {
  const [search, setSearch] = useState('')
  const [selectedRamo, setSelectedRamo] = useState<string|null>(null)
  const [tab, setTab] = useState<Tab>('docs')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadFile, setUploadFile] = useState<File|null>(null)
  const [uploadStep, setUploadStep] = useState<'form'|'done'>('form')
  const [uploadForm, setUploadForm] = useState({ nombre:'', ramo:'', aseguradora:'', tipo:'manual' })
  const [openDoc, setOpenDoc] = useState<DocModal|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function openUpload() { setShowUpload(true); setUploadFile(null); setUploadStep('form'); setUploadForm({ nombre:'',ramo:'',aseguradora:'',tipo:'manual' }) }
  function handleUpload() { setUploadStep('done'); setTimeout(() => setShowUpload(false), 1800) }

  const ramos = [...new Set(MOCK_KB_DOCS.map(d => d.ramo))]

  const filteredDocs = MOCK_KB_DOCS.filter(d => {
    const matchSearch = d.nombre.toLowerCase().includes(search.toLowerCase()) || d.ramo.toLowerCase().includes(search.toLowerCase())
    const matchRamo = !selectedRamo || d.ramo === selectedRamo
    return matchSearch && matchRamo
  })

  const filteredAseg = MOCK_ASEGURADORAS.filter(a => {
    const name = (a as {name?:string;nombre?:string}).name || (a as {nombre?:string}).nombre || ''
    return name.toLowerCase().includes(search.toLowerCase())
  })

  const contenido = openDoc ? CONTENIDO_DOCS[openDoc.id] : null

  return (
    <>
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Documentos',     val:MOCK_KB_DOCS.length,                                color:'#6B7280' },
          { label:'Aseguradoras',   val:MOCK_ASEGURADORAS.length,                           color:'#F7941D' },
          { label:'Ramos cubiertos',val:ramos.length,                                       color:'#69A481' },
          { label:'Circulares',     val:MOCK_KB_DOCS.filter(d=>d.tipo==='circular').length, color:'#7C1F31' },
        ].map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:`${k.color}15` }}>
              <BookOpen size={14} style={{ color:k.color }} />
            </div>
            <div>
              <p className="text-[20px] leading-tight" style={{ color:k.color }}>{k.val}</p>
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Upload */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar documentos, ramos, aseguradoras..."
            className="w-full bg-[#EFF2F9] pl-10 pr-4 py-3 text-[13px] text-[#1A1F2B] rounded-2xl outline-none shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)] placeholder:text-[#9CA3AF]" />
        </div>
        <button onClick={openUpload} className="flex items-center gap-2 px-4 py-2 rounded-2xl text-white text-[12px] font-semibold transition-all hover:scale-[1.02] shrink-0"
          style={{ background:'linear-gradient(135deg,#F7941D,#e08019)', boxShadow:'0 4px 12px rgba(247,148,29,0.35)' }}>
          <Plus size={13} /> Subir doc
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#EFF2F9] rounded-2xl p-1.5 shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)] w-fit">
        {[{key:'docs',label:'Documentos'},{key:'aseguradoras',label:'Aseguradoras'}].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key as Tab)}
            className={cn('px-5 py-2 rounded-xl text-[12px] transition-all font-semibold',
              tab===t.key?'bg-[#EFF2F9] text-[#F7941D] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)]':'text-[#9CA3AF] hover:text-[#6B7280]')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==='docs' && (
        <div className="flex gap-4">
          {/* Filtro ramos */}
          <div className="w-[160px] shrink-0 flex flex-col gap-1">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest px-1 mb-1">Filtrar ramo</p>
            {[null,...ramos].map(r=>(
              <button key={String(r)} onClick={()=>setSelectedRamo(r)}
                className={cn('text-left text-[12px] px-3 py-2 rounded-xl transition-all',
                  selectedRamo===r?'bg-[#EFF2F9] text-[#F7941D] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] font-semibold':'text-[#9CA3AF] hover:text-[#6B7280]')}>
                {r===null?'Todos':r}
              </button>
            ))}
          </div>

          {/* Lista docs */}
          <div className="flex-1 flex flex-col gap-3">
            {filteredDocs.length===0 && (
              <div className="text-center py-12 text-[#9CA3AF] text-[13px]">No se encontraron documentos</div>
            )}
            {filteredDocs.map(doc=>{
              const color = TIPO_COLOR[doc.tipo] || '#6B7280'
              return (
                <div key={doc.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-4 hover:shadow-[-7px_-7px_16px_#FAFBFF,7px_7px_16px_rgba(22,27,29,0.18)] transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${color}15` }}>
                    <FileText size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#1A1F2B] font-semibold truncate">{doc.nombre}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background:`${color}15`, color }}>{doc.tipo}</span>
                      <span className="text-[10px] text-[#9CA3AF]">{doc.ramo}</span>
                      <span className="text-[10px] text-[#B5BFC6]">{doc.version}</span>
                      <span className="text-[10px] text-[#B5BFC6]">{doc.fecha}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-[#9CA3AF]">{doc.size}</span>
                    {/* BOTÓN HOJA — ABRE MODAL */}
                    <button onClick={()=>setOpenDoc(doc)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors"
                      title="Ver contenido">
                      <Eye size={13} />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors" title="Descargar">
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab==='aseguradoras' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAseg.map(a=>{
            const name = (a as {name?:string;nombre?:string}).name || (a as {nombre?:string}).nombre || ''
            return (
              <div key={a.id} className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                    <Shield size={16} className="text-[#F7941D]" />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#1A1F2B] font-semibold">{name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{a.docs} documentos</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {a.ramos.map(r=>(
                    <span key={r} className="text-[10px] text-[#6B7280] bg-[#EFF2F9] px-2 py-0.5 rounded-lg shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]">{r}</span>
                  ))}
                </div>
                <button onClick={()=>setTab('docs')} className="flex items-center justify-between text-[12px] text-[#9CA3AF] hover:text-[#F7941D] transition-colors pt-2 border-t border-[#D1D5DB]/20">
                  <span>Ver documentos</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>

    {/* ─── MODAL CONTENIDO DOCUMENTO ─── */}
    {openDoc && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter:'blur(12px)', background:'rgba(26,31,43,0.45)' }}>
        <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-2xl shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.28)] relative flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-start gap-3 p-6 border-b border-[#E4EBF1]">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background:`${TIPO_COLOR[openDoc.tipo]||'#6B7280'}15` }}>
              <FileText size={18} style={{ color:TIPO_COLOR[openDoc.tipo]||'#6B7280' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-[#1A1F2B] leading-tight">{contenido?.titulo || openDoc.nombre}</p>
              {contenido?.vigencia && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{contenido.vigencia}</p>}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-lg font-semibold" style={{ background:`${TIPO_COLOR[openDoc.tipo]||'#6B7280'}18`, color:TIPO_COLOR[openDoc.tipo]||'#6B7280' }}>{openDoc.tipo}</span>
                <span className="text-[10px] text-[#9CA3AF]">{openDoc.ramo}</span>
                <span className="text-[10px] text-[#B5BFC6]">{openDoc.version} · {openDoc.size}</span>
              </div>
            </div>
            <button onClick={()=>setOpenDoc(null)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#7C1F31] transition-colors shrink-0">
              <X size={15} />
            </button>
          </div>

          {/* Cuerpo desplazable */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {/* Resumen */}
            <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.10)] border border-[#F7941D]/15">
              <p className="text-[12px] leading-relaxed text-[#1A1F2B]">{contenido?.cuerpo || 'Documento oficial. Consulta el archivo para ver el contenido completo.'}</p>
            </div>

            {/* Cláusulas / Artículos */}
            {contenido?.clausulas && (
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">Contenido</p>
                {contenido.clausulas.map((c,i)=>(
                  <div key={i} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.10)] flex gap-3">
                    <div className="shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background:`${TIPO_COLOR[openDoc.tipo]||'#6B7280'}18`, color:TIPO_COLOR[openDoc.tipo]||'#6B7280' }}>{c.num}</span>
                    </div>
                    <p className="text-[12px] text-[#1A1F2B] leading-relaxed flex-1">{c.texto}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Si no hay contenido inventado */}
            {!contenido && (
              <div className="text-center py-8">
                <Tag size={32} className="text-[#B5BFC6] mx-auto mb-3" />
                <p className="text-[13px] text-[#9CA3AF]">Documento indexado. Descarga para ver el contenido completo.</p>
              </div>
            )}
          </div>

          {/* Footer acciones */}
          <div className="flex items-center gap-3 p-4 border-t border-[#E4EBF1]">
            <button onClick={()=>setOpenDoc(null)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B] transition-all">
              <X size={12} /> Cerrar
            </button>
            <div className="flex-1" />
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#F7941D] transition-all">
              <Download size={12} /> Descargar
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-[1.02]"
              style={{ background:'linear-gradient(135deg,#F7941D,#e08019)', boxShadow:'0 4px 12px rgba(247,148,29,0.35)' }}>
              <ExternalLink size={12} /> Abrir en XORIA
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ─── MODAL SUBIR DOCUMENTO ─── */}
    {showUpload && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter:'blur(10px)', background:'rgba(26,31,43,0.4)' }}>
        <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md p-6 shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
          <button onClick={()=>setShowUpload(false)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors"><X size={16} /></button>
          {uploadStep==='done' ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <CheckCircle size={40} className="text-[#69A481]" />
              <p className="text-[14px] text-[#1A1F2B] font-bold">Documento subido</p>
              <p className="text-[12px] text-[#9CA3AF]">Disponible en la base de conocimiento</p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-[16px] text-[#1A1F2B] font-bold">Subir documento</h2>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">Agrega un PDF, circular o manual a la KB</p>
              </div>
              <button onClick={()=>fileRef.current?.click()} className="w-full border-2 border-dashed border-[#D1D5DB] rounded-2xl p-8 flex flex-col items-center gap-2 hover:border-[#F7941D] transition-colors group">
                <Upload size={24} className="text-[#9CA3AF] group-hover:text-[#F7941D] transition-colors" />
                {uploadFile ? <p className="text-[13px] text-[#69A481] font-semibold">{uploadFile.name}</p> : <p className="text-[13px] text-[#9CA3AF]">Haz clic o arrastra un archivo</p>}
                <p className="text-[11px] text-[#B5BFC6]">PDF, DOC, DOCX hasta 20 MB</p>
              </button>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e=>e.target.files&&setUploadFile(e.target.files[0])} />
              <div className="flex flex-col gap-3">
                {[{label:'Nombre del documento',key:'nombre',placeholder:'Circular CNSF 2025-001...'},{label:'Ramo',key:'ramo',placeholder:'GMM, Auto, Vida...'},{label:'Aseguradora',key:'aseguradora',placeholder:'GNP, AXA, Qualitas...'}].map(f=>(
                  <div key={f.key} className="flex flex-col gap-1">
                    <label className="text-[11px] text-[#6B7280] uppercase tracking-widest">{f.label}</label>
                    <input value={uploadForm[f.key as keyof typeof uploadForm]} onChange={e=>setUploadForm(u=>({...u,[f.key]:e.target.value}))} placeholder={f.placeholder}
                      className="bg-white/30 border border-white/50 rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] placeholder:text-[#B5BFC6] outline-none focus:border-[#F7941D]/60 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]" />
                  </div>
                ))}
              </div>
              <button onClick={handleUpload} disabled={!uploadFile||!uploadForm.nombre}
                className={cn('py-3 rounded-2xl text-white font-bold text-[14px] transition-all', (uploadFile&&uploadForm.nombre)?'hover:scale-[1.02]':'opacity-40 cursor-not-allowed')}
                style={(uploadFile&&uploadForm.nombre)?{background:'linear-gradient(135deg,#F7941D,#e08019)',boxShadow:'0 6px 24px rgba(247,148,29,0.40)'}:{}}>
                Subir documento
              </button>
            </>
          )}
        </div>
      </div>
    )}
    </>
  )
}
