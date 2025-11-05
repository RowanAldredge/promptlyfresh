import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

// Only run on app routes, not assets/_next
export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
