import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { IMeta, ISkillCategory } from "@/types";

const SKILL_CATEGORY_URL = "/skill-categories";

export type SkillCategoryQueryArg = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
};

const skillCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSkillCategories: build.query<
      { data: ISkillCategory[]; meta?: IMeta },
      SkillCategoryQueryArg | void
    >({
      query: (arg) => ({
        url: `${SKILL_CATEGORY_URL}`,
        method: "GET",
        params: arg ?? undefined,
      }),
      transformResponse: (response: ISkillCategory[], meta?: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.skillCategory],
    }),
    getSkillCategory: build.query<ISkillCategory, string>({
      query: (id) => ({
        url: `${SKILL_CATEGORY_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.skillCategory],
    }),
    createSkillCategory: build.mutation<
      ISkillCategory,
      Record<string, unknown>
    >({
      query: (data) => ({
        url: `${SKILL_CATEGORY_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.skillCategory, tagTypes.skill],
    }),
    updateSkillCategory: build.mutation<
      ISkillCategory,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `${SKILL_CATEGORY_URL}/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [tagTypes.skillCategory, tagTypes.skill],
    }),
    deleteSkillCategory: build.mutation<ISkillCategory, string>({
      query: (id) => ({
        url: `${SKILL_CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.skillCategory, tagTypes.skill],
    }),
    reorderSkillCategories: build.mutation<
      ISkillCategory[],
      { ids: string[] }
    >({
      query: ({ ids }) => ({
        url: `${SKILL_CATEGORY_URL}/reorder`,
        method: "PATCH",
        data: { ids },
      }),
      invalidatesTags: [tagTypes.skillCategory, tagTypes.skill],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSkillCategoriesQuery,
  useGetSkillCategoryQuery,
  useCreateSkillCategoryMutation,
  useUpdateSkillCategoryMutation,
  useDeleteSkillCategoryMutation,
  useReorderSkillCategoriesMutation,
} = skillCategoryApi;
