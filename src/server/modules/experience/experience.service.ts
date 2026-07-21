// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/experience/experience.service.ts
//
// Transforms: helpers/paginationHelper -> @/server/lib/pagination;
// shared/errors/errors.clsses -> @/server/lib/ApiError; shared/interfaces ->
// @/server/lib/interfaces; Experience model default import -> named import
// with the mongoose recompile guard. Function names preserved exactly.
import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { calculatePagination } from "@/server/lib/pagination";
import { ApiError } from "@/server/lib/ApiError";
import { IPaginationParams } from "@/server/lib/interfaces";
import { experienceSearchableFields } from "./experience.constant";
import { IExperience, IExperienceFilters } from "./experience.interface";
import { Experience } from "./experience.model";

const create = async (experience: IExperience): Promise<IExperience | null> => {
  const savedExperience = (await Experience.create(experience)).toObject();
  return savedExperience;
};

const update = async (
  experience: Partial<IExperience>,
  id: string
): Promise<IExperience | null> => {
  const isExist = await Experience.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Experience not found");
  }

  const updatedExperienceData: Partial<IExperience> = { ...experience };

  const savedExperience = await Experience.findOneAndUpdate(
    { _id: id },
    updatedExperienceData,
    {
      new: true,
    }
  ).populate("technologies");

  return savedExperience;
};

const findAll = async (
  filters: IExperienceFilters,
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
  const searchableFields: string[] = experienceSearchableFields;

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

  const result = await Experience.find(filterCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
    .populate("technologies");

  const total = await Experience.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const findOne = async (id: string): Promise<IExperience | null> => {
  const savedExperience = await Experience.findById(id).populate(
    "technologies"
  );
  if (!savedExperience) {
    throw new ApiError(httpStatus.NOT_FOUND, "Experience not found");
  }
  return savedExperience;
};

const deleteOne = async (id: string): Promise<IExperience | null> => {
  const savedExperience = await Experience.findByIdAndDelete(id).populate(
    "technologies"
  );
  return savedExperience;
};

export const ExperienceService = {
  create,
  update,
  findAll,
  findOne,
  deleteOne,
};
