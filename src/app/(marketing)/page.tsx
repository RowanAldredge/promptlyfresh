// src/app/(public)/page.tsx
import Link from "next/link";
import WaitlistForm from "./waitlist-form";

export const dynamic = "force-static"; // safe for landing page

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Promptly</div>
          <div className="flex gap-4 text-sm">
            <Link href="#features" className="hover:underline">Features</Link>
            <Link href="#pricing" className="hover:underline">Pricing</Link>
            <a href="mailto:hello@getpromptly.org" className="hover:underline">Contact</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              AI-native email marketing that writes, sends, and learns.
            </h1>
            <p className="mt-4 text-neutral-700">
              Compose high-performing campaigns in minutes. Built for creators and stores who want results without the busywork.
            </p>

            {/* Client-side waitlist form */}
            <WaitlistForm />

            <p className="mt-3 text-xs text-neutral-500">
              No spam. We’ll email you once at launch and major updates.
            </p>
          </div>

          {/* Placeholder visual box */}
          <div className="rounded-2xl border bg-neutral-50 h-64 md:h-80 flex items-center justify-center">
            <span className="text-neutral-400 text-sm">Preview area (drop screenshot later)</span>
          </div>
        </div>
      </section>

      {/* Features (skeleton) */}
      <section id="features" className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-12 grid gap-6 md:grid-cols-3">
          {[
            ["Write", "Generate on-brand emails from simple prompts."],
            ["Send", "One-click sending, scheduling, and automation basics."],
            ["Learn", "See opens, clicks, and get AI suggestions to improve."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded border bg-white p-4">
              <div className="font-medium">{title}</div>
              <div className="mt-2 text-sm text-neutral-700">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing CTA (skeleton) */}
      <section id="pricing" className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-xl font-semibold">Founding members</h2>
          <p className="mt-2 text-neutral-700">
            Early adopters get a lifetime discount and priority support.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded border px-3 py-1 text-sm">Starter – $50/mo</span>
            <span className="rounded border px-3 py-1 text-sm">Pro – $100/mo</span>
            <span className="rounded border px-3 py-1 text-sm">Growth – $150/mo</span>
            <span className="rounded border px-3 py-1 text-sm">Lifetime – $200 one-time</span>
          </div>
          <p className="mt-4 text-sm">
            Not ready?{" "}
            <Link href="#top" className="underline">
              Join the waitlist above
            </Link>{" "}
            and we’ll let you know when we launch.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-neutral-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Promptly</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
