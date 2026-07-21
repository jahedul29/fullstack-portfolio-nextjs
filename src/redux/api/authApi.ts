import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const AUTH_URL = "/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        data: loginData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    logout: build.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.user],
    }),
    me: build.query({
      query: () => ({
        url: `${AUTH_URL}/me`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
  }),
  overrideExisting: false,
});

export const { useUserLoginMutation, useLogoutMutation, useMeQuery } = authApi;
