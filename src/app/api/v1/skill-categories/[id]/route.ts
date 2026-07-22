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

export const GET = handler(
  async (_req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    const data = await SkillCategoryService.findOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Skill category fetched successfully",
      data,
    });
  }
);

export const PATCH = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const body = await req.json();
    SkillCategoryValidationSchema.update.parse({ body });

    const data = await SkillCategoryService.update(body, ctx.params.id);

    revalidateTag(dataFetchingTags.skills);
    revalidateTag(dataFetchingTags.skillCategories);

    return sendResponse({
      statusCode: 200,
      message: "Skill category updated successfully",
      data,
    });
  }
);

export const DELETE = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const data = await SkillCategoryService.deleteOne(ctx.params.id);

    revalidateTag(dataFetchingTags.skills);
    revalidateTag(dataFetchingTags.skillCategories);

    return sendResponse({
      statusCode: 200,
      message: "Skill category deleted successfully",
      data,
    });
  }
);
