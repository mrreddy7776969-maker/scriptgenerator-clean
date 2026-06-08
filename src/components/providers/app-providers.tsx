"use client";

import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { FolderSetupModal } from "@/components/pwa/folder-setup-modal";
import { OnboardingTour } from "@/components/onboarding/onboarding-tour";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <ServiceWorkerRegister />
        <FolderSetupModal />
        <OnboardingTour />
      </ThemeProvider>
    </SessionProvider>
  );
}
