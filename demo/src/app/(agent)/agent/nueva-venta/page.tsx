'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft, ArrowRight, Car, Shield, Heart, Home, Briefcase,
  Calculator, Send, Download, CheckCircle, Clock, Mail,
  ChevronRight, Sparkles, RotateCcw, FileText, Bot, X,
  Plus, Eye, Star, AlertTriangle, TrendingUp, DollarSign,
  Mic, MicOff, Volume2, VolumeX
} from 'lucide-react'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { cn } from '@/lib/utils'

// ─── TTS / STT UNIVERSALES ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSR(): any | null {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null
}
function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) { onEnd?.(); return }
  window.speechSynthesis.cancel()
  const utter = () => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-MX'; u.rate = 1.05; u.pitch = 1.0; u.volume = 1
    const voices = window.speechSynthesis.getVoices()
    const pick = voices.find(v => v.name === 'Paulina')
      || voices.find(v => v.name === 'Sabina')
      || voices.find(v => v.name === 'Monica')
      || voices.find(v => v.lang === 'es-MX')
      || voices.find(v => v.lang.startsWith('es'))
    if (pick) u.voice = pick
    if (onEnd) u.onend = () => onEnd()
    window.speechSynthesis.speak(u)
  }
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) { utter(); return }
  const tid = setTimeout(utter, 1200)
  window.speechSynthesis.onvoiceschanged = () => { clearTimeout(tid); window.speechSynthesis.onvoiceschanged = null; utter() }
}

// ─── CONSTANTES ACTUARIALES (factores de riesgo simulados) ───────────────────
const FACTOR_EDAD: Record<string, number> = {
  '18-25': 1.45, '26-35': 1.10, '36-45': 1.00, '46-55': 1.08, '56-65': 1.20, '65+': 1.35
}
const FACTOR_ZONA: Record<string, number> = {
  '06600': 1.35, '64000': 1.10, '44100': 1.20, '45010': 1.05, '14000': 1.15,
  '03810': 1.40, '11000': 1.30, '06700': 1.38, DEFAULT: 1.15
}
const FACTOR_USO: Record<string, number> = {
  particular: 1.00, uber: 1.85, negocio: 1.40, reparto: 1.60
}
const BASE_RATE_AUTO = 4800 // MXN anual base

const MARCAS_POPULARES = [
  'Volkswagen','Nissan','Chevrolet','Toyota','Honda','Kia','Hyundai',
  'Ford','Seat','Mazda','Audi','BMW','Mercedes-Benz','RAM','Jeep','Dodge','Renault','Peugeot'
]

const MODELOS_POR_MARCA: Record<string, string[]> = {
  Volkswagen: ['Jetta','Vento','Golf','Passat','Tiguan','Taos','T-Cross','Polo','ID.4'],
  Nissan: ['Versa','Sentra','Altima','X-Trail','Kicks','Frontier','March','Pathfinder','Murano'],
  Chevrolet: ['Aveo','Sonic','Cruze','Cavalier','Trax','Equinox','Beat','Silverado','S10'],
  Toyota: ['Yaris','Corolla','Camry','RAV4','Hilux','Land Cruiser','Prius','C-HR','Rush'],
  Honda: ['City','Civic','CR-V','HR-V','Accord','Fit','Pilot','Odyssey','Ridgeline'],
  Kia: ['Rio','Forte','Soul','Sportage','Sorento','Seltos','Stinger','EV6','Carnival'],
  Hyundai: ['Grand i10','Accent','Elantra','Tucson','Santa Fe','Creta','Ioniq','Kona','Venue'],
  Ford: ['Figo','Mustang','Explorer','Escape','Expedition','F-150','Ranger','Maverick','Edge'],
  Seat: ['Ibiza','León','Ateca','Tarraco','Arona','Toledo','Alhambra','Mii','El-Born'],
  Mazda: ['Mazda2','Mazda3','Mazda6','CX-3','CX-30','CX-5','CX-9','MX-5','BT-50'],
  Audi: ['A1','A3','A4','A5','A6','Q3','Q5','Q7','TT','e-tron'],
  BMW: ['Serie 1','Serie 2','Serie 3','Serie 5','X1','X2','X3','X5','M3','M5'],
  'Mercedes-Benz': ['Clase A','Clase C','Clase E','GLA','GLC','GLE','CLA','AMG GT','EQA'],
  RAM: ['700','1500','2500','3500','ProMaster','Classic'],
  Jeep: ['Compass','Renegade','Cherokee','Wrangler','Grand Cherokee','Commander','Gladiator'],
  Dodge: ['Attitude','Neon','Journey','Challenger','Charger','Durango','RAM'],
  Renault: ['Kwid','Stepway','Sandero','Captur','Koleos','Oroch','Duster','Talisman'],
  Peugeot: ['208','301','2008','3008','5008','Partner','Expert','Rifter'],
}

// ─── TIPO DATOS ────────────────────────────────────────────────────────────────
type RamoId = 'auto'|'gmm'|'vida'|'danos'|'rc'
interface CotizacionAuto {
  // Cliente
  nombre: string; edad: string; sexo: string; cp: string; estadoCivil: string
  // Vehículo
  marca: string; modelo: string; anio: string; version: string
  valor: string; uso: string; color: string; placas: string; vin: string
  // Cobertura
  deducible: string; coaseguro: string
}

interface ResultadoCotizacion {
  id: string
  ramo: RamoId
  fecha: string
  cliente: string
  datos: CotizacionAuto
  opciones: OpcionCotizacion[]
  estado: 'generada'|'enviada'|'aceptada'|'rechazada'
}
interface OpcionCotizacion {
  nombre: string; prima_mensual: number; prima_anual: number
  deducible: number; coaseguro: number; coberturas: string[]
  recomendada: boolean
}

