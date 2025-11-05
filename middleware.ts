// /middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes (no auth)
const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/waitlist",
  "/api/stripe/webhook", // must remain public
  // "/api/health",
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Let public routes pass
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // In your Clerk version, auth() returns a Promise
    const { userId } = await auth();

    // If unauthenticated, redirect manually (works across all versions)
    if (!userId) {
      const url = new URL("/sign-in", req.url);
      // preserve where the user was going
      url.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(url);
    }

    // Authenticated → continue
    return NextResponse.next();
  } catch (err) {
    // Never hard-fail in middleware: fail-open to avoid 500s
    // (You can log err to Vercel "Functions" → Edge logs)
    return NextResponse.next();
  }
});

// Don’t run on Next internals or static assets
export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
