"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    try {
      setLoading(true);
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create checkout session");
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // Stripe Checkout redirect
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      alert(err.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-center text-3xl font-semibold">Pricing</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded border bg-white p-6 text-center">
          <h2 className="mb-2 text-xl font-medium">Free</h2>
          <p className="mb-4 text-sm text-neutral-600">
            2 AI generations per day, test sends only.
          </p>
          <p className="mb-6 text-2xl font-bold">$0</p>
          <Link href="/dashboard" className="inline-block rounded border px-4 py-2 text-sm">
            Start Free
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="rounded border bg-white p-6 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-medium">Pro</h2>
          <p className="mb-4 text-sm text-neutral-600">
            Unlimited generations and live sending.
          </p>
          <p className="mb-6 text-2xl font-bold">$49/mo</p>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className={`rounded bg-black px-4 py-2 text-sm text-white ${loading ? "opacity-70" : ""}`}
          >
            {loading ? "Redirecting..." : "Upgrade to Pro"}
          </button>
        </div>
      </div>
    </div>
  );
}
