import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { IBlog, IMeta } from "@/types";

const BLOG_URL = "/blogs";

export type BlogQueryArg = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  isFeatured?: boolean;
};

const blogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBlogs: build.query<{ data: IBlog[]; meta?: IMeta }, BlogQueryArg | void>({
      query: (arg) => ({
        url: `${BLOG_URL}`,
        method: "GET",
        params: arg ?? undefined,
      }),
      transformResponse: (response: IBlog[], meta?: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.blog],
    }),
    getBlogById: build.query<IBlog, string>({
      query: (id) => ({
        url: `${BLOG_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.blog],
    }),
    createBlog: build.mutation<IBlog, Record<string, unknown>>({
      query: (data) => ({
        url: `${BLOG_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.blog],
    }),
    updateBlog: build.mutation<
      IBlog,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `${BLOG_URL}/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [tagTypes.blog],
    }),
    deleteBlog: build.mutation<IBlog, string>({
      query: (id) => ({
        url: `${BLOG_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blog],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
