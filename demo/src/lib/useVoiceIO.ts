'use client'
import { useRef, useState, useCallback, useEffect } from 'react'

// ─── Tipos para SpeechRecognition (no incluidos en TS lib dom por default) ────
type SR = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: SREvent) => void) | null
  onerror: (() => void) | null
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
}

export function useVoiceIO(options: UseVoiceIOOptions = {}) {
  const {
    lang = 'es-MX',
    rate = 0.95,
    pitch = 1.05,
    onTranscript,
    onSpeechEnd,
  } = options

  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(true)

  const recogRef = useRef<SR | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const speakingRef = useRef(false)

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
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (e: SREvent) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        const t = res[0].transcript
        if (res.isFinal) final += t
        else interim += t
      }
      const text = (final || interim).trim()
      setTranscript(text)
      onTranscript?.(text, !!final)
    }

    rec.onerror = () => {
      setVoiceState('idle')
      speakingRef.current = false
    }

    rec.onend = () => {
      if (voiceState === 'listening') setVoiceState('idle')
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
    }
    utt.onerror = () => setVoiceState('idle')

    synthRef.current.speak(utt)
  }, [lang, rate, pitch])

  // ── Detener TTS ───────────────────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel()
    setVoiceState('idle')
  }, [])

  // ── Escuchar (STT) ────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!recogRef.current || voiceState === 'listening') return
    setTranscript('')
    setVoiceState('listening')
    speakingRef.current = true
    try { recogRef.current.start() } catch { /* already started */ }
  }, [voiceState])

  const stopListening = useCallback(() => {
    recogRef.current?.stop()
    setVoiceState('idle')
    speakingRef.current = false
  }, [])

  // ── Toggle micrófono ──────────────────────────────────────────────────────
  const toggleListen = useCallback(() => {
    if (voiceState === 'listening') stopListening()
    else startListening()
  }, [voiceState, startListening, stopListening])

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
