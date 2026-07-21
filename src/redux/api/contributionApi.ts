import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { IContribution, IMeta } from "@/types";

const CONTRIBUTION_URL = "/contributions";

export type ContributionQueryArg = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
};

const contributionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getContributions: build.query<
      { data: IContribution[]; meta?: IMeta },
      ContributionQueryArg | void
    >({
      query: (arg) => ({
        url: `${CONTRIBUTION_URL}`,
        method: "GET",
        params: arg ?? undefined,
      }),
      transformResponse: (response: IContribution[], meta?: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.contribution],
    }),
    getContributionById: build.query<IContribution, string>({
      query: (id) => ({
        url: `${CONTRIBUTION_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.contribution],
    }),
    createContribution: build.mutation<IContribution, Record<string, unknown>>({
      query: (data) => ({
        url: `${CONTRIBUTION_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.contribution],
    }),
    updateContribution: build.mutation<
      IContribution,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `${CONTRIBUTION_URL}/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [tagTypes.contribution],
    }),
    deleteContribution: build.mutation<IContribution, string>({
      query: (id) => ({
        url: `${CONTRIBUTION_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.contribution],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetContributionsQuery,
  useGetContributionByIdQuery,
  useCreateContributionMutation,
  useUpdateContributionMutation,
  useDeleteContributionMutation,
} = contributionApi;
