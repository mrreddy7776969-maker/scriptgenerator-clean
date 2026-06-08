"use client";

import { useEffect, useState } from "react";
import { Crown, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { PricingCard } from "./pricing-card";
import { useUIStore } from "@/lib/stores/ui-store";
import { usePricingStore } from "@/lib/stores/pricing-store-client";
import { FREE_SCRIPT_LIMIT } from "@/lib/constants";

export function PaywallModal() {
  const { paywallOpen, setPaywallOpen } = useUIStore();
  const { pricing, fetchPricing } = usePricingStore();
  const [loading, setLoading] = useState<"pro" | "proPlus" | null>(null);

  useEffect(() => {
    if (paywallOpen) fetchPricing();
  }, [paywallOpen, fetchPricing]);

  const handleCheckout = async (plan: "pro" | "proPlus") => {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Stripe is not configured yet. See README for setup instructions.");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (!pricing) return null;

  return (
    <Modal open={paywallOpen} onClose={() => setPaywallOpen(false)} size="xl">
      <div className="text-center mb-6">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
          <Crown className="h-6 w-6 text-gold" />
        </div>
        <h2 className="font-serif text-2xl">Unlock Unlimited Scripts</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;ve used all {FREE_SCRIPT_LIMIT} free scripts. Upgrade to keep creating
          magical visual stories for kids.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PricingCard
          plan={pricing.pro}
          onSelect={() => handleCheckout("pro")}
          loading={loading === "pro"}
        />
        <PricingCard
          plan={pricing.proPlus}
          highlighted
          onSelect={() => handleCheckout("proPlus")}
          loading={loading === "proPlus"}
        />
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        Secure payments powered by Stripe · Prices in INR
      </p>
    </Modal>
  );
}
