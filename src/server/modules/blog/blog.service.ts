// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/blog/blog.service.ts
//
// Transforms: helpers/paginationHelper -> @/server/lib/pagination;
// shared/errors/errors.clsses -> @/server/lib/ApiError; shared/interfaces ->
// @/server/lib/interfaces; Blog model default import -> named import with
// the mongoose recompile guard. Function names preserved exactly.
import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { calculatePagination } from "@/server/lib/pagination";
import { ApiError } from "@/server/lib/ApiError";
import { IPaginationParams } from "@/server/lib/interfaces";
import { blogSearchableFields } from "./blog.constant";
import { IBlog, IBlogFilters } from "./blog.interface";
import { Blog } from "./blog.model";

const create = async (blog: IBlog): Promise<IBlog | null> => {
  const savedBlog = (await Blog.create(blog)).toObject();
  return savedBlog;
};

const update = async (
  blog: Partial<IBlog>,
  id: string
): Promise<IBlog | null> => {
  const isExist = await Blog.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const updatedBlogData: Partial<IBlog> = { ...blog };

  const savedBlog = await Blog.findOneAndUpdate({ _id: id }, updatedBlogData, {
    new: true,
  });

  return savedBlog;
};

const findAll = async (
  filters: IBlogFilters,
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
  const searchableFields: string[] = blogSearchableFields;

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

  const result = await Blog.find(filterCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments(filterCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const findOne = async (id: string): Promise<IBlog | null> => {
  const savedBlog = await Blog.findById(id);
  if (!savedBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }
  return savedBlog;
};

const deleteOne = async (id: string): Promise<IBlog | null> => {
  const savedBlog = await Blog.findByIdAndDelete(id);
  return savedBlog;
};

export const BlogService = {
  create,
  update,
  findAll,
  findOne,
  deleteOne,
};
