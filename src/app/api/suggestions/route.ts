import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText, formatLlmError } from "@/lib/llm";
import { extractJson } from "@/lib/llm/parse-script";
import type { StorySuggestion, StorySuggestions } from "@/types";

function buildSuggestionPrompt(seed: string): string {
  const context = seed.trim()
    ? `Use this creator idea as inspiration: "${seed.trim()}".`
    : "Invent fresh ideas for a bright, non-verbal animated short for kids aged 3-7.";

  return `${context}

Suggest story-building options for a visual-only kids animation script.

Return ONLY valid JSON with this exact structure:
{
  "qualities": [
    { "label": "A good quality or moral lesson", "reason": "Why it works visually" }
  ],
  "locations": [
    { "label": "A specific cinematic location", "reason": "What visual energy it adds" }
  ]
}

Rules:
- Return exactly 5 qualities and exactly 5 locations.
- Keep each label under 42 characters.
- Keep each reason under 90 characters.
- Make the ideas concrete, positive, varied, and easy to animate without dialogue.
- Avoid generic labels like "Kindness" unless made more specific.`;
}

function normalizeSuggestion(value: unknown): StorySuggestion | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const label = String(item.label || "").trim();
  const reason = String(item.reason || "").trim();
  if (!label || !reason) return null;
  return {
    label: label.slice(0, 60),
    reason: reason.slice(0, 120),
  };
}

function parseSuggestions(text: string): StorySuggestions {
  const parsed = extractJson(text) as Partial<Record<keyof StorySuggestions, unknown>>;
  const qualities = Array.isArray(parsed.qualities)
    ? parsed.qualities.map(normalizeSuggestion).filter(Boolean)
    : [];
  const locations = Array.isArray(parsed.locations)
    ? parsed.locations.map(normalizeSuggestion).filter(Boolean)
    : [];

  if (qualities.length === 0 || locations.length === 0) {
    throw new Error("AI returned incomplete suggestions");
  }

  return {
    qualities: qualities.slice(0, 5) as StorySuggestion[],
    locations: locations.slice(0, 5) as StorySuggestion[],
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { seed?: string };
    const prompt = buildSuggestionPrompt(body.seed || "");
    const text = await generateText(prompt);
    return NextResponse.json({ suggestions: parseSuggestions(text) });
  } catch (err) {
    return NextResponse.json({ error: formatLlmError(err) }, { status: 500 });
  }
}
