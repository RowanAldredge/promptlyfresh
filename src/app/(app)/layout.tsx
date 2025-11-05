import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/db"; // ✅ added

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // ✅ ensure a profile exists and read the current plan
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {},
    create: { userId, plan: "free" },
  });

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r bg-white p-4 flex flex-col">
        <div className="font-semibold mb-6">Promptly</div>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block">Dashboard</Link>
          <Link href="/compose" className="block">Write Email</Link>
          <Link href="/send" className="block">Send</Link>
          <Link href="/history" className="block">History</Link>
          <Link href="/settings/account" className="block">Settings</Link>
          <Link href="/settings/billing" className="block">Billing</Link>
          
        </nav>
        <div className="mt-auto flex items-center justify-between pt-4 border-t text-sm">
          {/* ✅ show live plan from DB */}
          <span className="text-neutral-500">
            Plan: {profile.plan.toUpperCase()}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
