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
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
          <p className="mt-2 text-text-muted text-sm">
            Manage your Promptly subscription and invoices.
          </p>
        </div>

        {/* Current plan section */}
        <section className="rounded-3xl border border-borderc bg-surface p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-lg mb-2">Your current plan</h2>

          <div className="inline-flex items-center gap-2 rounded-full border border-borderc bg-background px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="font-medium capitalize">Free</span>
          </div>

          <p className="mt-3 text-sm text-text-muted leading-relaxed">
            Upgrade anytime to unlock unlimited generations, advanced analytics,
            and AI-driven send-time optimization.
          </p>

          <button
            onClick={openBillingPortal}
            disabled={loading}
            className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition
              ${
                loading
                  ? "bg-borderc cursor-not-allowed"
                  : "bg-gradient-to-r from-brand-600 to-accent hover:opacity-90"
              }`}
          >
            {loading ? "Opening Stripe..." : "Manage Billing in Stripe"}
            {!loading && <span aria-hidden>↗</span>}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </section>

        {/* Info card */}
        <section className="rounded-3xl border border-borderc bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Stripe Customer Portal</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            You can use the Stripe portal to update payment methods, view or
            download invoices, switch plans, or cancel your subscription. All
            billing changes are handled securely through Stripe.
          </p>
        </section>

        {/* Support hint */}
        <p className="mt-10 text-xs text-center text-text-muted">
          Need help with billing?{" "}
          <a
            href="mailto:hello@getpromptly.org"
            className="underline hover:text-brand-600"
          >
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}
