"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FolderOpen, RotateCcw, Shield } from "lucide-react";
import {
  clearFolderHandle,
  isFolderGranted,
  saveFolderHandle,
} from "@/lib/storage";
import { useTheme } from "@/components/providers/theme-provider";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [folderSet, setFolderSet] = useState(isFolderGranted);
  const [message, setMessage] = useState("");

  const handlePickFolder = async () => {
    if (!("showDirectoryPicker" in window)) {
      setMessage("Your browser doesn't support folder selection. Downloads will use the default location.");
      return;
    }
    try {
      const handle = await window.showDirectoryPicker!({
        mode: "readwrite",
        id: "plotline-downloads",
        startIn: "documents",
      });
      await saveFolderHandle(handle);
      setFolderSet(true);
      setMessage("Download folder updated successfully.");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessage("Could not set folder.");
      }
    }
  };

  const handleClearFolder = async () => {
    await clearFolderHandle();
    setFolderSet(false);
    setMessage("Download folder cleared.");
  };

  const handleResetTour = () => {
    localStorage.removeItem("plotline-onboarding-done");
    setMessage("Onboarding tour reset. It will show on your next dashboard visit.");
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your preferences</p>
      </div>

      {message && (
        <div className="rounded-lg bg-gold/10 px-4 py-3 text-sm text-gold">{message}</div>
      )}

      <div className="glass-card p-6 space-y-4">
        <h3 className="font-serif text-lg">Account</h3>
        <div className="text-sm">
          <p className="text-muted-foreground">Name</p>
          <p className="font-medium">{session?.user?.name}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{session?.user?.email}</p>
        </div>
        {session?.user?.isAdmin && (
          <div className="flex items-center gap-2 text-sm text-gold">
            <Shield className="h-4 w-4" />
            Admin account
          </div>
        )}
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="font-serif text-lg">Appearance</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={`rounded-lg px-4 py-2 text-sm transition-colors ${
              theme === "light" ? "bg-gold/10 text-gold" : "bg-muted"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`rounded-lg px-4 py-2 text-sm transition-colors ${
              theme === "dark" ? "bg-gold/10 text-gold" : "bg-muted"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="font-serif text-lg">Download Folder</h3>
        <p className="text-sm text-muted-foreground">
          Choose where PlotLine saves your TXT and PDF exports. You only need to set this once.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={handlePickFolder} className="btn-primary">
            <FolderOpen className="h-4 w-4" />
            {folderSet ? "Change Folder" : "Choose Folder"}
          </button>
          {folderSet && (
            <button onClick={handleClearFolder} className="btn-secondary">
              Clear Folder
            </button>
          )}
        </div>
        {folderSet && (
          <p className="text-xs text-green-600 dark:text-green-400">✓ Download folder is set</p>
        )}
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="font-serif text-lg">Onboarding</h3>
        <p className="text-sm text-muted-foreground">
          Replay the first-time tour or skip it permanently.
        </p>
        <button onClick={handleResetTour} className="btn-secondary">
          <RotateCcw className="h-4 w-4" />
          Reset Onboarding Tour
        </button>
      </div>
    </div>
  );
}
