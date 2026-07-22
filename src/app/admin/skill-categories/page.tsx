"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceSheet } from "@/components/admin/ResourceSheet";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { SkillCategoryForm } from "@/components/admin/skill-categories/SkillCategoryForm";
import { SortableSkillCategoryList } from "@/components/admin/skill-categories/SortableSkillCategoryList";
import {
  useDeleteSkillCategoryMutation,
  useGetSkillCategoriesQuery,
} from "@/redux/api/skillCategoryApi";
import { ISkillCategory } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const FETCH_ALL_LIMIT = 200;

export default function SkillCategoriesPage() {
  const { data, isLoading } = useGetSkillCategoriesQuery({
    limit: FETCH_ALL_LIMIT,
  });
  const [deleteSkillCategory, { isLoading: isDeleting }] =
    useDeleteSkillCategoryMutation();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ISkillCategory | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteSkillCategory(deletingId).unwrap();
      toast.success("Category deleted");
      setDeletingId(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Skill Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Drag to reorder — this order drives how skill groups appear on
            the landing page.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[52px] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <SortableSkillCategoryList
          categories={data?.data ?? []}
          onEdit={(category) => {
            setEditing(category);
            setSheetOpen(true);
          }}
          onDelete={(id) => setDeletingId(id)}
        />
      )}

      <ResourceSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editing ? "Edit category" : "Add category"}
        description={
          editing
            ? "Update this category's details below."
            : "Fill in the details to add a new skill category."
        }
      >
        <SkillCategoryForm
          category={editing}
          onSuccess={() => setSheetOpen(false)}
        />
      </ResourceSheet>

      <ConfirmDelete
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete category?"
        description="This will permanently remove the category. Skills using this category name will keep the stale name until reassigned."
      />
    </div>
  );
}
