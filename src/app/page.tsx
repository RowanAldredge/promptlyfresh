// src/app/(public)/page.tsx
import Link from "next/link";
import WaitlistForm from "./(marketing)/waitlist-form";

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
            <Link href="#why" className="text-slate-600 hover:text-slate-900 transition">Why</Link>
            <Link href="#who" className="text-slate-600 hover:text-slate-900 transition">Who</Link>
            <Link href="#how" className="text-slate-600 hover:text-slate-900 transition">How</Link>
            <a href="mailto:hello@getpromptly.org" className="text-slate-600 hover:text-slate-900 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO (centered, primary CTA) */}
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
            Promptly drafts, sends, and learns from every campaign — so each email performs better than the last.
          </p>
          <div className="mt-8 w-full max-w-lg mx-auto">
            <WaitlistForm />
            <p className="mt-2 text-xs text-slate-500">No spam — just launch updates.</p>
          </div>
        </div>
      </section>

      {/* WHY PROMPTLY (split grid: left label, right horizontal blocks) */}
      <section id="why" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-12 md:grid-cols-[220px,1fr]">
          {/* Left rail / eyebrow */}
          <aside className="md:pt-2">
            <div className="text-xs uppercase tracking-widest text-blue-700">Why Promptly</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold leading-snug">
              Not just “AI that writes.” <br className="hidden md:block" />
              AI that **closes the loop**.
            </h2>
          </aside>

          {/* Right content: three horizontal “reasons” */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                k: "Generate",
                d: "On-brand subjects, body copy, and CTAs from a simple brief — in seconds.",
              },
              {
                k: "Send",
                d: "Schedule or send now. Stay consistent without juggling multiple tools.",
              },
              {
                k: "Learn",
                d: "Opens, clicks, and conversions train Promptly to write & time the next send better.",
              },
            ].map(({ k, d }) => (
              <div key={k} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-xs font-semibold tracking-wide text-slate-500">{k}</div>
                <p className="mt-2 text-slate-800 font-medium">{k === "Learn" ? "Analytics-trained writing" : `Built-in ${k.toLowerCase()}`}</p>
                <p className="mt-2 text-slate-600 text-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR (split grid: left copy, right pill matrix; reads left→right) */}
      <section id="who" className="bg-slate-50 border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-12 md:grid-cols-[220px,1fr]">
          <aside className="md:pt-2">
            <div className="text-xs uppercase tracking-widest text-blue-700">Who it’s for</div>
            <h3 className="mt-2 text-2xl md:text-3xl font-semibold leading-snug">
              From idea-stage to growth-stage.
            </h3>
            <p className="mt-3 text-slate-600">
              If you need consistent, better-performing emails without hiring a copywriter,
              Promptly is built for you.
            </p>
          </aside>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "🛍️ eCommerce stores",
              "⚙️ SaaS & startups",
              "🧠 Creators & coaches",
              "🏪 Local businesses",
              "📚 Courses & info products",
              "✉️ Freelancers & agencies",
            ].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (horizontal stepper with separators) */}
      <section id="how" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-blue-700">How it works</div>
            <h4 className="mt-2 text-2xl md:text-3xl font-semibold">Left-to-right: generate → send → learn</h4>
          </div>

          {/* Stepper row */}
          <div className="mt-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8">
            {[
              {
                n: "1",
                t: "Generate",
                p: "Describe your offer, audience, and goal. Promptly drafts your email in your brand’s voice.",
              },
              {
                n: "2",
                t: "Send",
                p: "Schedule or ship now — with built-in sending so you never lose momentum.",
              },
              {
                n: "3",
                t: "Learn",
                p: "Opens, clicks, and conversions inform the next draft’s subject, structure, and timing.",
              },
            ].map(({ n, t, p }, idx, arr) => (
              <div key={t} className="flex-1">
                <div className="flex items-start md:items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                    {n}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{t}</div>
                    <p className="mt-1 text-slate-600 text-sm">{p}</p>
                  </div>
                </div>

                {/* connector line for desktop */}
                {idx < arr.length - 1 && (
                  <div className="hidden md:block mt-4 ml-[1.125rem] h-[2px] bg-slate-200" />
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-slate-600">
            The more you send, the smarter it gets — subjects, CTAs, and send-times adapt to your results.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA (secondary capture) */}
      <section id="cta" className="bg-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-[1fr,520px] items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-blue-100">Join the waitlist</div>
              <h5 className="mt-2 text-2xl md:text-3xl font-semibold">
                Still reading? You’re probably interested.
              </h5>
              <p className="mt-2 text-blue-100">
                Drop your email and be first when Promptly opens early access.
              </p>
            </div>
            <div className="w-full max-w-lg md:justify-self-end">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
