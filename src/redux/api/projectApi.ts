import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { IMeta, IProject } from "@/types";

const PROJECT_URL = "/projects";

export type ProjectQueryArg = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
};

const projectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<
      { data: IProject[]; meta?: IMeta },
      ProjectQueryArg | void
    >({
      query: (arg) => ({
        url: `${PROJECT_URL}`,
        method: "GET",
        params: arg ?? undefined,
      }),
      transformResponse: (response: IProject[], meta?: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.project],
    }),
    getProjectById: build.query<IProject, string>({
      query: (id) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.project],
    }),
    createProject: build.mutation<IProject, Record<string, unknown>>({
      query: (data) => ({
        url: `${PROJECT_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.project],
    }),
    updateProject: build.mutation<
      IProject,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [tagTypes.project],
    }),
    deleteProject: build.mutation<IProject, string>({
      query: (id) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.project],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
