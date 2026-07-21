import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { IOwner } from "@/types";

const OWNER_URL = "/owners";

const ownerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOwner: build.query<IOwner, void>({
      query: () => ({
        url: `${OWNER_URL}/getOwner`,
        method: "GET",
      }),
      providesTags: [tagTypes.owner],
    }),
    updateOwner: build.mutation<
      IOwner,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `${OWNER_URL}/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [tagTypes.owner],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOwnerQuery, useUpdateOwnerMutation } = ownerApi;
