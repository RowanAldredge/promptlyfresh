import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ← no apiVersion

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await req.text(); // must be raw text for signature verification
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          (session.metadata?.userId as string | undefined) ||
          (session.client_reference_id as string | undefined) ||
          "";
        if (!userId) break;

        await prisma.profile.upsert({
          where: { userId },
          update: { plan: "pro" },
          create: { userId, plan: "pro" },
        });
        console.log(`✅ Upgraded user ${userId} to Pro`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = (sub.metadata?.userId as string | undefined) || "";
        if (!userId) break;

        await prisma.profile.updateMany({ where: { userId }, data: { plan: "free" } });
        console.log(`🔻 Downgraded user ${userId} to Free (deleted)`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.status === "canceled") {
          const userId = (sub.metadata?.userId as string | undefined) || "";
          if (userId) {
            await prisma.profile.updateMany({ where: { userId }, data: { plan: "free" } });
            console.log(`🔻 Downgraded user ${userId} to Free (status=canceled)`);
          }
        }
        break;
      }

      default:
        console.log(`➡️  Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("💥 Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
