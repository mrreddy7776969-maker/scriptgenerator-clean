import { AppShell } from "@/components/layout/app-shell";
import { PaywallModal } from "@/components/billing/paywall-modal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {children}
      <PaywallModal />
    </AppShell>
  );
}
