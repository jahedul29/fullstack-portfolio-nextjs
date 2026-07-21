// Edge-runtime middleware — presence-only cookie check for /admin/*. Deep JWT
// verification (signature + role) happens server-side via authGuard in route
// handlers / server components. Deliberately no mongoose/jsonwebtoken imports
// here: those aren't Edge-safe.
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
