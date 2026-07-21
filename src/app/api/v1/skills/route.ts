import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { SkillService } from "@/server/modules/skill/skill.service";
import { skillFilterableFields } from "@/server/modules/skill/skill.constant";
import { SkillValidationSchema } from "@/server/modules/skill/skill.validation";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, skillFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await SkillService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Skills fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const POST = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  const body = await req.json();
  SkillValidationSchema.create.parse({ body });

  const data = await SkillService.create(body);
  return sendResponse({
    statusCode: 201,
    message: "Skill created successfully",
    data,
  });
});
