import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LlmProvider } from "./types";
import { isModelNotFoundError, withRetry } from "./retry";

const MODEL_PREFERENCES = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite-001",
] as const;

let cachedModels: string[] | null = null;

async function listAvailableModels(apiKey: string): Promise<string[]> {
  if (cachedModels) return cachedModels;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = (await res.json()) as {
      models?: Array<{
        name: string;
        supportedGenerationMethods?: string[];
      }>;
    };
    if (!data.models) return [...MODEL_PREFERENCES];
    cachedModels = data.models
      .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => m.name.replace(/^models\//, ""));
    return cachedModels;
  } catch {
    return [...MODEL_PREFERENCES];
  }
}

function pickModels(available: string[]): string[] {
  const forced = process.env.GEMINI_MODEL?.trim();
  const picked: string[] = [];
  if (forced && available.includes(forced)) picked.push(forced);
  for (const pref of MODEL_PREFERENCES) {
    if (available.includes(pref) && !picked.includes(pref)) picked.push(pref);
  }
  for (const m of available) {
    if (
      !picked.includes(m) &&
      m.includes("flash") &&
      !m.includes("tts") &&
      !m.includes("image") &&
      !m.includes("preview") &&
      !m.includes("gemma")
    ) {
      picked.push(m);
    }
  }
  return picked.length > 0 ? picked : [...MODEL_PREFERENCES];
}

async function generateWithModel(
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.95,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export const geminiProvider: LlmProvider = {
  name: "Gemini",

  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY?.trim());
  },

  async generate(prompt: string) {
    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);
    const available = await listAvailableModels(apiKey);
    const models = pickModels(available);

    let lastError: unknown;
    for (const modelName of models) {
      try {
        const text = await withRetry(
          () => generateWithModel(genAI, modelName, prompt),
          { label: `Gemini/${modelName}`, maxAttempts: 4, baseDelayMs: 3000 }
        );
        console.info(`[PlotLine] Gemini success: ${modelName}`);
        return text;
      } catch (err) {
        lastError = err;
        if (!isModelNotFoundError(err)) {
          console.warn(`[PlotLine] Gemini ${modelName} failed, trying next...`);
        }
      }
    }
    throw lastError ?? new Error("Gemini failed");
  },
};
