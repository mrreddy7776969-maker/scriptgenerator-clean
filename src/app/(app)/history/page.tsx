"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { History, Trash2 } from "lucide-react";
import { getHistory } from "@/lib/storage";
import { ScriptViewer } from "@/components/generator/script-viewer";
import type { Script } from "@/types";

export default function HistoryPage() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";
  const [history, setHistory] = useState<Script[]>(() => (email ? getHistory(email) : []));
  const [selected, setSelected] = useState<Script | null>(null);

  const handleClear = () => {
    if (!email) return;
    if (confirm("Clear all script history? This cannot be undone.")) {
      localStorage.removeItem(`plotline-history-${email}`);
      setHistory([]);
      setSelected(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">History</h1>
          <p className="mt-1 text-muted-foreground">
            Your previously generated scripts
          </p>
        </div>
        {history.length > 0 && (
          <button onClick={handleClear} className="btn-secondary !text-red-500">
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card flex flex-col items-center py-16 text-center">
          <History className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">No scripts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated scripts will appear here automatically
          </p>
        </div>
      ) : selected ? (
        <div>
          <button onClick={() => setSelected(null)} className="btn-secondary mb-4 text-sm">
            ← Back to list
          </button>
          <div className="glass-card p-6">
            <ScriptViewer script={selected} />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((script) => (
            <button
              key={script.id}
              onClick={() => setSelected(script)}
              className="glass-card flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{script.theme}</p>
                <p className="text-sm text-muted-foreground">
                  {script.setting} · {script.scenes.length} scenes · {script.characterCount} characters
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(script.createdAt).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
