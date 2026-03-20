'use client'
import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { MOCK_POLICIES, MOCK_CHART_DATA, MOCK_KPIS, MOCK_AGENTES_EQUIPO } from '@/data/mock'
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import {
  TrendingUp, TrendingDown, Filter, Download, X, CheckCircle,
  Users, DollarSign, FileText, BarChart2, PieChart as PieIcon,
  RefreshCw, Target, Award, Shield, ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { exportCSV } from '@/lib/exportCSV'
import { NeuSelect } from '@/components/ui'

const PERIODS = ['Este mes','Trimestre','Este año','Personalizado']
const RAMOS_FILTER = ['Todos','GMM','Auto','Vida','Hogar','RC']

// ─── DATOS SIMULADOS ───────────────────────────────────────────────────────
const PRODUCCION_MENSUAL = [
  { mes:'Oct',prima:128000,polizas:14,comisiones:21760,meta:120000},
  { mes:'Nov',prima:143000,polizas:17,comisiones:24310,meta:140000},
  { mes:'Dic',prima:119000,polizas:12,comisiones:20230,meta:130000},
  { mes:'Ene',prima:157000,polizas:19,comisiones:26690,meta:150000},
  { mes:'Feb',prima:162000,polizas:21,comisiones:27540,meta:160000},
  { mes:'Mar',prima:178500,polizas:23,comisiones:30345,meta:170000},
]
const RAMO_DIST = [
  { name:'GMM',       value:38, color:'#F7941D' },
  { name:'Auto',      value:25, color:'#1A1F2B' },
  { name:'Vida',      value:18, color:'#7C1F31' },
  { name:'Hogar',     value:12, color:'#69A481' },
  { name:'RC',        value: 7, color:'#6B7280' },
]
const PIPELINE_ETAPAS = [
  { etapa:'Prospecto',  count:24, valor:'$284,000' },
  { etapa:'Cotizando',  count:14, valor:'$193,000' },
  { etapa:'Propuesta',  count: 9, valor:'$147,000' },
  { etapa:'Negociando', count: 5, valor:'$98,000'  },
  { etapa:'Cierre',     count: 3, valor:'$67,000'  },
]
const RENOVACIONES_RIESGO = [
  { poliza:'GNP-2025-001234', cliente:'Ana López',     vence:'30 días', prima:'$8,500', riesgo:'alto'  },
  { poliza:'QUA-2025-005678', cliente:'Roberto García', vence:'45 días', prima:'$1,025', riesgo:'medio' },
  { poliza:'AXA-2025-000345', cliente:'Empresa XYZ',   vence:'60 días', prima:'$145,000', riesgo:'bajo'},
  { poliza:'MAP-2024-007890', cliente:'Grupo Textil',  vence:'75 días', prima:'$28,000', riesgo:'bajo' },
]
const TOP_CLIENTES = [
  { nombre:'Empresa XYZ SA',   polizas:4, prima:'$178,000', pct:100 },
  { nombre:'Ana López',        polizas:3, prima:'$89,500',  pct:50  },
  { nombre:'Grupo Textil SA',  polizas:2, prima:'$67,200',  pct:38  },
  { nombre:'Roberto García',   polizas:2, prima:'$48,100',  pct:27  },
  { nombre:'Laura Vega',       polizas:1, prima:'$31,400',  pct:18  },
]
const RETENCION_MENSUAL = [
  { mes:'Oct',retencion:92, cancelaciones:1 },
  { mes:'Nov',retencion:95, cancelaciones:0 },
  { mes:'Dic',retencion:88, cancelaciones:2 },
  { mes:'Ene',retencion:94, cancelaciones:1 },
  { mes:'Feb',retencion:97, cancelaciones:0 },
  { mes:'Mar',retencion:96, cancelaciones:1 },
]
// Para promotoria — por agente
const PROD_POR_AGENTE = [
  { agente:'C. Mendoza',  prima:178500, polizas:23, meta:170000 },
  { agente:'M. García',   prima:143000, polizas:18, meta:150000 },
  { agente:'L. Vega',     prima:128000, polizas:16, meta:140000 },
  { agente:'R. Sánchez',  prima:98000,  polizas:12, meta:120000 },
  { agente:'P. Torres',   prima:84000,  polizas:10, meta:100000 },
]
// Para aseguradora — overview
const RED_PRODUCCION = [
  { region:'CDMX Norte',   prima:1280000, agentes:12, polizas:187 },
  { region:'CDMX Sur',     prima:980000,  agentes: 9, polizas:143 },
  { region:'Monterrey',    prima:760000,  agentes: 7, polizas:112 },
  { region:'Guadalajara',  prima:640000,  agentes: 6, polizas: 97 },
  { region:'Puebla',       prima:420000,  agentes: 4, polizas: 63 },
]

const fmt = (n:number) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n)
const RIESGO_COLOR: Record<string,string> = { alto:'#7C1F31', medio:'#F7941D', bajo:'#69A481' }

