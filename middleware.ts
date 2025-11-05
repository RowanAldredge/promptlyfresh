import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";

// Public (non-gated) routes
const isPublic = createRouteMatcher([
  "/",                    // landing
  "/(marketing)(.*)",     // your public marketing/waitlist pages
  "/api/waitlist",        // waitlist API
  "/sign-in(.*)",         // Clerk auth pages must be public
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/_next(.*)",           // Next internals
]);

// Comma-separated allow list of emails, set in Vercel settings
const ALLOW_EMAILS = (process.env.ALLOW_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Let public routes through untouched
  if (isPublic(req)) return NextResponse.next();

  // Everything else requires a signed-in user
  const { userId } = await auth();

  if (!userId) {
    // Send them to sign-in, then back to the page they asked for
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If you haven't configured emails yet, keep the app private by default
  if (ALLOW_EMAILS.length === 0) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Pull the user's email from Clerk and check it against the allow list
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email =
      user.primaryEmailAddress?.emailAddress?.toLowerCase() ??
      user.emailAddresses?.[0]?.emailAddress?.toLowerCase() ??
      "";

    if (email && ALLOW_EMAILS.includes(email)) {
      return NextResponse.next();
    }
  } catch {
    // fall through to deny
  }

  // Not allowed → bounce to landing
  return NextResponse.redirect(new URL("/", req.url));
});

// Apply to everything except static assets
export const config = {
  matcher: ["/((?!_next|.*\\.(?:png|jpg|jpeg|gif|svg|ico|js|css|map)).*)"],
};
