
export type IPaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type IPaginationResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

export const calculatePagination = (options: IPaginationParams): IPaginationResult => {
  const page = Number(options?.page || 1);
  const limit = Number(options?.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = options?.sortBy || "createdAt";
  const sortOrder = options?.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const pickQueryParams = <K extends string>(
  searchParams: URLSearchParams,
  keys: K[]
): Partial<Record<K, string>> => {
  const finalObject: Partial<Record<K, string>> = {};

  for (const key of keys) {
    if (searchParams.has(key)) {
      const value = searchParams.get(key);
      if (value !== null) {
        finalObject[key] = value;
      }
    }
  }

  return finalObject;
};
