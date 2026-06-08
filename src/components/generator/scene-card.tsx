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
        <div className="space-y-4 border-t border-border px-4 pb-4 pt-3">
          <Section icon={Film} title="Visual Description" content={scene.visualDescription} />
          <Section title="Actions & Physical Gags" content={scene.actions} />
          <Section title="Micro-Expressions" content={scene.microExpressions} />
          <Section title="Editor & Animator Notes" content={scene.editorNotes} />
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
