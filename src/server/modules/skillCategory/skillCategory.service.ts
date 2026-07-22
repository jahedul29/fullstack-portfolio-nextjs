import httpStatus from "http-status";
import { SortOrder, Types } from "mongoose";
import { calculatePagination } from "@/server/lib/pagination";
import { ApiError } from "@/server/lib/ApiError";
import { IPaginationParams } from "@/server/lib/interfaces";
import { Skill } from "@/server/modules/skill/skill.model";
import { skillCategorySearchableFields } from "./skillCategory.constant";
import { ISkillCategory, ISkillCategoryFilters } from "./skillCategory.interface";
import { SkillCategory } from "./skillCategory.model";

const create = async (
  skillCategory: ISkillCategory
): Promise<ISkillCategory | null> => {
  const skillCategoryData = { ...skillCategory };

  if (
    skillCategoryData.position === undefined ||
    skillCategoryData.position === null
  ) {
    skillCategoryData.position = await SkillCategory.countDocuments();
  }

  const savedSkillCategory = (
    await SkillCategory.create(skillCategoryData)
  ).toObject();
  return savedSkillCategory;
};

const update = async (
  skillCategory: Partial<ISkillCategory>,
  id: string
): Promise<ISkillCategory | null> => {
  const isExist = await SkillCategory.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill category not found");
  }

  const updatedSkillCategoryData: Partial<ISkillCategory> = {
    ...skillCategory,
  };

  if (
    updatedSkillCategoryData.name &&
    updatedSkillCategoryData.name !== isExist.name
  ) {
    await Skill.updateMany(
      { category: isExist.name },
      { $set: { category: updatedSkillCategoryData.name } }
    );
  }

  const savedSkillCategory = await SkillCategory.findOneAndUpdate(
    { _id: id },
    updatedSkillCategoryData,
    {
      new: true,
    }
  );

  return savedSkillCategory;
};

const findAll = async (
  filters: ISkillCategoryFilters,
  paginationParams: IPaginationParams
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationParams);

  const sortCondition: { [key: string]: SortOrder } = {};
  if (paginationParams?.sortBy) {
    sortCondition[sortBy] = sortOrder;
  } else {
    sortCondition.position = 1;
    sortCondition.createdAt = 1;
  }

  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  let filterCondition = {};
  const searchableFields: string[] = skillCategorySearchableFields;

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

  const result = await SkillCategory.find(filterCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await SkillCategory.countDocuments(filterCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const findOne = async (id: string): Promise<ISkillCategory | null> => {
  const savedSkillCategory = await SkillCategory.findById(id);
  if (!savedSkillCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill category not found");
  }
  return savedSkillCategory;
};

const deleteOne = async (id: string): Promise<ISkillCategory | null> => {
  const isExist = await SkillCategory.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill category not found");
  }

  await Skill.updateMany(
    { category: isExist.name },
    { $unset: { category: "" } }
  );

  const savedSkillCategory = await SkillCategory.findByIdAndDelete(id);
  return savedSkillCategory;
};

const reorder = async (ids: string[]): Promise<ISkillCategory[]> => {
  await SkillCategory.bulkWrite(
    ids.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { position: index } },
      },
    }))
  );

  const reorderedSkillCategories = await SkillCategory.find({
    _id: { $in: ids },
  }).sort({
    position: 1,
  });

  return reorderedSkillCategories;
};

export const SkillCategoryService = {
  create,
  update,
  findAll,
  findOne,
  deleteOne,
  reorder,
};