export default function ReportesPage() {
  const { user } = useAuth()
  const rol = (user?.role || 'agente') as string
  const [period, setPeriod] = useState('Este mes')
  const [ramoFilter, setRamoFilter] = useState('Todos')
  const [showExport, setShowExport] = useState(false)
  const [exportStep, setExportStep] = useState<'form'|'done'>('form')
  const [exportFmt, setExportFmt] = useState<'csv'|'pdf'>('csv')

  // KPIs según rol
  const kpis = useMemo(() => {
    if (rol === 'promotoria') return [
      { label:'Producción red',    val:'$632,500', sub:'+8% vs mes ant.', trend:'up',   color:'#F7941D' },
      { label:'Agentes activos',   val:'5',        sub:'de 5 en tu equipo', trend:'up', color:'#69A481' },
      { label:'Pólizas emitidas',  val:'79',       sub:'este mes',          trend:'up', color:'#1A1F2B' },
      { label:'Override estimado', val:'$14,200',  sub:'por liquidar Abr', trend:'up',  color:'#7C1F31' },
    ]
    if (rol === 'aseguradora') return [
      { label:'Producción total', val:'$4,080,000', sub:'+12% vs periodo ant.', trend:'up',   color:'#F7941D' },
      { label:'Agentes en red',   val:'38',          sub:'activos este mes',     trend:'up',   color:'#69A481' },
      { label:'Pólizas activas',  val:'602',         sub:'en cartera',           trend:'up',   color:'#1A1F2B' },
      { label:'Siniestralidad',   val:'61%',         sub:'objetivo: <70%',       trend:'down', color:'#7C1F31' },
    ]
    return [
      { label:'Prima producida',  val:'$178,500', sub:'+8% vs meta',      trend:'up',   color:'#F7941D' },
      { label:'Pólizas emitidas', val:'23',       sub:'meta: 20 pol/mes', trend:'up',   color:'#69A481' },
      { label:'Comisiones',       val:'$30,345',  sub:'pagadas: $19,876', trend:'up',   color:'#1A1F2B' },
      { label:'Retención',        val:'96%',      sub:'cartera 89 pólizas',trend:'up',  color:'#7C1F31' },
    ]
  }, [rol])

  function handleExport() {
    if (exportFmt === 'csv') {
      const data = PRODUCCION_MENSUAL.map(m => ({
        Mes: m.mes, 'Prima MXN': m.prima, Polizas: m.polizas,
        'Comisiones MXN': m.comisiones, 'Meta MXN': m.meta
      }))
      exportCSV(data, `reporte-produccion-${period.replace(/ /g,'_')}.csv`)
    }
    setExportStep('done')
    setTimeout(() => { setShowExport(false); setExportStep('form') }, 1800)
  }

  return (
    <>
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] text-[#F7941D] font-bold tracking-widest uppercase">Análisis · {rol === 'promotoria' ? 'Promotoria' : rol === 'aseguradora' ? 'GNP Seguros' : 'Mi producción'}</p>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold">Reportes</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Período */}
          <div className="flex gap-1 bg-[#EFF2F9] rounded-2xl p-1 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
            {PERIODS.slice(0,3).map(p=>(
              <button key={p} onClick={()=>setPeriod(p)}
                className={cn('px-3 py-1.5 rounded-xl text-[11px] transition-all font-semibold',
                  period===p?'bg-[#EFF2F9] text-[#F7941D] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)]':'text-[#9CA3AF] hover:text-[#6B7280]')}>
                {p}
              </button>
            ))}
          </div>
          {/* Ramo */}
          <select value={ramoFilter} onChange={e=>setRamoFilter(e.target.value)}
            className="bg-[#EFF2F9] text-[#1A1F2B] text-[12px] px-3 py-2 rounded-xl shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] outline-none border-none">
            {RAMOS_FILTER.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={()=>setShowExport(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background:'linear-gradient(135deg,#F7941D,#e08019)', boxShadow:'0 4px 12px rgba(247,148,29,0.35)' }}>
            <Download size={13} /> Exportar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-[#9CA3AF] font-medium">{k.label}</p>
              <div className={cn('flex items-center gap-0.5 text-[10px] font-bold', k.trend==='up'?'text-[#69A481]':'text-[#F7941D]')}>
                {k.trend==='up' ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
              </div>
            </div>
            <p className="text-[22px] font-black leading-tight" style={{ color:k.color }}>{k.val}</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Gráfica producción + pie ramo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest">Producción</p>
              <p className="text-[15px] font-bold text-[#1A1F2B]">Prima mensual vs meta</p>
            </div>
            <BarChart2 size={16} className="text-[#9CA3AF]" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rol==='promotoria'?PROD_POR_AGENTE.map(a=>({mes:a.agente,prima:a.prima,meta:a.meta})):PRODUCCION_MENSUAL} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4EBF1" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [fmt(Number(v))]} contentStyle={{ background:'#EFF2F9', border:'none', borderRadius:12, boxShadow:'-3px -3px 8px #FAFBFF,3px 3px 8px rgba(22,27,29,0.15)', fontSize:11 }} />
              <Bar dataKey="prima" fill="#F7941D" radius={[6,6,0,0]} name="Prima" />
              <Bar dataKey="meta" fill="#1A1F2B" radius={[6,6,0,0]} name="Meta" opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-1">Distribución</p>
          <p className="text-[15px] font-bold text-[#1A1F2B] mb-3">Cartera por ramo</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={RAMO_DIST} cx="50%" cy="50%" outerRadius={55} dataKey="value" paddingAngle={2}>
                {RAMO_DIST.map((r,i)=><Cell key={i} fill={r.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ background:'#EFF2F9', border:'none', borderRadius:10, fontSize:11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {RAMO_DIST.map(r=>(
              <div key={r.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background:r.color }} />
                <span className="text-[11px] text-[#6B7280] flex-1">{r.name}</span>
                <span className="text-[11px] font-bold text-[#1A1F2B]">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retención */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
        <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-1">Cartera</p>
        <p className="text-[15px] font-bold text-[#1A1F2B] mb-4">Retención mensual</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={RETENCION_MENSUAL}>
            <defs>
              <linearGradient id="retG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#69A481" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#69A481" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EBF1" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis domain={[80,100]} tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
            <Tooltip contentStyle={{ background:'#EFF2F9', border:'none', borderRadius:10, fontSize:11 }} />
            <Area type="monotone" dataKey="retencion" stroke="#69A481" strokeWidth={2} fill="url(#retG)" name="Retención %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline */}
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-1">Ventas</p>
          <p className="text-[15px] font-bold text-[#1A1F2B] mb-4">Pipeline activo</p>
          <div className="flex flex-col gap-3">
            {PIPELINE_ETAPAS.map((e,i)=>{
              const ancho = 100 - i * 16
              return (
                <div key={e.etapa} className="flex items-center gap-3">
                  <div className="w-[80px] shrink-0">
                    <p className="text-[11px] text-[#6B7280]">{e.etapa}</p>
                  </div>
                  <div className="flex-1 h-6 bg-[#EFF2F9] rounded-full shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width:`${ancho}%`, background:'linear-gradient(135deg,#F7941D,#e08019)' }} />
                  </div>
                  <div className="w-[80px] shrink-0 text-right">
                    <p className="text-[11px] font-bold text-[#1A1F2B]">{e.count} <span className="text-[#9CA3AF] font-normal text-[10px]">{e.valor}</span></p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Renovaciones en riesgo */}
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-0.5">Renovaciones</p>
              <p className="text-[15px] font-bold text-[#1A1F2B]">Próximos vencimientos</p>
            </div>
            <RefreshCw size={14} className="text-[#9CA3AF]" />
          </div>
          <div className="flex flex-col gap-2">
            {RENOVACIONES_RIESGO.map(r=>(
              <div key={r.poliza} className="flex items-center gap-3 p-3 rounded-xl shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.08)]">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background:RIESGO_COLOR[r.riesgo] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#1A1F2B] truncate">{r.cliente}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{r.poliza}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-bold text-[#1A1F2B]">{r.prima}</p>
                  <p className="text-[10px]" style={{ color:RIESGO_COLOR[r.riesgo] }}>{r.vence}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top clientes / prod por agente / red */}
      {(rol==='agente'||rol==='promotoria') && (
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-1">{rol==='promotoria'?'Producción por agente':'Clientes'}</p>
          <p className="text-[15px] font-bold text-[#1A1F2B] mb-4">{rol==='promotoria'?'Ranking de agentes':'Top 5 clientes por prima'}</p>
          <div className="flex flex-col gap-3">
            {(rol==='promotoria'?PROD_POR_AGENTE.map((a,i)=>({nombre:a.agente,polizas:a.polizas,prima:fmt(a.prima),pct:Math.round(a.prima/1785)})): TOP_CLIENTES).map((c,i)=>(
              <div key={c.nombre} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                  style={{ background: i===0?'linear-gradient(135deg,#F7941D,#e08019)':i===1?'linear-gradient(135deg,#6B7280,#4a515c)':'linear-gradient(135deg,#B5BFC6,#8a95a0)', color:'white' }}>
                  {i+1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#1A1F2B]">{c.nombre}</p>
                  <div className="w-full h-1.5 bg-[#EFF2F9] rounded-full shadow-[inset_-1px_-1px_3px_#FAFBFF,inset_1px_1px_3px_rgba(22,27,29,0.08)] mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${c.pct}%`, background:'linear-gradient(135deg,#F7941D,#e08019)' }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-bold text-[#1A1F2B]">{c.prima}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{c.polizas} pólizas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rol==='aseguradora' && (
        <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)]">
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-1">Red</p>
          <p className="text-[15px] font-bold text-[#1A1F2B] mb-4">Producción por región</p>
          <div className="flex flex-col gap-2">
            {RED_PRODUCCION.map(r=>(
              <div key={r.region} className="flex items-center gap-4 p-3 rounded-xl shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.08)]">
                <div className="flex-1">
                  <p className="text-[12px] font-semibold text-[#1A1F2B]">{r.region}</p>
                  <div className="w-full h-1.5 bg-[#EFF2F9] rounded-full shadow-[inset_-1px_-1px_2px_#FAFBFF,inset_1px_1px_2px_rgba(22,27,29,0.08)] mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${Math.round(r.prima/12800)}%`, background:'linear-gradient(135deg,#F7941D,#e08019)' }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-bold text-[#1A1F2B]">{fmt(r.prima)}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{r.agentes} agentes · {r.polizas} pólizas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* ─── MODAL EXPORTAR ─── */}
    {showExport && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter:'blur(12px)', background:'rgba(26,31,43,0.4)' }}>
        <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm p-6 shadow-[-20px_-20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] flex flex-col gap-4">
          {exportStep==='done' ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle size={40} className="text-[#69A481]" />
              <p className="text-[14px] font-bold text-[#1A1F2B]">Reporte exportado</p>
              <p className="text-[12px] text-[#9CA3AF] text-center">El archivo se descargó a tu dispositivo.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-[#1A1F2B]">Exportar reporte</h2>
                  <p className="text-[12px] text-[#9CA3AF]">Período: {period}</p>
                </div>
                <button onClick={()=>setShowExport(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#7C1F31]">
                  <X size={15} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(['csv','pdf'] as const).map(f=>(
                  <button key={f} onClick={()=>setExportFmt(f)}
                    className={cn('flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all',
                      exportFmt===f?'shadow-[-3px_-3px_8px_#FAFBFF,3px_3px_8px_rgba(247,148,29,0.20)]':'shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)]')}
                    style={{ borderColor: exportFmt===f?'#F7941D40':'transparent', background: exportFmt===f?'#F7941D08':'#EFF2F9' }}>
                    <FileText size={20} style={{ color: exportFmt===f?'#F7941D':'#9CA3AF' }} />
                    <span className="text-[12px] font-semibold uppercase" style={{ color: exportFmt===f?'#F7941D':'#6B7280' }}>{f}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] text-[#9CA3AF] uppercase tracking-widest">Incluye</p>
                {['KPIs del período','Producción mensual','Distribución por ramo','Pipeline activo','Renovaciones próximas'].map(item=>(
                  <div key={item} className="flex items-center gap-2 text-[12px] text-[#6B7280]">
                    <CheckCircle size={12} className="text-[#69A481]" /> {item}
                  </div>
                ))}
              </div>
              <button onClick={handleExport}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-[14px] transition-all hover:scale-[1.02]"
                style={{ background:'linear-gradient(135deg,#F7941D,#e08019)', boxShadow:'0 6px 24px rgba(247,148,29,0.40)' }}>
                <Download size={14} /> Descargar {exportFmt.toUpperCase()}
              </button>
            </>
          )}
        </div>
      </div>
    )}
    </>
  )
}
