import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { calculatePagination } from "@/server/lib/pagination";
import { ApiError } from "@/server/lib/ApiError";
import { IPaginationParams } from "@/server/lib/interfaces";
import { messageSearchableFields } from "./message.constant";
import { IMessage, IMessageFilters } from "./message.interface";
import { Message } from "./message.model";

const notifyWebhook = (message: IMessage): void => {
  const webhookUrl = process.env.MESSAGE_NOTIFY_WEBHOOK_URL;
  if (!webhookUrl) {
    return;
  }

  try {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: message.name,
        email: message.email,
        message: message.message,
      }),
    }).catch(() => undefined);
  } catch {
    return;
  }
};

const create = async (message: IMessage): Promise<IMessage | null> => {
  const savedMessage = (await Message.create(message)).toObject();
  notifyWebhook(savedMessage);
  return savedMessage;
};

const update = async (
  message: Partial<IMessage>,
  id: string
): Promise<IMessage | null> => {
  const isExist = await Message.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }

  const updatedMessageData: Partial<IMessage> = { ...message };

  const savedMessage = await Message.findOneAndUpdate(
    { _id: id },
    updatedMessageData,
    {
      new: true,
    }
  );

  return savedMessage;
};

const findAll = async (
  filters: IMessageFilters,
  paginationParams: IPaginationParams
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationParams);

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortBy) {
    sortCondition[sortBy] = sortOrder;
  }

  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  let filterCondition = {};
  const searchableFields: string[] = messageSearchableFields;

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

  const result = await Message.find(filterCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Message.countDocuments(filterCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const findOne = async (id: string): Promise<IMessage | null> => {
  const savedMessage = await Message.findById(id);
  if (!savedMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }
  return savedMessage;
};

const deleteOne = async (id: string): Promise<IMessage | null> => {
  const savedMessage = await Message.findByIdAndDelete(id);
  return savedMessage;
};

export const MessageService = {
  create,
  update,
  findAll,
  findOne,
  deleteOne,
};
