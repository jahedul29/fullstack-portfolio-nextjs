"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceSheet } from "@/components/admin/ResourceSheet";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { SkillForm } from "@/components/admin/skills/SkillForm";
import { SortableSkillList } from "@/components/admin/skills/SortableSkillList";
import {
  useDeleteSkillMutation,
  useGetSkillsQuery,
} from "@/redux/api/skillApi";
import { ISkill } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const FETCH_ALL_LIMIT = 200;

export default function SkillsPage() {
  const { data, isLoading } = useGetSkillsQuery({ limit: FETCH_ALL_LIMIT });
  const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ISkill | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteSkill(deletingId).unwrap();
      toast.success("Skill deleted");
      setDeletingId(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground">
            Drag to reorder — this order drives how skills appear on the
            landing page.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[52px] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <SortableSkillList
          skills={data?.data ?? []}
          onEdit={(skill) => {
            setEditing(skill);
            setSheetOpen(true);
          }}
          onDelete={(id) => setDeletingId(id)}
        />
      )}

      <ResourceSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editing ? "Edit skill" : "Add skill"}
        description={
          editing
            ? "Update this skill's details below."
            : "Fill in the details to add a new skill."
        }
      >
        <SkillForm skill={editing} onSuccess={() => setSheetOpen(false)} />
      </ResourceSheet>

      <ConfirmDelete
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete skill?"
        description="This will permanently remove the skill. Projects/experiences referencing it will keep the stale id."
      />
    </div>
  );
}
