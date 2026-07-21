import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { SkillService } from "@/server/modules/skill/skill.service";
import { skillFilterableFields } from "@/server/modules/skill/skill.constant";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, skillFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await SkillService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Skills fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});
