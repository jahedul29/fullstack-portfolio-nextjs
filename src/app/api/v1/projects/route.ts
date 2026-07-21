import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { ProjectService } from "@/server/modules/project/project.service";
import { projectFilterableFields } from "@/server/modules/project/project.constant";
// FU-C: project.service's findAll/findOne populate("technologies") -> ref "Skill".
// Force Skill model registration before any populate runs by importing the model
// (side-effect only) here, since project.service.ts itself never imports it.
import "@/server/modules/skill/skill.model";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, projectFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await ProjectService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Projects fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});
