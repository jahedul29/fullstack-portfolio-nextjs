"use client";

import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ResourceSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

// Thin shadcn Sheet wrapper used by every resource page to host its
// add/edit react-hook-form. Kept generic (title/description/children) so
// each <Resource>Form.tsx owns its own fields.
export function ResourceSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ResourceSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="mt-6 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
