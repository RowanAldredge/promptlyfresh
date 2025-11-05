// src/app/api/waitlist/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Body = {
  email?: string;
  hp?: string; // honeypot field
};

function normalizeEmail(e: string) {
  return e.trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const { email = "", hp = "" } = (await req.json()) as Body;

    // Honeypot: if bots fill this, bail
    if (hp) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const e = normalizeEmail(email);

    // Basic email validation
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Upsert: if already present, no-op; otherwise create
    await prisma.waitlist.upsert({
      where: { email: e },
      update: {},            // do nothing if exists
      create: { email: e },  // create if new
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("waitlist POST error", err);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
