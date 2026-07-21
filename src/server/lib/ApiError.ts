// Ported near-verbatim from the old Express server:
// fullstack-portfolio-server/src/shared/errors/errors.clsses.ts
export class ApiError extends Error {
  constructor(public statusCode: number, public message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
