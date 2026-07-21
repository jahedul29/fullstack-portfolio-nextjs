import { NextRequest } from "next/server";
import httpStatus from "http-status";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { ApiError } from "@/server/lib/ApiError";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { UserService } from "@/server/modules/user/user.service";

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();

  const payload = await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  const user = await UserService.findOne(payload.id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return sendResponse({
    statusCode: 200,
    message: "User fetched successfully",
    data: user,
  });
});
