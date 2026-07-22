import httpStatus from "http-status";
import { SortOrder, Types } from "mongoose";
import { calculatePagination } from "@/server/lib/pagination";
import { ApiError } from "@/server/lib/ApiError";
import { IPaginationParams } from "@/server/lib/interfaces";
import { skillSearchableFields } from "./skill.constant";
import { ISkill, ISkillFilters } from "./skill.interface";
import { Skill } from "./skill.model";

const create = async (skill: ISkill): Promise<ISkill | null> => {
  const skillData = { ...skill };

  if (skillData.position === undefined || skillData.position === null) {
    skillData.position = await Skill.countDocuments();
  }

  const savedSkill = (await Skill.create(skillData)).toObject();
  return savedSkill;
};

const update = async (
  skill: Partial<ISkill>,
  id: string
): Promise<ISkill | null> => {
  const isExist = await Skill.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill not found");
  }

  const updatedSkillData: Partial<ISkill> = { ...skill };

  const savedSkill = await Skill.findOneAndUpdate(
    { _id: id },
    updatedSkillData,
    {
      new: true,
    }
  );

  return savedSkill;
};

const findAll = async (
  filters: ISkillFilters,
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
  const searchableFields: string[] = skillSearchableFields;

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

  const result = await Skill.find(filterCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Skill.countDocuments(filterCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const findOne = async (id: string): Promise<ISkill | null> => {
  const savedSkill = await Skill.findById(id);
  if (!savedSkill) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill not found");
  }
  return savedSkill;
};

const deleteOne = async (id: string): Promise<ISkill | null> => {
  const savedSkill = await Skill.findByIdAndDelete(id);
  return savedSkill;
};

const reorder = async (ids: string[]): Promise<ISkill[]> => {
  await Skill.bulkWrite(
    ids.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { position: index } },
      },
    }))
  );

  const reorderedSkills = await Skill.find({ _id: { $in: ids } }).sort({
    position: 1,
  });

  return reorderedSkills;
};

export const SkillService = {
  create,
  update,
  findAll,
  findOne,
  deleteOne,
  reorder,
};
