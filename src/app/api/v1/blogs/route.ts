import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { BlogService } from "@/server/modules/blog/blog.service";
import { blogFilterableFields } from "@/server/modules/blog/blog.constant";
import { BlogValidationSchema } from "@/server/modules/blog/blog.validation";

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

export const POST = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  // Validate only and pass the raw body through (see projects/route.ts):
  // the create schema doesn't declare `priorityScore`, which the Blog model
  // requires with no default, so the Zod-stripped result would drop it.
  const body = await req.json();
  BlogValidationSchema.create.parse({ body });

  const data = await BlogService.create(body);
  return sendResponse({
    statusCode: 201,
    message: "Blog created successfully",
    data,
  });
});
