'use client'
import { useState, useRef } from 'react'
import {
  Users, UserPlus, FileText, DollarSign, Target, Award, BookOpen,
  Clock, CheckCircle, X, Plus, Download, Upload, Edit2, Trash2,
  ChevronRight, AlertTriangle, BarChart2, Mic, MicOff, Send, Loader2
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { exportCSV } from '@/lib/exportCSV'

type Tab = 'expedientes'|'asistencia'|'nomina'|'metas'|'capacitacion'

const ROLES = ['Agente','Promotor Jr','Promotor Sr','Auxiliar Administrativo','Analista de Producción','Gerente de Zona']
const DEPT = ['Producción','Administración','Operaciones','Capacitación']

const EMPLEADOS = [
  { id:'e1', nombre:'Carlos Mendoza',    puesto:'Agente Sr', dept:'Producción',    status:'activo',   clave:'AG-001', ingreso:'2021-03-01', salario:18500, tipo:'Agente',        cedula:'CNSF-00123', avatar:'CM', email:'c.mendoza@gnp.com', tel:'55 1234 5678' },
  { id:'e2', nombre:'Patricia Garza',    puesto:'Promotor Sr',dept:'Producción',   status:'activo',   clave:'PR-001', ingreso:'2019-08-15', salario:32000, tipo:'Promotoria',    cedula:'CNSF-00050', avatar:'PG', email:'p.garza@gnp.com',   tel:'55 2345 6789' },
  { id:'e3', nombre:'Miguel García',     puesto:'Agente Jr',  dept:'Producción',   status:'activo',   clave:'AG-002', ingreso:'2023-01-10', salario:12000, tipo:'Agente',        cedula:'CNSF-00211', avatar:'MG', email:'m.garcia@gnp.com',  tel:'55 3456 7890' },
  { id:'e4', nombre:'Laura Vega',        puesto:'Aux. Admin', dept:'Administración',status:'activo',  clave:'AA-001', ingreso:'2022-06-01', salario:9800,  tipo:'Administrativo',cedula:'—',          avatar:'LV', email:'l.vega@gnp.com',    tel:'55 4567 8901' },
  { id:'e5', nombre:'Roberto Sánchez',   puesto:'Analista',   dept:'Operaciones',  status:'baja',    clave:'AN-001', ingreso:'2020-11-20', salario:14000, tipo:'Administrativo',cedula:'—',          avatar:'RS', email:'r.sanchez@gnp.com', tel:'55 5678 9012' },
  { id:'e6', nombre:'Diana Torres',      puesto:'Agente Jr',  dept:'Producción',   status:'activo',   clave:'AG-003', ingreso:'2024-02-01', salario:11500, tipo:'Agente',        cedula:'CNSF-00298', avatar:'DT', email:'d.torres@gnp.com',  tel:'55 6789 0123' },
]

const ASISTENCIA_HOY = [
  { id:'e1', nombre:'Carlos Mendoza',  entrada:'08:55', salida:'',      status:'presente' },
  { id:'e2', nombre:'Patricia Garza',  entrada:'09:02', salida:'',      status:'presente' },
  { id:'e3', nombre:'Miguel García',   entrada:'09:30', salida:'',      status:'tardanza' },
  { id:'e4', nombre:'Laura Vega',      entrada:'09:00', salida:'14:00', status:'medio día' },
  { id:'e6', nombre:'Diana Torres',    entrada:'',      salida:'',      status:'falta'    },
]

const NOMINA_MES = [
  { id:'e1', nombre:'Carlos Mendoza',    sueldo:18500, comision:30345, bonos:2000,  deducciones:4850,  neto:46000-1, tipo:'Agente',         },
  { id:'e2', nombre:'Patricia Garza',    sueldo:32000, comision:14200, bonos:3000,  deducciones:8200,  neto:41000,   tipo:'Promotoria',     },
  { id:'e3', nombre:'Miguel García',     sueldo:12000, comision:8400,  bonos:0,     deducciones:2450,  neto:17950,   tipo:'Agente',         },
  { id:'e4', nombre:'Laura Vega',        sueldo:9800,  comision:0,     bonos:500,   deducciones:1350,  neto:8950,    tipo:'Administrativo', },
  { id:'e6', nombre:'Diana Torres',      sueldo:11500, comision:6200,  bonos:0,     deducciones:2100,  neto:15600,   tipo:'Agente',         },
]

const METAS_EQUIPO = [
  { id:'e1', nombre:'Carlos Mendoza',  meta:170000, logrado:178500, pct:105, status:'superada'  },
  { id:'e2', nombre:'Patricia Garza',  meta:600000, logrado:632500, pct:105, status:'superada'  },
  { id:'e3', nombre:'Miguel García',   meta:150000, logrado:143000, pct:95,  status:'en proceso'},
  { id:'e4', nombre:'Laura Vega',      meta:0,      logrado:0,      pct:100, status:'N/A'       },
  { id:'e6', nombre:'Diana Torres',    meta:120000, logrado:84000,  pct:70,  status:'en riesgo' },
]

const CAPACITACIONES = [
  { id:'cap1', curso:'Certificación CNSF 2026',       horas:20, estado:'En curso',    avance:60, fecha:'Mar–Abr 2026', inscritos:['e1','e3','e6'] },
  { id:'cap2', curso:'Ventas Consultivas GNP',         horas:8,  estado:'Completado', avance:100,fecha:'Feb 2026',     inscritos:['e1','e2','e3','e6'] },
  { id:'cap3', curso:'Herramientas IAOS',              horas:4,  estado:'Programado', avance:0,  fecha:'Abr 2026',    inscritos:['e1','e2','e3','e4','e6'] },
  { id:'cap4', curso:'Siniestros y Proceso de Pago',   horas:6,  estado:'Completado', avance:100,fecha:'Ene 2026',    inscritos:['e1','e3'] },
  { id:'cap5', curso:'GMM Colectivo — Producto AXA',   horas:3,  estado:'Programado', avance:0,  fecha:'May 2026',    inscritos:['e2','e3','e6'] },
]

const STATUS_COLOR: Record<string,string> = {
  activo:'#69A481', baja:'#7C1F31', presente:'#69A481', tardanza:'#F7941D', falta:'#7C1F31', 'medio día':'#6B7280',
  superada:'#69A481', 'en proceso':'#F7941D', 'en riesgo':'#7C1F31', 'N/A':'#6B7280',
  'En curso':'#F7941D', Completado:'#69A481', Programado:'#6B7280'
}

const fmt = (n:number) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n)

