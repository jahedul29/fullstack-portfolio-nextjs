import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { AuthZodValidation } from "@/server/modules/auth/auth.validation";
import { AuthService } from "@/server/modules/auth/auth.service";

export const dynamic = "force-dynamic";

export const PATCH = handler(async (req: NextRequest) => {
  await connectDb();

  const payload = await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  const body = await req.json();
  const validated = AuthZodValidation.changePasswordValidation.parse({ body });

  await AuthService.changePassword(payload, validated.body);

  return sendResponse({
    statusCode: 200,
    message: "Password changed successfully",
    data: null,
  });
});
