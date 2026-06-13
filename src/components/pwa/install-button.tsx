"use client";

import { Download, X, Share, MoreVertical, Monitor } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallButtonProps {
  className?: string;
}

function getDeviceInfo() {
  if (typeof window === "undefined") return { isIOS: false, isAndroid: false, isMac: false, isWindows: false };
  const ua = navigator.userAgent;
  return {
    isIOS: /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    isAndroid: /Android/.test(ua),
    isMac: /Macintosh/.test(ua) && navigator.maxTouchPoints <= 1,
    isWindows: /Windows/.test(ua),
  };
}

export function InstallButton({ className }: InstallButtonProps = {}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsInstalled(standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleClick = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowModal(true);
    }
  }, [deferredPrompt]);

  if (isInstalled) return null;

  const device = getDeviceInfo();

  return (
    <>
      <button
        onClick={handleClick}
        className={className || "btn-primary !py-2 !px-4 text-xs sm:text-sm flex items-center gap-1.5"}
      >
        <Download className="h-4 w-4" />
        <span>Install App</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div
            className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="font-serif text-lg font-semibold">Install PlotLine</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Install PlotLine on your device for quick access, offline support, and a full-screen experience.
              </p>

              {device.isIOS ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold">iPhone / iPad</h4>
                  <div className="space-y-2">
                    <Step num={1} icon={<Share className="h-3.5 w-3.5" />} text='Tap the Share button in Safari' />
                    <Step num={2} icon={<Download className="h-3.5 w-3.5" />} text='Scroll down and tap "Add to Home Screen"' />
                    <Step num={3} icon={<Monitor className="h-3.5 w-3.5" />} text='Tap "Add" to confirm' />
                  </div>
                </div>
              ) : device.isAndroid ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold">Android</h4>
                  <div className="space-y-2">
                    <Step num={1} icon={<MoreVertical className="h-3.5 w-3.5" />} text='Tap the menu icon (⋮) in Chrome' />
                    <Step num={2} icon={<Download className="h-3.5 w-3.5" />} text='Tap "Install app" or "Add to Home Screen"' />
                    <Step num={3} icon={<Monitor className="h-3.5 w-3.5" />} text='Tap "Install" to confirm' />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold">Desktop (Chrome / Edge)</h4>
                  <div className="space-y-2">
                    <Step num={1} icon={<Monitor className="h-3.5 w-3.5" />} text='Look for the install icon (⊕) in the address bar' />
                    <Step num={2} icon={<Download className="h-3.5 w-3.5" />} text='Click "Install" in the popup dialog' />
                    <Step num={3} icon={<Monitor className="h-3.5 w-3.5" />} text='PlotLine will open as a standalone app' />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full btn-secondary py-2 text-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Step({ num, icon, text }: { num: number; icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 bg-muted/30 border border-border/50 rounded-xl p-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold text-xs font-bold">
        {num}
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground">
        <span className="text-gold shrink-0">{icon}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
