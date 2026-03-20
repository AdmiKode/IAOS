'use client'
import { useRef, useState, useCallback, useEffect } from 'react'

// ─── Tipos para SpeechRecognition (no incluidos en TS lib dom por default) ────
type SR = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: SREvent) => void) | null
  onerror: ((e: { error?: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}
type SRResult = { transcript: string; confidence: number }
type SRResultList = { length: number; isFinal: boolean; [index: number]: SRResult }
type SREvent = {
  resultIndex: number
  results: { length: number; isFinal: boolean; [i: number]: SRResultList } & ArrayLike<SRResultList & { isFinal: boolean }>
}
type SRConstructor = new () => SR

declare global {
  interface Window {
    SpeechRecognition: SRConstructor
    webkitSpeechRecognition: SRConstructor
  }
}

export type VoiceState = 'idle' | 'speaking' | 'listening' | 'processing'

interface UseVoiceIOOptions {
  lang?: string           // default 'es-MX'
  voiceName?: string      // nombre parcial de la voz buscada
  rate?: number           // velocidad TTS 0.5–2 (default 0.95)
  pitch?: number          // tono TTS 0–2 (default 1.05)
  onTranscript?: (text: string, isFinal: boolean) => void
  onSpeechEnd?: () => void
  /** Si true, el micrófono se reactiva automáticamente después de que XORIA termina de hablar */
  autoListen?: boolean
}

export function useVoiceIO(options: UseVoiceIOOptions = {}) {
  const {
    lang = 'es-MX',
    rate = 0.95,
    pitch = 1.05,
    onTranscript,
    onSpeechEnd,
    autoListen = false,
  } = options

  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(true)

  const recogRef = useRef<SR | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const speakingRef = useRef(false)
  const autoListenRef = useRef(autoListen)
  const listeningRef = useRef(false)

  // Mantener autoListenRef sincronizado
  useEffect(() => { autoListenRef.current = autoListen }, [autoListen])

  // Inicializar en el cliente
  useEffect(() => {
    if (typeof window === 'undefined') return
    synthRef.current = window.speechSynthesis

    // Buscar voz femenina mexicana
    function pickVoice() {
      const voices = synthRef.current?.getVoices() ?? []
      // Prioridad: Google español México > Microsoft Sabina > cualquier es-MX > es-ES femenina
      const candidates = [
        voices.find(v => v.lang === 'es-MX' && /sabina|paulina|maria|female|mujer/i.test(v.name)),
        voices.find(v => v.lang === 'es-MX'),
        voices.find(v => v.lang.startsWith('es') && /sabina|paulina|maria|female/i.test(v.name)),
        voices.find(v => v.lang.startsWith('es')),
      ]
      voiceRef.current = candidates.find(Boolean) ?? null
    }

    pickVoice()
    synthRef.current?.addEventListener('voiceschanged', pickVoice)

    // SpeechRecognition
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }

    const rec = new SR()
    rec.lang = lang
    rec.continuous = true        // ← escucha sin parar hasta que se llame stop()
    rec.interimResults = false   // ← solo resultados finales = sin duplicados
    rec.maxAlternatives = 1

    rec.onresult = (e: SREvent) => {
      // Con continuous=true tomamos solo el último resultado final
      const last = e.results[e.results.length - 1]
      if (!last.isFinal) return
      const text = last[0].transcript.trim()
      if (!text) return
      setTranscript(text)
      onTranscript?.(text, true)
    }

    rec.onerror = (ev: { error?: string }) => {
      // 'no-speech' es normal cuando el usuario no habla; reiniciar silenciosamente
      if (ev.error === 'no-speech' && listeningRef.current) {
        try { rec.start() } catch { /* ignore */ }
        return
      }
      setVoiceState('idle')
      listeningRef.current = false
      speakingRef.current = false
    }

    rec.onend = () => {
      // Si seguimos en modo escucha, reiniciar automáticamente (continuous workaround en Safari/Chrome)
      if (listeningRef.current) {
        try { rec.start() } catch { /* ignore */ }
        return
      }
      speakingRef.current = false
      onSpeechEnd?.()
    }

    recogRef.current = rec

    return () => {
      synthRef.current?.removeEventListener('voiceschanged', pickVoice)
      recogRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  // ── Hablar (TTS) ──────────────────────────────────────────────────────────
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current || !text) return
    // Pausar escucha mientras XORIA habla para evitar que se escuche a sí misma
    if (listeningRef.current) {
      try { recogRef.current?.stop() } catch { /* ignore */ }
      // No cambiamos listeningRef — seguimos "queriendo" escuchar
    }
    synthRef.current.cancel()
    setVoiceState('speaking')

    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = lang
    utt.rate = rate
    utt.pitch = pitch
    if (voiceRef.current) utt.voice = voiceRef.current

    utt.onend = () => {
      setVoiceState('idle')
      onEnd?.()
      // Si autoListen está activo, reanudar micrófono después de hablar
      if (autoListenRef.current && listeningRef.current) {
        setTimeout(() => {
          try { recogRef.current?.start() } catch { /* ignore */ }
          setVoiceState('listening')
        }, 300)
      }
    }
    utt.onerror = () => {
      setVoiceState('idle')
      if (autoListenRef.current && listeningRef.current) {
        setTimeout(() => {
          try { recogRef.current?.start() } catch { /* ignore */ }
          setVoiceState('listening')
        }, 300)
      }
    }

    synthRef.current.speak(utt)
  }, [lang, rate, pitch])

  // ── Detener TTS ───────────────────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel()
    setVoiceState('idle')
  }, [])

  // ── Escuchar (STT) ────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!recogRef.current || listeningRef.current) return
    setTranscript('')
    setVoiceState('listening')
    listeningRef.current = true
    speakingRef.current = true
    try { recogRef.current.start() } catch { /* already started */ }
  }, [])

  const stopListening = useCallback(() => {
    listeningRef.current = false
    speakingRef.current = false
    recogRef.current?.stop()
    setVoiceState('idle')
  }, [])

  // ── Toggle micrófono ──────────────────────────────────────────────────────
  const toggleListen = useCallback(() => {
    if (listeningRef.current) stopListening()
    else startListening()
  }, [startListening, stopListening])

  return {
    voiceState,
    transcript,
    supported,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleListen,
    isListening: voiceState === 'listening',
    isSpeaking: voiceState === 'speaking',
  }
}
