import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getUserPlan } from "@/lib/plan";
import { sendEmail } from "@/lib/emailProvider";
import { withTracking } from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // helpful in dev to avoid caching

type Body = {
  emailId: string;
  mode: "test" | "live";
  testRecipient?: string;
  recipients?: string[];      // live recipients
  subjectOverride?: string;
  scheduleAt?: string | null; // ISO datetime, optional
  utm?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    // ✅ Clerk auth tied to THIS request (fixes 401/Unauthorized in dev)
    const { userId, sessionId } = getAuth(req);
    if (!userId) {
      console.warn("[/api/send] 401 – no userId", { sessionId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const {
      emailId,
      mode,
      testRecipient,
      recipients = [],
      subjectOverride,
      scheduleAt,
      utm,
    } = body;

    if (!emailId) return NextResponse.json({ error: "Missing emailId" }, { status: 400 });

    const email = await prisma.email.findFirst({
      where: { id: emailId, userId },
      select: { id: true, subject: true, body: true },
    });
    if (!email) return NextResponse.json({ error: "Email not found" }, { status: 404 });

    const plan = await getUserPlan(userId);
    const from =
      process.env.MAIL_FROM ||
      process.env.MAILGUN_FROM ||
      "Promptly <no-reply@example.com>";

    const subject = (subjectOverride || email.subject || "(no subject)").trim();
    const baseHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.6;">
        ${email.body.replace(/\n/g, "<br/>")}
      </div>
    `;

    const isScheduled =
      !!scheduleAt &&
      !Number.isNaN(Date.parse(scheduleAt)) &&
      new Date(scheduleAt).getTime() > Date.now();

    // =========================
    // LIVE
    // =========================
    if (mode === "live") {
      if (plan !== "pro") {
        return NextResponse.json({ error: "upgrade_required" }, { status: 402 });
      }

      if (isScheduled) {
        const delivery = await prisma.delivery.create({
          data: {
            emailId: email.id,
            userId,
            status: "scheduled",
            scheduledAt: new Date(scheduleAt!),
            recipientCount: recipients.length,
          },
        });
        return NextResponse.json({ ok: true, deliveryId: delivery.id, status: "scheduled" });
      }

      if (!recipients.length) {
        return NextResponse.json({ error: "Missing recipients" }, { status: 400 });
      }

      // Create delivery first so we can inject tracking using its id
      const delivery = await prisma.delivery.create({
        data: {
          emailId: email.id,
          userId,
          status: "sent", // sending immediately
          sentAt: new Date(),
          recipientCount: recipients.length,
        },
      });

      // Add tracking (links + pixel) using the deliveryId
      const trackedHtml = withTracking(baseHtml, delivery.id);

      const result = await sendEmail({ to: recipients, subject, html: trackedHtml, from });

      if ((result as any).error) {
        // cleanup to avoid a dangling "sent" row
        await prisma.delivery.delete({ where: { id: delivery.id } }).catch(() => {});
        return NextResponse.json({ error: (result as any).error }, { status: 502 });
      }

      // persist provider message id
      await prisma.delivery.update({
        where: { id: delivery.id },
        data: { providerMessageId: (result as any).messageId ?? null },
      });

      // mark email as sent
      await prisma.email.update({ where: { id: email.id }, data: { status: "sent" } });

      return NextResponse.json({
        ok: true,
        provider: (result as any).provider,
        messageId: (result as any).messageId,
        deliveryId: delivery.id,
        status: "sent",
      });
    }

    // =========================
    // TEST
    // =========================
    if (!testRecipient || !testRecipient.includes("@")) {
      return NextResponse.json({ error: "Missing valid testRecipient" }, { status: 400 });
    }

    if (isScheduled) {
      const delivery = await prisma.delivery.create({
        data: {
          emailId: email.id,
          userId,
          status: "scheduled",
          scheduledAt: new Date(scheduleAt!),
          recipientCount: 1,
        },
      });
      return NextResponse.json({ ok: true, deliveryId: delivery.id, status: "scheduled_test" });
    }

    // Create a delivery row for the test so we can track opens/clicks on tests too (optional)
    const testDelivery = await prisma.delivery.create({
      data: {
        emailId: email.id,
        userId,
        status: "sent",
        sentAt: new Date(),
        recipientCount: 1,
      },
    });

    const trackedTestHtml = withTracking(baseHtml, testDelivery.id);

    const testResult = await sendEmail({
      to: [testRecipient],
      subject: `[TEST] ${subject}`,
      html: trackedTestHtml,
      from,
    });

    if ((testResult as any).error) {
      await prisma.delivery.delete({ where: { id: testDelivery.id } }).catch(() => {});
      return NextResponse.json({ error: (testResult as any).error }, { status: 502 });
    }

    await prisma.delivery.update({
      where: { id: testDelivery.id },
      data: { providerMessageId: (testResult as any).messageId ?? null },
    });

    return NextResponse.json({
      ok: true,
      provider: (testResult as any).provider,
      messageId: (testResult as any).messageId,
      deliveryId: testDelivery.id,
      status: "sent_test",
    });
  } catch (err: any) {
    console.error("/api/send error", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
