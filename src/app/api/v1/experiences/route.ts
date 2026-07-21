import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { ExperienceService } from "@/server/modules/experience/experience.service";
import { experienceFilterableFields } from "@/server/modules/experience/experience.constant";
import { ExperienceValidationSchema } from "@/server/modules/experience/experience.validation";
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

export const POST = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  const body = await req.json();
  ExperienceValidationSchema.create.parse({ body });

  const data = await ExperienceService.create(body);
  return sendResponse({
    statusCode: 201,
    message: "Experience created successfully",
    data,
  });
});
