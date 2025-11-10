// src/app/(app)/settings/account/page.tsx
import Link from "next/link";

export default function AccountSettings() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
          <p className="mt-2 text-text-muted text-sm">
            Manage your Promptly profile and connected integrations.
          </p>
        </div>

        {/* Section: Profile */}
        <section className="rounded-3xl border border-borderc bg-white p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-lg">Profile</h2>
              <p className="text-sm text-text-muted">
                Your Clerk account handles sign-in, password, and identity.
              </p>
            </div>
            <Link
              href="https://dashboard.clerk.com"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-2 text-sm shadow-sm hover:opacity-90 transition"
            >
              Manage in Clerk
              <span aria-hidden>↗</span>
            </Link>
          </div>

          <div className="text-sm text-text-muted leading-relaxed">
            Promptly uses Clerk for secure authentication. To change your email, password, or
            connected accounts, visit your Clerk profile dashboard.
          </div>
        </section>

        {/* Section: Billing */}
        <section className="rounded-3xl border border-borderc bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-lg">Billing</h2>
              <p className="text-sm text-text-muted">
                View or update your plan, invoices, and payment method.
              </p>
            </div>
            <Link
              href="/settings/billing"
              className="inline-flex items-center gap-2 rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface transition"
            >
              Open billing
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="text-sm text-text-muted leading-relaxed">
            You can manage your subscription and view past invoices in the Billing section.
            Upgrading unlocks unlimited generations and deeper analytics.
          </div>
        </section>

        {/* Subtle footer hint */}
        <p className="mt-10 text-xs text-center text-text-muted">
          Need help?{" "}
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
