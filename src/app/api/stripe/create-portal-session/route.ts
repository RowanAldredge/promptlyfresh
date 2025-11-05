// src/app/api/stripe/create-portal-session/route.ts
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress;

    if (!email) return NextResponse.json({ error: "No email on account" }, { status: 400 });

    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer =
      existing.data[0] ??
      (await stripe.customers.create({ email, name: user?.fullName || undefined, metadata: { userId } }));

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/settings/billing`;

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("create-portal-session error:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to create portal session" }, { status: 500 });
  }
}
