import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { emailId, subject, body, status } = await req.json() as {
      emailId?: string;
      subject: string;
      body: string;
      status?: "draft" | "sent" | "scheduled";
    };

    if (!subject || !body) {
      return NextResponse.json({ error: "Missing subject/body" }, { status: 400 });
    }

    let email;
    if (emailId) {
      email = await prisma.email.update({
        where: { id: emailId },
        data: { subject, body, status: status ?? "draft" },
      });
    } else {
      email = await prisma.email.create({
        data: { userId, subject, body, status: "draft" },
      });
    }

    return NextResponse.json({ emailId: email.id });
  } catch (err: any) {
    console.error("/api/emails error", err);
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
  }
}
