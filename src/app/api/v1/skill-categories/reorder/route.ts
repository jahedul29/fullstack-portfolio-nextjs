import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { SkillCategoryService } from "@/server/modules/skillCategory/skillCategory.service";
import { SkillCategoryValidationSchema } from "@/server/modules/skillCategory/skillCategory.validation";
import dataFetchingTags from "@/constants/dataFetchingTags";

export const dynamic = "force-dynamic";

export const PATCH = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  const body = await req.json();
  const { body: validatedBody } = SkillCategoryValidationSchema.reorder.parse({
    body,
  });

  const data = await SkillCategoryService.reorder(validatedBody.ids);

  revalidateTag(dataFetchingTags.skills);
  revalidateTag(dataFetchingTags.skillCategories);

  return sendResponse({
    statusCode: 200,
    message: "Skill categories reordered successfully",
    data,
  });
});
