import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateScript, formatLlmError } from "@/lib/llm";
import { enforceCooldown } from "@/lib/llm/cooldown";
import { FREE_SCRIPT_LIMIT } from "@/lib/constants";
import type { GenerateRequest } from "@/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.isAdmin ?? false;

  // Usage is tracked client-side in localStorage; server validates via header
  const scriptsUsed = Number(req.headers.get("x-scripts-used") || "0");
  const isSubscribed = req.headers.get("x-is-subscribed") === "true";

  if (!isAdmin && !isSubscribed && scriptsUsed >= FREE_SCRIPT_LIMIT) {
    return NextResponse.json(
      { error: "Free limit reached", paywall: true },
      { status: 403 }
    );
  }

  const body = (await req.json()) as GenerateRequest;
  if (!body.theme || !body.setting || !body.characterCount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!isAdmin) {
    try {
      enforceCooldown(session.user.email);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Too many requests";
      return NextResponse.json({ error: message }, { status: 429 });
    }
  }

  try {
    const script = await generateScript(body);
    const remaining = isAdmin || isSubscribed
      ? null
      : Math.max(0, FREE_SCRIPT_LIMIT - scriptsUsed - 1);

    return NextResponse.json({ script, remaining });
  } catch (err) {
    const message = formatLlmError(err);
    const status = message.includes("busy") || message.includes("wait") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
