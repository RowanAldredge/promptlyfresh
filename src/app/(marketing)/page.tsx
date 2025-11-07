// src/app/(public)/page.tsx
import Link from "next/link";
import WaitlistForm from "./waitlist-form";

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      {/* Header */}
<header className="sticky top-0 z-30 border-b border-transparent bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  {/* thin gradient accent line */}
  <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-600/50 to-transparent" />

  <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
    {/* Brand + tiny tagline */}
    <Link href="/" className="flex items-center gap-3">
      <span className="text-brand-600 font-semibold text-xl tracking-tight">Promptly</span>
         AI email that learns
    </Link>

    {/* Desktop actions */}
    <nav className="hidden md:flex items-center gap-3">
      <Link
        href="#how"
        className="text-sm text-text-muted hover:text-text-primary px-3 py-2 rounded-lg hover:bg-surface"
      >
        How it works
      </Link>
      <a
        href="mailto:hello@getpromptly.org"
        className="text-sm text-text-muted hover:text-text-primary px-3 py-2 rounded-lg hover:bg-surface"
      >
        Contact
      </a>
      <Link
        href="#top"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-2 text-sm shadow-sm hover:opacity-90 transition"
      >
        Join waitlist
        <span aria-hidden>→</span>
      </Link>
    </nav>

    {/* Mobile menu (no JS needed) */}
    <details className="md:hidden relative group">
      <summary className="list-none inline-flex items-center gap-2 rounded-full border border-borderc bg-surface px-3 py-2 text-sm text-text-primary cursor-pointer hover:bg-background">
        Menu <span className="text-text-muted">▾</span>
      </summary>
      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-borderc bg-background shadow-lg overflow-hidden">
        <Link
          href="#how"
          className="block px-4 py-3 text-sm text-text-primary hover:bg-surface"
        >
          How it works
        </Link>
        <a
          href="mailto:hello@getpromptly.org"
          className="block px-4 py-3 text-sm text-text-primary hover:bg-surface"
        >
          Contact
        </a>
        <Link
          href="#top"
          className="block px-4 py-3 text-sm text-white bg-gradient-to-r from-brand-600 to-accent hover:opacity-90"
        >
          Join waitlist
        </Link>
      </div>
    </details>
  </div>
</header>

      {/* HERO */}
<section
  id="top"
  className="relative overflow-hidden px-4 py-28 md:py-40 bg-gradient-to-b from-brand-100 via-background to-background"
>
  {/* Gradient field */}
  <div
    aria-hidden
    className="pointer-events-none absolute -top-40 -left-40 h-[42rem] w-[42rem] rounded-full bg-brand-600/25 blur-[130px]"
  />
  <div
    aria-hidden
    className="pointer-events-none absolute -top-10 left-32 h-[32rem] w-[32rem] rounded-full bg-brand-500/25 blur-[130px]"
  />
  <div
    aria-hidden
    className="pointer-events-none absolute -bottom-24 -right-36 h-[38rem] w-[38rem] rounded-full bg-accent/30 blur-[130px]"
  />
  <div
    aria-hidden
    className="pointer-events-none absolute top-1/3 right-0 h-64 w-64 rounded-full bg-brand-400/25 blur-[100px]"
  />

  <div className="relative max-w-3xl mx-auto text-center">
    {/* Larger brand name above headline */}
    <div className="text-brand-600 font-semibold text-4xl md:text-6xl mb-4">
      Promptly,
    </div>

    {/* Headline */}
    <h1 className="text-5xl md:text-5xl font-bold leading-tight tracking-tight">
      The AI that writes your emails and...{" "}
      <span className="text-brand-600">learns what works.</span>
    </h1>

    <p className="mt-4 text-lg text-text-muted">
      Generate campaigns, send with one click, and let analytics train the next draft.
    </p>

    <div className="mt-8 w-full max-w-lg mx-auto">
      <WaitlistForm />
      <p className="mt-3 text-sm text-text-muted">
        Join the waitlist to help shape an industry-changing email platform.
      </p>
    </div>
  </div>
</section>

      {/* WHY PROMPTLY (vertical layout) */}
