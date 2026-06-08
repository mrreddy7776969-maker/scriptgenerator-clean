"use client";

import { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";
import { usePricingStore } from "@/lib/stores/pricing-store-client";
import type { PricingConfig } from "@/types";
import { CURRENCY_SYMBOL } from "@/lib/constants";

export function PricingEditor() {
  const { pricing, fetchPricing, updatePricing } = usePricingStore();
  const [proPrice, setProPrice] = useState("50");
  const [proPlusPrice, setProPlusPrice] = useState("150");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  useEffect(() => {
    if (pricing) {
      setProPrice(String(pricing.pro.price));
      setProPlusPrice(String(pricing.proPlus.price));
    }
  }, [pricing]);

  const handleSave = async () => {
    if (!pricing) return;
    setSaving(true);

    const updated: PricingConfig = {
      ...pricing,
      pro: { ...pricing.pro, price: Number(proPrice) },
      proPlus: { ...pricing.proPlus, price: Number(proPlusPrice) },
      updatedAt: new Date().toISOString(),
    };

    await updatePricing(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="font-serif text-lg mb-1">Subscription Pricing</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Changes update pricing cards on Billing page and paywall modals instantly.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Pro Plan ({CURRENCY_SYMBOL}/month)</label>
          <input
            type="number"
            min="1"
            value={proPrice}
            onChange={(e) => setProPrice(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Pro Plus Plan ({CURRENCY_SYMBOL}/month)</label>
          <input
            type="number"
            min="1"
            value={proPlusPrice}
            onChange={(e) => setProPlusPrice(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary mt-6">
        {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {saved ? "Saved!" : saving ? "Saving..." : "Save Pricing"}
      </button>
    </div>
  );
}
