'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EFF2F9] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-[80px] font-[Questrial] text-[#E5E7EB] leading-none mb-4">404</div>
        <h1 className="text-[20px] text-[#1A1F2B] mb-2 tracking-wide">Página no encontrada</h1>
        <p className="text-[14px] text-[#9CA3AF] mb-6">La ruta que buscas no existe en este sistema.</p>
        <Link href="/login">
          <button className="flex items-center gap-2 mx-auto h-10 px-5 bg-[#EFF2F9] rounded-xl text-[13px] text-[#F7941D] shadow-[-4px_-4px_8px_#FAFBFF,4px_4px_8px_rgba(22,27,29,0.15)] hover:scale-105 transition-transform">
            <ArrowLeft size={14} />
            Volver al inicio
          </button>
        </Link>
      </div>
    </div>
  )
}
