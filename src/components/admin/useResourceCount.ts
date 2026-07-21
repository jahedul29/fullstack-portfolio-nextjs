"use client";

import * as React from "react";
import { instance } from "@/helpers/axios/axiosInstance";
import { getEnvConfig } from "@/helpers/config/envConfig";

// Lightweight one-off count fetch for resources that don't have a full RTK
// Query api module in this pass (contributions/users — dashboard "nice to
// have" stat tiles only, see task-9a-report.md). Not cached/tag-invalidated
// like the rest of admin data; that's fine for a dashboard summary number.
//
// `instance`'s response interceptor (src/helpers/axios/axiosInstance.ts)
// already unwraps the axios response into `{ data, meta }` at runtime, so
// the resolved value here is that plain object, not a real AxiosResponse.
// Unlike `axiosBaseQuery` (used by every RTK Query api module), the raw
// `instance` has no `baseURL` configured, so the `/api/v1` prefix has to be
// added here explicitly.
export function useResourceCount(url: string) {
  const [total, setTotal] = React.useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    instance
      .get(getEnvConfig().api_url + url, { params: { page: 1, limit: 1 } })
      .then((res: any) => {
        if (!cancelled) setTotal(res?.meta?.total);
      })
      .catch(() => {
        if (!cancelled) setTotal(undefined);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { total, isLoading };
}
