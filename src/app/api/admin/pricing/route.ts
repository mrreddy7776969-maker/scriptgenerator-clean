import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { setPricing } from "@/lib/pricing-store";
import type { PricingConfig } from "@/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await req.json()) as PricingConfig;
  const updated = setPricing(body);
  return NextResponse.json(updated);
}
