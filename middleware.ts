import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";

// Define all public (non-gated) routes
const isPublic = createRouteMatcher([
  "/",                    // landing
  "/(marketing)(.*)",     // waitlist or marketing pages
  "/api/waitlist",        // waitlist endpoint
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/_next(.*)",           // internal Next.js assets
]);

// Define which emails can access the gated MVP
const ALLOW_EMAILS = (process.env.ALLOW_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Allow all public routes
  if (isPublic(req)) return NextResponse.next();

  // Require authentication for all other routes
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If allow list is empty, block everyone
  if (ALLOW_EMAILS.length === 0) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Look up signed-in user's email via Clerk
  let email = "";
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    email =
      user.primaryEmailAddress?.emailAddress?.toLowerCase() ??
      user.emailAddresses?.[0]?.emailAddress?.toLowerCase() ??
      "";
  } catch {
    // fallback to deny
  }

  // Allow only if email is on the allow list
  if (email && ALLOW_EMAILS.includes(email)) {
    return NextResponse.next();
  }

  // Otherwise redirect to landing
  return NextResponse.redirect(new URL("/", req.url));
});

// Apply middleware to everything except static assets
export const config = {
  matcher: ["/((?!_next|.*\\.(?:png|jpg|jpeg|gif|svg|ico|js|css|map)).*)"],
};