// Shared response/error interface shapes ported from the old Express server:
// fullstack-portfolio-server/src/shared/interfaces/index.ts
// fullstack-portfolio-server/src/shared/errors/errors.interfaces.ts
//
// `IPaginationParams` already lives in `./pagination` (Task 2) — re-exported
// here so module services can import every shared shape from one place, per
// the old `shared/interfaces` import site.
export type { IPaginationParams } from "./pagination";

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};
