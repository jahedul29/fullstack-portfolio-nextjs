// Signature endpoint for SIGNED Cloudinary uploads from the admin panel
// (next-cloudinary's <CldUploadWidget signatureEndpoint="..."> posts the
// widget's `paramsToSign` here and expects the raw `{ signature }` shape back
// - see https://next.cloudinary.dev/clduploadwidget). There is no public
// (unsigned) upload preset/surface: only an authenticated admin/manager can
// obtain a signature, and the signature itself is scoped to the exact params
// the widget sent (folder, timestamp, etc.), so it can't be replayed for an
// arbitrary upload.
//
// NOTE: This route intentionally does NOT use `sendResponse` (which wraps
// every other route's body in the frozen `{ success, statusCode, message,
// data, meta }` envelope). next-cloudinary reads `signature` directly off the
// top-level JSON body, so wrapping it here would break the widget. This is
// the one documented exception to the frozen response-shape rule.
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { authGuard } from "@/server/lib/authGuard";
import { ApiError } from "@/server/lib/ApiError";
import { USER_ROLE } from "@/server/modules/user/user.constant";
import { config } from "@/server/lib/config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Auth first: no signature is generated for anyone but an authed
    // admin/manager, so there's no unsigned/public upload path.
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
