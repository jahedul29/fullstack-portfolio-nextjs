import { axiosBaseQuery } from "@/helpers/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypeList } from "../tag-types";
import { getEnvConfig } from "@/helpers/config/envConfig";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: getEnvConfig().api_url }),
  endpoints: () => ({}),
  tagTypes: tagTypeList,
});
