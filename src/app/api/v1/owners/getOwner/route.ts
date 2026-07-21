import { NextRequest } from "next/server";
import { connectDb } from "@/server/db";
import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";
import { OwnerService } from "@/server/modules/owner/owner.service";

export const dynamic = "force-dynamic";

export const GET = handler(async (_req: NextRequest) => {
  await connectDb();
  const data = await OwnerService.getOwner();
  return sendResponse({
    statusCode: 200,
    message: "Owner fetched successfully",
    data,
  });
});
