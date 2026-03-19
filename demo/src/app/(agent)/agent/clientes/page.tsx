'use client'
import { MOCK_LEADS } from '@/data/mock'
import { Users, Mail, Phone, Search, Plus } from 'lucide-react'
import { useState } from 'react'

const uniqueClients = Array.from(new Set(MOCK_LEADS.map(l => l.name))).map(name => {
  const lead = MOCK_LEADS.find(l => l.name === name)!
  return { name, email: lead.email, phone: lead.phone, ramo: lead.ramo, score: lead.score }
})

export default function ClientesPage() {
  const [search, setSearch] = useState('')
  const filtered = uniqueClients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">Clientes</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">{uniqueClients.length} prospectos y clientes</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#F7941D] rounded-xl text-white text-[13px] shadow-[0_4px_12px_rgba(247,148,29,0.3)] hover:bg-[#E8820A] transition-colors">
          <Plus size={15} />
          Nuevo cliente
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..."
          className="w-full bg-[#EFF2F9] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[#1A1F2B] outline-none shadow-[inset_-3px_-3px_7px_#FAFBFF,inset_3px_3px_7px_rgba(22,27,29,0.15)] placeholder:text-[#9CA3AF]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(client => (
          <div key={client.name}
            className="bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)] cursor-pointer hover:scale-[1.01] transition-transform duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7941D]/15 flex items-center justify-center text-[#F7941D] text-[14px]">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-[14px] text-[#1A1F2B]">{client.name}</p>
                <p className="text-[11px] text-[#9CA3AF]">{client.ramo}</p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-[12px] text-[#69A481]">{client.score}%</span>
                <p className="text-[10px] text-[#9CA3AF]">score</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
                <Mail size={11} className="text-[#9CA3AF]" />
                {client.email}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
                <Phone size={11} className="text-[#9CA3AF]" />
                {client.phone}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
