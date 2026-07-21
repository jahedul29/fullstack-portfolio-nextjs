"use client";

import * as React from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/DataTable";
import { ResourceSheet } from "@/components/admin/ResourceSheet";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { ExperienceForm } from "@/components/admin/experiences/ExperienceForm";
import {
  useDeleteExperienceMutation,
  useGetExperiencesQuery,
} from "@/redux/api/experienceApi";
import { IExperience } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const LIMIT = 10;

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
}

export default function ExperiencesPage() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const sortBy = sorting[0]?.id;
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { data, isLoading, isFetching } = useGetExperiencesQuery({
    page,
    limit: LIMIT,
    searchTerm: searchTerm || undefined,
    sortBy,
    sortOrder,
  });
  const [deleteExperience, { isLoading: isDeleting }] =
    useDeleteExperienceMutation();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<IExperience | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<IExperience>[]>(
    () => [
      {
        accessorKey: "companyName",
        header: "Company",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.companyName}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.position}
            </p>
          </div>
        ),
      },
      {
        id: "period",
        header: "Period",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.startTime)} –{" "}
            {row.original.isWorkingCurrently
              ? "Present"
              : formatDate(row.original.endTime)}
          </span>
        ),
      },
      {
        accessorKey: "show",
        header: "Visible",
        cell: ({ row }) =>
          row.original.show ? (
            <Badge>Visible</Badge>
          ) : (
            <span className="text-muted-foreground">Hidden</span>
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
              aria-label="Edit experience"
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
              aria-label="Delete experience"
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
      await deleteExperience(deletingId).unwrap();
      toast.success("Experience deleted");
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
            Experiences
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the work experience shown on your portfolio.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add experience
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
        searchPlaceholder="Search experiences..."
        page={page}
        onPageChange={setPage}
        limit={LIMIT}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No experiences yet. Add your first one."
      />

      <ResourceSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editing ? "Edit experience" : "Add experience"}
        description={
          editing
            ? "Update this experience's details below."
            : "Fill in the details to add a new experience."
        }
      >
        <ExperienceForm
          experience={editing}
          onSuccess={() => setSheetOpen(false)}
        />
      </ResourceSheet>

      <ConfirmDelete
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete experience?"
        description="This will permanently remove the experience. This action cannot be undone."
      />
    </div>
  );
}
