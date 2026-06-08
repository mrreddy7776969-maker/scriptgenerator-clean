import type { LlmProvider } from "./types";
import { chatCompletion } from "./openai-chat";
import { withRetry } from "./retry";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
] as const;

export const groqProvider: LlmProvider = {
  name: "Groq",

  isConfigured() {
    return Boolean(process.env.GROQ_API_KEY?.trim());
  },

  async generate(prompt: string) {
    const apiKey = process.env.GROQ_API_KEY!;

    let lastError: unknown;
    for (const model of GROQ_MODELS) {
      try {
        return await withRetry(
          () =>
            chatCompletion(
              "https://api.groq.com/openai/v1",
              apiKey,
              model,
              prompt
            ),
          { label: `Groq/${model}`, maxAttempts: 3 }
        );
      } catch (err) {
        lastError = err;
        console.warn(`[PlotLine] Groq model ${model} failed`);
      }
    }
    throw lastError ?? new Error("Groq failed");
  },
};
