// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public (unauthenticated) routes
const isPublicRoute = createRouteMatcher([
  "/",                 // landing
  "/waitlist(.*)",     // waitlist page(s)
  "/api/waitlist(.*)", // waitlist API endpoint
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing",
  "/demo",
  "/contact",
  "/legal(.*)",
  "/favicon.ico",
  "/robots.txt",
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) return;

  // Gate everything else
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    // send them to sign-in; Clerk attaches return_to automatically
    return redirectToSignIn();
  }
});

// Tell Next which paths to run the middleware on
export const config = {
  matcher: [
    // run on all paths except static files and _next
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/", // include root
    "/(api|trpc)(.*)",
  ],
};
