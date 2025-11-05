import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getUserPlan } from "@/lib/plan";
import { LIMITS } from "@/lib/limits";

// helpful in dev to avoid caching
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // ✅ Clerk auth bound to this request (avoids intermittent 401s)
    const { userId, sessionId } = getAuth(req);
    if (!userId) {
      console.warn("[/api/generate] 401 – no userId", { sessionId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await getUserPlan(userId);

    // Start-of-today boundary
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ensure profile exists
    let profile = await prisma.profile.upsert({
      where: { userId },
      update: {},
      create: { userId, plan, genCount: 0, genPeriodStart: today },
    });

    // Reset daily counter when the day rolls over
    if (!profile.genPeriodStart || profile.genPeriodStart < today) {
      profile = await prisma.profile.update({
        where: { userId },
        data: { genCount: 0, genPeriodStart: today },
      });
    }

    // Enforce caps
    const cap =
      plan === "pro" ? LIMITS.pro.dailyGenerations : LIMITS.free.dailyGenerations;

    if (profile.genCount >= cap) {
      return NextResponse.json({ error: "limit_reached" }, { status: 429 });
    }

    // Parse prompt fields (same shape you already use)
    const payload = await req.json();

    // ===== MOCK GENERATION (swap to OpenAI later) =====
    const subject = `(friendly) ${payload.business || "your product"} for ${payload.audience || "your audience"}`;
    const body = `Hi {{first_name}},

Here’s a quick update about ${payload.product || "our product"} for ${
      payload.audience || "your audience"
    }.

• Key benefit #1
• Key benefit #2
• Next step: ${payload.cta || "Learn more"}

Best,
${payload.business || "Promptly"}`;
    const source = process.env.OPENAI_API_KEY ? "openai" : "mock";
    // ===== END MOCK =====

    // Increment daily count AFTER successful generation
    const updated = await prisma.profile.update({
      where: { userId },
      data: { genCount: { increment: 1 } },
    });

    const remaining = Math.max(0, cap === Infinity ? Infinity : cap - updated.genCount);

    return NextResponse.json({ subject, body, source, remaining });
  } catch (err: any) {
    console.error("/api/generate error", err);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
