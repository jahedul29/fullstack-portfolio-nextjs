import { handler } from "@/server/lib/handler";
import { sendResponse } from "@/server/lib/sendResponse";

export const dynamic = "force-dynamic";

export const POST = handler(async () => {
  const res = sendResponse({
    statusCode: 200,
    message: "Logged out successfully",
    data: null,
  });

  res.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
  res.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });

  return res;
});
