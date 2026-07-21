import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { config } from "@/server/lib/config";
import { jwtHelpers } from "@/server/lib/jwt";
import { AuthZodValidation } from "@/server/modules/auth/auth.validation";
import { AuthService } from "@/server/modules/auth/auth.service";

export const dynamic = "force-dynamic";

export const POST = handler(async (req: NextRequest) => {
  await connectDb();

  const body = await req.json();
  const validated = AuthZodValidation.loginValidation.parse({ body });

  const { accessToken, refreshToken } = await AuthService.login(
    validated.body
  );

  // Decode the freshly-issued access token to surface non-sensitive claims
  // (id/role) to the client without ever putting the raw token in the JSON body.
  const { id, role } = jwtHelpers.verifyToken(accessToken, config.jwt.secret);

  const res = sendResponse({
    statusCode: 200,
    message: "Logged in successfully",
    data: { id, role },
  });

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return res;
});
