// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/project/project.service.ts
//
// Transforms: helpers/paginationHelper -> @/server/lib/pagination;
// shared/errors/errors.clsses -> @/server/lib/ApiError; shared/interfaces ->
// @/server/lib/interfaces; Project model default import -> named import with
// the mongoose recompile guard. Function names preserved exactly.
import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { calculatePagination } from "@/server/lib/pagination";
import { ApiError } from "@/server/lib/ApiError";
import { IPaginationParams } from "@/server/lib/interfaces";
import { projectSearchableFields } from "./project.constant";
import { IProject, IProjectFilters } from "./project.interface";
import { Project } from "./project.model";

const create = async (project: IProject): Promise<IProject | null> => {
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

  // working on filtering
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
