// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
  auth,
  clerkClient,
} from "@clerk/nextjs/server";

// Public routes that do NOT require auth
const isPublic = createRouteMatcher([
  "/",                    // landing
  "/(marketing)(.*)",     // your waitlist lives here
  "/api/waitlist",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/_next(.*)",           // Next.js internals
]);

// Comma-separated allowlist of emails (set this in Vercel env)
const ALLOW_EMAILS = (process.env.ALLOW_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export default clerkMiddleware(async (req: NextRequest) => {
  // Let public routes through
  if (isPublic(req)) return NextResponse.next();

  // Everything else requires an allowed, signed-in user
  const { userId } = auth();

  // Not signed in → send to landing
  if (!userId) return NextResponse.redirect(new URL("/", req.url));

  // If allow list is empty, block everyone
  if (ALLOW_EMAILS.length === 0) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Fetch user via Clerk (NOTE the awaited clerkClient())
  let email = "";
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    email =
      user.primaryEmailAddress?.emailAddress?.toLowerCase() ??
      user.emailAddresses?.[0]?.emailAddress?.toLowerCase() ??
      "";
  } catch {
    // Fall through to deny
  }

  // Allow only allow-listed emails
  if (email && ALLOW_EMAILS.includes(email)) {
    return NextResponse.next();
  }

  // Otherwise bounce to landing
  return NextResponse.redirect(new URL("/", req.url));
});

// Run on everything except obvious static assets / Next internals.
// (Public routing exceptions are handled above by isPublic.)
export const config = {
  matcher: ["/((?!_next|.*\\.(?:png|jpg|jpeg|gif|svg|ico|js|css|map)).*)"],
};
