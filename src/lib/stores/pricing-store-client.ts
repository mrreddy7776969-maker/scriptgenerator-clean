"use client";

import { create } from "zustand";
import type { PricingConfig } from "@/types";
import { getLocalPricing, saveLocalPricing } from "@/lib/storage";

interface PricingState {
  pricing: PricingConfig | null;
  loading: boolean;
  fetchPricing: () => Promise<void>;
  updatePricing: (config: PricingConfig) => Promise<void>;
}

export const usePricingStore = create<PricingState>((set) => ({
  pricing: null,
  loading: true,

  fetchPricing: async () => {
    set({ loading: true });
    try {
      const local = getLocalPricing();
      const res = await fetch("/api/pricing");
      const server = (await res.json()) as PricingConfig;
      const merged = local
        ? { ...server, ...local, pro: { ...server.pro, ...local.pro }, proPlus: { ...server.proPlus, ...local.proPlus } }
        : server;
      set({ pricing: merged, loading: false });
    } catch {
      const local = getLocalPricing();
      set({ pricing: local, loading: false });
    }
  },

  updatePricing: async (config: PricingConfig) => {
    saveLocalPricing(config);
    set({ pricing: config });
    try {
      await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
    } catch {
      // localStorage fallback is sufficient for MVP
    }
  },
}));
