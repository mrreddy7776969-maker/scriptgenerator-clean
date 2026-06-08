import { NextResponse } from "next/server";
import { getPricing } from "@/lib/pricing-store";

export async function GET() {
  return NextResponse.json(getPricing());
}
