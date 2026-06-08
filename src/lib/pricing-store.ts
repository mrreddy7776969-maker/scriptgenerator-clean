import type { PricingConfig } from "@/types";

const DEFAULT_PRICING: PricingConfig = {
  pro: {
    name: "Pro",
    price: 50,
    currency: "INR",
    features: [
      "Unlimited script generation",
      "PDF & TXT export",
      "Full scene timeline viewer",
      "Priority generation queue",
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  proPlus: {
    name: "Pro Plus",
    price: 150,
    currency: "INR",
    features: [
      "Everything in Pro",
      "Advanced editor notes",
      "Script history & favorites",
      "Early access to new features",
      "Premium support",
    ],
    stripePriceId: process.env.STRIPE_PRO_PLUS_PRICE_ID,
  },
  updatedAt: new Date().toISOString(),
};

let pricingConfig: PricingConfig = {
  ...DEFAULT_PRICING,
  pro: {
    ...DEFAULT_PRICING.pro,
    price: Number(process.env.PRO_PRICE) || DEFAULT_PRICING.pro.price,
  },
  proPlus: {
    ...DEFAULT_PRICING.proPlus,
    price: Number(process.env.PRO_PLUS_PRICE) || DEFAULT_PRICING.proPlus.price,
  },
};

export function getPricing(): PricingConfig {
  return pricingConfig;
}

export function setPricing(config: Partial<PricingConfig>): PricingConfig {
  pricingConfig = {
    ...pricingConfig,
    ...config,
    pro: { ...pricingConfig.pro, ...config.pro },
    proPlus: { ...pricingConfig.proPlus, ...config.proPlus },
    updatedAt: new Date().toISOString(),
  };
  return pricingConfig;
}

export function getDefaultPricing(): PricingConfig {
  return DEFAULT_PRICING;
}
