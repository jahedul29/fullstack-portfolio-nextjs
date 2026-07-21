import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { OwnerService } from "@/server/modules/owner/owner.service";
import { OwnerValidationSchema } from "@/server/modules/owner/owner.validation";

export const dynamic = "force-dynamic";

export const POST = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  const body = await req.json();
  OwnerValidationSchema.create.parse({ body });

  const data = await OwnerService.create(body);
  return sendResponse({
    statusCode: 201,
    message: "Owner created successfully",
    data,
  });
});
