import { buildPrompt } from "../prompt-template";
import type { GenerateRequest, Script } from "@/types";
import { groqProvider } from "./groq-provider";
import { openRouterProvider } from "./openrouter-provider";
import { geminiProvider } from "./gemini-provider";
import { buildScript, formatLlmError } from "./parse-script";
import type { LlmProvider } from "./types";

const ALL_PROVIDERS: LlmProvider[] = [
  groqProvider,
  openRouterProvider,
  geminiProvider,
];

function getActiveProviders(): LlmProvider[] {
  const forced = process.env.LLM_PROVIDER?.toLowerCase();

  if (forced === "groq") {
    return groqProvider.isConfigured() ? [groqProvider] : [];
  }
  if (forced === "openrouter") {
    return openRouterProvider.isConfigured() ? [openRouterProvider] : [];
  }
  if (forced === "gemini") {
    return geminiProvider.isConfigured() ? [geminiProvider] : [];
  }

  // Default: try all configured providers in order (most reliable first)
  return ALL_PROVIDERS.filter((p) => p.isConfigured());
}

export async function generateScript(request: GenerateRequest): Promise<Script> {
  const text = await generateText(buildPrompt(request.theme, request.setting, request.characterCount));
  return buildScript(request, text);
}

export async function generateText(prompt: string): Promise<string> {
  const providers = getActiveProviders();

  if (providers.length === 0) {
    throw new Error(
      "No AI provider configured. Add GROQ_API_KEY (recommended, free) or GEMINI_API_KEY to .env.local"
    );
  }

  let lastError: unknown;

  for (const provider of providers) {
    try {
      console.info(`[PlotLine] Trying ${provider.name}...`);
      const text = await provider.generate(prompt);
      console.info(`[PlotLine] AI text generated via ${provider.name}`);
      return text;
    } catch (err) {
      lastError = err;
      console.warn(`[PlotLine] ${provider.name} failed, trying next provider...`, err);
    }
  }

  throw lastError ?? new Error("All AI providers failed");
}

export { formatLlmError };
