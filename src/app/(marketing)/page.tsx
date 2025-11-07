// src/app/(public)/page.tsx
import Link from "next/link";
import WaitlistForm from "./waitlist-form";

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Promptly
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#why" className="text-slate-600 hover:text-slate-900 transition">Why Promptly</Link>
            <Link href="#who" className="text-slate-600 hover:text-slate-900 transition">Who it’s for</Link>
            <Link href="#how" className="text-slate-600 hover:text-slate-900 transition">How it works</Link>
            <a href="mailto:hello@getpromptly.org" className="text-slate-600 hover:text-slate-900 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative flex flex-col items-center justify-center text-center px-4 py-28 md:py-40 bg-gradient-to-b from-blue-50 via-white to-white"
      >
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs text-blue-700 mb-4">
            Early Access • Join the waitlist
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Write & optimize your emails in minutes.
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Promptly uses AI to write, test, and schedule your campaigns — and gets smarter with every send.
          </p>

          {/* Waitlist form directly below header */}
          <div className="mt-8 w-full max-w-lg mx-auto">
            <WaitlistForm />
            <p className="mt-2 text-xs text-slate-500">No spam — just launch updates.</p>
          </div>
        </div>
      </section>

      {/* WHY PROMPTLY */}
      <section id="why" className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">Why Promptly?</h2>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
            Most tools stop at “generate.” Promptly closes the loop — it <strong>writes</strong>, <strong>sends</strong>,
            <strong> tracks</strong>, and <strong>learns</strong> from your results to improve the next email automatically.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3 text-left">
            {[
              {
                title: "Beyond copy generation",
                desc: "Create on-brand campaigns from a simple brief — subject, body, CTA, and structure in seconds."
              },
              {
                title: "Built-in sending & scheduling",
                desc: "Send immediately or schedule; stay consistent without juggling multiple tools."
              },
              {
                title: "Analytics that train the AI",
                desc: "Opens, clicks, and conversions feed back into Promptly so each send gets smarter."
              }
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="font-semibold text-lg">{title}</div>
                <p className="mt-2 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS PROMPTLY FOR */}
      <section id="who" className="bg-slate-50 border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">Who Promptly is for</h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            Founders, creators, and lean teams who want better emails without hiring a copywriter or spending hours writing.
            Whether you sell products, software, or content — Promptly helps you grow with consistent, data-driven emails.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-700">
            {[
              "🛍️ eCommerce stores",
              "⚙️ SaaS & startups",
              "🧠 Creators & coaches",
              "🏪 Local businesses",
              "📚 Info products & courses",
              "✉️ Freelancers & agencies"
            ].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <h2 className="text-3xl md:text-4xl font-semibold text-center">How Promptly works</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Generate",
                desc: "Describe your offer, audience, and goal. Promptly drafts subject lines, body copy, and CTAs in your voice."
              },
              {
                step: "2",
                title: "Send",
                desc: "Schedule or send immediately. Stay consistent with built-in sending — no tool switching."
              },
              {
                step: "3",
                title: "Learn",
                desc: "Opens, clicks, and conversions are analyzed. Promptly adapts tone, structure, and timing to improve the next send."
              }
            ].map(({ step, title, desc }) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm text-slate-500">Step {step}</div>
                <div className="mt-1 font-semibold text-lg">{title}</div>
                <p className="mt-2 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-slate-600">
            <p>
              The more you send, the smarter it gets — recommendations for subjects, CTAs, and best send times come from your own performance data.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section id="cta" className="bg-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">
            Still reading? You’re probably interested.
          </h3>
          <p className="mt-3 text-blue-100">
            Enter your email to join the waitlist — early access opens soon.
          </p>
          <div className="mt-8 w-full max-w-lg mx-auto">
            <WaitlistForm />
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
