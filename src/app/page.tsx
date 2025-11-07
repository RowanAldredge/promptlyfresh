// src/app/(public)/page.tsx
import Link from "next/link";
import WaitlistForm from "./(marketing)/waitlist-form";

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-borderc">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Promptly
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#why" className="text-text-muted hover:text-text-primary transition">
              Why
            </Link>
            <Link href="#who" className="text-text-muted hover:text-text-primary transition">
              Who
            </Link>
            <Link href="#how" className="text-text-muted hover:text-text-primary transition">
              How
            </Link>
            <a
              href="mailto:hello@getpromptly.org"
              className="text-text-muted hover:text-text-primary transition"
            >
              Contact
            </a>
          </nav>
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
    <div className="text-brand-600 font-semibold text-2xl md:text-3xl mb-4">
      Promptly
    </div>

    {/* Headline */}
    <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
      AI that writes your emails —{" "}
      <span className="text-brand-600">and learns what works.</span>
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

      {/* WHY PROMPTLY */}
      <section id="why" className="border-t border-borderc">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-12 md:grid-cols-[230px,1fr]">
          <aside className="md:pt-2">
            <div className="text-xs uppercase tracking-widest text-brand-700">
              Why Promptly
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold leading-snug">
              Generate → Send →{" "}
              <span className="text-brand-600">Learn</span>
            </h2>
            <p className="mt-3 text-text-muted">
              One loop — not three tools. Promptly gets better each time you hit send.
            </p>
          </aside>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Generate",
                h: "On-brand in seconds",
                d: "Subjects, body & CTAs from a simple brief — in your voice.",
                c: "bg-brand-600/70",
              },
              {
                t: "Send",
                h: "Built-in delivery",
                d: "Schedule or ship now — stay consistent without juggling tools.",
                c: "bg-accent",
              },
              {
                t: "Learn",
                h: "Analytics-trained",
                d: "Opens, clicks & conversions teach Promptly what to do next.",
                c: "bg-brand-700",
              },
            ].map(({ t, h, d, c }) => (
              <div
                key={t}
                className="rounded-2xl border border-borderc bg-surface p-6 shadow-sm"
              >
                <div className="text-xs font-semibold tracking-wide text-text-muted">{t}</div>
                <div className="mt-1 font-semibold">{h}</div>
                <p className="mt-2 text-sm text-text-muted">{d}</p>
                <div className={`mt-4 h-1 w-14 rounded ${c}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO */}
      <section
        id="who"
        className="border-t border-borderc bg-gradient-to-b from-surface to-background"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <h3 className="text-3xl md:text-4xl font-semibold">Who it’s for</h3>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-text-muted">
            Founders, creators, and lean teams who want consistent, higher-performing email — without a copywriter.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "🛍️ eCommerce stores",
              "⚙️ SaaS & startups",
              "🧠 Creators & coaches",
              "🏪 Local businesses",
              "📚 Courses & info products",
              "✉️ Freelancers & agencies",
            ].map((pill, i) => (
              <span
                key={pill}
                className={`rounded-full px-4 py-2 text-sm shadow-sm ${
                  i % 2 === 0
                    ? "border border-borderc bg-background text-text-primary"
                    : "border border-transparent bg-brand-50 text-brand-700"
                }`}
              >
                {pill}
              </span>
            ))}
          </div>
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
