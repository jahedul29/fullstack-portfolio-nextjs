import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const OWNER_URL = "/owners";

const ownerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // getOwner: build.query({
    //     query: (arg: Record<string, any>) => ({
    //       url: `${OWNER_URL}`,
    //       method: "GET",
    //       params: arg,
    //     }),
    //     transformResponse: (response: IDepartment[], meta: IMeta) => {
    //       return {
    //         admins: response,
    //         meta,
    //       };
    //     },
    //     providesTags: [tagTypes.admin],
    //   }),
    getOwner: build.query({
      query: () => ({
        url: `${OWNER_URL}`,
        method: "GET",
      }),
      providesTags: [tagTypes.admin],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOwnerQuery } = ownerApi;
