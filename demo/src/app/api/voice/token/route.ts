import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Return a mock ephemeral token for demo purposes
    return NextResponse.json({
      client_secret: {
        value: `ek_demo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        expires_at: Math.floor(Date.now() / 1000) + 60,
      },
      session_id: `sess_demo_${Math.random().toString(36).slice(2)}`,
      model: "gpt-4o-realtime-preview-2024-12-17",
      demo: true,
    });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        instructions:
          "Eres XORIA, el asistente de voz de Insurance Agent OS. Respondes en español, de forma profesional y concisa. Ayudas a agentes de seguros a gestionar su cartera, responder preguntas de clientes y optimizar su trabajo diario.",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 800,
        },
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create realtime session", detail: String(err) },
      { status: 500 }
    );
  }
}
