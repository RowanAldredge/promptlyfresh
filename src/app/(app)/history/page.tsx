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
    select: { id: true, subject: true, status: true, createdAt: true, updatedAt: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-medium mb-4">History</h1>

      {/* Filters (GET) */}
      <form method="GET" className="mb-4 grid gap-2 md:grid-cols-[160px_160px_160px_auto]">
        <select name="status" defaultValue={status} className="rounded border p-2 text-sm">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <input name="from" type="date" defaultValue={sp?.from ?? ""} className="rounded border p-2 text-sm" />
        <input name="to" type="date" defaultValue={sp?.to ?? ""} className="rounded border p-2 text-sm" />
        <button className="rounded border px-4 py-2 text-sm w-max">Apply</button>
      </form>

      {emails.length === 0 ? (
        <div className="rounded border bg-white p-6">
          <p className="mb-3 text-sm text-neutral-600">No emails match your filters.</p>
          <Link href="/compose" className="inline-block rounded border px-4 py-2 text-sm">Write Email</Link>
        </div>
      ) : (
        <div className="rounded border bg-white">
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="p-3">Subject</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.map(e => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="p-3">{e.subject || "(no subject)"}</td>
                  <td className="p-3 capitalize">{e.status}</td>
                  <td className="p-3">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    <Link href={`/history/${e.id}`} className="mr-3 underline">View</Link>
                    <Link href={`/send?emailId=${e.id}`} className="underline">Send</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
