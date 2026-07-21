import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { IExperience, IMeta } from "@/types";

const EXPERIENCE_URL = "/experiences";

export type ExperienceQueryArg = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  show?: boolean;
};

const experienceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExperiences: build.query<
      { data: IExperience[]; meta?: IMeta },
      ExperienceQueryArg | void
    >({
      query: (arg) => ({
        url: `${EXPERIENCE_URL}`,
        method: "GET",
        params: arg ?? undefined,
      }),
      transformResponse: (response: IExperience[], meta?: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.experience],
    }),
    getExperienceById: build.query<IExperience, string>({
      query: (id) => ({
        url: `${EXPERIENCE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.experience],
    }),
    createExperience: build.mutation<IExperience, Record<string, unknown>>({
      query: (data) => ({
        url: `${EXPERIENCE_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.experience],
    }),
    updateExperience: build.mutation<
      IExperience,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `${EXPERIENCE_URL}/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [tagTypes.experience],
    }),
    deleteExperience: build.mutation<IExperience, string>({
      query: (id) => ({
        url: `${EXPERIENCE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.experience],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExperiencesQuery,
  useGetExperienceByIdQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi;
