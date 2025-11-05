import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ← no apiVersion

export async function POST() {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = (sessionClaims as any)?.email as string | undefined;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Promptly Pro Plan" },
            unit_amount: 4900,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/pricing`,
      client_reference_id: userId,
      metadata: { userId },
      customer_email: email,
      subscription_data: {
        metadata: { userId },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to create checkout session" }, { status: 500 });
  }
}