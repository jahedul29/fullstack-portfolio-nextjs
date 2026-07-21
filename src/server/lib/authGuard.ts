import { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { ApiError } from "./ApiError";
import { jwtHelpers } from "./jwt";
import { config } from "./config";

export const authGuard = async (
  req: NextRequest,
  roles: string[] = []
): Promise<JwtPayload> => {
  const token = req.cookies.get("accessToken")?.value ?? req.headers.get("authorization");

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  let verifiedUser: JwtPayload;
  try {
    verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  if (roles.length && !roles.includes(verifiedUser.role)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }

  return verifiedUser;
};
