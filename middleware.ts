// src/middleware.ts
import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',                    // landing page
  '/api/waitlist',        // waitlist API
  '/sign-in(.*)',         // Clerk pages
  '/sign-up(.*)',
  '/favicon.ico',
  // If you have more public assets or pages, add them here:
  '/_next/static(.*)',
  '/_next/image(.*)',
  '/images/(.*)',
  '/public/(.*)',          // if you serve anything under /public (rare with App Router)
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Allow all public routes through
  if (isPublicRoute(req)) {
    // Optional: If a signed-in user hits "/", send them to the app
    if (req.nextUrl.pathname === '/' && userId) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Everything else requires auth
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

// IMPORTANT: don't run middleware on static files and internals
export const config = {
  matcher: [
    // Apply to all paths EXCEPT next internals and static assets
    '/((?!_next|.*\\.(?:png|jpg|jpeg|svg|ico|css|js|map|txt)).*)',
  ],
};
