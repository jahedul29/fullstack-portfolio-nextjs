import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { BlogService } from "@/server/modules/blog/blog.service";
import { BlogValidationSchema } from "@/server/modules/blog/blog.validation";

export const dynamic = "force-dynamic";

export const GET = handler(
  async (_req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    // BlogService.findOne already throws ApiError(NOT_FOUND) when missing.
    const data = await BlogService.findOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Blog fetched successfully",
      data,
    });
  }
);

export const PATCH = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const body = await req.json();
    BlogValidationSchema.update.parse({ body });

    const data = await BlogService.update(body, ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Blog updated successfully",
      data,
    });
  }
);

export const DELETE = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const data = await BlogService.deleteOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Blog deleted successfully",
      data,
    });
  }
);
