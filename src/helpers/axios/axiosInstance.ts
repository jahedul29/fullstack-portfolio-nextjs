import { ResponseSuccessType } from "@/types";
import axios from "axios";

const instance = axios.create();

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;
// Auth now travels via the httpOnly accessToken/refreshToken cookies set by
// the login route handler, so every request must include credentials instead
// of attaching a bearer token pulled from localStorage.
instance.defaults.withCredentials = true;

// Add a response interceptor
instance.interceptors.response.use(
  //@ts-ignore
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    };
    return responseObject;
  },
  function (error) {
    const errorObj = {
      statusCode: error?.response?.data?.statusCode || 500,
      message: error?.response?.data?.message || "something went wrong",
      errorMessages: error?.response?.data?.messages,
    };
    // return Promise.reject(error);
    return errorObj;
  }
);

export { instance };
