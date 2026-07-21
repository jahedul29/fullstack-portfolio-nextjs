// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/user/user.interface.ts
/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export type IUser = {
  name: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "manager";
  password: string;
  address: string;
  profileUrl: string;
  status: "active" | "blocked";
};

export type IUserMethods = object;

export interface UserModel extends Model<IUser, object, IUserMethods> {
  isUserExist(email: string): Promise<
    | (Pick<IUser, "email" | "role" | "password"> & {
        _id: Types.ObjectId;
      })
    | null
  >;
  isPasswordMatch(
    givenPassword: string,
    currentPassword: string
  ): Promise<boolean>;
}

export type IUserFilters = {
  searchTerm?: string;
  id?: string;
};
