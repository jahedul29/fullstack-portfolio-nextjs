// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/auth/auth.service.ts
//
// Transforms: config -> @/server/lib/config (config.jwt.expires_in ->
// expiresIn, refresh_secret -> refreshSecret, refresh_expires_in ->
// refreshExpiresIn); helpers/jwtHelpers -> @/server/lib/jwt (JwtHelpers ->
// jwtHelpers); shared/errors/errors.clsses -> @/server/lib/ApiError; User
// model default import -> named import with the mongoose recompile guard.
// `JwtPayload` is a plain data shape from jsonwebtoken, not an Express type,
// so it stays — services remain HTTP-agnostic.
import httpStatus from "http-status";
import { JwtPayload, Secret } from "jsonwebtoken";
import { config } from "@/server/lib/config";
import { jwtHelpers } from "@/server/lib/jwt";
import { ApiError } from "@/server/lib/ApiError";
import { User } from "../user/user.model";
import {
  ILoginResponse,
  ILoginUser,
  IRefreshTokenResponse,
} from "./auth.interface";

const login = async (payload: ILoginUser): Promise<ILoginResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!(await User.isPasswordMatch(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password not match");
  }

  const accessToken = await jwtHelpers.createToken(
    { id: isUserExist._id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string
  );

  const refreshToken = await jwtHelpers.createToken(
    { id: isUserExist._id, role: isUserExist.role },
    config.jwt.refreshSecret as Secret,
    config.jwt.refreshExpiresIn as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (
  refreshToken: string
): Promise<IRefreshTokenResponse> => {
  let verifiedData = null;
  try {
    verifiedData = jwtHelpers.verifyToken(
      refreshToken,
      config.jwt.refreshSecret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Token not valid");
  }

  const { id: userId } = verifiedData;

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const accessToken = await jwtHelpers.createToken(
    { id: isUserExist._id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string
  );

  return {
    accessToken,
  };
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findById(user?.id).select("+password");

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!(await User.isPasswordMatch(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password not match");
  }

  isUserExist.password = newPassword;

  await isUserExist.save();
};

export const AuthService = {
  login,
  refreshToken,
  changePassword,
};
