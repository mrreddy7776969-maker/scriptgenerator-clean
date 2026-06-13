"use client";

import { useState } from "react";
import { Check, Copy, Download, FileText, Users } from "lucide-react";
import type { Script } from "@/types";
import { SceneCard } from "./scene-card";
import { copyScriptToClipboard, exportAsPdf, exportAsTxt } from "@/lib/export";

interface ScriptViewerProps {
  script: Script;
}

export function ScriptViewer({ script }: ScriptViewerProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleCopy = async () => {
    await copyScriptToClipboard(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = async () => {
    setExporting("txt");
    await exportAsTxt(script);
    setExporting(null);
  };

  const handleExportPdf = async () => {
    setExporting("pdf");
    await exportAsPdf(script);
    setExporting(null);
  };

  return (
    <div className="space-y-6" id="script-viewer">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl">{script.theme}</h2>
          <p className="text-sm text-muted-foreground">
            {script.setting} · {script.characterCount} character(s) · {script.scenes.length} scenes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleCopy} className="btn-secondary !py-2 !px-3 text-xs">
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleExportTxt}
            disabled={exporting === "txt"}
            className="btn-secondary !py-2 !px-3 text-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            {exporting === "txt" ? "Saving..." : "TXT"}
          </button>
          <button
            onClick={handleExportPdf}
            disabled={exporting === "pdf"}
            className="btn-secondary !py-2 !px-3 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            {exporting === "pdf" ? "Saving..." : "PDF"}
          </button>
        </div>
      </div>

      {script.characters && script.characters.length > 0 && (
        <div className="border border-border/40 bg-muted/20 p-5 rounded-2xl space-y-3 animate-slide-up">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-gold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Characters Cast
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {script.characters.map((char) => (
              <div
                key={char.name}
                className="bg-card/40 border border-border/60 hover:border-gold/30 hover:bg-card/80 transition-all duration-300 p-4 rounded-xl flex items-start gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold font-serif font-bold text-sm">
                  {char.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{char.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{char.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden sm:block" />
        <div className="space-y-3 sm:pl-10">
          {script.scenes.map((scene, i) => (
            <SceneCard key={scene.number} scene={scene} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
