import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { BlogService } from "@/server/modules/blog/blog.service";

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
