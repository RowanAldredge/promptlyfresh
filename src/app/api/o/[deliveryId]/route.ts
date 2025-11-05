// src/app/api/o/[deliveryId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Pre-encoded 1×1 transparent GIF
const ONE_BY_ONE_GIF = Uint8Array.from([
  71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0, 255, 255, 255, 33, 249, 4, 1, 0, 0, 1, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59,
]);

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ deliveryId: string }> } // 👈 params is a Promise in Next 15
) {
  const { deliveryId } = await ctx.params; // 👈 await the params

  // Fire-and-forget: record an OPEN (don’t crash the request if DB fails)
  prisma.event
    .create({
      data: {
        deliveryId,
        type: "OPEN",
      },
    })
    .catch(() => {});

  return new NextResponse(ONE_BY_ONE_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, must-revalidate, max-age=0",
    },
  });
}
