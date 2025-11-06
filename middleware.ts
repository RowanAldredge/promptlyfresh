// middleware.ts (or src/middleware.ts)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";

// --- Public (non-gated) routes ---
const isPublic = createRouteMatcher([
  "/",                    // landing
  "/(marketing)(.*)",     // marketing/waitlist
  "/api/waitlist",        // waitlist endpoint
  "/sign-in(.*)",         // keep Clerk auth pages public
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/_next(.*)",           // Next internals
]);

// --- Env allow-lists ---
const ALLOW_EMAILS = (process.env.ALLOW_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const ALLOW_USER_IDS = (process.env.ALLOW_USER_IDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Helper: supports both Clerk shapes (function -> Promise<ClerkClient> OR object)
async function getClerkClient() {
  const anyClient = clerkClient as unknown as any;
  return typeof anyClient === "function" ? await anyClient() : anyClient;
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Let public routes through
  if (isPublic(req)) return NextResponse.next();

  // In your setup auth() is async
  const session = await auth();
  const { userId } = session;

  // Not signed in → go to sign-in and return here after
  if (!userId) {
    return session.redirectToSignIn({ returnBackUrl: req.url });
  }

  // If no allow-lists configured, keep app private
  if (ALLOW_EMAILS.length === 0 && ALLOW_USER_IDS.length === 0) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow by Clerk user ID
  if (ALLOW_USER_IDS.includes(userId)) {
    return NextResponse.next();
  }

  // Else allow by email
  try {
    const client = await getClerkClient();
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
  matcher: ["/((?!_next|.*\\.(?:png|jpg|jpeg|gif|svg|ico|js|css|map|txt|xml)).*)"],
};
