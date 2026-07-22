import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { calculatePagination } from "@/server/lib/pagination";
import { ApiError } from "@/server/lib/ApiError";
import { IPaginationParams } from "@/server/lib/interfaces";
import { projectSearchableFields } from "./project.constant";
import { IProject, IProjectFilters } from "./project.interface";
import { Project } from "./project.model";

const MAX_FEATURED_PER_BUCKET = 3;

const getBucket = (type?: string): "personal" | "professional" =>
  type === "personal" ? "personal" : "professional";

const countFeaturedInBucket = async (
  bucket: "personal" | "professional",
  excludeId?: string
): Promise<number> => {
  const bucketCondition =
    bucket === "personal"
      ? { type: "personal" }
      : { type: { $ne: "personal" } };

  return Project.countDocuments({
    isFeatured: true,
    ...bucketCondition,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  });
};

const assertFeaturedCap = async (
  bucket: "personal" | "professional",
  excludeId?: string
): Promise<void> => {
  const count = await countFeaturedInBucket(bucket, excludeId);
  if (count >= MAX_FEATURED_PER_BUCKET) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can feature at most 3 ${bucket === "personal" ? "side" : "professional"} projects.`
    );
  }
};

const create = async (project: IProject): Promise<IProject | null> => {
  if (project.isFeatured) {
    const bucket = getBucket(project.type);
    await assertFeaturedCap(bucket);
  }

  const savedProject = (await Project.create(project)).toObject();
  return savedProject;
};

const update = async (
  project: Partial<IProject>,
  id: string
): Promise<IProject | null> => {
  const isExist = await Project.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }

  const resultingIsFeatured = project.isFeatured ?? isExist.isFeatured;
  const resultingType = project.type ?? isExist.type;

  if (resultingIsFeatured) {
    const bucket = getBucket(resultingType);
    await assertFeaturedCap(bucket, id);
  }

  const updatedProjectData: Partial<IProject> = { ...project };

  const savedProject = await Project.findOneAndUpdate(
    { _id: id },
    updatedProjectData,
    {
      new: true,
    }
  ).populate("technologies");

  return savedProject;
};

const findAll = async (
  filters: IProjectFilters,
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
  const searchableFields: string[] = projectSearchableFields;

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

  const result = await Project.find(filterCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
    .populate("technologies");

  const total = await Project.countDocuments(filterCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const findOne = async (id: string): Promise<IProject | null> => {
  const savedProject = await Project.findById(id).populate("technologies");
  if (!savedProject) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }
  return savedProject;
};

const deleteOne = async (id: string): Promise<IProject | null> => {
  const savedProject = await Project.findByIdAndDelete(id).populate(
    "technologies"
  );
  return savedProject;
};

export const ProjectService = {
  create,
  update,
  findAll,
  findOne,
  deleteOne,
};
