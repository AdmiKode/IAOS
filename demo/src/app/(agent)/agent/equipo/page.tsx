'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { MOCK_AGENTES_EQUIPO } from '@/data/mock'
import {
  Users, TrendingUp, DollarSign, Target, Award, Activity,
  ChevronRight, X, Phone, Mail, Shield, CheckCircle2, AlertCircle,
  BarChart3, Layers, Crown, Clock, Plus, Download
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PLAN_COLOR: Record<string, string> = {
  'Básico': '#6B7280',
  'Profesional': '#F7941D',
  'Empresarial': '#1A1F2B',
}

type Agente = typeof MOCK_AGENTES_EQUIPO[0]

function AgenteModal({ agente, onClose }: { agente: Agente; onClose: () => void }) {
  const [tab, setTab] = useState<'resumen' | 'produccion' | 'cartera'>('resumen')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26,31,43,0.55)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-2xl bg-[#EFF2F9] rounded-3xl shadow-[0_24px_80px_rgba(22,27,29,0.35)] overflow-hidden"
        onClick={e => e.stopPropagation()}>
        {/* Header agente */}
        <div className="bg-gradient-to-r from-[#1A1F2B] to-[#2D3548] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#F7941D] font-bold text-[16px]"
              style={{ background: 'rgba(247,148,29,0.15)', border: '2px solid rgba(247,148,29,0.3)' }}>
              {agente.avatar}
            </div>
            <div>
              <p className="text-white font-bold text-[16px]">{agente.name}</p>
              <p className="text-white/60 text-[11px]">{agente.cedula}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: `${PLAN_COLOR[agente.plan]}22`, color: PLAN_COLOR[agente.plan], border: `1px solid ${PLAN_COLOR[agente.plan]}44` }}>
              {agente.plan}
            </span>
            <div className={cn('w-2 h-2 rounded-full', agente.status === 'activo' ? 'bg-[#69A481]' : 'bg-[#6B7280]')} />
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] px-6 bg-[#EFF2F9]">
          {([['resumen', 'Resumen'], ['produccion', 'Producción'], ['cartera', 'Cartera']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={cn('py-3 px-4 text-[11px] font-semibold border-b-2 transition-all', tab === id ? 'border-[#F7941D] text-[#F7941D]' : 'border-transparent text-[#9CA3AF] hover:text-[#6B7280]')}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'resumen' && (
            <div className="flex flex-col gap-4">
              {/* KPIs grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: 'Pólizas activas', value: agente.polizasActivas.toString(), color: '#69A481' },
                  { icon: DollarSign, label: 'Prima total MXN', value: `$${agente.primaTotal.toLocaleString()}`, color: '#F7941D' },
                  { icon: TrendingUp, label: 'Tasa de cierre', value: `${agente.tasaCierre}%`, color: '#1A1F2B' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-[#EFF2F9] rounded-xl p-4 shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] text-center">
                    <kpi.icon size={16} style={{ color: kpi.color }} className="mx-auto mb-1" />
                    <p className="text-[16px] font-bold text-[#1A1F2B]">{kpi.value}</p>
                    <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">{kpi.label}</p>
                  </div>
                ))}
              </div>
              {/* Meta del mes */}
              <div className="bg-[#EFF2F9] rounded-xl p-4 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
                <div className="flex justify-between mb-2">
                  <span className="text-[11px] text-[#6B7280] font-semibold">Avance meta mensual</span>
                  <span className={cn('text-[11px] font-bold', agente.avanceMeta >= 90 ? 'text-[#69A481]' : agente.avanceMeta >= 60 ? 'text-[#F7941D]' : 'text-[#7C1F31]')}>
                    {agente.avanceMeta}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${agente.avanceMeta}%`, background: agente.avanceMeta >= 90 ? '#69A481' : agente.avanceMeta >= 60 ? '#F7941D' : '#7C1F31' }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-[#9CA3AF]">Comisión: ${agente.comisionMes.toLocaleString()}</span>
                  <span className="text-[9px] text-[#9CA3AF]">Meta: ${agente.metaMes.toLocaleString()}</span>
                </div>
              </div>
              {/* Info */}
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <Mail size={11} className="text-[#9CA3AF]" /> {agente.email}
                </div>
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <Clock size={11} className="text-[#9CA3AF]" /> Último acceso: {agente.ultimoAcceso}
                </div>
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <Layers size={11} className="text-[#9CA3AF]" /> Ramos: {agente.ramos.join(', ')}
                </div>
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <Shield size={11} className="text-[#9CA3AF]" /> {agente.aseguradoras.join(', ')}
                </div>
              </div>
            </div>
          )}

          {tab === 'produccion' && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-semibold">Producción mensual — últimos 6 meses</p>
              {['Oct','Nov','Dic','Ene','Feb','Mar'].map((mes, i) => {
                const base = agente.primaTotal
                const vals = [0.65, 0.72, 0.61, 0.84, 0.91, 1.0]
                const val = Math.round(base * vals[i])
                const pct = Math.round((val / (base * 1.1)) * 100)
                return (
                  <div key={mes} className="flex items-center gap-3">
                    <span className="text-[10px] text-[#9CA3AF] w-6">{mes}</span>
                    <div className="flex-1 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#F7941D' }} />
                    </div>
                    <span className="text-[10px] text-[#1A1F2B] font-semibold w-20 text-right">${val.toLocaleString()}</span>
                  </div>
                )
              })}
              <div className="mt-3 bg-[#EFF2F9] rounded-xl p-4 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[14px] font-bold text-[#F7941D]">{agente.leads}</p>
                    <p className="text-[9px] text-[#9CA3AF] uppercase">Leads activos</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#69A481]">${agente.comisionMes.toLocaleString()}</p>
                    <p className="text-[9px] text-[#9CA3AF] uppercase">Comisión mes</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1A1F2B]">{agente.tasaCierre}%</p>
                    <p className="text-[9px] text-[#9CA3AF] uppercase">Tasa cierre</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'cartera' && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-1">Distribución de cartera por ramo</p>
              {agente.ramos.map((ramo, i) => {
                const pcts = [40, 30, 20, 10]
                const pct = pcts[i] || 8
                return (
                  <div key={ramo} className="flex items-center gap-3">
                    <span className="text-[10px] text-[#6B7280] w-28 truncate">{ramo}</span>
                    <div className="flex-1 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: i === 0 ? '#F7941D' : i === 1 ? '#69A481' : i === 2 ? '#1A1F2B' : '#9CA3AF' }} />
                    </div>
                    <span className="text-[10px] text-[#1A1F2B] font-semibold w-8 text-right">{pct}%</span>
                  </div>
                )
              })}
              <div className="mt-2 bg-[#EFF2F9] rounded-xl p-3 shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)]">
                <p className="text-[10px] text-[#9CA3AF]">Pólizas activas totales: <span className="text-[#1A1F2B] font-bold">{agente.polizasActivas}</span></p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">Prima anualizada estimada: <span className="text-[#F7941D] font-bold">${(agente.primaTotal * 12).toLocaleString()}</span></p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-5 flex gap-2">
          <button className="flex-1 py-2.5 rounded-xl text-[11px] font-semibold text-[#1A1F2B] bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:shadow-none transition-all flex items-center justify-center gap-1.5">
            <Mail size={12} /> Enviar mensaje
          </button>
          <button className="flex-1 py-2.5 rounded-xl text-[11px] font-semibold text-white hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
            <BarChart3 size={12} /> Ver reporte completo
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EquipoPage() {
  const { user } = useAuth()
  const [selectedAgente, setSelectedAgente] = useState<Agente | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)

  const filtered = MOCK_AGENTES_EQUIPO.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || a.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalPrima = MOCK_AGENTES_EQUIPO.reduce((acc, a) => acc + a.primaTotal, 0)
  const totalPolizas = MOCK_AGENTES_EQUIPO.reduce((acc, a) => acc + a.polizasActivas, 0)
  const totalComision = MOCK_AGENTES_EQUIPO.reduce((acc, a) => acc + a.comisionMes, 0)
  const activos = MOCK_AGENTES_EQUIPO.filter(a => a.status === 'activo').length

  return (
    <div className="flex flex-col gap-5">
      {selectedAgente && <AgenteModal agente={selectedAgente} onClose={() => setSelectedAgente(null)} />}

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,31,43,0.55)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md bg-[#EFF2F9] rounded-3xl p-6 shadow-[0_24px_80px_rgba(22,27,29,0.35)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] text-[#1A1F2B] font-bold">Invitar nuevo agente</h3>
              <button onClick={() => setShowInvite(false)} className="w-7 h-7 flex items-center justify-center rounded-xl text-[#6B7280] hover:text-[#1A1F2B] transition-colors"><X size={14} /></button>
            </div>
            <div className="flex flex-col gap-3">
              {['Nombre completo', 'Correo electrónico', 'Número de cédula CNSF'].map(field => (
                <div key={field}>
                  <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">{field}</label>
                  <input className="w-full px-4 py-2.5 rounded-xl text-[12px] text-[#1A1F2B] bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] outline-none" placeholder={`Ej. ${field === 'Nombre completo' ? 'Juan Pérez' : field === 'Correo electrónico' ? 'agente@correo.com' : 'CNSF-MX-2024-XXXXX'}`} />
                </div>
              ))}
              <div>
                <label className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-1 block">Plan</label>
                <select className="w-full px-4 py-2.5 rounded-xl text-[12px] text-[#1A1F2B] bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] outline-none">
                  <option>Básico</option><option>Profesional</option><option>Empresarial</option>
                </select>
              </div>
              <button onClick={() => { alert('✅ Invitación enviada por correo'); setShowInvite(false) }}
                className="w-full py-3 rounded-xl text-white text-[12px] font-semibold mt-2"
                style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)' }}>
                Enviar invitación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-[#F7941D] font-bold tracking-[0.15em] uppercase mb-0.5">
            {user?.role === 'promotoria' ? 'Promotoria' : user?.role === 'broker' ? 'Broker' : 'Admin'} · Vista de equipo
          </p>
          <h1 className="text-[22px] text-[#1A1F2B] font-bold">Mi Equipo de Agentes</h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] text-[#6B7280] font-semibold bg-[#EFF2F9] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.12)] hover:text-[#1A1F2B] transition-colors">
            <Download size={12} /> Exportar
          </button>
          <button onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] text-white font-semibold"
            style={{ background: 'linear-gradient(135deg,#F7941D,#e08019)', boxShadow: '0 4px 14px rgba(247,148,29,0.35)' }}>
            <Plus size={12} /> Invitar agente
          </button>
        </div>
      </div>

      {/* KPIs generales */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Agentes activos', value: `${activos}/${MOCK_AGENTES_EQUIPO.length}`, color: '#69A481' },
          { icon: Shield, label: 'Pólizas totales', value: totalPolizas.toString(), color: '#1A1F2B' },
          { icon: DollarSign, label: 'Prima total MXN', value: `$${(totalPrima / 1000).toFixed(0)}k`, color: '#F7941D' },
          { icon: Award, label: 'Comisión del mes', value: `$${(totalComision / 1000).toFixed(0)}k`, color: '#7C1F31' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
            <kpi.icon size={18} style={{ color: kpi.color }} className="mb-2" />
            <p className="text-[22px] font-bold text-[#1A1F2B]">{kpi.value}</p>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar agente..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[12px] text-[#1A1F2B] bg-[#EFF2F9] shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] outline-none placeholder-[#D1D5DB]" />
          <Activity size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        </div>
        {[null, 'activo', 'inactivo'].map(s => (
          <button key={String(s)} onClick={() => setFilterStatus(s)}
            className={cn('px-3 py-2 rounded-xl text-[11px] font-semibold capitalize transition-all', filterStatus === s ? 'bg-[#F7941D] text-white' : 'bg-[#EFF2F9] text-[#9CA3AF] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.10)] hover:text-[#6B7280]')}>
            {s === null ? 'Todos' : s}
          </button>
        ))}
      </div>

      {/* Tabla de agentes */}
      <div className="bg-[#EFF2F9] rounded-2xl shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E5E7EB] grid grid-cols-12 gap-3 text-[9px] text-[#9CA3AF] font-semibold uppercase tracking-wider">
          <div className="col-span-3">Agente</div>
          <div className="col-span-2 text-center">Pólizas</div>
          <div className="col-span-2 text-center">Prima MXN</div>
          <div className="col-span-2 text-center">Tasa cierre</div>
          <div className="col-span-2 text-center">Meta mes</div>
          <div className="col-span-1" />
        </div>
        {filtered.map(agente => (
          <button key={agente.id} onClick={() => setSelectedAgente(agente)}
            className="w-full px-5 py-4 border-b border-[#F0F0F0] last:border-0 grid grid-cols-12 gap-3 items-center text-left hover:bg-white/40 transition-colors group">
            <div className="col-span-3 flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0', agente.status === 'activo' ? 'text-[#F7941D]' : 'text-[#9CA3AF]')}
                style={{ background: agente.status === 'activo' ? 'rgba(247,148,29,0.12)' : 'rgba(156,163,175,0.12)', border: `1.5px solid ${agente.status === 'activo' ? 'rgba(247,148,29,0.25)' : 'rgba(156,163,175,0.25)'}` }}>
                {agente.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] text-[#1A1F2B] font-semibold truncate">{agente.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${PLAN_COLOR[agente.plan]}18`, color: PLAN_COLOR[agente.plan] }}>{agente.plan}</span>
                  <div className={cn('w-1.5 h-1.5 rounded-full', agente.status === 'activo' ? 'bg-[#69A481]' : 'bg-[#6B7280]')} />
                </div>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-[13px] font-bold text-[#1A1F2B]">{agente.polizasActivas}</p>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-[12px] font-bold text-[#F7941D]">${(agente.primaTotal / 1000).toFixed(0)}k</p>
            </div>
            <div className="col-span-2 text-center">
              <span className={cn('text-[11px] font-bold', agente.tasaCierre >= 70 ? 'text-[#69A481]' : agente.tasaCierre >= 50 ? 'text-[#F7941D]' : 'text-[#7C1F31]')}>
                {agente.tasaCierre}%
              </span>
            </div>
            <div className="col-span-2">
              <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${agente.avanceMeta}%`, background: agente.avanceMeta >= 90 ? '#69A481' : '#F7941D' }} />
              </div>
              <p className="text-[9px] text-[#9CA3AF] text-right mt-0.5">{agente.avanceMeta}%</p>
            </div>
            <div className="col-span-1 flex justify-end">
              <ChevronRight size={14} className="text-[#D1D5DB] group-hover:text-[#F7941D] transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* Ranking */}
      <div className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-4px_-4px_10px_#FAFBFF,4px_4px_10px_rgba(22,27,29,0.12)]">
        <div className="flex items-center gap-2 mb-4">
          <Crown size={14} className="text-[#F7941D]" />
          <p className="text-[12px] text-[#1A1F2B] font-bold">Ranking por producción este mes</p>
        </div>
        <div className="flex flex-col gap-2">
          {[...MOCK_AGENTES_EQUIPO].sort((a, b) => b.primaTotal - a.primaTotal).slice(0, 5).map((agente, i) => (
            <div key={agente.id} className="flex items-center gap-3">
              <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0',
                i === 0 ? 'bg-[#F7941D] text-white' : i === 1 ? 'bg-[#6B7280] text-white' : i === 2 ? 'bg-[#B45309] text-white' : 'bg-[#E5E7EB] text-[#9CA3AF]')}>
                {i + 1}
              </span>
              <span className="flex-1 text-[11px] text-[#1A1F2B] font-medium">{agente.name}</span>
              <span className="text-[11px] text-[#F7941D] font-bold">${agente.primaTotal.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
