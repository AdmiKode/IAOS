'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Car, Shield, Heart, Home, Briefcase, Send, Mic, MicOff,
  CheckCircle, Loader2, ArrowRight, X, ChevronDown, RotateCcw,
  MessageSquare, Download, AlertTriangle, User
} from 'lucide-react'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { cn } from '@/lib/utils'

type RamoId = 'auto'|'gmm'|'vida'|'danos'|'rc'
type Pantalla = 'selector'|'formulario'|'resultado'|'enviada'

interface CotizForm {
  nombre: string; email: string; tel: string; cp: string; edad: string; sexo: string
  // Auto
  marca: string; modelo: string; anio: string; uso: string; valor: string
  // GMM / Vida
  peso: string; talla: string; preexistencia: string; suma: string
  // Daños
  tipo_bien: string; valor_inmueble: string
}

const RAMOS = [
  { id:'auto' as RamoId, label:'Auto',          icon:Car,       color:'#F7941D', desc:'Seguro para tu vehículo' },
  { id:'gmm'  as RamoId, label:'Gastos Médicos',icon:Shield,    color:'#69A481', desc:'Protección médica integral' },
  { id:'vida' as RamoId, label:'Vida',           icon:Heart,     color:'#7C1F31', desc:'Protege a tu familia' },
  { id:'danos'as RamoId, label:'Hogar / Daños',  icon:Home,      color:'#1A1F2B', desc:'Tu hogar asegurado' },
  { id:'rc'   as RamoId, label:'RC Profesional', icon:Briefcase, color:'#6B7280', desc:'Responsabilidad civil' },
]

const MARCAS = ['Volkswagen','Nissan','Chevrolet','Toyota','Honda','Kia','Hyundai','Ford','Mazda','Otra']

function Field({ label, children, required }: { label:string; children:React.ReactNode; required?:boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] text-[#6B7280] tracking-widest uppercase">{label}{required && <span className="text-[#F7941D] ml-0.5">*</span>}</label>
      {children}
    </div>
  )
}
function TInput({ value, onChange, placeholder, type='text' }: { value:string; onChange:(v:string)=>void; placeholder?:string; type?:string }) {
  return (
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-white/30 backdrop-blur-sm border border-white/50 rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] placeholder:text-[#B5BFC6] outline-none focus:border-[#F7941D]/60 transition-all shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]" />
  )
}

// Resultado simulado por ramo
function calcularCliente(ramo: RamoId, form: CotizForm) {
  const base: Record<RamoId, number> = { auto:4800, gmm:18000, vida:8400, danos:3600, rc:12000 }
  const fEdad: Record<string,number> = { '18-25':1.4,'26-35':1.1,'36-45':1.0,'46-55':1.08,'56-65':1.2,'65+':1.35 }
  const fe = fEdad[form.edad] || 1.1
  const base_anual = base[ramo] * fe
  return [
    { nombre:'Básica',     prima_mensual: Math.round(base_anual*0.85/12/100)*100, prima_anual: Math.round(base_anual*0.85/100)*100, desc:'Cobertura esencial' },
    { nombre:'Intermedia', prima_mensual: Math.round(base_anual/12/100)*100,       prima_anual: Math.round(base_anual/100)*100,      desc:'Recomendada', recomendada:true },
    { nombre:'Amplia',     prima_mensual: Math.round(base_anual*1.3/12/100)*100,   prima_anual: Math.round(base_anual*1.3/100)*100,  desc:'Cobertura total' },
  ]
}

const fmt = (n:number) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n)

