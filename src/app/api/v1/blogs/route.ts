import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { BlogService } from "@/server/modules/blog/blog.service";
import { blogFilterableFields } from "@/server/modules/blog/blog.constant";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, blogFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await BlogService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Blogs fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});
