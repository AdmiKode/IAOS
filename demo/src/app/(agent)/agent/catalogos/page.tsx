'use client'
import { useState } from 'react'
import { MOCK_RAMOS, MOCK_ASEGURADORAS } from '@/data/mock'
import { Plus, Shield, Tag, Edit2, ToggleLeft, ToggleRight, Search, ChevronRight, X, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type EditTarget = { tipo: 'ramo' | 'aseguradora' | 'etapa'; id: string; nombre: string; extra?: string } | null

export default function CatalogosPage() {
  const [tab, setTab] = useState<'ramos' | 'aseguradoras' | 'etapas'>('ramos')
  const [search, setSearch] = useState('')
  const [ramos, setRamos] = useState(MOCK_RAMOS)
  const [editTarget, setEditTarget] = useState<EditTarget>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editSaved, setEditSaved] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [addNombre, setAddNombre] = useState('')
  const [addCodigo, setAddCodigo] = useState('')
  const [addSaved, setAddSaved] = useState(false)

  function openEdit(target: EditTarget) {
    setEditTarget(target); setEditNombre(target?.nombre || ''); setEditSaved(false)
  }
  function saveEdit() { setEditSaved(true); setTimeout(() => setEditTarget(null), 1600) }
  function openAdd() { setShowAdd(true); setAddNombre(''); setAddCodigo(''); setAddSaved(false) }
  function saveAdd() { setAddSaved(true); setTimeout(() => setShowAdd(false), 1600) }

  const ETAPAS = [
    { id: 'e1', nombre: 'Nuevo', descripcion: 'Lead recién ingresado', orden: 1, color: '#9CA3AF' },
    { id: 'e2', nombre: 'Contactado', descripcion: 'Primer contacto realizado', orden: 2, color: '#6B7280' },
    { id: 'e3', nombre: 'Perfilamiento', descripcion: 'Recopilando información del cliente', orden: 3, color: '#F7941D' },
    { id: 'e4', nombre: 'Expediente', descripcion: 'Expediente completo', orden: 4, color: '#F7941D' },
    { id: 'e5', nombre: 'Cotización', descripcion: 'Cotización enviada al cliente', orden: 5, color: '#69A481' },
    { id: 'e6', nombre: 'Negociación', descripcion: 'En proceso de cierre', orden: 6, color: '#69A481' },
    { id: 'e7', nombre: 'Aceptación', descripcion: 'Cliente acepta la propuesta', orden: 7, color: '#7C1F31' },
    { id: 'e8', nombre: 'Emisión', descripcion: 'Póliza emitida exitosamente', orden: 8, color: '#7C1F31' },
  ]

  const filteredRamos = ramos.filter(r => r.nombre.toLowerCase().includes(search.toLowerCase()))
  const filteredAseg = MOCK_ASEGURADORAS.filter(a => {
    const n = (a as any).name || (a as any).nombre || ''
    return n.toLowerCase().includes(search.toLowerCase())
  })

  const toggleRamo = (id: string) => setRamos(prev => prev.map(r => r.id === id ? { ...r, activo: !r.activo } : r))

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Ramos activos', val: ramos.filter(r => r.activo).length, color: '#69A481' },
          { label: 'Aseguradoras', val: MOCK_ASEGURADORAS.length, color: '#F7941D' },
          { label: 'Etapas pipeline', val: ETAPAS.length, color: '#6B7280' },
        ].map(k => (
          <div key={k.label} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.color}15` }}>
              <Tag size={14} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-[20px] leading-tight" style={{ color: k.color }}>{k.val}</p>
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-[#EFF2F9] rounded-2xl p-1.5 shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.12)]">
          {[{ key: 'ramos', label: 'Ramos' }, { key: 'aseguradoras', label: 'Aseguradoras' }, { key: 'etapas', label: 'Etapas pipeline' }].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as typeof tab); setSearch('') }}
              className={cn('px-4 py-2 rounded-xl text-[12px] transition-all',
                tab === t.key ? 'bg-[#EFF2F9] text-[#F7941D] shadow-[-3px_-3px_7px_#FAFBFF,3px_3px_7px_rgba(22,27,29,0.14)]' : 'text-[#9CA3AF] hover:text-[#6B7280]')}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
            className="w-full bg-[#EFF2F9] pl-8 pr-3 py-2 text-[12px] text-[#1A1F2B] rounded-xl outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.10)] placeholder:text-[#9CA3AF]" />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#F7941D] rounded-xl text-white text-[12px] shadow-[0_3px_10px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-all">
          <Plus size={13} />
          Agregar
        </button>
      </div>

      {/* Ramos */}
      {tab === 'ramos' && (
        <div className="grid md:grid-cols-2 gap-3">
          {filteredRamos.map(r => (
            <div key={r.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${r.activo ? '#69A481' : '#9CA3AF'}15` }}>
                <Tag size={15} style={{ color: r.activo ? '#69A481' : '#9CA3AF' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#1A1F2B]">{r.nombre}</p>
                <p className="text-[11px] text-[#9CA3AF]">Codigo: {r.codigo}</p>
              </div>
              <button onClick={() => toggleRamo(r.id)} className="shrink-0 text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
                {r.activo ? <ToggleRight size={22} style={{ color: '#69A481' }} /> : <ToggleLeft size={22} />}
              </button>
              <button onClick={() => openEdit({ tipo: 'ramo', id: r.id, nombre: r.nombre, extra: r.codigo })} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
                <Edit2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Aseguradoras */}
      {tab === 'aseguradoras' && (
        <div className="grid md:grid-cols-2 gap-3">
          {filteredAseg.map(a => {
            const nombre = (a as any).name || (a as any).nombre || ''
            return (
            <div key={a.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                <Shield size={16} className="text-[#F7941D]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#1A1F2B]">{nombre}</p>
                <p className="text-[11px] text-[#9CA3AF]">{a.ramos.length} ramos · {a.docs} docs</p>
              </div>
              <button onClick={() => openEdit({ tipo: 'aseguradora', id: a.id, nombre })} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
                <Edit2 size={12} />
              </button>
            </div>
            )
          })}
        </div>
      )}

      {/* Etapas */}
      {tab === 'etapas' && (
        <div className="flex flex-col gap-3">
          {ETAPAS.map((e, i) => (
            <div key={e.id} className="bg-[#EFF2F9] rounded-2xl p-4 shadow-[-5px_-5px_12px_#FAFBFF,5px_5px_12px_rgba(22,27,29,0.14)] flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[12px] shrink-0"
                style={{ background: e.color }}>
                {e.orden}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#1A1F2B]">{e.nombre}</p>
                <p className="text-[11px] text-[#9CA3AF]">{e.descripcion}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {i > 0 && <ChevronRight size={14} className="text-[#D1D5DB]" />}
                <button onClick={() => openEdit({ tipo: 'etapa', id: e.id, nombre: e.nombre })} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EFF2F9] shadow-[-2px_-2px_5px_#FAFBFF,2px_2px_5px_rgba(22,27,29,0.12)] text-[#9CA3AF] hover:text-[#F7941D] transition-colors">
                  <Edit2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal editar */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm p-6 shadow-[−20px_−20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4">
            <button onClick={() => setEditTarget(null)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors"><X size={16} /></button>
            {editSaved ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle size={36} className="text-[#69A481]" />
                <p className="text-[14px] text-[#1A1F2B]">Cambios guardados</p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-[15px] text-[#1A1F2B]">Editar {editTarget.tipo}</h2>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5 capitalize">{editTarget.nombre}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] text-[#9CA3AF] mb-1 block">Nombre</label>
                    <input value={editNombre} onChange={e => setEditNombre(e.target.value)}
                      className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)]" />
                  </div>
                  {editTarget.extra && (
                    <div>
                      <label className="text-[11px] text-[#9CA3AF] mb-1 block">Codigo</label>
                      <input defaultValue={editTarget.extra}
                        className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)]" />
                    </div>
                  )}
                </div>
                <button onClick={saveEdit} disabled={!editNombre}
                  className="w-full py-3 rounded-2xl text-white text-[13px] disabled:opacity-40 shadow-[0_4px_14px_rgba(247,148,29,0.3)] hover:brightness-110 transition-all"
                  style={{ background: '#F7941D' }}>Guardar cambios</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal agregar */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)', background: 'rgba(26,31,43,0.4)' }}>
          <div className="bg-[#EFF2F9] rounded-3xl w-full max-w-sm p-6 shadow-[−20px_−20px_60px_#FAFBFF,20px_20px_60px_rgba(22,27,29,0.25)] relative flex flex-col gap-4">
            <button onClick={() => setShowAdd(false)} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#7C1F31] transition-colors"><X size={16} /></button>
            {addSaved ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle size={36} className="text-[#69A481]" />
                <p className="text-[14px] text-[#1A1F2B]">Elemento creado</p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-[15px] text-[#1A1F2B]">Agregar {tab === 'ramos' ? 'ramo' : tab === 'aseguradoras' ? 'aseguradora' : 'etapa'}</h2>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">Completa los datos del nuevo elemento</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] text-[#9CA3AF] mb-1 block">Nombre *</label>
                    <input value={addNombre} onChange={e => setAddNombre(e.target.value)} placeholder="Ej. Vida Grupo"
                      className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6]" />
                  </div>
                  {tab !== 'etapas' && (
                    <div>
                      <label className="text-[11px] text-[#9CA3AF] mb-1 block">Codigo / Clave</label>
                      <input value={addCodigo} onChange={e => setAddCodigo(e.target.value)} placeholder="Ej. VG"
                        className="w-full bg-[#EFF2F9] rounded-xl px-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-2px_-2px_5px_#FAFBFF,inset_2px_2px_5px_rgba(22,27,29,0.12)] placeholder:text-[#B5BFC6]" />
                    </div>
                  )}
                </div>
                <button onClick={saveAdd} disabled={!addNombre}
                  className="w-full py-3 rounded-2xl text-white text-[13px] disabled:opacity-40 shadow-[0_4px_14px_rgba(247,148,29,0.3)] hover:brightness-110 transition-all"
                  style={{ background: '#F7941D' }}>Crear elemento</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}