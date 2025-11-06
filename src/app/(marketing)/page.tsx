// src/app/(public)/page.tsx
import Link from "next/link";
import WaitlistForm from "./waitlist-form";

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Promptly
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="text-slate-600 hover:text-slate-900 transition">Features</Link>
            <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition">Pricing</Link>
            <a href="mailto:hello@getpromptly.org" className="text-slate-600 hover:text-slate-900 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 relative">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs text-blue-700">
                Early Access • Join the waitlist
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Write & optimize your emails in minutes.
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Promptly uses AI to draft, improve, and schedule your campaigns —
                so you spend less time staring at a blank page and more time building.
              </p>

              {/* Inline waitlist form */}
              <div className="mt-8 w-full max-w-lg">
                <WaitlistForm />
                <p className="mt-2 text-xs text-slate-500">
                  No spam. We’ll only email you about the launch and major updates.
                </p>
              </div>
            </div>

            {/* Visual placeholder (no MVP UI yet) */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
                <div className="h-56 md:h-72 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 grid place-items-center">
                  <span className="text-slate-400 text-sm">
                    Product preview coming soon
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-lg bg-slate-50 border border-slate-200"
                    />
                  ))}
                </div>
              </div>
              <div
                aria-hidden
                className="absolute -z-10 -top-8 -right-8 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Built for founders using
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-600 opacity-80">
            <span>Shopify</span>
            <span>Gumroad</span>
            <span>Webflow</span>
            <span>Framer</span>
          </div>
        </div>
      </section>

      {/* PROBLEM → PROMISE */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Writing marketing emails shouldn’t feel like homework.
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
            Most founders waste hours figuring out what to say. Promptly writes,
            optimizes, and schedules your emails — in your brand’s voice — and
            learns from every send to improve results over time.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">
            What you’ll soon do with Promptly
          </h3>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Generate on-brand emails",
                desc: "Describe your product and get a send-ready campaign in seconds.",
                icon: "✉️",
              },
              {
                title: "Improve automatically",
                desc: "See which subjects and CTAs drive opens and clicks — recommendations included.",
                icon: "📈",
              },
              {
                title: "Send smarter",
                desc: "Schedule, automate, and stay consistent without heavyweight tools.",
                icon: "⚙️",
              },
            ].map(({ title, desc, icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <div className="font-semibold text-lg">{title}</div>
                <p className="mt-2 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / FOUNDING MEMBERS */}
      <section id="pricing" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h3 className="text-2xl md:text-3xl font-semibold">Founding members</h3>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Early adopters get a lifetime discount and priority support when we launch.
            Join the waitlist now to be notified first.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm">
              Starter — $50/mo
            </span>
            <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm">
              Pro — $100/mo
            </span>
            <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm">
              Growth — $150/mo
            </span>
            <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm">
              Lifetime — $200 one-time
            </span>
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 max-w-lg">
            <WaitlistForm />
            <p className="mt-2 text-xs text-slate-500">
              Be among the first to get access.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Promptly</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
