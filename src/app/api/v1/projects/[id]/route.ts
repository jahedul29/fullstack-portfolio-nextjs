import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { ProjectService } from "@/server/modules/project/project.service";
import { ProjectValidationSchema } from "@/server/modules/project/project.validation";
// FU-C: findOne populates "technologies" -> ref "Skill"; ensure Skill model is
// registered (see notes in ../route.ts).
import "@/server/modules/skill/skill.model";

export const dynamic = "force-dynamic";

export const GET = handler(
  async (_req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    // ProjectService.findOne already throws ApiError(NOT_FOUND) when missing.
    const data = await ProjectService.findOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Project fetched successfully",
      data,
    });
  }
);

export const PATCH = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const body = await req.json();
    ProjectValidationSchema.update.parse({ body });

    const data = await ProjectService.update(body, ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Project updated successfully",
      data,
    });
  }
);

export const DELETE = handler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const data = await ProjectService.deleteOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Project deleted successfully",
      data,
    });
  }
);
