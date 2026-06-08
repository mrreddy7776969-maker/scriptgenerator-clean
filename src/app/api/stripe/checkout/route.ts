import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { getPricing } from "@/lib/pricing-store";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment variables." },
      { status: 503 }
    );
  }

  const { plan } = (await req.json()) as { plan: "pro" | "proPlus" };
  const pricing = getPricing();
  const selected = plan === "proPlus" ? pricing.proPlus : pricing.pro;

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    // Use pre-created Stripe Price ID if available, otherwise create ad-hoc price
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = selected.stripePriceId
      ? [{ price: selected.stripePriceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `PlotLine ${selected.name}`,
                description: `PlotLine ${selected.name} subscription`,
              },
              unit_amount: selected.price * 100,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ];

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: lineItems,
      success_url: `${origin}/billing?success=true`,
      cancel_url: `${origin}/billing?canceled=true`,
      metadata: {
        plan,
        userEmail: session.user.email,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
