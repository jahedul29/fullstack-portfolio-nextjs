"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OwnerForm } from "@/components/admin/owner/OwnerForm";
import { useGetOwnerQuery } from "@/redux/api/ownerApi";
import { getErrorMessage } from "@/lib/get-error-message";

export default function OwnerPage() {
  const { data: owner, isLoading, error } = useGetOwnerQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Owner profile</h1>
        <p className="text-sm text-muted-foreground">
          This is the single profile record shown across your portfolio&apos;s
          landing page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>
            Update your contact info, social links, and about section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          ) : owner ? (
            <OwnerForm owner={owner} />
          ) : (
            <p className="text-sm text-muted-foreground">
              {error
                ? getErrorMessage(
                    error,
                    "Unable to load the owner profile."
                  )
                : "No owner record found yet."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
