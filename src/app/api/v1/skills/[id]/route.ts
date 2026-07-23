import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { SkillService } from "@/server/modules/skill/skill.service";
import { SkillValidationSchema } from "@/server/modules/skill/skill.validation";
import dataFetchingTags from "@/constants/dataFetchingTags";

export const dynamic = "force-dynamic";

export const GET = handler(
  async (_req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    const data = await SkillService.findOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Skill fetched successfully",
      data,
    });
  }
);

export const PATCH = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const body = await req.json();
    SkillValidationSchema.update.parse({ body });

    const data = await SkillService.update(body, ctx.params.id);

    revalidateTag(dataFetchingTags.skills);
    revalidateTag(dataFetchingTags.projects);
    revalidateTag(dataFetchingTags.experiences);
    revalidateTag(dataFetchingTags.contributions);

    return sendResponse({
      statusCode: 200,
      message: "Skill updated successfully",
      data,
    });
  }
);

export const DELETE = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const data = await SkillService.deleteOne(ctx.params.id);

    revalidateTag(dataFetchingTags.skills);
    revalidateTag(dataFetchingTags.projects);
    revalidateTag(dataFetchingTags.experiences);
    revalidateTag(dataFetchingTags.contributions);

    return sendResponse({
      statusCode: 200,
      message: "Skill deleted successfully",
      data,
    });
  }
);
