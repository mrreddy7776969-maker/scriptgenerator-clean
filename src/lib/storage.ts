"use client";

import { get, set, del } from "idb-keyval";
import type { PricingConfig, Script, UserUsage } from "@/types";
import { FREE_SCRIPT_LIMIT } from "./constants";

const KEYS = {
  usage: (email: string) => `plotline-usage-${email}`,
  history: (email: string) => `plotline-history-${email}`,
  pricing: "plotline-pricing-config",
  onboarding: "plotline-onboarding-done",
  folderGranted: "plotline-folder-granted",
} as const;

const FOLDER_HANDLE_KEY = "plotline-download-folder";

export function getUsage(email: string): UserUsage {
  if (typeof window === "undefined") {
    return { email, scriptsUsed: 0, isSubscribed: false };
  }
  const raw = localStorage.getItem(KEYS.usage(email));
  if (!raw) return { email, scriptsUsed: 0, isSubscribed: false };
  return JSON.parse(raw) as UserUsage;
}

export function saveUsage(usage: UserUsage): void {
  localStorage.setItem(KEYS.usage(usage.email), JSON.stringify(usage));
}

export function incrementUsage(email: string, isAdmin: boolean): UserUsage {
  const usage = getUsage(email);
  if (!isAdmin && !usage.isSubscribed) {
    usage.scriptsUsed = Math.min(usage.scriptsUsed + 1, FREE_SCRIPT_LIMIT + 1);
  }
  saveUsage(usage);
  return usage;
}

export function getRemainingScripts(email: string, isAdmin: boolean): number | null {
  if (isAdmin) return null;
  const usage = getUsage(email);
  if (usage.isSubscribed) return null;
  return Math.max(0, FREE_SCRIPT_LIMIT - usage.scriptsUsed);
}

export function canGenerate(email: string, isAdmin: boolean): boolean {
  if (isAdmin) return true;
  const usage = getUsage(email);
  if (usage.isSubscribed) return true;
  return usage.scriptsUsed < FREE_SCRIPT_LIMIT;
}

export function getHistory(email: string): Script[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.history(email));
  if (!raw) return [];
  return JSON.parse(raw) as Script[];
}

export function addToHistory(email: string, script: Script): void {
  const history = getHistory(email);
  history.unshift(script);
  localStorage.setItem(KEYS.history(email), JSON.stringify(history.slice(0, 50)));
}

export function getLocalPricing(): PricingConfig | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.pricing);
  if (!raw) return null;
  return JSON.parse(raw) as PricingConfig;
}

export function saveLocalPricing(config: PricingConfig): void {
  localStorage.setItem(KEYS.pricing, JSON.stringify(config));
}

export function isOnboardingDone(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(KEYS.onboarding) === "true";
}

export function setOnboardingDone(): void {
  localStorage.setItem(KEYS.onboarding, "true");
}

export function isFolderGranted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEYS.folderGranted) === "true";
}

export function setFolderGranted(): void {
  localStorage.setItem(KEYS.folderGranted, "true");
}

export async function saveFolderHandle(
  handle: FileSystemDirectoryHandle
): Promise<void> {
  await set(FOLDER_HANDLE_KEY, handle);
  setFolderGranted();
}

export async function getFolderHandle(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const handle = await get<FileSystemDirectoryHandle>(FOLDER_HANDLE_KEY);
    return handle ?? null;
  } catch {
    return null;
  }
}

export async function clearFolderHandle(): Promise<void> {
  await del(FOLDER_HANDLE_KEY);
  localStorage.removeItem(KEYS.folderGranted);
}

export async function verifyFolderPermission(
  handle: FileSystemDirectoryHandle
): Promise<boolean> {
  try {
    const opts = { mode: "readwrite" as const };
    if ((await handle.queryPermission(opts)) === "granted") return true;
    return (await handle.requestPermission(opts)) === "granted";
  } catch {
    return false;
  }
}

export async function saveFileToFolder(
  filename: string,
  content: string | Blob,
  mimeType = "text/plain"
): Promise<boolean> {
  const handle = await getFolderHandle();
  if (!handle) return false;

  const hasPermission = await verifyFolderPermission(handle);
  if (!hasPermission) return false;

  const fileHandle = await handle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  await writable.write(blob);
  await writable.close();
  return true;
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function scriptToText(script: Script): string {
  const lines = [
    `PlotLine Script`,
    `Theme: ${script.theme}`,
    `Setting: ${script.setting}`,
    `Characters: ${script.characterCount}`,
    `Generated: ${new Date(script.createdAt).toLocaleString()}`,
    "",
    "=".repeat(60),
    "",
  ];

  for (const scene of script.scenes) {
    lines.push(`SCENE ${scene.number}: ${scene.title}`);
    if (scene.durationHint) lines.push(`Duration: ${scene.durationHint}`);
    lines.push("");
    lines.push("VISUAL DESCRIPTION:");
    lines.push(scene.visualDescription);
    lines.push("");
    lines.push("ACTIONS & PHYSICAL GAGS:");
    lines.push(scene.actions);
    lines.push("");
    lines.push("MICRO-EXPRESSIONS:");
    lines.push(scene.microExpressions);
    lines.push("");
    lines.push("EDITOR & ANIMATOR NOTES:");
    lines.push(scene.editorNotes);
    lines.push("");
    lines.push("-".repeat(60));
    lines.push("");
  }

  return lines.join("\n");
}
