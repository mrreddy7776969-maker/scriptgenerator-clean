"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Clapperboard,
  CreditCard,
  History,
  LayoutDashboard,
  Settings,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { useUIStore } from "@/lib/stores/ui-store";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tourId?: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generator", label: "Script Generator", icon: Sparkles, tourId: "nav-generator" },
  { href: "/history", label: "History", icon: History },
  { href: "/billing", label: "Billing / Pricing", icon: CreditCard, tourId: "nav-billing" },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminItem: NavItem = { href: "/admin", label: "Admin Settings", icon: Shield };

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const isAdmin = session?.user?.isAdmin;

  const items = isAdmin ? [...navItems, adminItem] : navItems;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <Clapperboard className="h-5 w-5 text-gold" />
            </div>
            <span className="font-serif text-xl tracking-tight">{APP_NAME}</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 hover:bg-muted lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                id={item.tourId}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gold/10 text-gold font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            Visual scripts for kids&apos; animation
          </p>
        </div>
      </aside>
    </>
  );
}
