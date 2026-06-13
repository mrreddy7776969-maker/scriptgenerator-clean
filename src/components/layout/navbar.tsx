"use client";

import { Menu, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { InstallButton } from "@/components/pwa/install-button";
import { useUIStore } from "@/lib/stores/ui-store";

export function Navbar() {
  const { data: session } = useSession();
  const { setSidebarOpen } = useUIStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 backdrop-blur-sm lg:px-6" style={{ backgroundColor: "color-mix(in srgb, var(--card) 80%, transparent)" }}>
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard">
          <img src="/logo.png" alt="PlotLine Logo" className="h-6 w-auto object-contain rounded" />
        </Link>
      </div>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2 sm:gap-3">
        <InstallButton />
        <ThemeToggle />

        {session?.user && (
          <div className="flex items-center gap-3 border-l border-border pl-3">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="btn-secondary !p-2"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
