// src/app/(app)/history/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

type Status = "" | "draft" | "sent" | "scheduled";

// Next 15: searchParams is a Promise
type SearchParams = Promise<{
  status?: string;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
}>;

type Props = { searchParams: SearchParams };

export const dynamic = "force-dynamic";

export default async function HistoryPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // ✅ await the promise per Next 15
  const sp = await searchParams;

  const status = (sp?.status ?? "") as Status;
  const from = sp?.from ? new Date(sp.from) : undefined;
  const to = sp?.to ? new Date(sp.to) : undefined;

  const where: any = { userId };
  if (status) where.status = status;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = from;
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const emails = await prisma.email.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      subject: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-background text-text-primary">
      {/* Page header */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">History</h1>
        <Link
          href="/compose"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-2 text-sm shadow-sm hover:opacity-90 transition"
        >
          ✏️ Write new email
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 space-y-6">
        {/* Filters */}
        <section className="rounded-3xl border border-borderc bg-surface p-4 md:p-6">
          <div className="text-sm uppercase tracking-widest text-text-muted mb-3">
            Filters
          </div>
          <form
            method="GET"
            className="grid gap-3 md:grid-cols-[200px_200px_200px_auto]"
          >
            <select
              name="status"
              defaultValue={status}
              className="rounded-xl border border-borderc bg-white px-3 py-2 text-sm"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
            </select>

            <input
              name="from"
              type="date"
              defaultValue={sp?.from ?? ""}
              className="rounded-xl border border-borderc bg-white px-3 py-2 text-sm"
            />
            <input
              name="to"
              type="date"
              defaultValue={sp?.to ?? ""}
              className="rounded-xl border border-borderc bg-white px-3 py-2 text-sm"
            />

            <div className="flex items-center gap-2">
              <button
                className="rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface"
                type="submit"
              >
                Apply
              </button>
              <Link
                href="/history"
                className="rounded-full border border-borderc bg-background px-4 py-2 text-sm hover:bg-surface"
              >
                Reset
              </Link>
            </div>
          </form>
        </section>

        {/* Results */}
        {emails.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-borderc bg-surface p-10 text-center">
            <div className="text-2xl mb-2">📭</div>
            <div className="font-semibold">No emails match your filters</div>
            <p className="mt-1 text-sm text-text-muted">
              Start by writing your first email — the AI will learn as you send.
            </p>
            <div className="mt-4">
              <Link
                href="/compose"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-2 text-sm shadow-sm hover:opacity-90 transition"
              >
                ✏️ Write email
              </Link>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-borderc bg-white overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your emails</h2>
              <span className="text-sm text-text-muted">
                Showing {emails.length} {emails.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="border-t border-borderc overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-text-muted">
                  <tr className="border-b border-borderc/80">
                    <th className="p-3 pr-4">Subject</th>
                    <th className="p-3 pr-4">Status</th>
                    <th className="p-3 pr-4">Created</th>
                    <th className="p-3 pr-4">Updated</th>
                    <th className="p-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((e) => (
                    <tr key={e.id} className="border-b border-borderc/60 last:border-0">
                      <td className="p-3 pr-4 font-medium">
                        {e.subject || "(no subject)"}
                      </td>
                      <td className="p-3 pr-4 capitalize">
                        <StatusBadge status={e.status as Status} />
                      </td>
                      <td className="p-3 pr-4">
                        {new Date(e.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3 pr-4">
                        {new Date(e.updatedAt).toLocaleString()}
                      </td>
                      <td className="p-3 pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/history/${e.id}`}
                            className="rounded-lg px-3 py-1 hover:bg-surface"
                          >
                            View
                          </Link>
                          <Link
                            href={`/send?emailId=${e.id}`}
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
          </section>
        )}
      </div>
    </main>
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
