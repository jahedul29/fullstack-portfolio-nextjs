"use client";

import { Button } from "@/components/ui/button";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-3xl font-bold text-destructive sm:text-4xl">
        Something went wrong
      </h2>
      <p className="max-w-md text-muted-foreground">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
};

export default ErrorPage;
