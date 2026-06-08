"use client";

import { Shield, Users, DollarSign } from "lucide-react";
import { PricingEditor } from "@/components/admin/pricing-editor";
import { ADMIN_EMAIL, FREE_SCRIPT_LIMIT } from "@/lib/constants";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
          <Shield className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="font-serif text-3xl">Admin Settings</h1>
          <p className="text-muted-foreground">Manage pricing and application settings</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-card p-5">
          <Users className="h-5 w-5 text-gold mb-2" />
          <p className="text-sm text-muted-foreground">Admin Email</p>
          <p className="font-medium text-sm">{ADMIN_EMAIL}</p>
        </div>
        <div className="glass-card p-5">
          <DollarSign className="h-5 w-5 text-gold mb-2" />
          <p className="text-sm text-muted-foreground">Free Tier Limit</p>
          <p className="font-medium">{FREE_SCRIPT_LIMIT} scripts per user</p>
        </div>
      </div>

      <PricingEditor />

      <div className="glass-card p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-2">Admin Notes</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Pricing changes apply instantly to Billing page and paywall modals.</li>
          <li>For persistent global pricing across server restarts, set PRO_PRICE and PRO_PLUS_PRICE in Vercel env vars.</li>
          <li>Stripe Price IDs can be set via STRIPE_PRO_PRICE_ID and STRIPE_PRO_PLUS_PRICE_ID env vars.</li>
        </ul>
      </div>
    </div>
  );
}
