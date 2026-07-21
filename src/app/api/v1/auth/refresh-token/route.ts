import { NextRequest } from "next/server";
import httpStatus from "http-status";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { ApiError } from "@/server/lib/ApiError";
import { AuthService } from "@/server/modules/auth/auth.service";

export const dynamic = "force-dynamic";

export const POST = handler(async (req: NextRequest) => {
  await connectDb();

  const token = req.cookies.get("refreshToken")?.value;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token not found");
  }

  const { accessToken } = await AuthService.refreshToken(token);

  const res = sendResponse({
    statusCode: 200,
    message: "New access token generated successfully",
    data: null,
  });

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, 
  });

  return res;
});