// ─── MOTOR DE CÁLCULO ─────────────────────────────────────────────────────────
function calcularPrimaAuto(datos: CotizacionAuto): OpcionCotizacion[] {
  const fEdad = FACTOR_EDAD[datos.edad] || 1.15
  const fZona = FACTOR_ZONA[datos.cp] || FACTOR_ZONA.DEFAULT
  const fUso = FACTOR_USO[datos.uso] || 1.0
  const anio = parseInt(datos.anio) || 2022
  const antiguedad = new Date().getFullYear() - anio
  const fVehiculo = antiguedad <= 2 ? 1.0 : antiguedad <= 5 ? 1.08 : antiguedad <= 10 ? 1.15 : 1.25
  const valorComercial = parseFloat(datos.valor.replace(/[^0-9.]/g,'')) || 250000
  const fValor = valorComercial > 600000 ? 1.30 : valorComercial > 400000 ? 1.15 : valorComercial > 250000 ? 1.05 : 1.00

  const primaBase = BASE_RATE_AUTO * fEdad * fZona * fUso * fVehiculo * fValor
  const roundK = (n: number) => Math.round(n / 100) * 100

  return [
    {
      nombre: 'Básica',
      prima_anual: roundK(primaBase * 0.85),
      prima_mensual: roundK((primaBase * 0.85) / 12),
      deducible: 10,
      coaseguro: 20,
      coberturas: ['Daños materiales','Robo total','Responsabilidad civil $3M','Asistencia vial básica'],
      recomendada: false,
    },
    {
      nombre: 'Intermedia',
      prima_anual: roundK(primaBase),
      prima_mensual: roundK(primaBase / 12),
      deducible: 5,
      coaseguro: 10,
      coberturas: ['Daños materiales','Robo total','RC $5M','Cristales','Gastos médicos $200k','Asistencia premium 24/7'],
      recomendada: true,
    },
    {
      nombre: 'Amplia',
      prima_anual: roundK(primaBase * 1.28),
      prima_mensual: roundK((primaBase * 1.28) / 12),
      deducible: 0,
      coaseguro: 5,
      coberturas: ['Todo riesgo','RC $8M','Cristales','Gastos médicos $500k','Auto sustituto 30 días','Valor factura 24 meses','Conductor designado'],
      recomendada: false,
    },
  ]
}

const fmt = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)

// ─── HISTORIAL (localStorage simulation) ─────────────────────────────────────
const STORAGE_KEY = 'iaos_cotizaciones'
function loadCotizaciones(): ResultadoCotizacion[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveCotizacion(c: ResultadoCotizacion) {
  const all = loadCotizaciones()
  const idx = all.findIndex(x => x.id === c.id)
  if (idx >= 0) all[idx] = c; else all.unshift(c)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 50)))
}

// ─── COMPONENTE FIELD ─────────────────────────────────────────────────────────
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
function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v:string)=>void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] placeholder:text-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#F7941D]/50 focus:bg-[#F7941D]/3 shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]"
    />
  )
}

