"use client";

import { Check, Crown, Zap } from "lucide-react";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import type { PricingPlan } from "@/types";

interface PricingCardProps {
  plan: PricingPlan;
  highlighted?: boolean;
  onSelect: () => void;
  loading?: boolean;
}

export function PricingCard({ plan, highlighted, onSelect, loading }: PricingCardProps) {
  const Icon = highlighted ? Crown : Zap;

  return (
    <div
      className={`glass-card relative flex flex-col p-6 transition-all ${
        highlighted ? "ring-2 ring-gold shadow-premium" : ""
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-xs font-medium text-accent-foreground">
          Most Popular
        </span>
      )}

      <div className="mb-4 flex items-center gap-2">
        <div className={`rounded-lg p-2 ${highlighted ? "bg-gold/20" : "bg-muted"}`}>
          <Icon className={`h-5 w-5 ${highlighted ? "text-gold" : "text-muted-foreground"}`} />
        </div>
        <h3 className="font-serif text-xl">{plan.name}</h3>
      </div>

      <div className="mb-6">
        <span className="font-serif text-4xl">
          {CURRENCY_SYMBOL}{plan.price}
        </span>
        <span className="text-muted-foreground">/month</span>
      </div>

      <ul className="mb-6 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={loading}
        className={highlighted ? "btn-primary w-full" : "btn-secondary w-full"}
      >
        {loading ? "Processing..." : `Upgrade to ${plan.name}`}
      </button>
    </div>
  );
}
