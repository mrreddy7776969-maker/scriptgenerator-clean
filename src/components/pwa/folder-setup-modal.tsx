"use client";

import { FolderOpen, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { isFolderGranted, saveFolderHandle } from "@/lib/storage";
import { useUIStore } from "@/lib/stores/ui-store";

export function FolderSetupModal() {
  const { data: session } = useSession();
  const { folderSetupOpen, setFolderSetupOpen } = useUIStore();
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user?.email) return;
    if (isFolderGranted()) return;
    if (dismissed) return;
    if (!("showDirectoryPicker" in window)) return;

    const timer = setTimeout(() => setFolderSetupOpen(true), 1500);
    return () => clearTimeout(timer);
  }, [session, dismissed, setFolderSetupOpen]);

  const handlePickFolder = async () => {
    setError("");
    try {
      const handle = await window.showDirectoryPicker!({
        mode: "readwrite",
        id: "plotline-downloads",
        startIn: "documents",
      });
      await saveFolderHandle(handle);
      setFolderSetupOpen(false);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Could not access folder. You can try again later from Settings.");
      }
    }
  };

  const handleSkip = () => {
    setDismissed(true);
    setFolderSetupOpen(false);
  };

  if (!folderSetupOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md glass-card animate-slide-up p-6">
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 rounded-lg p-1.5 hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
          <FolderOpen className="h-6 w-6 text-gold" />
        </div>

        <h2 className="font-serif text-xl">Choose Your Download Folder</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select a folder once and PlotLine will save all your scripts there automatically —
          no need to ask again.
        </p>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button onClick={handlePickFolder} className="btn-primary flex-1">
            <FolderOpen className="h-4 w-4" />
            Choose Folder
          </button>
          <button onClick={handleSkip} className="btn-secondary">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
