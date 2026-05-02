import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
    }

    const { spanish } = await req.json();
    if (!spanish || typeof spanish !== "string") {
      return NextResponse.json({ error: "Missing 'spanish' field" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: `You are a Spanish-to-English explainer. Given a Spanish text, respond with:
1. A natural English translation (one line)
2. ONE short note about any tricky vocabulary or grammar (one line, only if genuinely useful)

Keep total response under 4 lines. No preamble. No "here is the translation." Just the translation and the note.`,
      messages: [{ role: "user", content: spanish }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({ explanation: text });
  } catch (err: any) {
    console.error("Explain API error:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
