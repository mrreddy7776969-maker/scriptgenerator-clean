"use client";

import { useState } from "react";
import { ChevronDown, Clock, Film } from "lucide-react";
import type { Scene } from "@/types";

interface SceneCardProps {
  scene: Scene;
  index: number;
}

export function SceneCard({ scene, index }: SceneCardProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const [activeBeat, setActiveBeat] = useState(0);

  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-sm font-medium text-gold">
            {scene.number}
          </div>
          <div>
            <p className="font-medium">{scene.title}</p>
            {scene.durationHint && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {scene.durationHint}
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="space-y-6 border-t border-border px-4 pb-5 pt-4">
          {/* General Scene Overview */}
          <div className="bg-muted/10 border border-border/40 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Scene Overview
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Section icon={Film} title="Visual Description" content={scene.visualDescription} />
              <Section title="Actions & Physical Gags" content={scene.actions} />
              <Section title="Micro-Expressions" content={scene.microExpressions} />
              <Section title="Editor & Animator Notes" content={scene.editorNotes} />
            </div>
          </div>

          {/* Sub-scenes Timeline / Tabs */}
          {scene.subScenes && scene.subScenes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5" />
                  Animation Beats (5-6s Beats)
                </h4>
                <span className="text-xs text-muted-foreground">
                  {scene.subScenes.length} beats
                </span>
              </div>

              {/* Horizontal Tabs Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gold/20">
                {scene.subScenes.map((sub, idx) => (
                  <button
                    key={sub.number}
                    onClick={() => setActiveBeat(idx)}
                    className={`flex flex-col items-center justify-center min-w-[70px] py-1.5 px-2.5 rounded-lg border text-center transition-all ${
                      activeBeat === idx
                        ? "bg-gold/15 border-gold text-gold font-medium scale-[1.02]"
                        : "bg-background/40 border-border/80 text-muted-foreground hover:border-gold/30 hover:bg-muted/20"
                    }`}
                  >
                    <span className="text-xs">Beat {sub.number}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">{sub.duration}</span>
                  </button>
                ))}
              </div>

              {/* Active Beat Details */}
              <div className="bg-background/60 border border-border/60 p-4 rounded-xl animate-fade-in space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h5 className="text-sm font-semibold text-foreground">
                    Beat {scene.subScenes[activeBeat]?.number || activeBeat + 1} Details
                  </h5>
                  <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full font-medium">
                    {scene.subScenes[activeBeat]?.duration || "6 seconds"}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Section icon={Film} title="Visual Description" content={scene.subScenes[activeBeat]?.visualDescription || ""} />
                  <Section title="Actions & Physical Gags" content={scene.subScenes[activeBeat]?.actions || ""} />
                  <Section title="Micro-Expressions" content={scene.subScenes[activeBeat]?.microExpressions || ""} />
                  <Section title="Editor & Animator Notes" content={scene.subScenes[activeBeat]?.editorNotes || ""} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  content,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
}) {
  return (
    <div>
      <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gold">
        {Icon && <Icon className="h-3 w-3" />}
        {title}
      </h4>
      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{content}</p>
    </div>
  );
}
