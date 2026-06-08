"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Sparkles, AlertCircle, Wand2, Heart, MapPin, Loader2 } from "lucide-react";
import { CHARACTER_COUNTS, FREE_SCRIPT_LIMIT } from "@/lib/constants";
import { canGenerate, getRemainingScripts, getUsage } from "@/lib/storage";
import { useUIStore } from "@/lib/stores/ui-store";
import type { Script, StorySuggestion, StorySuggestions } from "@/types";

interface ScriptFormProps {
  onGenerated: (script: Script) => void;
  onLoading: (loading: boolean) => void;
}

export function ScriptForm({ onGenerated, onLoading }: ScriptFormProps) {
  const { data: session } = useSession();
  const { setPaywallOpen } = useUIStore();
  const [theme, setTheme] = useState("");
  const [setting, setSetting] = useState("");
  const [seedIdea, setSeedIdea] = useState("");
  const [characterCount, setCharacterCount] = useState<number>(2);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<StorySuggestions | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const isAdmin = session?.user?.isAdmin ?? false;
  const email = session?.user?.email ?? "";
  const remaining = email ? getRemainingScripts(email, isAdmin) : FREE_SCRIPT_LIMIT;
  const canGen = email ? canGenerate(email, isAdmin) : false;

  const handleSuggest = async () => {
    setError("");
    setSuggestionLoading(true);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: seedIdea }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not generate ideas");
      }

      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate ideas");
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canGen) {
      setPaywallOpen(true);
      return;
    }

    const finalTheme = theme.trim();
    const finalSetting = setting.trim();
    if (!finalTheme) {
      setError("Please choose or enter a good quality for the story.");
      return;
    }
    if (!finalSetting) {
      setError("Please choose or enter a story location.");
      return;
    }

    onLoading(true);
    try {
      const usage = getUsage(email);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-scripts-used": String(usage.scriptsUsed),
          "x-is-subscribed": String(usage.isSubscribed),
        },
        body: JSON.stringify({ theme: finalTheme, setting: finalSetting, characterCount }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.paywall) {
          setPaywallOpen(true);
          return;
        }
        throw new Error(data.error || "Generation failed");
      }

      onGenerated(data.script);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      onLoading(false);
    }
  };

  const SuggestionGroup = ({
    title,
    icon,
    items,
    selected,
    onSelect,
  }: {
    title: string;
    icon: React.ReactNode;
    items: StorySuggestion[];
    selected: string;
    onSelect: (value: string) => void;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </div>
      <div className="grid gap-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(item.label)}
            className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
              selected === item.label
                ? "border-gold bg-gold/10 shadow-premium"
                : "border-border bg-card hover:border-gold/60 hover:bg-muted"
            }`}
          >
            <span className="block text-sm font-medium">{item.label}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {item.reason}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5" id="generator-form">
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-base">AI Story Spark</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Add a tiny seed idea, then let AI suggest the best moral quality and location.
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
            <Wand2 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={seedIdea}
            onChange={(e) => setSeedIdea(e.target.value)}
            placeholder="e.g., a small robot learning to care"
            className="input-field"
          />
          <button
            type="button"
            onClick={handleSuggest}
            disabled={suggestionLoading}
            className="btn-secondary shrink-0"
          >
            {suggestionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {suggestionLoading ? "Thinking" : "Generate Ideas"}
          </button>
        </div>
      </div>

      {suggestions && (
        <div className="grid gap-4 animate-slide-up">
          <SuggestionGroup
            title="Good quality"
            icon={<Heart className="h-4 w-4 text-gold" />}
            items={suggestions.qualities}
            selected={theme}
            onSelect={setTheme}
          />
          <SuggestionGroup
            title="Story location"
            icon={<MapPin className="h-4 w-4 text-gold" />}
            items={suggestions.locations}
            selected={setting}
            onSelect={setSetting}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Selected Good Quality</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Generate or type a moral quality"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Selected Location</label>
          <input
            type="text"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            placeholder="Generate or type a cinematic place"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Number of Characters</label>
        <div className="grid grid-cols-4 gap-2">
          {CHARACTER_COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCharacterCount(n)}
              className={`rounded-lg border py-2.5 text-sm font-medium transition-all ${
                characterCount === n
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border hover:bg-muted"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {!isAdmin && remaining !== null && (
        <div className="rounded-lg bg-muted px-4 py-3 text-sm">
          <span className="text-muted-foreground">Scripts remaining: </span>
          <span className="font-medium text-gold">{remaining}</span>
          <span className="text-muted-foreground"> / {FREE_SCRIPT_LIMIT} free</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canGen && !isAdmin}
        className="btn-primary w-full"
        id="generate-btn"
      >
        <Sparkles className="h-4 w-4" />
        {canGen || isAdmin ? "Generate Script" : "Upgrade to Continue"}
      </button>
    </form>
  );
}
