// src/app/(app)/history/[id]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

type Tab = "content" | "performance" | "events";
type Status = "" | "draft" | "sent" | "scheduled";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: Tab }>;
};

export const dynamic = "force-dynamic";

export default async function EmailDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const tab: Tab = (sp.tab as Tab) ?? "content";

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const email = await prisma.email.findFirst({
    where: { id, userId },
    include: {
      deliveries: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          status: true,
          createdAt: true,
          providerMessageId: true,
          sentAt: true,
        },
      },
    },
  });

  if (!email) {
    return (
      <main className="min-h-screen bg-background text-text-primary">
        <div className="mx-auto max-w-6xl px-4 pt-10">
          <h1 className="text-2xl md:text-3xl font-semibold mb-3">Email not found</h1>
          <Link href="/history" className="underline">Back to History</Link>
        </div>
      </main>
    );
  }

  // Lightweight performance for this email (all deliveries for this email)
  const [opens, clicks, sentCount] = await Promise.all([
    prisma.event.count({ where: { type: "OPEN", delivery: { emailId: id, userId } } }),
    prisma.event.count({ where: { type: "CLICK", delivery: { emailId: id, userId } } }),
    prisma.delivery.count({ where: { emailId: id, userId, status: "sent" } }),
  ]);
  const denom = Math.max(sentCount, 1);
  const openRate = Math.round((opens / denom) * 100);
  const clickRate = Math.round((clicks / denom) * 100);

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        {/* Title + actions */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {email.subject || "(no subject)"}
            </h1>
            <div className="mt-2 text-sm text-text-muted">
              <span className="mr-3">Created: {new Date(email.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(email.updatedAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/send?emailId=${email.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-2 text-sm shadow-sm hover:opacity-90 transition"
            >
              Send
            </Link>
            <Link
              href="/compose"
              className="inline-flex items-center gap-2 rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface"
            >
              Duplicate
            </Link>
          </div>
        </div>

        {/* Status badge */}
        <div className="mb-6">
          <StatusBadge status={email.status as Status} />
        </div>

        {/* Tabs */}
        <nav className="mb-4 flex flex-wrap items-center gap-2">
          <TabLink href={`/history/${email.id}?tab=content`} active={tab === "content"}>
            Content
          </TabLink>
          <TabLink href={`/history/${email.id}?tab=performance`} active={tab === "performance"}>
            Performance
          </TabLink>
          <TabLink href={`/history/${email.id}?tab=events`} active={tab === "events"}>
            Events
          </TabLink>
        </nav>

        {/* Panels */}
        {tab === "content" && (
          <section className="rounded-3xl border border-borderc bg-white p-6 shadow-sm">
            <div className="text-sm text-text-muted mb-2">Body</div>
            <article className="whitespace-pre-wrap leading-7 text-sm">{email.body}</article>
          </section>
        )}

        {tab === "performance" && (
          <section className="rounded-3xl border border-borderc bg-white p-6 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-3">
              <MetricCard label="Sends" value={sentCount} accent="bg-brand-600/70" />
              <MetricCard label="Open rate" value={`${openRate}%`} accent="bg-brand-700" />
              <MetricCard label="Click rate" value={`${clickRate}%`} accent="bg-accent" />
            </div>

            <div className="mt-6 rounded-2xl border border-borderc bg-surface p-4 text-sm">
              <div className="font-semibold mb-1">Quick suggestion</div>
              <p className="text-text-muted">
                If opens are below target, test shorter subjects (6–10 words) and send at your
                best weekday/time from Analytics.
              </p>
            </div>
          </section>
        )}

        {tab === "events" && (
          <section className="rounded-3xl border border-borderc bg-white p-6 shadow-sm">
            <div className="mb-3 font-semibold">Recent deliveries</div>
            {email.deliveries.length === 0 ? (
              <p className="text-sm text-text-muted">No delivery events yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-text-muted">
                    <tr className="border-b border-borderc/80">
                      <th className="p-3 pr-4">Status</th>
                      <th className="p-3 pr-4">Timestamp</th>
                      <th className="p-3 pr-4">Provider ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {email.deliveries.map((d) => (
                      <tr key={d.id} className="border-b border-borderc/60 last:border-0">
                        <td className="p-3 pr-4">
                          <StatusBadge status={d.status as Status} />
                        </td>
                        <td className="p-3 pr-4">
                          {d.sentAt
                            ? new Date(d.sentAt).toLocaleString()
                            : new Date(d.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 pr-4 text-text-muted">
                          {d.providerMessageId || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

/* ——— UI bits ——— */

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border ${
        active
          ? "border-transparent bg-gradient-to-r from-brand-600 to-accent text-white shadow-sm"
          : "border-borderc bg-background hover:bg-surface text-text-primary"
      } transition`}
    >
      {children}
    </Link>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-borderc bg-white p-5 shadow-sm">
      <div className="text-sm text-text-muted mb-1">{label}</div>
      <div className="text-3xl font-semibold">{value}</div>
      <div className={`mt-2 h-1 w-12 rounded ${accent}`} />
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "sent") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-green-700">
        Sent
      </span>
    );
  }
  if (status === "scheduled") {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
        Scheduled
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
        Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-borderc bg-surface px-2 py-0.5 text-text-muted">
      —
    </span>
  );
}
