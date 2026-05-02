import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

// Default Mexican-Spanish capable voice (Valentina is a popular ElevenLabs voice for Latin American Spanish)
// Users can override by passing voiceId
// Voice IDs from ElevenLabs free tier — these are widely used multilingual voices
const DEFAULT_FEMALE_VOICE = "EXAVITQu4vr4xnSDxMaL"; // Sarah - clear, warm, works for Spanish via multilingual model
const DEFAULT_MALE_VOICE = "TxGEqnHWrfWFTfGW9XjX"; // Josh - male equivalent

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY not set in environment variables." },
        { status: 500 }
      );
    }

    const { text, gender = "female", voiceId } = await req.json() as {
      text: string;
      gender?: "male" | "female";
      voiceId?: string;
    };

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing 'text' field" }, { status: 400 });
    }

    if (text.length > 1000) {
      return NextResponse.json({ error: "Text too long (max 1000 chars)" }, { status: 400 });
    }

    const useVoiceId = voiceId || (gender === "male" ? DEFAULT_MALE_VOICE : DEFAULT_FEMALE_VOICE);

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${useVoiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          // Multilingual model handles Spanish well including Mexican intonation
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text();
      console.error("ElevenLabs error:", ttsResponse.status, errText);
      return NextResponse.json(
        { error: `ElevenLabs API error (${ttsResponse.status}): ${errText.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const audioBuffer = await ttsResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("TTS API error:", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
