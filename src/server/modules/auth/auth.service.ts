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
