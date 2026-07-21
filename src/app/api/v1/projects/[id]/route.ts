import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { ProjectService } from "@/server/modules/project/project.service";
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
