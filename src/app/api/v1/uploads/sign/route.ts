import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { authGuard } from "@/server/lib/authGuard";
import { ApiError } from "@/server/lib/ApiError";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { config } from "@/server/lib/config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await authGuard(req, [USER_ROLE.ADMIN, USER_ROLE.MANAGER]);

    const { paramsToSign } = await req.json();

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      config.cloudinary.apiSecret
    );

    return NextResponse.json({ signature });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode ?? 401 }
      );
    }

    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
