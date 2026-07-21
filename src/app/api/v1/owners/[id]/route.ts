import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { OwnerService } from "@/server/modules/owner/owner.service";
import { OwnerValidationSchema } from "@/server/modules/owner/owner.validation";

export const dynamic = "force-dynamic";

export const PATCH = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const body = await req.json();
    OwnerValidationSchema.update.parse({ body });

    const data = await OwnerService.update(body, ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Owner updated successfully",
      data,
    });
  }
);
