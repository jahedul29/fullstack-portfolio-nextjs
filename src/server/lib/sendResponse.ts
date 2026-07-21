// Ported from the old Express server: fullstack-portfolio-server/src/shared/sendResponse.ts
// The success body shape is FROZEN — keep byte-identical to the old Express response.
import { NextResponse } from "next/server";

type IApiResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
};

export const sendResponse = <T>(data: IApiResponse<T>): NextResponse => {
  return NextResponse.json(
    {
      success: true,
      statusCode: data.statusCode,
      message: data.message ?? null,
      data: data.data ?? null,
      meta: data.meta,
    },
    { status: data.statusCode }
  );
};
