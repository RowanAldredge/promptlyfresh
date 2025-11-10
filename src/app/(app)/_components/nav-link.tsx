// src/app/(app)/_components/nav-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
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
        ${
          active
            ? "bg-gradient-to-r from-brand-600 to-accent text-white shadow-sm"
            : "border border-transparent hover:border-borderc hover:bg-background text-text-primary"
        }`}
    >
      {children}
    </Link>
  );
}
