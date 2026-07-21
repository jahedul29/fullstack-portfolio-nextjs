import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { pickQueryParams } from "@/server/lib/pagination";
import { authGuard } from "@/server/lib/authGuard";
import { USER_ROLE, userFilterableFields } from "@/server/modules/user/user.constant";
import { UserService } from "@/server/modules/user/user.service";
import { UserValidationSchema } from "@/server/modules/user/user.validation";
import { IUser } from "@/server/modules/user/user.interface";

const PAGINATION_KEYS = ["page", "limit", "sortBy", "sortOrder"];

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN]);

  const sp = req.nextUrl.searchParams;
  const filters = pickQueryParams(sp, userFilterableFields);
  const options = pickQueryParams(sp, PAGINATION_KEYS);
  const result = await UserService.findAll(filters, options);
  return sendResponse({
    statusCode: 200,
    message: "Users fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const POST = handler(async (req: NextRequest) => {
  await connectDb();
  await authGuard(req, [USER_ROLE.ADMIN]);

  const body = await req.json();
  UserValidationSchema.create.parse({ body });

  const savedUser = await UserService.create(body);

  // UserService.create builds the doc via `User.create(...).toObject()`,
  // which bypasses the schema's `password: { select: 0 }` (that option only
  // applies to query results). Strip it here before responding, mirroring
  // the old Express UserController.create.
  let data: Omit<IUser, "password"> | null = null;
  if (savedUser) {
    const { password: _password, ...rest } = savedUser as IUser & {
      password?: string;
    };
    data = rest;
  }

  return sendResponse({
    statusCode: 201,
    message: "User created successfully",
    data,
  });
});
