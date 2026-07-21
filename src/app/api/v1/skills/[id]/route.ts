import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { SkillService } from "@/server/modules/skill/skill.service";

export const dynamic = "force-dynamic";

export const GET = handler(
  async (_req: NextRequest, ctx: { params: { id: string } }) => {
    await connectDb();
    // SkillService.findOne already throws ApiError(NOT_FOUND) when missing.
    const data = await SkillService.findOne(ctx.params.id);
    return sendResponse({
      statusCode: 200,
      message: "Skill fetched successfully",
      data,
    });
  }
);
