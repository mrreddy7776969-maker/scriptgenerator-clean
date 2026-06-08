"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Film, Sparkles, Wand2 } from "lucide-react";
import { ScriptForm } from "@/components/generator/script-form";
import { ScriptViewer } from "@/components/generator/script-viewer";
import { LoadingSkeleton } from "@/components/generator/loading-skeleton";
import { addToHistory, incrementUsage } from "@/lib/storage";
import type { Script } from "@/types";

export default function GeneratorPage() {
  const { data: session } = useSession();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerated = (newScript: Script) => {
    const email = session?.user?.email;
    const isAdmin = session?.user?.isAdmin ?? false;

    if (email) {
      incrementUsage(email, isAdmin);
      addToHistory(email, newScript);
    }

    setScript(newScript);
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-3xl">Script Generator</h1>
        <p className="mt-1 text-muted-foreground">
          AI-powered visual action scripts with story qualities and locations shaped for you
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6 h-fit lg:sticky lg:top-20">
          <h2 className="font-serif text-lg mb-4">Configure Your Story</h2>
          <ScriptForm
            onGenerated={handleGenerated}
            onLoading={setLoading}
          />
        </div>

        <div className="glass-card p-6 min-h-[400px]">
          <h2 className="font-serif text-lg mb-4">Generated Script</h2>
          {loading ? (
            <LoadingSkeleton />
          ) : script ? (
            <ScriptViewer script={script} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold shadow-premium">
                <Film className="h-9 w-9" />
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-card text-gold shadow-premium">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>
              <p className="font-medium">No script yet</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                Generate AI story sparks, choose a quality and location, then create a visual script.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                <Wand2 className="h-3.5 w-3.5 text-gold" />
                Start with the AI Story Spark panel
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
