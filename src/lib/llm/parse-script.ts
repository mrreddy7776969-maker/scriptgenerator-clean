import type { GenerateRequest, Scene, Script, Character, SubScene } from "@/types";

export function parseCharacters(raw: unknown): Character[] {
  if (!raw || typeof raw !== "object" || !("characters" in raw)) {
    return [];
  }
  const chars = (raw as { characters: unknown }).characters;
  if (!Array.isArray(chars)) {
    return [];
  }
  return chars.map((c) => {
    const char = c as Record<string, unknown>;
    return {
      name: String(char.name || "Unnamed Character"),
      description: String(char.description || ""),
    };
  });
}

export function parseScenes(raw: unknown): Scene[] {
  if (!raw || typeof raw !== "object" || !("scenes" in raw)) {
    throw new Error("Invalid response format from AI");
  }
  const scenes = (raw as { scenes: unknown }).scenes;
  if (!Array.isArray(scenes) || scenes.length === 0) {
    throw new Error("No scenes returned from AI");
  }
  return scenes.map((s, i) => {
    const scene = s as Record<string, unknown>;
    
    const rawSubScenes = scene.subScenes;
    const subScenes: SubScene[] = Array.isArray(rawSubScenes)
      ? rawSubScenes.map((ss, idx) => {
          const sub = ss as Record<string, unknown>;
          return {
            number: Number(sub.number) || idx + 1,
            duration: String(sub.duration || "6 seconds"),
            visualDescription: String(sub.visualDescription || ""),
            actions: String(sub.actions || ""),
            microExpressions: String(sub.microExpressions || ""),
            editorNotes: String(sub.editorNotes || ""),
          };
        })
      : [];

    return {
      number: Number(scene.number) || i + 1,
      title: String(scene.title || `Scene ${i + 1}`),
      visualDescription: String(scene.visualDescription || ""),
      actions: String(scene.actions || ""),
      microExpressions: String(scene.microExpressions || ""),
      editorNotes: String(scene.editorNotes || ""),
      durationHint: scene.durationHint ? String(scene.durationHint) : undefined,
      subScenes,
    };
  });
}

export function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in AI response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export function buildScript(request: GenerateRequest, text: string): Script {
  const parsed = extractJson(text);
  const characters = parseCharacters(parsed);
  const scenes = parseScenes(parsed);
  return {
    id: crypto.randomUUID(),
    theme: request.theme,
    setting: request.setting,
    characterCount: request.characterCount,
    characters,
    scenes,
    createdAt: new Date().toISOString(),
  };
}

export function formatLlmError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes("429") || msg.includes("quota") || msg.includes("Quota exceeded")) {
    return "All AI providers are temporarily busy. Please wait 30 seconds and try again.";
  }

  if (msg.includes("not configured") || msg.includes("No LLM providers")) {
    return msg;
  }

  if (msg.length > 220) {
    return msg.slice(0, 220) + "...";
  }

  return msg;
}
