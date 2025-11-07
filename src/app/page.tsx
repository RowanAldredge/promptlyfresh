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
            Promptly drafts, sends, and learns from every campaign — so each email performs better than the last.
          </p>
          <div className="mt-8 w-full max-w-lg mx-auto">
            <WaitlistForm />
            <p className="mt-2 text-xs text-slate-500">No spam — just launch updates.</p>
          </div>
        </div>
      </section>

      {/* WHY PROMPTLY (keep horizontal) */}
      <section id="why" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-12 md:grid-cols-[220px,1fr]">
          {/* Left rail */}
          <aside className="md:pt-2">
            <div className="text-xs uppercase tracking-widest text-blue-700">Why Promptly</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold leading-snug">
              Not just “AI that writes.” <br className="hidden md:block" />
              AI that <span className="underline decoration-blue-200">closes the loop</span>.
            </h2>
          </aside>

          {/* Right content */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                k: "Generate",
                h: "On-brand in seconds",
                d: "Subjects, body, and CTAs from a simple brief — in your voice.",
              },
              {
                k: "Send",
                h: "Built-in delivery",
                d: "Schedule or ship now. Stay consistent without juggling tools.",
              },
              {
                k: "Learn",
                h: "Analytics-trained",
                d: "Opens, clicks, and conversions inform the next draft automatically.",
              },
            ].map(({ k, h, d }) => (
              <div key={k} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-xs font-semibold tracking-wide text-slate-500">{k}</div>
                <div className="mt-1 font-semibold">{h}</div>
                <p className="mt-2 text-slate-600 text-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO (revert to vertical w/ pill matrix) */}
      <section id="who" className="bg-slate-50 border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <h3 className="text-3xl md:text-4xl font-semibold">Who Promptly is for</h3>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
            Founders, creators, and lean teams who need better emails without hiring a copywriter
            — from idea-stage to growth-stage businesses.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

      {/* HOW (vertical timeline variation) */}
      <section id="how" className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-blue-700">How it works</div>
            <h4 className="mt-2 text-2xl md:text-3xl font-semibold">Generate → Send → Learn</h4>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Promptly improves with your data — suggestions for subjects, CTAs, and send times get sharper as you grow.
            </p>
          </div>

          <ol className="mt-12 relative border-l border-slate-200 max-w-3xl mx-auto pl-6">
            {[
              {
                t: "Generate",
                d: "Describe your offer, audience, and goal. Promptly drafts your email in your brand’s voice.",
              },
              {
                t: "Send",
                d: "Schedule or send immediately with built-in sending — no switching tools, no extra setup.",
              },
              {
                t: "Learn",
                d: "Opens, clicks, and conversions feed back into the system to improve the next campaign.",
              },
            ].map(({ t, d }, i) => (
              <li key={t} className="mb-10 last:mb-0">
                <div className="absolute -left-[10px] mt-1 h-5 w-5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                <h5 className="font-semibold">{t}</h5>
                <p className="mt-1 text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BOTTOM CTA */}
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
