import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ZodError } from "zod";
import httpStatus from "http-status";
import { ApiError } from "./ApiError";

type IErrorMessage = {
  path: string;
  message: string;
};

type RouteContext = { params: any };

type RouteHandlerFn = (req: NextRequest, context: RouteContext) => Promise<NextResponse>;

const errorResponse = (
  statusCode: number,
  message: string,
  errorMessages: IErrorMessage[]
): NextResponse => {
  return NextResponse.json(
    {
      success: false,
      message,
      errorMessages,
    },
    { status: statusCode }
  );
};

const hasDuplicateKeyCode = (err: unknown): err is { code: 11000; message?: string } => {
  return typeof err === "object" && err !== null && (err as { code?: unknown }).code === 11000;
};

export const handler = (fn: RouteHandlerFn) => {
  return async (req: NextRequest, context: RouteContext): Promise<NextResponse> => {
    try {
      return await fn(req, context);
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages: IErrorMessage[] = err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        return errorResponse(httpStatus.BAD_REQUEST, "Validation Error", errorMessages);
      }

      if (err instanceof ApiError) {
        return errorResponse(
          err.statusCode,
          err.message,
          err.message ? [{ path: "", message: err.message }] : []
        );
      }

      if (err instanceof mongoose.Error.ValidationError) {
        const errorMessages: IErrorMessage[] = Object.values(err.errors).map((el) => ({
          path: el?.path ?? "",
          message: el?.message ?? "",
        }));
        return errorResponse(httpStatus.BAD_REQUEST, err.message, errorMessages);
      }

      if (err instanceof mongoose.Error.CastError) {
        return errorResponse(httpStatus.BAD_REQUEST, "Validation Error", [
          { path: err.path, message: err.message },
        ]);
      }

      if (hasDuplicateKeyCode(err)) {
        const message = err.message ?? "Duplicate key error";
        return errorResponse(httpStatus.CONFLICT, message, [{ path: "", message }]);
      }

      return errorResponse(httpStatus.INTERNAL_SERVER_ERROR, "something went wrong", [
        { path: "", message: "something went wrong" },
      ]);
    }
  };
};
