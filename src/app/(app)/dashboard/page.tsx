// src/app/(app)/dashboard/page.tsx
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FREE_DAILY_GEN_CAP, remainingGensForToday } from "@/lib/limits";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Profile for plan + remaining gens UI
  const profile = await prisma.profile.findFirst({
    where: { userId },
    select: { plan: true, genCount: true, genPeriodStart: true },
  });
  const isPro = profile?.plan === "pro";
  const left = profile
    ? remainingGensForToday({
        plan: profile.plan,
        genCount: profile.genCount,
        genPeriodStart: profile.genPeriodStart,
      })
    : 0;

  // 30-day window
  const since = new Date();
  since.setDate(since.getDate() - 30);

  // Sends + basic rates
  const sentLast30 = await prisma.delivery.count({
    where: { userId, status: "sent", createdAt: { gte: since } },
  });

  const [opens, clicks] = await Promise.all([
    prisma.event.count({
      where: {
        type: "OPEN",
        delivery: { userId, status: "sent", createdAt: { gte: since } },
      },
    }),
    prisma.event.count({
      where: {
        type: "CLICK",
        delivery: { userId, status: "sent", createdAt: { gte: since } },
      },
    }),
  ]);

  const denom = Math.max(sentLast30, 1);
  const openRate = Math.round((opens / denom) * 100);
  const clickRate = Math.round((clicks / denom) * 100);

  // Recent emails for activity list
  const recent = await prisma.email.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 6,
    select: { id: true, subject: true, status: true, updatedAt: true },
  });

  // Simple “smart suggestion” heuristic based on open rate + subject length tendency
  // (keeps MVP lightweight without heavy analytics)
  const lastSubject = recent[0]?.subject ?? "";
  const words = lastSubject.trim() ? lastSubject.trim().split(/\s+/).length : 0;
  let suggestion =
    "Short, specific subjects tend to win. Try 6–8 words and lead with the benefit.";
  if (openRate >= 40) {
    suggestion =
      "Nice! Your open rates are strong. Keep subjects concise and front-load the value.";
  } else if (openRate < 20) {
    suggestion =
      "Open rates look low. Test shorter subjects (≤8 words) and add urgency sparingly.";
  }
  if (words > 11) {
    suggestion = "Your last subject was long. Try trimming to ~7 words for a lift.";
  } else if (words > 0 && words <= 5) {
    suggestion = "Ultra-short works sometimes—also test ~7 words for more context.";

  }

  return (
    <main className="min-h-screen bg-background text-text-primary">
      {/* Page header */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>

        {/* Plan badge */}
        <div className="flex items-center gap-2">
          {isPro ? (
            <span className="inline-flex items-center rounded-full border border-borderc bg-surface px-3 py-1 text-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-brand-600" />
              Pro · Unlimited generations
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm">
              <span className="rounded-full border border-borderc bg-surface px-3 py-1">
                Free · {left} left today (of {FREE_DAILY_GEN_CAP})
              </span>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-1.5 text-sm shadow-sm hover:opacity-90 transition"
              >
                Upgrade
              </Link>
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 space-y-8">
        {/* Smart suggestion + Stats */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Smart Suggestion */}
          <div className="md:col-span-1 rounded-3xl border border-borderc bg-surface p-6 relative overflow-hidden">
            {/* soft glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-600/20 blur-[80px]"
            />
            <div className="text-sm font-semibold text-text-muted">Smart suggestion</div>
            <p className="mt-2 text-sm leading-relaxed">{suggestion}</p>
            <Link
              href="/analytics"
              className="mt-4 inline-flex items-center gap-2 text-sm underline underline-offset-4"
            >
              See insights
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Stat tiles */}
          <div className="md:col-span-2 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-borderc bg-white p-5 shadow-sm">
              <div className="text-sm text-text-muted mb-1">Sends (last 30d)</div>
              <div className="text-3xl font-semibold">{sentLast30}</div>
              <div className="mt-2 h-1 w-12 rounded bg-brand-600/70" />
            </div>
            <div className="rounded-2xl border border-borderc bg-white p-5 shadow-sm">
              <div className="text-sm text-text-muted mb-1">Open rate</div>
              <div className="text-3xl font-semibold">{openRate}%</div>
              <div className="mt-2 h-1 w-12 rounded bg-brand-700" />
            </div>
            <div className="rounded-2xl border border-borderc bg-white p-5 shadow-sm">
              <div className="text-sm text-text-muted mb-1">Click rate</div>
              <div className="text-3xl font-semibold">{clickRate}%</div>
              <div className="mt-2 h-1 w-12 rounded bg-accent" />
            </div>
          </div>
        </section>

        {/* Recent campaigns */}
        <section className="rounded-3xl border border-borderc bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent campaigns</h2>
            <Link
              href="/analytics"
              className="text-sm text-text-muted hover:text-text-primary"
            >
              View analytics →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-borderc bg-surface p-8 text-center">
              <div className="text-xl mb-1">📭</div>
              <div className="font-medium">No campaigns yet</div>
              <p className="mt-1 text-sm text-text-muted">
                Start by writing your first email — the AI will learn as you send.
              </p>
              <div className="mt-4">
                <Link
                  href="/compose"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-2 text-sm shadow-sm hover:opacity-90 transition"
                >
                  ✏️ Write new email
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-text-muted">
                  <tr className="border-b border-borderc">
                    <th className="py-3 pr-4">Subject</th>
                    <th className="py-3 pr-4">Updated</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-0 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.id} className="border-b border-borderc/60 last:border-0">
                      <td className="py-3 pr-4 font-medium">
                        {r.subject || "(no subject)"}
                      </td>
                      <td className="py-3 pr-4 text-text-muted">
                        {new Date(r.updatedAt).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 capitalize">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 ${
                            r.status === "sent"
                              ? "bg-green-50 text-green-700"
                              : r.status === "draft"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-surface text-text-muted border border-borderc"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 pr-0">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/history/${r.id}`}
                            className="rounded-lg px-3 py-1 hover:bg-surface"
                          >
                            View
                          </Link>
                          <Link
                            href={`/send?emailId=${r.id}`}
                            className="inline-flex items-center gap-2 rounded-full border border-borderc bg-background px-3 py-1 hover:bg-surface"
                          >
                            Send
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* CTA bar */}
        <section className="rounded-3xl border border-borderc bg-surface p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-widest text-text-muted">
              Next step
            </div>
            <div className="font-semibold">Generate your next email</div>
            <p className="text-sm text-text-muted">
              Promptly will apply what worked last time to draft smarter.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/compose"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-2 text-sm shadow-sm hover:opacity-90 transition"
            >
              ✏️ Write new email
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface"
            >
              View analytics
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
