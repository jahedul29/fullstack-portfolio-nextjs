import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { IMeta, IUser } from "@/types";

const USER_URL = "/users";

export type UserQueryArg = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
};

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<{ data: IUser[]; meta?: IMeta }, UserQueryArg | void>(
      {
        query: (arg) => ({
          url: `${USER_URL}`,
          method: "GET",
          params: arg ?? undefined,
        }),
        transformResponse: (response: IUser[], meta?: IMeta) => ({
          data: response,
          meta,
        }),
        providesTags: [tagTypes.user],
      }
    ),
    getUserById: build.query<IUser, string>({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    createUser: build.mutation<IUser, Record<string, unknown>>({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    updateUser: build.mutation<
      IUser,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `${USER_URL}/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    deleteUser: build.mutation<IUser, string>({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
