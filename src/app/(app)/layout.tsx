// src/app/(app)/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/db";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Ensure a profile exists; read plan for sidebar badge/CTA
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {},
    create: { userId, plan: "free" },
    select: { plan: true },
  });

  const isFree = profile.plan !== "pro";

  return (
    <div className="min-h-screen bg-background text-text-primary grid md:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-borderc bg-surface/70 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
        <div className="h-full sticky top-0 flex flex-col p-5">

          {/* Brand */}
          <Link href="/dashboard" className="mb-6">
            <div className="inline-flex items-center gap-2">
              <span className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-brand-600 to-accent bg-clip-text text-transparent">
                Promptly
              </span>
            </div>
            <div className="text-xs text-text-muted">AI email that learns</div>
          </Link>

          {/* Nav */}
          <nav className="space-y-1">
            <NavLink href="/dashboard">🏠 Dashboard</NavLink>
            <NavLink href="/compose">✏️ Write</NavLink>
            <NavLink href="/send">🚀 Send</NavLink>
            <NavLink href="/history">🗂️ History</NavLink>

            <div className="pt-3 mt-3 border-t border-borderc/80 text-xs uppercase tracking-widest text-text-muted">
              Settings
            </div>
            <NavLink href="/settings/account">👤 Account</NavLink>
            <NavLink href="/settings/billing">💳 Billing</NavLink>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Plan badge + user */}
          <div className="pt-4 border-t border-borderc">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-borderc bg-background px-3 py-1 text-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isFree ? "bg-amber-500" : "bg-brand-600"
                  }`}
                />
                Plan: {profile.plan.toUpperCase()}
              </span>

              <UserButton afterSignOutUrl="/" />
            </div>

            {isFree && (
              <Link
                href="/pricing"
                className="mt-3 inline-flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-brand-600 to-accent text-white px-4 py-2 text-sm shadow-sm hover:opacity-90 transition"
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="p-6 md:p-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

/* ---------- Client-side active link ---------- */
"use client";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    pathname === href ||
    (href !== "/dashboard" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition
        ${active
          ? "bg-gradient-to-r from-brand-600 to-accent text-white shadow-sm"
          : "border border-transparent hover:border-borderc hover:bg-background"
        }`}
    >
      {children}
    </Link>
  );
}
