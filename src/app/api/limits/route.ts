// src/app/api/limits/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { remainingGensForToday } from "@/lib/limits";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { plan: true, genCount: true, genPeriodStart: true },
    });

    if (!profile) {
      return NextResponse.json(
        { plan: "free", left: 2 },
        { status: 200 }
      );
    }

    const left = remainingGensForToday({
      plan: profile.plan,
      genCount: profile.genCount,
      genPeriodStart: profile.genPeriodStart,
    });

    return NextResponse.json(
      {
        plan: profile.plan,
        left: left === Infinity ? -1 : left, // -1 means "Unlimited" for Pro
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/limits error", err);
    return NextResponse.json(
      { error: "Failed to fetch limits" },
      { status: 500 }
    );
  }
}