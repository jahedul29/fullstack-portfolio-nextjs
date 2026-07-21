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
