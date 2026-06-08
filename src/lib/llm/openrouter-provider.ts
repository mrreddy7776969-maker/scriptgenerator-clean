import type { LlmProvider } from "./types";
import { chatCompletion } from "./openai-chat";
import { withRetry } from "./retry";

/** Free models on OpenRouter — tried in order */
const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
] as const;

export const openRouterProvider: LlmProvider = {
  name: "OpenRouter",

  isConfigured() {
    return Boolean(process.env.OPENROUTER_API_KEY?.trim());
  },

  async generate(prompt: string) {
    const apiKey = process.env.OPENROUTER_API_KEY!;

    let lastError: unknown;
    for (const model of FREE_MODELS) {
      try {
        return await withRetry(
          () =>
            chatCompletion(
              "https://openrouter.ai/api/v1",
              apiKey,
              model,
              prompt,
              {
                "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
                "X-Title": "PlotLine",
              }
            ),
          { label: `OpenRouter/${model}`, maxAttempts: 2 }
        );
      } catch (err) {
        lastError = err;
        console.warn(`[PlotLine] OpenRouter model ${model} failed`);
      }
    }
    throw lastError ?? new Error("OpenRouter failed");
  },
};
