import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 20;

export type ListeningScenario =
  | "kid_speed"
  | "mom_to_kid"
  | "service_worker"
  | "two_friends";

export type ListeningDifficulty = 1 | 2 | 3;

const SCENARIO_PROMPTS: Record<ListeningScenario, string> = {
  kid_speed:
    "A 6-year-old Mexican girl talking fast about her day at school. Run-on sentences, kid vocabulary, no pauses. Subjects: friends, snacks, games, what the teacher said.",
  mom_to_kid:
    "A Mexican mom giving casual instructions or asking questions to her young child. Warm but quick. Common imperatives, terms of endearment (mi amor, mija). Subjects: getting ready, eating, putting things away, going somewhere.",
  service_worker:
    "A Mexican service worker (cafe, restaurant, taxi, or shop) speaking quickly to a customer. Polite but fast and clipped. Common service phrases.",
  two_friends:
    "Two Mexican friends in their 30s having a casual conversation. Slang, overlapping ideas, faster than formal speech. Subjects: weekend plans, work complaints, family, food.",
};

const DIFFICULTY_INSTRUCTIONS: Record<ListeningDifficulty, string> = {
  1: "Easy: 8-12 seconds when read at natural speed. Simple, common vocabulary. Present tense or simple past. Short sentences.",
  2: "Medium: 12-18 seconds. Mix of tenses (present, past, near future). Some intermediate vocabulary. Natural sentence length.",
  3: "Hard: 15-25 seconds. Includes subjunctive, conditionals, or idiomatic expressions. Longer sentences with subordinate clauses. Real conversational pacing.",
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
    }

    const { scenario, difficulty = 1 } = await req.json() as {
      scenario: ListeningScenario;
      difficulty?: ListeningDifficulty;
    };

    if (!scenario || !SCENARIO_PROMPTS[scenario]) {
      return NextResponse.json({ error: "Invalid scenario" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: `You generate short Spanish listening exercises for an intermediate learner.

ALWAYS use Mexican Spanish (tú not vos, Mexican vocabulary like "carro/coche," "platicar," "ahorita," "qué onda").

Respond ONLY with valid JSON in this exact format:
{
  "spanish": "...",
  "english": "...",
  "vocab": [{"word": "...", "meaning": "..."}, {"word": "...", "meaning": "..."}]
}

The "spanish" field is what will be read aloud. Single speaker only — no dialogue tags or stage directions. The "english" field is a natural translation. "vocab" lists 2-3 of the trickier words/phrases with brief meanings.

NO preamble, NO explanation, NO markdown. Just the JSON object.`,
      messages: [
        {
          role: "user",
          content: `Scenario: ${SCENARIO_PROMPTS[scenario]}\n\nDifficulty: ${DIFFICULTY_INSTRUCTIONS[difficulty]}\n\nGenerate one new listening clip script. Make it different from anything generic — include specific details that make it feel real.`,
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    // Strip markdown fences if present
    const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse generated script", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      spanish: parsed.spanish,
      english: parsed.english,
      vocab: parsed.vocab || [],
      scenario,
      difficulty,
    });
  } catch (err: any) {
    console.error("Script gen error:", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
