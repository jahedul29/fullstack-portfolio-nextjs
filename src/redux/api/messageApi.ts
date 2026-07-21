import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { IMessage, IMeta } from "@/types";

const MESSAGE_URL = "/messages";

export type MessageQueryArg = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  isRead?: boolean;
};

const messageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMessages: build.query<
      { data: IMessage[]; meta?: IMeta },
      MessageQueryArg | void
    >({
      query: (arg) => ({
        url: `${MESSAGE_URL}`,
        method: "GET",
        params: arg ?? undefined,
      }),
      transformResponse: (response: IMessage[], meta?: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.message],
    }),
    getMessage: build.query<IMessage, string>({
      query: (id) => ({
        url: `${MESSAGE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.message],
    }),
    createMessage: build.mutation<IMessage, Record<string, unknown>>({
      query: (data) => ({
        url: `${MESSAGE_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.message],
    }),
    markMessageRead: build.mutation<
      IMessage,
      { id: string; isRead: boolean }
    >({
      query: ({ id, isRead }) => ({
        url: `${MESSAGE_URL}/${id}`,
        method: "PATCH",
        data: { isRead },
      }),
      invalidatesTags: [tagTypes.message],
    }),
    deleteMessage: build.mutation<IMessage, string>({
      query: (id) => ({
        url: `${MESSAGE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.message],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMessagesQuery,
  useGetMessageQuery,
  useCreateMessageMutation,
  useMarkMessageReadMutation,
  useDeleteMessageMutation,
} = messageApi;