// ─── XORIA MINI PANEL ─────────────────────────────────────────────────────────
function XoriaMini({ msg, onStartVoice, hasSR }: { msg: string; onStartVoice?: () => void; hasSR?: boolean }) {
  return (
    <div className="flex items-start gap-3 bg-[#F7941D]/6 border border-[#F7941D]/20 rounded-2xl p-4">
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
        <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] text-[#F7941D] font-bold tracking-widest uppercase mb-0.5">XORIA</p>
        <p className="text-[13px] text-[#1A1F2B] leading-relaxed">{msg}</p>
      </div>
      {onStartVoice && hasSR && (
        <button
          onClick={onStartVoice}
          title="Llenar cotización por voz"
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-white bg-[#F7941D] shadow-[0_4px_12px_rgba(247,148,29,0.4)] hover:bg-[#e08019] active:scale-95 transition-all">
          <Mic size={12} /> Modo voz
        </button>
      )}
    </div>
  )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
type PantallaId = 'selector'|'formulario'|'resultado'|'historial'
const RAMOS: { id: RamoId; label: string; icon: React.ElementType; color: string; desc: string; activo: boolean }[] = [
  { id: 'auto', label: 'Auto', icon: Car, color: '#F7941D', desc: 'Vehículo particular, Uber, negocio o reparto', activo: true },
  { id: 'gmm', label: 'GMM', icon: Shield, color: '#69A481', desc: 'Gastos Médicos Mayores individual o colectivo', activo: true },
  { id: 'vida', label: 'Vida', icon: Heart, color: '#7C1F31', desc: 'Seguro de vida con suma asegurada y beneficiarios', activo: true },
  { id: 'danos', label: 'Daños / Hogar', icon: Home, color: '#1A1F2B', desc: 'Hogar, empresa, contenidos y responsabilidad civil', activo: true },
  { id: 'rc', label: 'RC Empresarial', icon: Briefcase, color: '#6B7280', desc: 'Responsabilidad civil profesional y general', activo: true },
]

export default function NuevaVentaPage() {
  const router = useRouter()
  const [pantalla, setPantalla] = useState<PantallaId>('selector')
  const [ramo, setRamo] = useState<RamoId>('auto')
  const [cotizaciones, setCotizaciones] = useState<ResultadoCotizacion[]>([])
  const [cotActiva, setCotActiva] = useState<ResultadoCotizacion|null>(null)
  const [xoriaMsg, setXoriaMsg] = useState('Hola. Selecciona el tipo de seguro y completa los datos. Yo verifico y calculo la prima en tiempo real.')
  const [calcOk, setCalcOk] = useState(false)
  const [showMailModal, setShowMailModal] = useState(false)
  const [mailDest, setMailDest] = useState('')
  const [camposCompletos, setCamposCompletos] = useState(0)

  // ─── VOZ ASISTIDA ────────────────────────────────────────────────────────────
  const [hasSR, setHasSR] = useState(false)
  const [vozActiva, setVozActiva] = useState(false)
  const [listening, setListening] = useState(false)
  const [vozStatus, setVozStatus] = useState('')
  const [vozCampoIdx, setVozCampoIdx] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const srRef = useRef<any>(null)

  // Campos que XORIA pregunta en orden (9 obligatorios + estadoCivil)
  const VOZ_CAMPOS: { key: keyof CotizacionAuto; pregunta: string; proceso?: (v: string) => string }[] = [
    { key: 'nombre',     pregunta: '¿Cuál es el nombre completo del asegurado?' },
    { key: 'edad',       pregunta: '¿En qué rango de edad está? Dime: 18 a 25, 26 a 35, 36 a 45, 46 a 55, 56 a 65, o mayor de 65.' },
    { key: 'cp',         pregunta: '¿Cuál es el código postal del domicilio del asegurado?', proceso: v => v.replace(/\D/g,'').slice(0,5) },
    { key: 'sexo',       pregunta: '¿El asegurado es masculino o femenino?' },
    { key: 'marca',      pregunta: '¿Cuál es la marca del vehículo? Por ejemplo: Volkswagen, Nissan, Toyota, Honda...' },
    { key: 'modelo',     pregunta: '¿Cuál es el modelo del vehículo?' },
    { key: 'anio',       pregunta: '¿De qué año es el vehículo?', proceso: v => v.replace(/\D/g,'').slice(0,4) },
    { key: 'valor',      pregunta: '¿Cuál es el valor comercial aproximado en pesos? Solo el número, sin comas.' },
    { key: 'uso',        pregunta: '¿Cuál es el uso del vehículo? Dime: particular, Uber, negocio o reparto.' },
  ]

  useEffect(() => {
    setHasSR(!!getSR())
  }, [])

  const detenerSR = useCallback(() => {
    try { srRef.current?.stop() } catch {}
    srRef.current = null
    setListening(false)
  }, [])

  const escucharRespuesta = useCallback((campoIdx: number, formSnapshot: CotizacionAuto) => {
    const SR = getSR()
    if (!SR || campoIdx >= VOZ_CAMPOS.length) return
    const { key, proceso } = VOZ_CAMPOS[campoIdx]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = new SR()
    srRef.current = rec
    rec.lang = 'es-MX'
    rec.continuous = false
    rec.interimResults = false

    // Flag para evitar que onend interfiera después de recibir resultado
    let gotResult = false

    rec.onstart = () => setListening(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      gotResult = true
      const raw = (e.results[0][0].transcript || '').trim()
      if (!raw) return
      let valor = raw

      // Normalizar campos especiales
      if (key === 'edad') {
        const n = parseInt(raw.replace(/\D/g,''))
        if (!isNaN(n)) {
          if (n <= 25) valor = '18-25'
          else if (n <= 35) valor = '26-35'
          else if (n <= 45) valor = '36-45'
          else if (n <= 55) valor = '46-55'
          else if (n <= 65) valor = '56-65'
          else valor = '65+'
        } else {
          if (/18|1[89]|2[0-5]/.test(raw)) valor = '18-25'
          else if (/2[6-9]|3[0-5]/.test(raw)) valor = '26-35'
          else if (/3[6-9]|4[0-5]/.test(raw)) valor = '36-45'
          else if (/4[6-9]|5[0-5]/.test(raw)) valor = '46-55'
          else if (/5[6-9]|6[0-5]/.test(raw)) valor = '56-65'
          else valor = '65+'
        }
      } else if (key === 'sexo') {
        valor = /fem|muj|f\b/i.test(raw) ? 'F' : 'M'
      } else if (key === 'uso') {
        if (/uber|didi/i.test(raw)) valor = 'uber'
        else if (/neg|empr|compl/i.test(raw)) valor = 'negocio'
        else if (/repart|mens|entreg/i.test(raw)) valor = 'reparto'
        else valor = 'particular'
      } else if (key === 'valor') {
        const nums = raw.replace(/[^0-9]/g,'')
        valor = nums || raw
      } else if (proceso) {
        valor = proceso(raw)
      }

      const newForm = { ...formSnapshot, [key]: valor }
      setForm(newForm)
      setListening(false)
      srRef.current = null

      const nextIdx = campoIdx + 1
      setVozStatus(`✓ ${raw}`)

      if (nextIdx < VOZ_CAMPOS.length) {
        setVozCampoIdx(nextIdx)
        setTimeout(() => {
          const nextPregunta = VOZ_CAMPOS[nextIdx].pregunta
          setVozStatus('XORIA hablando...')
          let listenerStarted = false
          const startNext = () => {
            if (listenerStarted) return
            listenerStarted = true
            // Cancelar TTS por si aún estaba hablando antes de abrir el mic
            try { window.speechSynthesis?.cancel() } catch {}
            setTimeout(() => {
              setVozStatus('Escuchando...')
              escucharRespuesta(nextIdx, newForm)
            }, 300)
          }
          speakText(nextPregunta, startNext)
          // Respaldo: si onEnd nunca dispara, avanzar a los 6s
          setTimeout(startNext, 6000)
        }, 900)
      } else {
        // Todos los campos completos
        setVozStatus('✓ Datos completos')
        setVozActiva(false)
        setTimeout(() => {
          const reqs = ['nombre','edad','sexo','cp','marca','modelo','anio','valor','uso']
          const nf = newForm as unknown as Record<string,string>
          const allDone = reqs.every(k => nf[k]?.trim())
          if (allDone) {
            const opciones = calcularPrimaAuto(newForm)
            const nueva: ResultadoCotizacion = {
              id: `COT-${Date.now()}`, ramo,
              fecha: new Date().toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'}),
              cliente: newForm.nombre, datos: { ...newForm }, opciones, estado: 'generada'
            }
            setCotActiva(nueva)
            saveCotizacion(nueva)
            setCotizaciones(loadCotizaciones())
            setPantalla('resultado')
            setXoriaMsg(`Cotización lista para ${newForm.nombre}. ${newForm.marca} ${newForm.modelo} ${newForm.anio}. Prima mensual desde ${fmt(opciones[0].prima_mensual)}.`)
            speakText(`Cotización lista para ${newForm.nombre}. El ${newForm.marca} ${newForm.modelo} tiene una prima desde ${fmt(opciones[0].prima_mensual)} al mes.`)
          }
        }, 900)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (e: any) => {
      // Si ya procesamos un resultado, ignorar CUALQUIER error posterior
      if (gotResult) return
      setListening(false)
      srRef.current = null
      // no-speech/aborted es normal — reintentar silenciosamente sin TTS
      if (e.error === 'no-speech' || e.error === 'aborted' || e.error === 'network') {
        setTimeout(() => escucharRespuesta(campoIdx, formSnapshot), 400)
        return
      }
      // Error real — avisar y reintentar
      setVozStatus('No te escuché. Repite la respuesta.')
      setTimeout(() => {
        setVozStatus('Escuchando...')
        escucharRespuesta(campoIdx, formSnapshot)
      }, 1000)
    }

    // onend solo actúa si no hubo resultado
    rec.onend = () => {
      if (!gotResult) setListening(false)
    }

    try { rec.start() } catch { setListening(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ramo])

  const iniciarVozAsistida = useCallback(() => {
    if (!hasSR) return
    setVozActiva(true)
    setVozCampoIdx(0)
    setPantalla('formulario')
    const bienvenida = 'Hola, voy a ayudarte a llenar la cotización por voz. Responde cada pregunta con claridad.'
    setVozStatus('XORIA hablando...')
    speakText(bienvenida + ' ' + VOZ_CAMPOS[0].pregunta, () => {
      setVozStatus('Escuchando...')
      escucharRespuesta(0, {
        nombre:'', edad:'', sexo:'', cp:'', estadoCivil:'',
        marca:'', modelo:'', anio:'', version:'', valor:'', uso:'', color:'', placas:'', vin:'',
        deducible:'5', coaseguro:'10'
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSR, escucharRespuesta])

  const detenerVoz = useCallback(() => {
    detenerSR()
    window.speechSynthesis?.cancel()
    setVozActiva(false)
    setVozStatus('')
  }, [detenerSR])

  const [form, setForm] = useState<CotizacionAuto>({
    nombre:'', edad:'', sexo:'', cp:'', estadoCivil:'',
    marca:'', modelo:'', anio:'', version:'', valor:'', uso:'', color:'', placas:'', vin:'',
    deducible:'5', coaseguro:'10'
  })

  useEffect(() => {
    setCotizaciones(loadCotizaciones())
  }, [])

  // Calcular campos completos en tiempo real
  useEffect(() => {
    const reqs = ['nombre','edad','sexo','cp','marca','modelo','anio','valor','uso']
    const f = form as unknown as Record<string,string>
    const done = reqs.filter(k => f[k]?.trim()).length
    setCamposCompletos(done)
    setCalcOk(done === reqs.length)
    if (done < 3) setXoriaMsg('Completa los datos del cliente y del vehículo. Necesito al menos: nombre, edad, CP, marca, modelo, año, valor y uso.')
    else if (done < 6) setXoriaMsg(`Bien, llevo ${done} de 9 campos. Continúa con los datos del vehículo.`)
    else if (done < 9) setXoriaMsg(`Casi listo — ${done}/9. Falta: ${reqs.filter(k=>!f[k]).join(', ')}.`)
    else setXoriaMsg('✓ Tengo todos los datos. Puedo calcular la prima ahora. Presiona "Calcular cotización".')
  }, [form])

  const modelos = form.marca ? (MODELOS_POR_MARCA[form.marca] || []) : []
  const aniosOpts = Array.from({ length: 20 }, (_, i) => 2025 - i).map(a => ({ value: String(a), label: String(a) }))

  function calcular() {
    if (!calcOk) return
    const opciones = calcularPrimaAuto(form)
    const nueva: ResultadoCotizacion = {
      id: `COT-${Date.now()}`,
      ramo,
      fecha: new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' }),
      cliente: form.nombre,
      datos: { ...form },
      opciones,
      estado: 'generada'
    }
    setCotActiva(nueva)
    saveCotizacion(nueva)
    setCotizaciones(loadCotizaciones())
    setPantalla('resultado')
    setXoriaMsg(`Cotización lista para ${form.nombre}. Vehículo: ${form.marca} ${form.modelo} ${form.anio}. Prima mensual desde ${fmt(opciones[0].prima_mensual)}. Te recomiendo la opción Intermedia.`)
  }

  function enviarCorreo() {
    if (!cotActiva) return
    const upd: ResultadoCotizacion = { ...cotActiva, estado: 'enviada' }
    setCotActiva(upd)
    saveCotizacion(upd)
    setCotizaciones(loadCotizaciones())
    setShowMailModal(false)
    setXoriaMsg(`Cotización enviada a ${mailDest || 'el correo del asegurado'}. Quedará en tu historial como "enviada". Si la acepta, la puedes convertir a solicitud formal.`)
  }

  function marcarAceptada(cot: ResultadoCotizacion) {
    const upd = { ...cot, estado: 'aceptada' as const }
    saveCotizacion(upd)
    setCotizaciones(loadCotizaciones())
    router.push(`/agent/nueva-venta/solicitud?cot=${cot.id}&ramo=${cot.ramo}`)
  }

  const progresoBar = Math.round((camposCompletos / 9) * 100)

  // ─── SELECTOR DE RAMO ────────────────────────────────────────────────────────
  if (pantalla === 'selector') return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/agent/dashboard')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B] transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <p className="text-[11px] text-[#F7941D] font-bold tracking-[0.2em] uppercase mb-0.5">XORIA · Motor de Cotización</p>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold">Cotizador inteligente</h1>
        </div>
        <button onClick={() => setPantalla('historial')}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] text-[#6B7280] font-semibold bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.13)] hover:text-[#1A1F2B] transition-all">
          <Clock size={14} /> Historial ({cotizaciones.length})
        </button>
      </div>

      <XoriaMini msg={xoriaMsg} onStartVoice={iniciarVozAsistida} hasSR={hasSR} />

      {/* Flujo visual */}
      <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <div className="flex items-center gap-0 overflow-x-auto">
          {['Tipo de seguro','Datos del riesgo','Cálculo dinámico','Resultado + PDF','Enviar por correo','Solicitud con XORIA'].map((s,i) => (
            <div key={s} className="flex items-center shrink-0">
              <div className={cn('flex flex-col items-center gap-1 px-2.5', i === 0 ? 'opacity-100':'opacity-35')}>
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold', i===0?'bg-[#F7941D] text-white':'bg-[#EFF2F9] text-[#9CA3AF] shadow-[inset_-2px_-2px_4px_#FAFBFF,inset_2px_2px_4px_rgba(22,27,29,0.10)]')}>
                  {i+1}
                </div>
                <span className="text-[8px] text-[#6B7280] whitespace-nowrap">{s}</span>
              </div>
              {i<5 && <div className="w-4 h-px bg-[#D1D5DB] shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Cards ramo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {RAMOS.map(r => {
          const Icon = r.icon
          const sel = ramo === r.id
          return (
            <button key={r.id}
              onClick={() => setRamo(r.id)}
              className={cn(
                'relative flex flex-col gap-3 p-4 rounded-2xl text-left transition-all duration-200 border',
                sel
                  ? 'shadow-[-4px_-4px_12px_#FAFBFF,4px_4px_12px_rgba(22,27,29,0.20)] scale-[1.02]'
                  : 'shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.12)] hover:scale-[1.01]',
              )}
              style={{
                background: sel ? `${r.color}10` : '#EFF2F9',
                borderColor: sel ? `${r.color}40` : 'transparent'
              }}>
              {sel && <span className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: r.color }}><CheckCircle size={10} className="text-white" /></span>}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${r.color}12` }}>
                <Icon size={18} style={{ color: r.color }} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#1A1F2B]">{r.label}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5 leading-tight">{r.desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      <button onClick={() => setPantalla('formulario')}
        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold text-[14px] transition-all hover:scale-[1.02] hover:shadow-[0_8px_28px_rgba(247,148,29,0.45)]"
        style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 6px 20px rgba(247,148,29,0.35)' }}>
        <Calculator size={16} /> Comenzar cotización · {RAMOS.find(r=>r.id===ramo)?.label}
        <ArrowRight size={15} />
      </button>
    </div>
  )

  // ─── FORMULARIO DE DATOS ─────────────────────────────────────────────────────
  if (pantalla === 'formulario') return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setPantalla('selector')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B]">
          <ArrowLeft size={15} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-[#F7941D] font-bold tracking-widest uppercase">Cotización · Auto</p>
          <h1 className="text-[18px] text-[#1A1F2B] font-bold">Datos del riesgo</h1>
        </div>
        <button onClick={() => setPantalla('historial')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B]">
          <Clock size={12}/> {cotizaciones.length} guardadas
        </button>
      </div>

      {/* Banner voz activa */}
      {vozActiva && (
        <div className={cn(
          'flex items-center gap-3 rounded-2xl p-4 border transition-all',
          listening
            ? 'bg-[#F7941D]/10 border-[#F7941D]/40 shadow-[0_0_20px_rgba(247,148,29,0.15)]'
            : 'bg-[#1A1F2B]/5 border-[#1A1F2B]/15'
        )}>
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all',
            listening ? 'bg-[#F7941D] shadow-[0_0_16px_rgba(247,148,29,0.5)]' : 'bg-[#EFF2F9]')}>
            {listening ? <Mic size={16} className="text-white" /> : <Volume2 size={16} className="text-[#F7941D]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-widest text-[#F7941D] uppercase mb-0.5">
              XORIA · Modo voz — Campo {vozCampoIdx + 1} de {VOZ_CAMPOS.length}
            </p>
            <p className="text-[13px] font-semibold text-[#1A1F2B] leading-snug">
              {VOZ_CAMPOS[vozCampoIdx]?.pregunta}
            </p>
            {vozStatus && <p className="text-[11px] text-[#6B7280] mt-0.5">{vozStatus}</p>}
          </div>
          <button onClick={detenerVoz}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] text-[#6B7280] hover:text-[#7C1F31] transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      <XoriaMini msg={xoriaMsg} onStartVoice={iniciarVozAsistida} hasSR={hasSR && !vozActiva} />

      {/* Barra de progreso */}
      <div className="bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
        <div className="flex justify-between text-[10px] text-[#9CA3AF] mb-1.5">
          <span>Completado</span><span className={cn('font-bold', calcOk ? 'text-[#69A481]':'text-[#F7941D]')}>{progresoBar}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#EFF2F9] shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.12)]">
          <div className="h-full rounded-full transition-all duration-500" style={{ width:`${progresoBar}%`, background: calcOk ? 'linear-gradient(90deg,#69A481,#4a7a5d)' : 'linear-gradient(90deg,#F7941D,#e08019)' }} />
        </div>
      </div>

      {/* ── SECCIÓN: DATOS DEL CLIENTE ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#F7941D] text-white text-[9px] flex items-center justify-center font-bold">1</span>
          Datos del asegurado / titular
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre completo" required><TextInput value={form.nombre} onChange={v=>setForm(f=>({...f,nombre:v}))} placeholder="María García López" /></Field>
          <Field label="Edad / Rango" required>
            <NeuSelect value={form.edad} onChange={v=>setForm(f=>({...f,edad:v}))}
              options={[{value:'18-25',label:'18–25 años'},{value:'26-35',label:'26–35 años'},{value:'36-45',label:'36–45 años'},{value:'46-55',label:'46–55 años'},{value:'56-65',label:'56–65 años'},{value:'65+',label:'65+ años'}]}
              placeholder="Rango de edad" />
          </Field>
          <Field label="Sexo" required>
            <NeuSelect value={form.sexo} onChange={v=>setForm(f=>({...f,sexo:v}))}
              options={[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}]} placeholder="Selecciona" />
          </Field>
          <Field label="Código Postal" required>
            <TextInput value={form.cp} onChange={v=>setForm(f=>({...f,cp:v.replace(/\D/,'').slice(0,5)}))} placeholder="06600" />
          </Field>
          <Field label="Estado civil">
            <NeuSelect value={form.estadoCivil} onChange={v=>setForm(f=>({...f,estadoCivil:v}))}
              options={[{value:'soltero',label:'Soltero/a'},{value:'casado',label:'Casado/a'},{value:'divorciado',label:'Divorciado/a'},{value:'viudo',label:'Viudo/a'},{value:'union_libre',label:'Unión libre'}]}
              placeholder="Estado civil" />
          </Field>
        </div>
      </div>

      {/* ── SECCIÓN: DATOS DEL VEHÍCULO ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#F7941D] text-white text-[9px] flex items-center justify-center font-bold">2</span>
          Datos del vehículo
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Marca" required>
            <NeuSelect value={form.marca} onChange={v=>setForm(f=>({...f,marca:v,modelo:''}))}
              options={MARCAS_POPULARES.map(m=>({value:m,label:m}))} placeholder="Selecciona marca" />
          </Field>
          <Field label="Modelo" required>
            <NeuSelect value={form.modelo} onChange={v=>setForm(f=>({...f,modelo:v}))}
              options={modelos.map(m=>({value:m,label:m}))}
              placeholder={form.marca ? 'Selecciona modelo':'Primero elige marca'}
              disabled={!form.marca} />
          </Field>
          <Field label="Año" required>
            <NeuSelect value={form.anio} onChange={v=>setForm(f=>({...f,anio:v}))}
              options={aniosOpts} placeholder="Año del vehículo" />
          </Field>
          <Field label="Versión / Trim">
            <TextInput value={form.version} onChange={v=>setForm(f=>({...f,version:v}))} placeholder="ej. Style Plus, SE, AT" />
          </Field>
          <Field label="Valor comercial estimado (MXN)" required>
            <TextInput value={form.valor} onChange={v=>setForm(f=>({...f,valor:v}))} placeholder="250,000" />
          </Field>
          <Field label="Uso del vehículo" required>
            <NeuSelect value={form.uso} onChange={v=>setForm(f=>({...f,uso:v}))}
              options={[
                {value:'particular',label:'Particular',desc:'uso personal'},
                {value:'uber',label:'Uber / DIDI',desc:'+85% prima'},
                {value:'negocio',label:'Negocio / empresa',desc:'+40% prima'},
                {value:'reparto',label:'Reparto / mensajería',desc:'+60% prima'},
              ]} placeholder="Uso del vehículo" />
          </Field>
          <Field label="Color">
            <TextInput value={form.color} onChange={v=>setForm(f=>({...f,color:v}))} placeholder="Blanco perla" />
          </Field>
          <Field label="Placas">
            <TextInput value={form.placas} onChange={v=>setForm(f=>({...f,placas:v.toUpperCase()}))} placeholder="ABC-1234" />
          </Field>
          <Field label="VIN / No. de serie">
            <TextInput value={form.vin} onChange={v=>setForm(f=>({...f,vin:v.toUpperCase()}))} placeholder="17 caracteres" />
          </Field>
        </div>
      </div>

      {/* ── SECCIÓN: REPUVE ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase mb-1 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#1A1F2B] text-white text-[9px] flex items-center justify-center font-bold">R</span>
          REPUVE — Validación de placas y robo vehicular
          <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F7941D]/10 text-[#F7941D]">SEGURO AUTO</span>
        </p>
        <p className="text-[11px] text-[#6B7280] mb-4 leading-relaxed">
          Consulta obligatoria AMIS/CNBV antes de emitir cualquier seguro de automóvil. Verifica el número de serie (VIN), placas y si el vehículo tiene reporte de robo activo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">VIN / No. de serie</p>
            <p className="text-[13px] font-semibold text-[#1A1F2B]">{form.vin || <span className="text-[#9CA3AF]">Sin capturar</span>}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Placas</p>
            <p className="text-[13px] font-semibold text-[#1A1F2B]">{form.placas || <span className="text-[#9CA3AF]">Sin capturar</span>}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Reporte de robo</p>
            <p className="text-[13px] font-semibold text-[#69A481]">Sin reporte (simulado)</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <a
            href="https://car-buddy.co/vinmxes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(28,35,51,0.3)]"
            style={{ background: 'linear-gradient(135deg,#1A1F2B,#2D3548)' }}
          >
            <Shield size={13} /> Consultar REPUVE
          </a>
          <a
            href="https://car-buddy.co/vinmxes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-[#7C1F31] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-all"
          >
            <AlertTriangle size={13} /> Verificar reporte de robo
          </a>
        </div>
      </div>

      {/* ── SECCIÓN: COBERTURAS ── */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#F7941D] text-white text-[9px] flex items-center justify-center font-bold">3</span>
          Preferencias de cobertura
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Deducible preferido">
            <NeuSelect value={form.deducible} onChange={v=>setForm(f=>({...f,deducible:v}))}
              options={[{value:'0',label:'Sin deducible (prima mayor)'},{value:'5',label:'5% (recomendado)'},{value:'10',label:'10% (prima menor)'}]}
              placeholder="Deducible" />
          </Field>
          <Field label="Coaseguro">
            <NeuSelect value={form.coaseguro} onChange={v=>setForm(f=>({...f,coaseguro:v}))}
              options={[{value:'5',label:'5% coaseguro'},{value:'10',label:'10% coaseguro'},{value:'20',label:'20% coaseguro'}]}
              placeholder="Coaseguro" />
          </Field>
        </div>
      </div>

      <button onClick={calcular} disabled={!calcOk}
        className={cn('flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-[15px] transition-all duration-300',
          calcOk ? 'hover:scale-[1.02] hover:shadow-[0_10px_32px_rgba(247,148,29,0.5)]' : 'opacity-40 cursor-not-allowed'
        )}
        style={{ background: 'linear-gradient(135deg,#F7941D,#c8600a)', boxShadow: calcOk ? '0 6px 24px rgba(247,148,29,0.4)':undefined }}>
        <Calculator size={18} />
        {calcOk ? 'Calcular cotización' : `Faltan ${9-camposCompletos} campos obligatorios`}
        {calcOk && <Sparkles size={14} />}
      </button>
    </div>
  )

  // ─── RESULTADO DE COTIZACIÓN ─────────────────────────────────────────────────
  if (pantalla === 'resultado' && cotActiva) return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setPantalla('formulario')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B]">
          <ArrowLeft size={15} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-[#69A481] font-bold tracking-widest uppercase">✓ Cotización generada</p>
          <h1 className="text-[18px] text-[#1A1F2B] font-bold">{cotActiva.id}</h1>
        </div>
        <span className="text-[11px] text-[#9CA3AF]">{cotActiva.fecha}</span>
      </div>

      <XoriaMini msg={xoriaMsg} />

      {/* Resumen vehículo */}
      <div className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase font-semibold mb-3">Riesgo cotizado</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'Asegurado', value: cotActiva.datos.nombre },
            { label:'Vehículo', value: `${cotActiva.datos.marca} ${cotActiva.datos.modelo}` },
            { label:'Año', value: cotActiva.datos.anio },
            { label:'Valor', value: fmt(parseFloat(cotActiva.datos.valor.replace(/[^0-9.]/g,''))) },
            { label:'Uso', value: cotActiva.datos.uso },
            { label:'CP', value: cotActiva.datos.cp },
            { label:'Edad', value: cotActiva.datos.edad },
            { label:'Placas', value: cotActiva.datos.placas || '—' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
              <p className="text-[12px] font-semibold text-[#1A1F2B] capitalize">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Opciones de cotización */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cotActiva.opciones.map(op => (
          <div key={op.nombre}
            className={cn('flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-200',
              op.recomendada
                ? 'border-[#F7941D]/40 shadow-[-4px_-4px_12px_#FAFBFF,4px_4px_16px_rgba(247,148,29,0.18)] scale-[1.01]'
                : 'border-transparent shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.12)]'
            )}
            style={{ background: op.recomendada ? '#F7941D08' : '#EFF2F9' }}>
            {op.recomendada && (
              <div className="flex items-center gap-1 text-[#F7941D]">
                <Star size={11} className="fill-[#F7941D]" />
                <span className="text-[9px] font-bold tracking-widest uppercase">Recomendada</span>
              </div>
            )}
            <div>
              <p className="text-[16px] font-bold text-[#1A1F2B]">{op.nombre}</p>
              <p className="text-[28px] font-black" style={{ color: op.recomendada ? '#F7941D':'#1A1F2B' }}>{fmt(op.prima_mensual)}</p>
              <p className="text-[11px] text-[#9CA3AF]">al mes · {fmt(op.prima_anual)}/año</p>
            </div>
            <div className="text-[11px] text-[#6B7280]">
              <p>Deducible: <strong>{op.deducible}%</strong></p>
              <p>Coaseguro: <strong>{op.coaseguro}%</strong></p>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              {op.coberturas.map(c => (
                <div key={c} className="flex items-center gap-1.5 text-[11px] text-[#1A1F2B]">
                  <CheckCircle size={10} className="text-[#69A481] shrink-0" />
                  {c}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Acciones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button onClick={() => window.print()}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-[#6B7280] hover:text-[#1A1F2B] transition-all text-[11px] font-semibold">
          <Download size={16}/> Descargar PDF
        </button>
        <button onClick={() => setShowMailModal(true)}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-[#6B7280] hover:text-[#F7941D] transition-all text-[11px] font-semibold">
          <Send size={16}/> Enviar por correo
        </button>
        <button onClick={() => setPantalla('historial')}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-[#6B7280] hover:text-[#1A1F2B] transition-all text-[11px] font-semibold">
          <Clock size={16}/> Ver historial
        </button>
        <button onClick={() => marcarAceptada(cotActiva)}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-white text-[11px] font-semibold transition-all hover:scale-[1.03]"
          style={{ background:'linear-gradient(135deg,#69A481,#4a7a5d)', boxShadow:'0 4px 14px rgba(105,164,129,0.4)' }}>
          <CheckCircle size={16}/> Cliente acepta
        </button>
      </div>

      {/* Formularios de solicitud */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase mb-3 flex items-center gap-2">
          <FileText size={13} className="text-[#F7941D]" /> Formatos de solicitud oficiales
        </p>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/Solicitud Auto .pdf"
            target="_blank"
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-[#1A1F2B] bg-[#EFF2F9] shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-all"
          >
            <Download size={13} /> Solicitud Seguro Auto
          </a>
          <a
            href="/MEX-Solicitud-GMM-individual-2024.pdf"
            target="_blank"
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-[#1A1F2B] bg-[#EFF2F9] shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-all"
          >
            <Download size={13} /> Solicitud GMM Individual
          </a>
          <a
            href="/Solicitud_Gastos_Medicos_Mayores_Colectivo_Centenario.pdf"
            target="_blank"
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-[#1A1F2B] bg-[#EFF2F9] shadow-[-2px_-2px_6px_#FAFBFF,2px_2px_6px_rgba(22,27,29,0.12)] hover:text-[#F7941D] transition-all"
          >
            <Download size={13} /> Solicitud GMM Colectivo
          </a>
        </div>
        <p className="text-[10px] text-[#9CA3AF] mt-2">O usa XORIA para llenar la solicitud con dictado de voz</p>
        <button
          onClick={() => router.push('/agent/nueva-venta/solicitud?tipo=auto')}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 4px 16px rgba(247,148,29,0.35)' }}
        >
          <Bot size={13} /> Llenar solicitud con XORIA
        </button>
      </div>

      {/* Modal envío correo */}
      {showMailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#EFF2F9] rounded-3xl p-6 shadow-[-20px_-20px_40px_#FAFBFF,20px_20px_40px_rgba(22,27,29,0.25)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-[#1A1F2B]">Enviar cotización</h3>
              <button onClick={() => setShowMailModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1F2B] transition-colors bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]">
                <X size={15}/>
              </button>
            </div>
            <Field label="Correo del asegurado">
              <TextInput value={mailDest} onChange={setMailDest} placeholder="cliente@email.com" type="email"/>
            </Field>
            <div className="mt-3 p-3 rounded-xl bg-[#F7941D]/6 border border-[#F7941D]/20">
              <p className="text-[11px] text-[#F7941D] font-semibold mb-1">XORIA preparará el texto</p>
              <p className="text-[11px] text-[#6B7280]">La IA redactará el correo profesional con las 3 opciones de cotización y los datos del vehículo.</p>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowMailModal(false)} className="flex-1 py-2.5 rounded-xl text-[13px] text-[#6B7280] font-semibold bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B]">Cancelar</button>
              <button onClick={enviarCorreo} className="flex-1 py-2.5 rounded-xl text-[13px] text-white font-bold transition-all hover:scale-[1.02]" style={{ background:'linear-gradient(135deg,#F7941D,#e08019)' }}>
                <span className="flex items-center justify-center gap-2"><Mail size={14}/> Enviar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ─── HISTORIAL DE COTIZACIONES ────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setPantalla('selector')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B]">
          <ArrowLeft size={15}/>
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-[#F7941D] font-bold tracking-widest uppercase">Cotizaciones guardadas</p>
          <h1 className="text-[18px] text-[#1A1F2B] font-bold">Historial</h1>
        </div>
        <button onClick={() => setPantalla('formulario')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] text-white font-semibold transition-all hover:scale-[1.02]"
          style={{ background:'linear-gradient(135deg,#F7941D,#e08019)' }}>
          <Plus size={13}/> Nueva
        </button>
      </div>

      <XoriaMini msg="Aquí están todas tus cotizaciones. Abre cualquiera para ver el detalle, reenviar o convertir a solicitud." />

      {cotizaciones.length === 0 ? (
        <div className="text-center py-16 text-[#9CA3AF]">
          <Calculator size={36} className="mx-auto mb-3 opacity-30"/>
          <p className="text-[14px] font-semibold">Sin cotizaciones aún</p>
          <p className="text-[12px] mt-1">Haz tu primera cotización arriba</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {cotizaciones.map(cot => {
            const estadoMap: Record<string, { color: string; label: string }> = {
              generada: { color:'#9CA3AF', label:'Generada' },
              enviada:  { color:'#F7941D', label:'Enviada' },
              aceptada: { color:'#69A481', label:'✓ Aceptada' },
              rechazada:{ color:'#7C1F31', label:'Rechazada' },
            }
            const est = estadoMap[cot.estado] || estadoMap.generada
            return (
              <div key={cot.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.12)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F7941D]/10">
                      <Car size={16} className="text-[#F7941D]"/>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1A1F2B]">{cot.cliente}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{cot.id} · {cot.fecha}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background:`${est.color}15`, color: est.color }}>{est.label}</span>
                </div>
                <div className="flex gap-3 text-[11px] text-[#6B7280] mt-2 mb-3 pl-12">
                  <span>{cot.datos.marca} {cot.datos.modelo} {cot.datos.anio}</span>
                  <span>·</span>
                  <span>Desde {fmt(cot.opciones[0]?.prima_mensual ?? 0)}/mes</span>
                </div>
                <div className="flex gap-2 pl-12">
                  <button onClick={() => { setCotActiva(cot); setPantalla('resultado') }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B] font-semibold">
                    <Eye size={11}/> Ver
                  </button>
                  <button onClick={() => { setForm(cot.datos); setPantalla('formulario') }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_4px_#FAFBFF,2px_2px_4px_rgba(22,27,29,0.10)] hover:text-[#F7941D] font-semibold">
                    <RotateCcw size={11}/> Re-cotizar
                  </button>
                  {cot.estado !== 'aceptada' && (
                    <button onClick={() => marcarAceptada(cot)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] text-white font-semibold"
                      style={{ background:'linear-gradient(135deg,#69A481,#4a7a5d)' }}>
                      <CheckCircle size={11}/> Acepta
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