<section id="why" className="border-t border-borderc bg-background">
  <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
    {/* Header now on top */}
    <h2 className="text-3xl md:text-4xl font-semibold">Why Promptly</h2>

    {/* Body container */}
    <div className="mt-10 space-y-10 text-left">
      {/* Big thesis */}
      <div className="rounded-3xl border border-borderc bg-surface p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
        <p className="text-xl md:text-2xl font-semibold leading-snug text-center">
          Email shouldn’t be guesswork.{" "}
          <span className="bg-gradient-to-r from-brand-700 to-accent bg-clip-text text-transparent">
            Promptly adapts to your results.
          </span>
        </p>
        <p className="mt-3 text-text-muted text-center">
          This isn’t just AI that drafts copy — it{" "}
          <span className="font-medium text-text-primary">
            learns from opens, clicks, and conversions
          </span>{" "}
          to write and time the next send better. That feedback loop changes how teams do email.
        </p>
      </div>

      {/* Three proof points (stack or grid) */}
      <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
        {[
          {
            icon: "🧠",
            title: "Learns your audience",
            desc: "Tone, length, and CTAs adapt to what your list responds to.",
          },
          {
            icon: "📈",
            title: "Optimizes outcomes",
            desc: "Subjects and send-times update based on real performance.",
          },
          {
            icon: "⚡",
            title: "Closes the loop",
            desc: "Generate → Send → Learn — one system, no stitching tools.",
          },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-borderc bg-background p-5 text-center"
          >
            <div className="text-2xl">{icon}</div>
            <div className="mt-2 font-semibold">{title}</div>
            <p className="mt-1 text-sm text-text-muted">{desc}</p>
          </div>
        ))}
      </div>

      {/* Contrast card: old vs new */}
      <div className="rounded-2xl border border-borderc overflow-hidden max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 text-left">
          <div className="p-6 bg-background">
            <div className="text-sm font-semibold text-text-muted">The old way</div>
            <ul className="mt-2 space-y-2 text-sm text-text-muted">
              <li>• Static generators</li>
              <li>• Manual timing guesses</li>
              <li>• Analytics you never act on</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-r from-brand-50 to-accent/10">
            <div className="text-sm font-semibold text-brand-700">Promptly</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li>• Drafts on-brand, fast</li>
              <li>• Sends & schedules inside the app</li>
              <li>• Learns from results to improve next send</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* WHO IT’S FOR */}
<section
  id="who"
  className="border-t border-borderc bg-gradient-to-b from-surface to-background"
>
  <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
    <h3 className="text-3xl md:text-4xl font-semibold">Who it’s for</h3>

    <p className="mt-6 max-w-3xl mx-auto text-lg text-text-muted">
      Founders, creators, and lean teams who want consistent, higher-performing email — without a copywriter.
    </p>

    {/* All six highlighted pills */}
    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 justify-center">
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
          className="rounded-full border border-transparent bg-brand-50 text-brand-700 px-4 py-2 text-sm shadow-sm"
        >
          {pill}
        </span>
      ))}
    </div>

    {/* Cheeky follow-up line */}
    <p className="mt-10 text-lg font-medium text-text-primary">
      Trick question — Promptly is for <span className="text-brand-600">every business</span> looking to grow through smarter email.
    </p>
  </div>
</section>

      {/* HOW */}
      <section id="how" className="border-t border-borderc">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-brand-700">
              How it works
            </div>
            <h4 className="mt-2 text-2xl md:text-3xl font-semibold">
              Idea ➜ Inbox ➜ Insight
            </h4>
            <p className="mt-3 text-text-muted max-w-2xl mx-auto">
              A simple flow that gets smarter as you send.
            </p>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            {[
              { t: "Generate", d: "Brief Promptly. Get a draft you’d actually send." },
              { t: "Send", d: "Ship or schedule — inside Promptly." },
              { t: "Learn", d: "Analytics feed the next draft automatically." },
            ].map(({ t, d }, idx) => (
              <div key={t} className="flex-1">
                <div className="rounded-2xl border border-borderc bg-surface p-5 h-full">
                  <div className="text-sm font-semibold">{t}</div>
                  <p className="mt-1 text-sm text-text-muted">{d}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:flex items-center justify-center mt-4">
                    <span className="text-4xl text-brand-600">➜</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-text-muted">
            More sends → sharper subjects, stronger CTAs, smarter timing.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section id="cta" className="bg-gradient-to-r from-brand-600 to-accent text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-[1fr,520px] items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-brand-100/90">
                Join the waitlist
              </div>
              <h5 className="mt-2 text-2xl md:text-3xl font-semibold">
                Still reading? You’re probably in.
              </h5>
              <p className="mt-2 text-white/80">
                Be first to try Promptly and shape what comes next.
              </p>
            </div>
            <div className="w-full max-w-lg md:justify-self-end">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-borderc bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-text-muted flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Promptly</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
