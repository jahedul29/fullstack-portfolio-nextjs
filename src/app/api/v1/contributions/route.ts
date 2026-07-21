import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { ContributionService } from "@/server/modules/contribution/contribution.service";
import { contributionFilterableFields } from "@/server/modules/contribution/contribution.constant";
import { ContributionValidationSchema } from "@/server/modules/contribution/contribution.validation";
// FU-C: contribution.service's findAll/findOne populate("technologies") ->
// ref "Skill". Force Skill model registration before any populate runs (see
// notes in ../projects/route.ts).
import "@/server/modules/skill/skill.model";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, contributionFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await ContributionService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Contributions fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const POST = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  // Validate only and pass the raw body through (see ../projects/route.ts):
  // the create schema doesn't declare `priorityScore`, which the
  // Contribution model requires with no default.
  const body = await req.json();
  ContributionValidationSchema.create.parse({ body });

  const data = await ContributionService.create(body);
  return sendResponse({
    statusCode: 201,
    message: "Contribution created successfully",
    data,
  });
});
