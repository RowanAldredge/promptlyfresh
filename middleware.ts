// /middleware.ts (project root)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes
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
  // allow public routes
  if (isPublicRoute(req)) return;

  // MUST await auth() in your version
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    // Use Clerk helper if available
    return redirectToSignIn();
    // Or a manual fallback:
    // return Response.redirect(new URL("/sign-in", req.url));
  }
});

// Don’t run middleware on static assets / Next internals
export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
