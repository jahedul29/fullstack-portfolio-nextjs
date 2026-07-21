import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { ExperienceService } from "@/server/modules/experience/experience.service";
import { ExperienceValidationSchema } from "@/server/modules/experience/experience.validation";
// FU-C: findOne populates "technologies" -> ref "Skill"; ensure Skill model is
// registered (see notes in ../route.ts).
import "@/server/modules/skill/skill.model";

export const dynamic = "force-dynamic";

export const GET = handler(
  async (_req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    // ExperienceService.findOne already throws ApiError(NOT_FOUND) when missing.
    const data = await ExperienceService.findOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Experience fetched successfully",
      data,
    });
  }
);

export const PATCH = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const body = await req.json();
    ExperienceValidationSchema.update.parse({ body });

    const data = await ExperienceService.update(body, ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Experience updated successfully",
      data,
    });
  }
);

export const DELETE = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const data = await ExperienceService.deleteOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Experience deleted successfully",
      data,
    });
  }
);
