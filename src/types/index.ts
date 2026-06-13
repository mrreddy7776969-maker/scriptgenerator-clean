export interface Character {
  name: string;
  description: string;
}

export interface SubScene {
  number: number;
  duration: string;
  visualDescription: string;
  actions: string;
  microExpressions: string;
  editorNotes: string;
}

export interface Scene {
  number: number;
  title: string;
  visualDescription: string;
  actions: string;
  microExpressions: string;
  editorNotes: string;
  durationHint?: string;
  subScenes: SubScene[];
}

export interface Script {
  id: string;
  theme: string;
  setting: string;
  characterCount: number;
  characters: Character[];
  scenes: Scene[];
  createdAt: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  features: string[];
  stripePriceId?: string;
}

export interface PricingConfig {
  pro: PricingPlan;
  proPlus: PricingPlan;
  updatedAt: string;
}

export interface UserUsage {
  email: string;
  scriptsUsed: number;
  isSubscribed: boolean;
  plan?: "pro" | "proPlus";
}

export interface GenerateRequest {
  theme: string;
  setting: string;
  characterCount: number;
}

export interface GenerateResponse {
  script: Script;
  remaining: number | null;
}

export interface StorySuggestion {
  label: string;
  reason: string;
}

export interface StorySuggestions {
  qualities: StorySuggestion[];
  locations: StorySuggestion[];
}
