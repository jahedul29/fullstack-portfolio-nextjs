import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { MessageService } from "@/server/modules/message/message.service";
import { messageFilterableFields } from "@/server/modules/message/message.constant";
import { MessageValidationSchema } from "@/server/modules/message/message.validation";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, messageFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await MessageService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Messages fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const POST = handler(async (req: NextRequest) => {
  await connectDb();

  const body = await req.json();
  MessageValidationSchema.create.parse({ body });

  const data = await MessageService.create(body);
  return sendResponse({
    statusCode: 201,
    message: "Message sent successfully",
    data,
  });
});
