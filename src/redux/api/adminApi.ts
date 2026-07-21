import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const ADMIN_URL = "/admins";

const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // admins: build.query({
    //   query: (arg: Record<string, any>) => ({
    //     url: `${ADMIN_URL}`,
    //     method: "GET",
    //     params: arg,
    //   }),
    //   transformResponse: (response: IDepartment[], meta: IMeta) => {
    //     return {
    //       admins: response,
    //       meta,
    //     };
    //   },
    //   providesTags: [tagTypes.admin],
    // }),
    getAdminById: build.query({
      query: (id) => ({
        url: `${ADMIN_URL}/${id}`,
        method: "GET",
      }),
    }),
    addAdmin: build.mutation({
      query: (data) => ({
        url: `/users/create-admin`,
        method: "POST",
        data: data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.admin],
    }),
    updateAdmin: build.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.admin],
    }),
    deleteAdmin: build.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.admin],
    }),
  }),
});

export const {
  // useAdminsQuery,
  useGetAdminByIdQuery,
  useAddAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;
