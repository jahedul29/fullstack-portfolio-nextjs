import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { MessageService } from "@/server/modules/message/message.service";
import { MessageValidationSchema } from "@/server/modules/message/message.validation";

export const dynamic = "force-dynamic";

export const GET = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const data = await MessageService.findOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Message fetched successfully",
      data,
    });
  }
);

export const PATCH = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const body = await req.json();
    MessageValidationSchema.update.parse({ body });

    const data = await MessageService.update(body, ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Message updated successfully",
      data,
    });
  }
);

export const DELETE = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const data = await MessageService.deleteOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Message deleted successfully",
      data,
    });
  }
);
