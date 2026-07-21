"use client";

import * as React from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { ResourceSheet } from "@/components/admin/ResourceSheet";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { SkillForm } from "@/components/admin/skills/SkillForm";
import {
  useDeleteSkillMutation,
  useGetSkillsQuery,
} from "@/redux/api/skillApi";
import { ISkill } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const LIMIT = 10;

export default function SkillsPage() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const sortBy = sorting[0]?.id;
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { data, isLoading, isFetching } = useGetSkillsQuery({
    page,
    limit: LIMIT,
    searchTerm: searchTerm || undefined,
    sortBy,
    sortOrder,
  });
  const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ISkill | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<ISkill>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "level",
        header: "Level",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min(100, Math.max(0, row.original.level))}%`,
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {row.original.level}%
            </span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit skill"
              onClick={() => {
                setEditing(row.original);
                setSheetOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete skill"
              onClick={() => setDeletingId(row.original.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

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
            Manage the skills shown on your portfolio.
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

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        meta={data?.meta}
        isLoading={isLoading}
        isFetching={isFetching}
        searchTerm={searchTerm}
        onSearchTermChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        searchPlaceholder="Search skills..."
        page={page}
        onPageChange={setPage}
        limit={LIMIT}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No skills yet. Add your first one."
      />

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
