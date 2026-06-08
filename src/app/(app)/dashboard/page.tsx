"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Clapperboard, Crown, Sparkles, Zap } from "lucide-react";
import { FREE_SCRIPT_LIMIT } from "@/lib/constants";
import { getHistory, getRemainingScripts, getUsage } from "@/lib/storage";

export default function DashboardPage() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";
  const isAdmin = session?.user?.isAdmin ?? false;

  const usage = email ? getUsage(email) : null;
  const remaining = email ? getRemainingScripts(email, isAdmin) : FREE_SCRIPT_LIMIT;
  const history = email ? getHistory(email) : [];

  useEffect(() => {
    // Re-render on mount to pick up localStorage
  }, [email]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Create dialogue-free visual scripts for kids&apos; 3D animation
        </p>
      </div>

      <div id="dashboard-stats" className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Sparkles}
          label="Scripts Used"
          value={isAdmin ? "∞" : String(usage?.scriptsUsed ?? 0)}
          sub={isAdmin ? "Admin — unlimited" : `of ${FREE_SCRIPT_LIMIT} free`}
        />
        <StatCard
          icon={Zap}
          label="Remaining"
          value={remaining === null ? "∞" : String(remaining)}
          sub={remaining === null ? "Unlimited access" : "free scripts left"}
        />
        <StatCard
          icon={Clapperboard}
          label="Total Saved"
          value={String(history.length)}
          sub="in your history"
        />
      </div>

      {isAdmin && (
        <div className="glass-card flex items-center gap-4 p-5 border-gold/30">
          <div className="rounded-lg bg-gold/10 p-3">
            <Crown className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-medium">Admin Access Active</p>
            <p className="text-sm text-muted-foreground">
              Unlimited script generation and admin controls enabled
            </p>
          </div>
        </div>
      )}

      <div className="glass-card p-6">
        <h2 className="font-serif text-xl mb-2">Quick Start</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Pick a moral theme, choose a setting, and let AI craft a unique 10-12 scene visual script.
        </p>
        <Link href="/generator" className="btn-primary">
          Open Script Generator
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {history.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">Recent Scripts</h2>
            <Link href="/history" className="text-sm text-gold hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {history.slice(0, 3).map((script) => (
              <div key={script.id} className="glass-card flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{script.theme}</p>
                  <p className="text-sm text-muted-foreground">
                    {script.setting} · {script.scenes.length} scenes
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(script.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-serif text-3xl mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}
