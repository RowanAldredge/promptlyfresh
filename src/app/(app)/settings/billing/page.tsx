"use client";

import { useState } from "react";

export default function BillingSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openBillingPortal() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to open billing");
      window.location.href = data.url; // redirect to Stripe portal
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium">Billing</h1>

      <div className="rounded border bg-white p-4">
        <div className="mb-2 text-sm text-neutral-600">Your current plan</div>
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
          <span className="font-medium capitalize">Free</span>
        </div>
      </div>

      <button
        onClick={openBillingPortal}
        disabled={loading}
        className={`rounded px-4 py-2 text-sm text-white ${
          loading ? "bg-neutral-400" : "bg-black hover:bg-neutral-800"
        }`}
      >
        {loading ? "Opening Stripe..." : "Manage Billing in Stripe"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="rounded border bg-white p-4 text-sm text-neutral-600">
        <p>
          Use the Stripe Customer Portal to update payment methods, download
          invoices, or cancel your subscription.
        </p>
      </div>
    </div>
  );
}
