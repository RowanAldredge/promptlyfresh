import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: "content" | "performance" | "events" }>;
};

export default async function EmailDetailPage({ params, searchParams }: Props) {
  // ✅ Next 15: await both params and searchParams
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const tab = sp.tab ?? "content";

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
      <div>
        <h1 className="text-2xl font-medium mb-4">Email not found</h1>
        <Link href="/history" className="underline">
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-medium">{email.subject || "(no subject)"}</h1>
        <div className="flex gap-2">
          <Link href={`/send?emailId=${email.id}`} className="rounded border px-3 py-1 text-sm">
            Send
          </Link>
          <Link href="/compose" className="rounded border px-3 py-1 text-sm">
            Duplicate
          </Link>
        </div>
      </div>

      <div className="mb-6 text-sm text-neutral-600">
        <span className="mr-3 capitalize">Status: {email.status}</span>
        <span className="mr-3">Created: {new Date(email.createdAt).toLocaleString()}</span>
        <span>Updated: {new Date(email.updatedAt).toLocaleString()}</span>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex gap-3 text-sm">
        <Link
          href={`/history/${email.id}?tab=content`}
          className={`underline-offset-4 ${tab === "content" ? "underline" : ""}`}
        >
          Content
        </Link>
        <Link
          href={`/history/${email.id}?tab=performance`}
          className={`underline-offset-4 ${tab === "performance" ? "underline" : ""}`}
        >
          Performance
        </Link>
        <Link
          href={`/history/${email.id}?tab=events`}
          className={`underline-offset-4 ${tab === "events" ? "underline" : ""}`}
        >
          Events
        </Link>
      </div>

      {tab === "content" && (
        <article className="rounded border bg-white p-4 whitespace-pre-wrap text-sm leading-6">
          {email.body}
        </article>
      )}

      {tab === "performance" && (
        <div className="rounded border bg-white p-4 text-sm">
          <div className="mb-2 font-medium">Performance (coming soon)</div>
          <div className="text-neutral-600">Opens %, Clicks %, trends…</div>
        </div>
      )}

      {tab === "events" && (
        <div className="rounded border bg-white p-4 text-sm">
          <div className="mb-2 font-medium">Recent deliveries (last 50)</div>
          {email.deliveries.length === 0 ? (
            <div className="text-neutral-600">No delivery events yet.</div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {email.deliveries.map((d) => (
                <li key={d.id}>
                  <span className="mr-2 capitalize">{d.status}</span>
                  <span className="mr-2">
                    {d.sentAt
                      ? new Date(d.sentAt).toLocaleString()
                      : new Date(d.createdAt).toLocaleString()}
                  </span>
                  <span className="text-neutral-500">
                    ({d.providerMessageId || "no provider id"})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
