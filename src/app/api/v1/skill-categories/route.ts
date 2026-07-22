import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { SkillCategoryService } from "@/server/modules/skillCategory/skillCategory.service";
import { skillCategoryFilterableFields } from "@/server/modules/skillCategory/skillCategory.constant";
import { SkillCategoryValidationSchema } from "@/server/modules/skillCategory/skillCategory.validation";
import dataFetchingTags from "@/constants/dataFetchingTags";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, skillCategoryFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await SkillCategoryService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Skill categories fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const POST = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  const body = await req.json();
  SkillCategoryValidationSchema.create.parse({ body });

  const data = await SkillCategoryService.create(body);

  revalidateTag(dataFetchingTags.skills);
  revalidateTag(dataFetchingTags.skillCategories);

  return sendResponse({
    statusCode: 201,
    message: "Skill category created successfully",
    data,
  });
});
