import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { UserService } from "@/server/modules/user/user.service";
import { UserValidationSchema } from "@/server/modules/user/user.validation";

export const dynamic = "force-dynamic";

export const GET = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    // UserService.findOne already throws ApiError(NOT_FOUND) when missing.
    const data = await UserService.findOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "User fetched successfully",
      data,
    });
  }
);

export const PATCH = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN]);

    const body = await req.json();
    UserValidationSchema.update.parse({ body });

    const data = await UserService.update(body, ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "User updated successfully",
      data,
    });
  }
);

export const DELETE = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN]);

    const data = await UserService.deleteOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "User deleted successfully",
      data,
    });
  }
);
