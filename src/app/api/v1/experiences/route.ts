import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { ExperienceService } from "@/server/modules/experience/experience.service";
import { experienceFilterableFields } from "@/server/modules/experience/experience.constant";
// FU-C: experience.service's findAll/findOne populate("technologies") -> ref
// "Skill". Force Skill model registration before any populate runs.
import "@/server/modules/skill/skill.model";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, experienceFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await ExperienceService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Experiences fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});