export default function RHPromoPage() {
  const [tab, setTab] = useState<Tab>('expedientes')
  const [openEmp, setOpenEmp] = useState<typeof EMPLEADOS[0]|null>(null)
  const [newEmp, setNewEmp] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<{role:'user'|'xoria';msg:string}[]>([
    { role:'xoria', msg:'Hola, soy XORIA. Puedo ayudarte a gestionar tu equipo: consultar expedientes, analizar asistencia, preparar nómina o sugerir capacitaciones.' }
  ])
  const [isSending, setIsSending] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [showNominaModal, setShowNominaModal] = useState<typeof NOMINA_MES[0]|null>(null)

  const TABS_LIST: { id:Tab; label:string; icon:React.ElementType }[] = [
    { id:'expedientes',  label:'Expedientes',  icon:Users     },
    { id:'asistencia',   label:'Asistencia',   icon:Clock     },
    { id:'nomina',       label:'Nómina',       icon:DollarSign},
    { id:'metas',        label:'Metas',        icon:Target    },
    { id:'capacitacion', label:'Capacitación', icon:BookOpen  },
  ]

  const empleadosActivos = EMPLEADOS.filter(e=>e.status==='activo')
  const totalNomina = NOMINA_MES.reduce((s,e)=>s+e.neto,0)

  async function enviarChat() {
    if (!chatInput.trim()) return
    const msg = chatInput.trim()
    setChatInput('')
    setIsSending(true)
    setChatHistory(h=>[...h,{role:'user',msg}])
    try {
      const res = await fetch('/api/xoria/chat',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ messages:[...chatHistory.map(m=>({role:m.role==='xoria'?'assistant':'user',content:m.msg})),{role:'user',content:msg}], context:{ perfil:'promotoria_rh', instruccion:'Eres el asistente de RH de una promotoria de seguros en México. Respondes preguntas sobre expedientes, asistencia, nómina, metas y capacitación de agentes. Máximo 2 oraciones, en español.' } })
      })
      const json = await res.json()
      setChatHistory(h=>[...h,{role:'xoria',msg:json.reply||'Revisando los expedientes del equipo...'}])
    } catch {
      setChatHistory(h=>[...h,{role:'xoria',msg:'Aquí estoy para gestionar el equipo contigo.'}])
    }
    setIsSending(false)
  }

  function toggleMic() {
    type SR = { new(): { lang:string; continuous:boolean; start():void; onresult:(e:{results:{[n:number]:{[n:number]:{transcript:string}}}})=>void; onerror:()=>void; onend:()=>void }; }
    const SRClass = ((window as unknown as Record<string,unknown>).SpeechRecognition || (window as unknown as Record<string,unknown>).webkitSpeechRecognition) as SR|undefined
    if (!SRClass) return
    const r = new SRClass(); r.lang='es-MX'; r.continuous=false
    setIsListening(true)
    r.start()
    r.onresult=(e)=>{setChatInput(e.results[0][0].transcript);setIsListening(false)}
    r.onerror=()=>setIsListening(false)
    r.onend=()=>setIsListening(false)
  }

  return (
    <>
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] text-[#F7941D] font-bold tracking-widest uppercase">Promotoria · Gestión</p>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold">Recursos Humanos</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label:'Empleados activos', val:empleadosActivos.length, color:'#69A481' },
              { label:'Nómina este mes',    val:fmt(totalNomina),        color:'#F7941D' },
              { label:'Presentes hoy',      val:`${ASISTENCIA_HOY.filter(a=>a.status==='presente').length}/${ASISTENCIA_HOY.length}`, color:'#1A1F2B' },
            ].map(k=>(
              <div key={k.label} className="bg-[#EFF2F9] rounded-2xl px-4 py-3 shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.12)] text-right">
                <p className="text-[16px] font-black" style={{ color:k.color }}>{k.val}</p>
                <p className="text-[10px] text-[#9CA3AF]">{k.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Contenido principal */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#EFF2F9] rounded-2xl p-1.5 shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)] overflow-x-auto">
            {TABS_LIST.map(t=>{
              const Icon = t.icon
              return (
                <button key={t.id} onClick={()=>setTab(t.id)}
                  className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all',
                    tab===t.id?'bg-[#EFF2F9] text-[#F7941D] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)]':'text-[#9CA3AF] hover:text-[#6B7280]')}>
                  <Icon size={12} /> {t.label}
                </button>
              )
            })}
          </div>

          {/* ── EXPEDIENTES ── */}
          {tab==='expedientes' && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <button onClick={()=>setNewEmp(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background:'linear-gradient(135deg,#F7941D,#e08019)', boxShadow:'0 4px 12px rgba(247,148,29,0.35)' }}>
                  <UserPlus size={13} /> Nuevo empleado
                </button>
              </div>
              {EMPLEADOS.map(emp=>(
                <button key={emp.id} onClick={()=>setOpenEmp(emp)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#EFF2F9] shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] text-left hover:scale-[1.002] transition-all w-full">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold"
                    style={{ background: emp.status==='activo'?'linear-gradient(135deg,#F7941D18,#e0801908)':'#6B728018', color: emp.status==='activo'?'#F7941D':'#6B7280', border:`2px solid ${emp.status==='activo'?'#F7941D30':'#6B728030'}` }}>
                    {emp.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-bold text-[#1A1F2B]">{emp.nombre}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background:`${STATUS_COLOR[emp.status]}18`, color:STATUS_COLOR[emp.status] }}>{emp.status}</span>
                    </div>
                    <p className="text-[11px] text-[#6B7280]">{emp.puesto} · {emp.dept}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{emp.clave} · Ingreso: {emp.ingreso}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-bold text-[#1A1F2B]">{fmt(emp.salario)}</p>
                    <p className="text-[10px] text-[#9CA3AF]">base mensual</p>
                    <ChevronRight size={13} className="text-[#B5BFC6] ml-auto mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── ASISTENCIA ── */}
          {tab==='asistencia' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest">Hoy</p>
                  <p className="text-[15px] font-bold text-[#1A1F2B]">{new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})}</p>
                </div>
                <button onClick={()=>exportCSV(ASISTENCIA_HOY.map(a=>({Empleado:a.nombre,Entrada:a.entrada||'—',Salida:a.salida||'—',Status:a.status})),'asistencia-hoy.csv')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#F7941D] transition-all">
                  <Download size={12} /> Exportar
                </button>
              </div>
              {/* Resumen */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label:'Presentes',  val:ASISTENCIA_HOY.filter(a=>a.status==='presente').length, color:'#69A481' },
                  { label:'Tardanzas',  val:ASISTENCIA_HOY.filter(a=>a.status==='tardanza').length, color:'#F7941D' },
                  { label:'Faltas',     val:ASISTENCIA_HOY.filter(a=>a.status==='falta').length,    color:'#7C1F31' },
                  { label:'Medio día',  val:ASISTENCIA_HOY.filter(a=>a.status==='medio día').length,color:'#6B7280' },
                ].map(k=>(
                  <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-3 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-center">
                    <p className="text-[20px] font-black" style={{ color:k.color }}>{k.val}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{k.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {ASISTENCIA_HOY.map(a=>(
                  <div key={a.id} className="flex items-center gap-4 p-4 bg-[#EFF2F9] rounded-2xl shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(22,27,29,0.10)]">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background:STATUS_COLOR[a.status]||'#6B7280' }} />
                    <p className="text-[13px] font-semibold text-[#1A1F2B] flex-1">{a.nombre}</p>
                    <p className="text-[11px] text-[#69A481] w-16 text-right">{a.entrada||'—'}</p>
                    <p className="text-[11px] text-[#9CA3AF] w-16 text-right">{a.salida||'—'}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold w-20 text-center" style={{ background:`${STATUS_COLOR[a.status]||'#6B7280'}18`, color:STATUS_COLOR[a.status]||'#6B7280' }}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NÓMINA ── */}
          {tab==='nomina' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest">Marzo 2026</p>
                  <p className="text-[15px] font-bold text-[#1A1F2B]">Nómina del equipo</p>
                </div>
                <button onClick={()=>exportCSV(NOMINA_MES.map(e=>({Empleado:e.nombre,Sueldo:e.sueldo,Comisión:e.comision,Bonos:e.bonos,Deducciones:e.deducciones,Neto:e.neto})),'nomina-marzo-2026.csv')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#F7941D] transition-all">
                  <Download size={12} /> CSV
                </button>
              </div>
              <div className="bg-[#EFF2F9] rounded-2xl shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] overflow-hidden">
                <div className="grid grid-cols-5 gap-2 px-5 py-3 border-b border-[#D1D5DB]/20 text-[10px] text-[#9CA3AF] uppercase tracking-widest">
                  <span className="col-span-2">Empleado</span><span className="text-right">Sueldo</span><span className="text-right">Comisión</span><span className="text-right font-bold text-[#F7941D]">Neto</span>
                </div>
                {NOMINA_MES.map(e=>(
                  <button key={e.id} onClick={()=>setShowNominaModal(e)}
                    className="grid grid-cols-5 gap-2 px-5 py-4 border-b border-[#D1D5DB]/15 last:border-0 hover:bg-[#F7941D]/4 transition-colors w-full text-left">
                    <div className="col-span-2">
                      <p className="text-[12px] font-semibold text-[#1A1F2B]">{e.nombre}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{e.tipo}</p>
                    </div>
                    <p className="text-[12px] text-[#6B7280] text-right self-center">{fmt(e.sueldo)}</p>
                    <p className="text-[12px] text-[#69A481] text-right self-center">{e.comision>0?fmt(e.comision):'—'}</p>
                    <p className="text-[13px] font-bold text-[#F7941D] text-right self-center">{fmt(e.neto)}</p>
                  </button>
                ))}
                <div className="grid grid-cols-5 gap-2 px-5 py-3 bg-[#F7941D]/5 border-t border-[#F7941D]/20">
                  <span className="col-span-2 text-[11px] font-bold text-[#1A1F2B]">TOTAL NÓMINA</span>
                  <span/><span/>
                  <span className="text-[14px] font-black text-[#F7941D] text-right">{fmt(totalNomina)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── METAS ── */}
          {tab==='metas' && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest">Progreso · Marzo 2026</p>
              {METAS_EQUIPO.map(m=>(
                <div key={m.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[13px] font-bold text-[#1A1F2B]">{m.nombre}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background:`${STATUS_COLOR[m.status]||'#6B7280'}18`, color:STATUS_COLOR[m.status]||'#6B7280' }}>{m.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[18px] font-black" style={{ color: m.pct>=100?'#69A481':m.pct>=80?'#F7941D':'#7C1F31' }}>{m.pct}%</p>
                      <p className="text-[10px] text-[#9CA3AF]">{m.meta>0?`${fmt(m.logrado)} / ${fmt(m.meta)}`:'No aplica'}</p>
                    </div>
                  </div>
                  {m.meta>0 && (
                    <div className="w-full h-3 bg-[#EFF2F9] rounded-full shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width:`${Math.min(m.pct,100)}%`, background: m.pct>=100?'linear-gradient(135deg,#69A481,#4a7a5d)':m.pct>=80?'linear-gradient(135deg,#F7941D,#e08019)':'linear-gradient(135deg,#7C1F31,#5a1624)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── CAPACITACIÓN ── */}
          {tab==='capacitacion' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest">Plan de desarrollo 2026</p>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{ background:'linear-gradient(135deg,#F7941D,#e08019)' }}>
                  <Plus size={12} /> Nuevo curso
                </button>
              </div>
              {CAPACITACIONES.map(cap=>(
                <div key={cap.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${STATUS_COLOR[cap.estado]||'#6B7280'}15` }}>
                      <BookOpen size={16} style={{ color:STATUS_COLOR[cap.estado]||'#6B7280' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-bold text-[#1A1F2B]">{cap.curso}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background:`${STATUS_COLOR[cap.estado]||'#6B7280'}18`, color:STATUS_COLOR[cap.estado]||'#6B7280' }}>{cap.estado}</span>
                      </div>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">{cap.horas} hrs · {cap.fecha} · {cap.inscritos.length} inscritos</p>
                      {cap.avance > 0 && (
                        <div className="w-full h-2 bg-[#EFF2F9] rounded-full shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.08)] mt-2 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${cap.avance}%`, background:'linear-gradient(135deg,#F7941D,#e08019)' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── XORIA CHAT ── */}
        <div className="lg:col-span-1">
          <div className="bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] flex flex-col sticky top-4" style={{ height:'65vh', minHeight:400 }}>
            <div className="flex items-center gap-2 p-3 border-b border-[#E4EBF1]">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <Image src="/Icono xoria.png" alt="XORIA" width={28} height={28} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-[#1A1F2B]">XORIA · RH</p>
                <p className="text-[9px] text-[#69A481]">Asistente activo</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {chatHistory.map((m,i)=>(
                <div key={i} className={cn('flex gap-1.5 max-w-[95%]', m.role==='user'?'self-end flex-row-reverse':'self-start')}>
                  <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0', m.role==='xoria'?'overflow-hidden':'bg-[#F7941D]')}>
                    {m.role==='xoria'?<Image src="/Icono xoria.png" alt="X" width={20} height={20} className="object-cover w-full h-full"/>:<span className="text-[8px] text-white font-bold">Tú</span>}
                  </div>
                  <div className={cn('rounded-xl px-2.5 py-1.5 text-[10px] leading-relaxed',
                    m.role==='xoria'?'bg-[#EFF2F9] text-[#1A1F2B] shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)] rounded-tl-sm':'text-white rounded-tr-sm'
                  )} style={m.role==='user'?{background:'linear-gradient(135deg,#F7941D,#e08019)'}:{}}>
                    {m.msg}
                  </div>
                </div>
              ))}
              {isSending&&<div className="flex gap-1.5 self-start"><div className="w-5 h-5 rounded-full overflow-hidden"><Image src="/Icono xoria.png" alt="X" width={20} height={20} className="object-cover w-full h-full"/></div><div className="bg-[#EFF2F9] rounded-xl rounded-tl-sm px-2.5 py-1.5 shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]"><Loader2 size={11} className="text-[#F7941D] animate-spin"/></div></div>}
              <div ref={chatEndRef}/>
            </div>
            <div className="p-2.5 border-t border-[#E4EBF1]">
              <div className="flex gap-1.5">
                <button onClick={toggleMic} className={cn('w-7 h-7 flex items-center justify-center rounded-lg shrink-0 transition-all', isListening?'text-white':'text-[#6B7280] bg-[#EFF2F9] shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]')} style={isListening?{background:'linear-gradient(135deg,#F7941D,#e08019)'}:{}}>
                  {isListening?<MicOff size={11}/>:<Mic size={11}/>}
                </button>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&enviarChat()} placeholder="Pregunta sobre el equipo..."
                  className="flex-1 bg-white/30 border border-white/50 rounded-lg px-2.5 py-1.5 text-[10px] text-[#1A1F2B] placeholder:text-[#B5BFC6] outline-none focus:border-[#F7941D]/50 shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.08)]"/>
                <button onClick={enviarChat} disabled={!chatInput.trim()||isSending} className={cn('w-7 h-7 flex items-center justify-center rounded-lg shrink-0 transition-all', chatInput.trim()?'text-white':'text-[#B5BFC6] bg-[#EFF2F9] shadow-[-1px_-1px_3px_#FAFBFF,1px_1px_3px_rgba(22,27,29,0.10)]')} style={chatInput.trim()?{background:'linear-gradient(135deg,#F7941D,#e08019)'}:{}}>
                  <Send size={11}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── MODAL EXPEDIENTE ── */}
    {openEmp && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter:'blur(12px)', background:'rgba(26,31,43,0.45)' }} onClick={()=>setOpenEmp(null)}>
        <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-lg shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.28)] flex flex-col max-h-[85vh]" onClick={e=>e.stopPropagation()}>
          <div className="flex items-center gap-4 p-6 border-b border-[#E4EBF1]">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-[16px] font-bold"
              style={{ background:'linear-gradient(135deg,#F7941D18,#e0801908)', color:'#F7941D', border:'2px solid #F7941D40' }}>
              {openEmp.avatar}
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-[#1A1F2B]">{openEmp.nombre}</p>
              <p className="text-[12px] text-[#6B7280]">{openEmp.puesto} · {openEmp.dept}</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1 inline-block" style={{ background:`${STATUS_COLOR[openEmp.status]}18`, color:STATUS_COLOR[openEmp.status] }}>{openEmp.status}</span>
            </div>
            <button onClick={()=>setOpenEmp(null)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#7C1F31]">
              <X size={15}/>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Clave empleado',openEmp.clave],
                ['Fecha de ingreso',openEmp.ingreso],
                ['Tipo',openEmp.tipo],
                ['Cédula CNSF',openEmp.cedula],
                ['Correo',openEmp.email],
                ['Teléfono',openEmp.tel],
                ['Salario base',fmt(openEmp.salario)],
                ['Departamento',openEmp.dept],
              ].map(([k,v])=>(
                <div key={k} className="bg-[#EFF2F9] rounded-xl p-3 shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.08)]">
                  <p className="text-[10px] text-[#9CA3AF] uppercase">{k}</p>
                  <p className="text-[12px] font-semibold text-[#1A1F2B] mt-0.5 truncate">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest">Documentos en expediente</p>
              {['INE / Identificación oficial','CURP','RFC','Contrato de agencia','Constancia CNSF','Comprobante domicilio','Foto'].map(doc=>(
                <div key={doc} className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.08)]">
                  <CheckCircle size={13} className="text-[#69A481] shrink-0"/>
                  <p className="text-[12px] text-[#1A1F2B] flex-1">{doc}</p>
                  <Download size={12} className="text-[#9CA3AF] hover:text-[#F7941D] transition-colors cursor-pointer"/>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 p-4 border-t border-[#E4EBF1]">
            <button onClick={()=>setOpenEmp(null)} className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#1A1F2B] transition-all">
              Cerrar
            </button>
            <button className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-[1.02]" style={{ background:'linear-gradient(135deg,#F7941D,#e08019)' }}>
              <Edit2 size={12} className="inline mr-1"/> Editar expediente
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── MODAL NÓMINA DETALLE ── */}
    {showNominaModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter:'blur(12px)', background:'rgba(26,31,43,0.45)' }} onClick={()=>setShowNominaModal(null)}>
        <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm p-6 shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.28)]" onClick={e=>e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-[#F7941D] font-bold tracking-widest uppercase">Nómina · Marzo 2026</p>
              <p className="text-[14px] font-bold text-[#1A1F2B]">{showNominaModal.nombre}</p>
            </div>
            <button onClick={()=>setShowNominaModal(null)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#7C1F31]">
              <X size={15}/>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {[['Sueldo base',showNominaModal.sueldo,'#6B7280'],['Comisiones',showNominaModal.comision,'#69A481'],['Bonos',showNominaModal.bonos,'#F7941D'],['Deducciones',-showNominaModal.deducciones,'#7C1F31']].map(([k,v,c])=>(
              <div key={String(k)} className="flex items-center justify-between py-2 border-b border-[#D1D5DB]/15">
                <p className="text-[12px] text-[#6B7280]">{k}</p>
                <p className="text-[13px] font-semibold" style={{ color:String(c) }}>{typeof v==='number'&&v!==0?fmt(Math.abs(Number(v))):'—'}</p>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <p className="text-[13px] font-bold text-[#1A1F2B]">NETO A PAGAR</p>
              <p className="text-[18px] font-black text-[#F7941D]">{fmt(showNominaModal.neto)}</p>
            </div>
          </div>
          <button onClick={()=>setShowNominaModal(null)} className="w-full mt-4 py-3 rounded-2xl text-white font-bold text-[13px] transition-all hover:scale-[1.02]"
            style={{ background:'linear-gradient(135deg,#F7941D,#e08019)', boxShadow:'0 6px 24px rgba(247,148,29,0.40)' }}>
            Generar recibo de nómina
          </button>
        </div>
      </div>
    )}

    {/* ── MODAL NUEVO EMPLEADO ── */}
    {newEmp && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter:'blur(12px)', background:'rgba(26,31,43,0.45)' }}>
        <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-md p-6 shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.28)] flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[#F7941D] font-bold tracking-widest uppercase">RH · Alta</p>
              <p className="text-[14px] font-bold text-[#1A1F2B]">Nuevo empleado</p>
            </div>
            <button onClick={()=>setNewEmp(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#7C1F31]">
              <X size={15}/>
            </button>
          </div>
          {[
            {label:'Nombre completo',placeholder:'Juan Pérez García'},
            {label:'Puesto',placeholder:'Agente Jr, Auxiliar Admin...'},
            {label:'Departamento',placeholder:'Producción, Administración...'},
            {label:'Correo electrónico',placeholder:'correo@gnp.com'},
            {label:'Teléfono',placeholder:'55 0000 0000'},
            {label:'Fecha de ingreso',placeholder:'2026-04-01'},
            {label:'Salario base (MXN)',placeholder:'12,000'},
            {label:'Cédula CNSF (si aplica)',placeholder:'CNSF-00000'},
          ].map(f=>(
            <div key={f.label}>
              <p className="text-[11px] text-[#6B7280] uppercase tracking-widest mb-1">{f.label}</p>
              <input placeholder={f.placeholder}
                className="w-full bg-white/30 border border-white/50 rounded-xl px-3 py-2.5 text-[12px] text-[#1A1F2B] placeholder:text-[#B5BFC6] outline-none focus:border-[#F7941D]/60 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]"/>
            </div>
          ))}
          <div className="flex gap-3 mt-2">
            <button onClick={()=>setNewEmp(false)} className="flex-1 py-3 rounded-2xl text-[12px] font-semibold text-[#6B7280] bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]">Cancelar</button>
            <button onClick={()=>setNewEmp(false)} className="flex-1 py-3 rounded-2xl text-white font-bold text-[13px] transition-all hover:scale-[1.02]"
              style={{ background:'linear-gradient(135deg,#F7941D,#e08019)', boxShadow:'0 6px 24px rgba(247,148,29,0.40)' }}>
              Dar de alta
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
