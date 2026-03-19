'use client'
import { useState } from 'react'
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function VozPage() {
  const [connected, setConnected] = useState(false)
  const [muted, setMuted] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])

  function toggleCall() {
    if (!connected) {
      setConnected(true)
      setTranscript(['XORIA Voice conectada. Habla ahora...'])
    } else {
      setConnected(false)
      setTranscript([])
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-[20px] text-[#1A1F2B] tracking-wide">XORIA Voice</h1>
        <p className="text-[13px] text-[#9CA3AF] mt-0.5">Asistente de voz en tiempo real · OpenAI Realtime API</p>
      </div>

      {/* Orb animado */}
      <div className={cn(
        'w-48 h-48 rounded-full transition-all duration-500 flex items-center justify-center',
        connected
          ? 'bg-[#EFF2F9] shadow-[-20px_-20px_40px_#FAFBFF,20px_20px_40px_rgba(22,27,29,0.23)] animate-pulse'
          : 'bg-[#EFF2F9] shadow-[-20px_-20px_40px_#FAFBFF,20px_20px_40px_rgba(22,27,29,0.23)]'
      )}>
        <div className={cn(
          'w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300',
          connected ? 'bg-[#F7941D]/20' : 'bg-[#EFF2F9] shadow-[-10px_-10px_20px_#FAFBFF,10px_10px_20px_rgba(22,27,29,0.18)]'
        )}>
          {connected
            ? <Volume2 size={40} className="text-[#F7941D]" />
            : <Mic size={40} className="text-[#9CA3AF]" />}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={cn('w-2 h-2 rounded-full', connected ? 'bg-[#69A481] animate-pulse' : 'bg-[#9CA3AF]')} />
        <span className="text-[13px] text-[#6B7280] tracking-wide">
          {connected ? 'Conectada · Escuchando' : 'Desconectada'}
        </span>
      </div>

      {/* Controles */}
      <div className="flex gap-4">
        {connected && (
          <button onClick={() => setMuted(v => !v)}
            className={cn('w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200',
              muted
                ? 'bg-[#7C1F31]/15 text-[#7C1F31] shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.3),inset_4px_4px_8px_rgba(22,27,29,0.2)]'
                : 'bg-[#EFF2F9] text-[#6B7280] shadow-[-5px_-5px_10px_#FAFBFF,5px_5px_10px_rgba(22,27,29,0.15)]')}>
            {muted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
        )}
        <button onClick={toggleCall}
          className={cn('w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95',
            connected
              ? 'bg-[#7C1F31] text-white shadow-[0_6px_20px_rgba(124,31,49,0.4)]'
              : 'bg-[#F7941D] text-white shadow-[0_6px_20px_rgba(247,148,29,0.4)]')}>
          {connected ? <PhoneOff size={24} /> : <Phone size={24} />}
        </button>
      </div>

      {/* Transcript */}
      {transcript.length > 0 && (
        <div className="w-full max-w-md bg-[#EFF2F9] rounded-2xl p-5 shadow-[-6px_-6px_14px_#FAFBFF,6px_6px_14px_rgba(22,27,29,0.14)]">
          <p className="text-[11px] text-[#9CA3AF] tracking-widest uppercase mb-3">Transcripción</p>
          {transcript.map((line, i) => (
            <p key={i} className="text-[13px] text-[#1A1F2B] leading-relaxed">{line}</p>
          ))}
        </div>
      )}

      <div className="text-center max-w-sm">
        <p className="text-[12px] text-[#B5BFC6] leading-relaxed">
          XORIA Voice usa OpenAI Realtime API (gpt-4o-realtime-preview) para conversación
          en tiempo real. Requiere conexión segura HTTPS en producción.
        </p>
      </div>
    </div>
  )
}
