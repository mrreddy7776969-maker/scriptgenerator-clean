"use client";

import { jsPDF } from "jspdf";
import type { Script } from "@/types";
import { downloadBlob, saveFileToFolder, scriptToText } from "./storage";

export async function exportAsTxt(script: Script): Promise<void> {
  const text = scriptToText(script);
  const filename = `plotline-${script.theme.toLowerCase().replace(/\s+/g, "-")}-${script.id.slice(0, 8)}.txt`;
  const saved = await saveFileToFolder(filename, text, "text/plain");
  if (!saved) {
    downloadBlob(filename, new Blob([text], { type: "text/plain" }));
  }
}

export async function exportAsPdf(script: Script): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const addText = (text: string, fontSize = 10, bold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += fontSize * 0.45;
    }
    y += 3;
  };

  addText("PlotLine — Visual Action Script", 16, true);
  addText(`Theme: ${script.theme} | Setting: ${script.setting}`, 10);
  addText(`Characters Count: ${script.characterCount} | Generated: ${new Date(script.createdAt).toLocaleString()}`, 9);
  y += 3;

  if (script.characters && script.characters.length > 0) {
    addText("Characters Involved", 12, true);
    for (const char of script.characters) {
      addText(`• ${char.name}: ${char.description}`, 10);
    }
    y += 4;
  }

  for (const scene of script.scenes) {
    addText(`Scene ${scene.number}: ${scene.title}`, 12, true);
    if (scene.durationHint) addText(`Duration: ${scene.durationHint}`, 9);
    
    addText("Scene Overview", 10, true);
    addText(`Visual Description: ${scene.visualDescription}`);
    addText(`Actions & Physical Gags: ${scene.actions}`);
    addText(`Micro-Expressions: ${scene.microExpressions}`);
    addText(`Editor & Animator Notes: ${scene.editorNotes}`);
    y += 2;

    if (scene.subScenes && scene.subScenes.length > 0) {
      addText("Sub-scenes Beats (5-6 seconds each):", 10, true);
      for (const sub of scene.subScenes) {
        addText(`Beat ${sub.number} (${sub.duration})`, 9, true);
        addText(`Visual: ${sub.visualDescription}`);
        addText(`Action: ${sub.actions}`);
        addText(`Expressions: ${sub.microExpressions}`);
        addText(`Notes: ${sub.editorNotes}`);
        y += 1;
      }
    }
    y += 5;
  }

  const filename = `plotline-${script.theme.toLowerCase().replace(/\s+/g, "-")}-${script.id.slice(0, 8)}.pdf`;
  const blob = doc.output("blob");
  const saved = await saveFileToFolder(filename, blob, "application/pdf");
  if (!saved) {
    downloadBlob(filename, blob);
  }
}

export async function copyScriptToClipboard(script: Script): Promise<void> {
  await navigator.clipboard.writeText(scriptToText(script));
}