export default function ClienteCotizarPage() {
  const router = useRouter()
  const [pantalla, setPantalla] = useState<Pantalla>('selector')
  const [ramo, setRamo] = useState<RamoId>('auto')
  const [form, setForm] = useState<CotizForm>({
    nombre:'', email:'', tel:'', cp:'', edad:'', sexo:'',
    marca:'', modelo:'', anio:'', uso:'', valor:'',
    peso:'', talla:'', preexistencia:'', suma:'',
    tipo_bien:'', valor_inmueble:''
  })
  const [resultado, setResultado] = useState<ReturnType<typeof calcularCliente>>([])
  const [planSel, setPlanSel] = useState<string|null>(null)
  const [enviado, setEnviado] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<{role:'user'|'xoria'; msg:string}[]>([
    { role:'xoria', msg:'¡Hola! Soy XORIA. Te ayudo a cotizar tu seguro paso a paso. ¿Qué tipo de seguro necesitas?' }
  ])
  const [isListening, setIsListening] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const set = (k: keyof CotizForm, v: string) => setForm(f => ({ ...f, [k]: v }))
  const anios = Array.from({length:20},(_,i)=>String(2025-i))

  // Campos obligatorios por ramo
  const camposObl: Partial<Record<RamoId,(keyof CotizForm)[]>> = {
    auto:  ['nombre','email','cp','edad','sexo','marca','modelo','anio','uso'],
    gmm:   ['nombre','email','cp','edad','sexo','peso','talla'],
    vida:  ['nombre','email','cp','edad','sexo'],
    danos: ['nombre','email','cp','tipo_bien'],
    rc:    ['nombre','email','cp','edad'],
  }
  const reqs = camposObl[ramo] || []
  const completo = reqs.every(k => form[k]?.trim())

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:'smooth' }) }, [chatHistory])

  function cotizar() {
    if (!completo) return
    const res = calcularCliente(ramo, form)
    setResultado(res)
    setPantalla('resultado')
  }

  async function enviarChat() {
    if (!chatInput.trim()) return
    const msg = chatInput.trim()
    setChatInput('')
    setIsSending(true)
    setChatHistory(h => [...h, { role:'user', msg }])
    try {
      const res = await fetch('/api/xoria/chat', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          messages: [...chatHistory.map(m=>({role:m.role==='xoria'?'assistant':'user',content:m.msg})), {role:'user',content:msg}],
          context: { perfil:'cliente_cotizacion', ramo, instruccion:`Ayuda al cliente a cotizar un seguro de ${ramo}. Responde en máximo 2 oraciones. Si el cliente da datos (nombre, edad, tipo de auto, etc.) confírmalos brevemente y pide el siguiente dato faltante.` }
        })
      })
      const json = await res.json()
      setChatHistory(h => [...h, { role:'xoria', msg: json.reply || 'Entendido. Completa el formulario para ver tu cotización.' }])
    } catch {
      setChatHistory(h => [...h, { role:'xoria', msg:'Completa el formulario y presiona "Calcular cotización".' }])
    }
    setIsSending(false)
  }

  function toggleMic() {
    type SR = { new(): { lang:string; continuous:boolean; start():void; onresult:(e:{results:{[n:number]:{[n:number]:{transcript:string}}}})=>void; onerror:()=>void; onend:()=>void }; }
    const SRClass = ((window as unknown as Record<string,unknown>).SpeechRecognition || (window as unknown as Record<string,unknown>).webkitSpeechRecognition) as SR|undefined
    if (!SRClass) { alert('Tu navegador no soporta voz.'); return }
    const r = new SRClass(); r.lang='es-MX'; r.continuous=false
    setIsListening(true)
    r.start()
    r.onresult = (e) => { setChatInput(e.results[0][0].transcript); setIsListening(false) }
    r.onerror = () => setIsListening(false)
    r.onend = () => setIsListening(false)
  }

  function solicitarCotizacion() {
    if (!planSel) return
    const plan = resultado.find(r => r.nombre === planSel)
    const key = 'iaos_solicitudes_cliente'
    const prev = JSON.parse(localStorage.getItem(key)||'[]')
    localStorage.setItem(key, JSON.stringify([{
      id:`COT-CLI-${Date.now()}`, ramo, plan: planSel,
      prima_mensual: plan?.prima_mensual, prima_anual: plan?.prima_anual,
      datos: form, fecha: new Date().toLocaleDateString('es-MX'),
      estado:'pendiente'
    }, ...prev].slice(0,50)))
    setPantalla('enviada')
  }

  // ─── PANTALLA SELECTOR ────────────────────────────────────────────────────
  if (pantalla === 'selector') return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <p className="text-[11px] text-[#F7941D] font-bold tracking-widest uppercase mb-1">XORIA · Cotizador</p>
        <h1 className="text-[22px] text-[#1A1F2B] font-bold">¿Qué seguro necesitas?</h1>
        <p className="text-[13px] text-[#6B7280] mt-1">XORIA te guía en el proceso y te da opciones personalizadas.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {RAMOS.map(r => {
          const Icon = r.icon
          const sel = ramo === r.id
          return (
            <button key={r.id} onClick={() => setRamo(r.id)}
              className={cn('flex items-center gap-4 p-4 rounded-2xl border text-left transition-all',
                sel ? 'scale-[1.01] shadow-[-4px_-4px_12px_#FAFBFF,4px_4px_12px_rgba(22,27,29,0.20)]' : 'shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.10)] hover:scale-[1.005]'
              )}
              style={{ background: sel ? `${r.color}0D` : '#EFF2F9', borderColor: sel ? `${r.color}40` : 'transparent' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${r.color}15` }}>
                <Icon size={22} style={{ color: r.color }} />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-[#1A1F2B]">{r.label}</p>
                <p className="text-[12px] text-[#6B7280]">{r.desc}</p>
              </div>
              {sel && <CheckCircle size={18} style={{ color: r.color }} />}
            </button>
          )
        })}
      </div>

      <button onClick={() => setPantalla('formulario')}
        className="flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-[14px] transition-all hover:scale-[1.02]"
        style={{ background:'linear-gradient(135deg,#F7941D,#c8600a)', boxShadow:'0 6px 24px rgba(247,148,29,0.40)' }}>
        Cotizar {RAMOS.find(r=>r.id===ramo)?.label} <ArrowRight size={16} />
      </button>

      {/* XORIA mini */}
      <div className="flex items-start gap-3 bg-[#F7941D]/6 border border-[#F7941D]/20 rounded-2xl p-4">
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
          <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
        </div>
        <p className="text-[12px] text-[#1A1F2B] leading-relaxed">
          <span className="text-[#F7941D] font-semibold">XORIA te ayuda.</span> Puedo guiarte por voz o texto, calcular tu prima y enviarte las opciones al correo. Sin compromisos.
        </p>
      </div>
    </div>
  )

  // ─── PANTALLA FORMULARIO ───────────────────────────────────────────────────
  if (pantalla === 'formulario') return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setPantalla('selector')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B]">
          <X size={15} />
        </button>
        <div>
          <p className="text-[10px] text-[#F7941D] font-bold tracking-widest uppercase">Cotización · {RAMOS.find(r=>r.id===ramo)?.label}</p>
          <h1 className="text-[18px] text-[#1A1F2B] font-bold">Datos para tu cotización</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Formulario */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Datos personales */}
          <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase mb-4">Datos personales</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nombre completo" required><TInput value={form.nombre} onChange={v=>set('nombre',v)} placeholder="María García" /></Field>
              <Field label="Correo electrónico" required><TInput value={form.email} onChange={v=>set('email',v)} placeholder="correo@email.com" type="email" /></Field>
              <Field label="Teléfono"><TInput value={form.tel} onChange={v=>set('tel',v)} placeholder="55 1234 5678" type="tel" /></Field>
              <Field label="Código Postal" required><TInput value={form.cp} onChange={v=>set('cp',v.slice(0,5))} placeholder="06600" /></Field>
              <Field label="Rango de edad" required>
                <NeuSelect value={form.edad} onChange={v=>set('edad',v)}
                  options={['18-25','26-35','36-45','46-55','56-65','65+'].map(a=>({value:a,label:`${a} años`}))}
                  placeholder="Tu edad" />
              </Field>
              <Field label="Sexo" required>
                <NeuSelect value={form.sexo} onChange={v=>set('sexo',v)}
                  options={[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}]} placeholder="Selecciona" />
              </Field>
            </div>
          </div>

          {/* Campos específicos por ramo */}
          {ramo === 'auto' && (
            <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
              <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase mb-4">Tu vehículo</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Marca" required>
                  <NeuSelect value={form.marca} onChange={v=>set('marca',v)} options={MARCAS.map(m=>({value:m,label:m}))} placeholder="Marca del auto" />
                </Field>
                <Field label="Modelo" required><TInput value={form.modelo} onChange={v=>set('modelo',v)} placeholder="Jetta, Versa, Civic..." /></Field>
                <Field label="Año" required>
                  <NeuSelect value={form.anio} onChange={v=>set('anio',v)} options={anios.map(a=>({value:a,label:a}))} placeholder="Año" />
                </Field>
                <Field label="Uso del vehículo" required>
                  <NeuSelect value={form.uso} onChange={v=>set('uso',v)}
                    options={[{value:'particular',label:'Particular'},{value:'uber',label:'Uber / DIDI'},{value:'negocio',label:'Negocio'}]}
                    placeholder="Uso" />
                </Field>
                <Field label="Valor estimado (MXN)"><TInput value={form.valor} onChange={v=>set('valor',v)} placeholder="250,000" /></Field>
              </div>
              {/* REPUVE */}
              <div className="mt-4 p-3 rounded-xl border border-[#1A1F2B]/10 bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.08)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#1A1F2B] text-white text-[8px] font-bold">R</div>
                  <p className="text-[11px] font-bold text-[#1A1F2B]">REPUVE — Verificación vehicular</p>
                </div>
                <p className="text-[10px] text-[#6B7280] mb-2">Consulta si tu vehículo tiene reporte de robo activo.</p>
                <a href="https://car-buddy.co/vinmxes" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{ background:'linear-gradient(135deg,#1A1F2B,#2D3548)' }}>
                  <Shield size={11} /> Verificar en REPUVE
                </a>
              </div>
            </div>
          )}

          {(ramo === 'gmm' || ramo === 'vida') && (
            <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
              <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase mb-4">Datos de salud</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Peso (kg)"><TInput value={form.peso} onChange={v=>set('peso',v)} placeholder="70" /></Field>
                <Field label="Talla (cm)"><TInput value={form.talla} onChange={v=>set('talla',v)} placeholder="170" /></Field>
                <Field label="Padecimientos previos">
                  <NeuSelect value={form.preexistencia} onChange={v=>set('preexistencia',v)}
                    options={['Ninguno','Diabetes','Hipertensión','Cardiopatía','Otro'].map(o=>({value:o,label:o}))}
                    placeholder="Selecciona" />
                </Field>
                <Field label="Suma asegurada">
                  <NeuSelect value={form.suma} onChange={v=>set('suma',v)}
                    options={['$500,000','$1,000,000','$2,000,000','$3,000,000','Ilimitada'].map(o=>({value:o,label:o}))}
                    placeholder="Suma asegurada" />
                </Field>
              </div>
            </div>
          )}

          {ramo === 'danos' && (
            <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
              <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase mb-4">Tu propiedad</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Tipo de bien" required>
                  <NeuSelect value={form.tipo_bien} onChange={v=>set('tipo_bien',v)}
                    options={['Casa habitación','Departamento','Local comercial','Oficina','Bodega'].map(o=>({value:o,label:o}))}
                    placeholder="Tipo" />
                </Field>
                <Field label="Valor del inmueble (MXN)">
                  <TInput value={form.valor_inmueble} onChange={v=>set('valor_inmueble',v)} placeholder="1,500,000" />
                </Field>
              </div>
            </div>
          )}

          <button onClick={cotizar} disabled={!completo}
            className={cn('flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-[14px] transition-all',
              completo ? 'hover:scale-[1.02] hover:shadow-[0_10px_32px_rgba(247,148,29,0.5)]' : 'opacity-40 cursor-not-allowed'
            )}
            style={{ background:'linear-gradient(135deg,#F7941D,#c8600a)', boxShadow: completo ? '0 6px 24px rgba(247,148,29,0.4)':undefined }}>
            Calcular mi cotización <ArrowRight size={16} />
          </button>
        </div>

        {/* XORIA Chat */}
        <div className="lg:col-span-2">
          <div className="bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex flex-col" style={{ height:'60vh', minHeight:360 }}>
            <div className="flex items-center gap-2 p-3 border-b border-[#E4EBF1]">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <Image src="/Icono xoria.png" alt="XORIA" width={28} height={28} className="object-cover w-full h-full" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1A1F2B]">XORIA</p>
                <p className="text-[9px] text-[#69A481]">Asistente activo</p>
              </div>
              <button onClick={() => setChatHistory([{role:'xoria',msg:'¡Hola! ¿En qué te ayudo con tu cotización?'}])}
                className="ml-auto w-6 h-6 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#1A1F2B] bg-[#EFF2F9] shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]">
                <RotateCcw size={10} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {chatHistory.map((m,i)=>(
                <div key={i} className={cn('flex gap-1.5 max-w-[90%]', m.role==='user'?'self-end flex-row-reverse':'self-start')}>
                  <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0', m.role==='xoria'?'overflow-hidden':'bg-[#F7941D]')}>
                    {m.role==='xoria' ? <Image src="/Icono xoria.png" alt="X" width={20} height={20} className="object-cover w-full h-full" /> : <User size={9} className="text-white" />}
                  </div>
                  <div className={cn('rounded-xl px-2.5 py-1.5 text-[11px] leading-relaxed',
                    m.role==='xoria' ? 'bg-[#EFF2F9] text-[#1A1F2B] shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)] rounded-tl-sm' : 'text-white rounded-tr-sm'
                  )}
                    style={m.role==='user'?{background:'linear-gradient(135deg,#F7941D,#e08019)'}:{}}>
                    {m.msg}
                  </div>
                </div>
              ))}
              {isSending && <div className="flex gap-1.5 self-start"><div className="w-5 h-5 rounded-full overflow-hidden"><Image src="/Icono xoria.png" alt="X" width={20} height={20} className="object-cover w-full h-full" /></div><div className="bg-[#EFF2F9] rounded-xl rounded-tl-sm px-2.5 py-1.5 shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]"><Loader2 size={12} className="text-[#F7941D] animate-spin" /></div></div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-2.5 border-t border-[#E4EBF1]">
              <div className="flex gap-1.5">
                <button onClick={toggleMic}
                  className={cn('w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-all',
                    isListening ? 'text-white' : 'text-[#6B7280] bg-[#EFF2F9] shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)] hover:text-[#F7941D]'
                  )} style={isListening?{background:'linear-gradient(135deg,#F7941D,#e08019)'}:{}}>
                  {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                </button>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&enviarChat()}
                  placeholder="Pregúntame lo que quieras..."
                  className="flex-1 bg-white/30 border border-white/50 rounded-lg px-2.5 py-1.5 text-[11px] text-[#1A1F2B] placeholder:text-[#B5BFC6] outline-none focus:border-[#F7941D]/50 shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.08)]" />
                <button onClick={enviarChat} disabled={!chatInput.trim()||isSending}
                  className={cn('w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-all',
                    chatInput.trim() ? 'text-white' : 'text-[#B5BFC6] bg-[#EFF2F9] shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]'
                  )} style={chatInput.trim()?{background:'linear-gradient(135deg,#F7941D,#e08019)'}:{}}>
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── PANTALLA RESULTADO ────────────────────────────────────────────────────
  if (pantalla === 'resultado') return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setPantalla('formulario')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.15)] text-[#6B7280] hover:text-[#1A1F2B]">
          <X size={15} />
        </button>
        <div>
          <p className="text-[10px] text-[#69A481] font-bold tracking-widest uppercase">Cotización generada</p>
          <h1 className="text-[18px] text-[#1A1F2B] font-bold">Opciones para ti</h1>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-[#F7941D]/6 border border-[#F7941D]/20 rounded-2xl p-4">
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
          <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
        </div>
        <p className="text-[12px] text-[#1A1F2B] leading-relaxed">
          <span className="text-[#F7941D] font-semibold">XORIA calculó 3 opciones</span> con base en tu perfil. Selecciona la que mejor se adapte y te la enviamos a tu agente para formalizar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resultado.map(op => {
          const sel = planSel === op.nombre
          return (
            <div key={op.nombre}
              className={cn('flex flex-col gap-3 p-5 rounded-2xl border transition-all',
                sel ? 'shadow-[-4px_-4px_12px_#FAFBFF,4px_4px_16px_rgba(247,148,29,0.22)] scale-[1.02]' : 'shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.10)]'
              )}
              style={{ background: sel?'#F7941D08':'#EFF2F9', borderColor: sel?'#F7941D40':'transparent' }}>
              {op.recomendada && <div className="text-[9px] font-bold text-[#F7941D] uppercase tracking-widest">Recomendada</div>}
              <div>
                <p className="text-[15px] font-bold text-[#1A1F2B]">{op.nombre}</p>
                <p className="text-[11px] text-[#6B7280]">{op.desc}</p>
              </div>
              <div>
                <p className="text-[28px] font-black" style={{ color: sel?'#F7941D':'#1A1F2B' }}>{fmt(op.prima_mensual)}</p>
                <p className="text-[11px] text-[#9CA3AF]">al mes · {fmt(op.prima_anual)}/año</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPlanSel(op.nombre)}
                  className={cn('flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all',
                    sel ? 'text-white' : 'text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B]'
                  )}
                  style={sel?{background:'linear-gradient(135deg,#F7941D,#e08019)'}:{}}>
                  {sel ? 'Seleccionada' : 'Elegir'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setPantalla('formulario')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B] transition-all">
          <RotateCcw size={13} /> Volver a cotizar
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-[#7C1F31] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B] transition-all"
          onClick={() => setPantalla('selector')}>
          <X size={13} /> Rechazar
        </button>
        <button onClick={solicitarCotizacion} disabled={!planSel}
          className={cn('flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all',
            planSel ? 'hover:scale-[1.03]' : 'opacity-40 cursor-not-allowed'
          )}
          style={planSel ? { background:'linear-gradient(135deg,#69A481,#4a7a5d)', boxShadow:'0 4px 16px rgba(105,164,129,0.4)' } : {}}>
          <CheckCircle size={13} /> Adquirir — llenar solicitud
        </button>
      </div>
    </div>
  )

  // ─── ENVIADA ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto py-16 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.15)]"
        style={{ background:'linear-gradient(135deg,#69A481,#4a7a5d)' }}>
        <CheckCircle size={28} className="text-white" />
      </div>
      <div>
        <h2 className="text-[20px] font-bold text-[#1A1F2B]">Solicitud enviada</h2>
        <p className="text-[13px] text-[#6B7280] mt-2 leading-relaxed">
          Tu agente recibió la cotización. Se pondrá en contacto contigo para formalizar el seguro con XORIA.
        </p>
      </div>
      <div className="flex items-start gap-3 bg-[#F7941D]/6 border border-[#F7941D]/20 rounded-2xl p-4 text-left">
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
          <Image src="/Icono xoria.png" alt="XORIA" width={32} height={32} className="object-cover w-full h-full" />
        </div>
        <p className="text-[12px] text-[#1A1F2B] leading-relaxed">
          Tu solicitud quedó registrada. Puedes ver el seguimiento en <strong>Mis pólizas</strong> o chatear conmigo si tienes dudas.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => router.push('/client/mensajes')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B] transition-all">
          <MessageSquare size={13} /> Ver mensajes
        </button>
        <button onClick={() => router.push('/client/inicio')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-[1.02]"
          style={{ background:'linear-gradient(135deg,#F7941D,#e08019)' }}>
          Ir al inicio <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}
