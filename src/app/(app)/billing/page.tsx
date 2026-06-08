"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { PricingCard } from "@/components/billing/pricing-card";
import { usePricingStore } from "@/lib/stores/pricing-store-client";
import { useSession } from "next-auth/react";
import { FREE_SCRIPT_LIMIT } from "@/lib/constants";
import { getUsage, saveUsage } from "@/lib/storage";

function BillingContent() {
  const { data: session } = useSession();
  const { pricing, fetchPricing } = usePricingStore();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<"pro" | "proPlus" | null>(null);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  useEffect(() => {
    if (success && session?.user?.email) {
      const usage = getUsage(session.user.email);
      usage.isSubscribed = true;
      saveUsage(usage);
    }
  }, [success, session]);

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
        alert(data.error || "Stripe is not configured yet. See README for setup.");
      }
    } catch {
      alert("Checkout failed.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl">Billing & Pricing</h1>
        <p className="mt-2 text-muted-foreground">
          Start free with {FREE_SCRIPT_LIMIT} scripts, then upgrade for unlimited access
        </p>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          Payment successful! Your subscription is now active.
        </div>
      )}
      {canceled && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          <XCircle className="h-4 w-4" />
          Checkout was canceled. No charges were made.
        </div>
      )}

      {pricing && (
        <div className="grid gap-6 sm:grid-cols-2">
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
      )}

      <div className="mt-8 glass-card p-6">
        <h3 className="font-serif text-lg mb-3">Free Plan</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="text-gold">✓</span> {FREE_SCRIPT_LIMIT} script generations
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gold">✓</span> TXT & PDF export
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gold">✓</span> Scene timeline viewer
          </li>
          <li className="flex items-center gap-2">
            <span className="text-muted-foreground">✗</span> Unlimited generation
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="animate-pulse p-8 text-muted-foreground">Loading...</div>}>
      <BillingContent />
    </Suspense>
  );
}
