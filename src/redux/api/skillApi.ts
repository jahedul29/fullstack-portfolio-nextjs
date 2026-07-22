import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { IMeta, ISkill } from "@/types";

const SKILL_URL = "/skills";

export type SkillQueryArg = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
};

const skillApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSkills: build.query<
      { data: ISkill[]; meta?: IMeta },
      SkillQueryArg | void
    >({
      query: (arg) => ({
        url: `${SKILL_URL}`,
        method: "GET",
        params: arg ?? undefined,
      }),
      transformResponse: (response: ISkill[], meta?: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.skill],
    }),
    getSkillById: build.query<ISkill, string>({
      query: (id) => ({
        url: `${SKILL_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.skill],
    }),
    createSkill: build.mutation<ISkill, Record<string, unknown>>({
      query: (data) => ({
        url: `${SKILL_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.skill],
    }),
    updateSkill: build.mutation<
      ISkill,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `${SKILL_URL}/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [tagTypes.skill],
    }),
    deleteSkill: build.mutation<ISkill, string>({
      query: (id) => ({
        url: `${SKILL_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.skill],
    }),
    reorderSkills: build.mutation<ISkill[], { ids: string[] }>({
      query: ({ ids }) => ({
        url: `${SKILL_URL}/reorder`,
        method: "PATCH",
        data: { ids },
      }),
      invalidatesTags: [tagTypes.skill],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSkillsQuery,
  useGetSkillByIdQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useReorderSkillsMutation,
} = skillApi;
