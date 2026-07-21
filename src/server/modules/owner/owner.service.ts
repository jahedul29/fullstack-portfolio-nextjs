import httpStatus from "http-status";
import { ApiError } from "@/server/lib/ApiError";
import { IOwner } from "./owner.interface";
import { Owner } from "./owner.model";

const create = async (user: IOwner): Promise<IOwner | null> => {
  const currentOwner = await Owner.find();

  if (currentOwner.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Owner already exists. Please update the current owner"
    );
  }

  const savedUser = (await Owner.create(user)).toObject();
  return savedUser;
};

const update = async (
  user: Partial<IOwner>,
  id: string
): Promise<IOwner | null> => {
  const isExist = await Owner.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Owner not found");
  }

  const savedUser = await Owner.findOneAndUpdate({ _id: id }, user, {
    new: true,
  });

  return savedUser;
};

const getOwner = async () => {
  const result = await Owner.find();
  if (result.length > 0) {
    return result[0];
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "No owner found");
  }
};

export const OwnerService = {
  create,
  update,
  getOwner,
};
