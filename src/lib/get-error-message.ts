// Shared RTK Query error -> user-facing message extractor.
//
// `src/helpers/axios/axiosInstance.ts`'s response interceptor resolves (does
// not reject) on error with `{ statusCode, message, errorMessages }`, so
// `axiosBaseQuery` treats it as a failed request and reports
// `{ error: { status, data: message } }` back to RTK Query — i.e. `error.data`
// is directly the message *string* (see `src/components/admin/LoginForm.tsx`
// for the original instance of this same unwrap logic).
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error && typeof error === "object") {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message.length > 0) return message;
    }
    if (typeof data === "string" && data.length > 0) return data;
  }
  return fallback;
}
