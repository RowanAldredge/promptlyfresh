// src/app/(app)/dashboard/page.tsx
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  FREE_DAILY_GEN_CAP,
  remainingGensForToday,
} from "@/lib/limits";

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

  const since = new Date();
  since.setDate(since.getDate() - 30);

  // Sends in last 30d
  const sentLast30 = await prisma.delivery.count({
    where: { userId, status: "sent", createdAt: { gte: since } },
  });

  // Real opens/clicks based on Delivery relation
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

  const recent = await prisma.email.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 6,
    select: { id: true, subject: true, status: true, updatedAt: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-medium mb-4">Dashboard</h1>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-neutral-500 mb-1">Sends (last 30d)</div>
          <div className="text-2xl font-medium">{sentLast30}</div>
        </div>

        <div className="rounded border bg-white p-4">
          <div className="text-sm text-neutral-500 mb-1">Opens %</div>
          <div className="text-2xl font-medium">{openRate}%</div>
        </div>

        <div className="rounded border bg-white p-4">
          <div className="text-sm text-neutral-500 mb-1">Clicks %</div>
          <div className="text-2xl font-medium">{clickRate}%</div>
        </div>

        {/* Plan & remaining banner */}
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-neutral-500 mb-1">Plan</div>
          <div className="text-2xl font-medium capitalize">
            {isPro ? "Pro" : "Free"}
          </div>
          <div className="mt-2 text-sm">
            {isPro ? (
              <span className="inline-block rounded bg-green-50 px-2 py-1 text-green-700">
                Unlimited generations
              </span>
            ) : (
              <span className="inline-block rounded bg-amber-50 px-2 py-1 text-amber-700">
                {left} left today (of {FREE_DAILY_GEN_CAP}) ·{" "}
                <Link href="/pricing" className="underline">
                  Upgrade
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded border bg-white p-4">
        <div className="mb-2 font-medium">Quick actions</div>
        <div className="flex gap-2">
          <Link href="/compose" className="rounded border px-3 py-1 text-sm">
            Write Email
          </Link>
          <Link href="/send" className="rounded border px-3 py-1 text-sm">
            Send
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded border bg-white p-4">
        <div className="mb-2 font-medium">Recent activity</div>
        {recent.length === 0 ? (
          <div className="text-sm text-neutral-600">
            Nothing yet. Start by{" "}
            <Link className="underline" href="/compose">
              writing your first email
            </Link>
            .
          </div>
        ) : (
          <ul className="text-sm space-y-2">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {r.subject || "(no subject)"}
                  </div>
                  <div className="text-neutral-500 capitalize">
                    {r.status} • {new Date(r.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/history/${r.id}`} className="underline">
                    View
                  </Link>
                  <Link href={`/send?emailId=${r.id}`} className="underline">
                    Send
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
