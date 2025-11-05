// src/app/api/r/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const deliveryId = url.searchParams.get("d");
  const target = url.searchParams.get("u");

  if (!deliveryId || !target) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  // Log click (fire-and-forget)
  prisma.event
    .create({
      data: {
        deliveryId,
        type: "CLICK",
        url: target,
      },
    })
    .catch(() => {});

  // Redirect to the original destination
  return NextResponse.redirect(target, { status: 302 });
}
