import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { ContributionService } from "@/server/modules/contribution/contribution.service";
import { ContributionValidationSchema } from "@/server/modules/contribution/contribution.validation";
import "@/server/modules/skill/skill.model";
import dataFetchingTags from "@/constants/dataFetchingTags";

export const dynamic = "force-dynamic";

export const GET = handler(
  async (_req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    const data = await ContributionService.findOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Contribution fetched successfully",
      data,
    });
  }
);

export const PATCH = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const body = await req.json();
    ContributionValidationSchema.update.parse({ body });

    const data = await ContributionService.update(body, ctx.params.id);

    revalidateTag(dataFetchingTags.contributions);

    return sendResponse({
      statusCode: 200,
      message: "Contribution updated successfully",
      data,
    });
  }
);

export const DELETE = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const data = await ContributionService.deleteOne(ctx.params.id);

    revalidateTag(dataFetchingTags.contributions);

    return sendResponse({
      statusCode: 200,
      message: "Contribution deleted successfully",
      data,
    });
  }
);
