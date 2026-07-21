// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/user/user.service.ts
//
// Transforms: helpers/paginationHelper -> @/server/lib/pagination;
// shared/errors/errors.clsses -> @/server/lib/ApiError; shared/interfaces ->
// @/server/lib/interfaces; shared/enum/common -> ./user.constant (single home
// for USER_ROLE/USER_STATUS, see step 5 of the port). Function names
// (create/update/findAll/findOne/deleteOne) preserved exactly.
import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { calculatePagination } from "@/server/lib/pagination";
import { ApiError } from "@/server/lib/ApiError";
import { IPaginationParams } from "@/server/lib/interfaces";
import {
  USER_ROLE,
  USER_STATUS,
  userSearchableFields,
} from "./user.constant";
import { IUser, IUserFilters } from "./user.interface";
import { User } from "./user.model";

const create = async (user: IUser): Promise<IUser | null> => {
  // FU-F/task 9b: this used to hard-code role=MANAGER/status=ACTIVE on every
  // create, which meant an admin could never create another admin from the
  // admin panel. Honor the incoming role/status when the caller (validated
  // by user.validation's create schema) supplies them, falling back to the
  // previous defaults otherwise.
  user.status = user.status ?? USER_STATUS.ACTIVE;
  user.role = user.role ?? USER_ROLE.MANAGER;

  const savedUser = (await User.create(user)).toObject();
  return savedUser;
};

const update = async (
  user: Partial<IUser>,
  id: string
): Promise<IUser | null> => {
  const isExist = await User.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUserData: Partial<IUser> = { ...user };

  const savedUser = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  });

  return savedUser;
};

const findAll = async (
  filters: IUserFilters,
  paginationParams: IPaginationParams
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationParams);

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortBy) {
    sortCondition[sortBy] = sortOrder;
  }

  // working on filtering
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  let filterCondition = {};
  const searchableFields: string[] = userSearchableFields;

  if (searchTerm) {
    andConditions.push({
      $or: searchableFields.map((field: string) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });

    filterCondition = { $and: andConditions };
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });

    filterCondition = { $and: andConditions };
  }

  const result = await User.find(filterCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filterCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const findOne = async (id: string): Promise<IUser | null> => {
  const savedUser = await User.findById(id);
  if (!savedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return savedUser;
};

const deleteOne = async (id: string): Promise<IUser | null> => {
  const savedUser = await User.findByIdAndDelete(id);
  return savedUser;
};

export const UserService = {
  create,
  update,
  findAll,
  findOne,
  deleteOne,
};
