// Server-only deep auth guard for the admin subtree. `src/middleware.ts` only
// checks that an `accessToken` cookie is present (Edge runtime, no
// jsonwebtoken). This helper does the real signature/expiry verification and
// is meant to be awaited at the top of `src/app/admin/layout.tsx` (a Node.js
// server component), never in middleware. Not marked with the `server-only`
// package (not currently a project dependency) — `next/headers` already
// throws if imported from a client component, which gives the same safety.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { JwtPayload } from "jsonwebtoken";
import { jwtHelpers } from "@/server/lib/jwt";
import { config } from "@/server/lib/config";

export type AdminUser = {
  id: string;
  role: string;
};

export async function requireAdmin(): Promise<AdminUser> {
  const token = cookies().get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  // Verification happens in its own try/catch, but the `redirect()` call
  // itself is made *outside* that try/catch — Next.js's docs warn against
  // calling redirect() inside a try/catch, since the surrounding catch would
  // otherwise swallow its internal throw as a verification failure.
  let payload: JwtPayload | null = null;
  try {
    payload = jwtHelpers.verifyToken(token, config.jwt.secret);
  } catch {
    payload = null;
  }

  if (!payload || !payload.id || !payload.role) {
    redirect("/login");
  }

  return { id: payload.id, role: payload.role };
}
