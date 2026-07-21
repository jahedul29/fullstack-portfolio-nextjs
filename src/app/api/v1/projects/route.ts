import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { ProjectService } from "@/server/modules/project/project.service";
import { projectFilterableFields } from "@/server/modules/project/project.constant";
import { ProjectValidationSchema } from "@/server/modules/project/project.validation";
// FU-C: project.service's findAll/findOne populate("technologies") -> ref "Skill".
// Force Skill model registration before any populate runs by importing the model
// (side-effect only) here, since project.service.ts itself never imports it.
import "@/server/modules/skill/skill.model";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, projectFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await ProjectService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Projects fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const POST = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  // Validate only (as the old Express `validateRequest` middleware did) and
  // pass the raw JSON body through to the service, not the Zod-stripped
  // result: the create schema doesn't declare every model field (e.g.
  // `priorityScore`, which the model requires with no default), so using the
  // narrowed/stripped parse result here would silently drop it.
  const body = await req.json();
  ProjectValidationSchema.create.parse({ body });

  const data = await ProjectService.create(body);
  return sendResponse({
    statusCode: 201,
    message: "Project created successfully",
    data,
  });
});
