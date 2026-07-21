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
import { ContributionForm } from "@/components/admin/contributions/ContributionForm";
import {
  useDeleteContributionMutation,
  useGetContributionsQuery,
} from "@/redux/api/contributionApi";
import { IContribution } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const LIMIT = 10;

export default function ContributionsPage() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const sortBy = sorting[0]?.id;
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { data, isLoading, isFetching } = useGetContributionsQuery({
    page,
    limit: LIMIT,
    searchTerm: searchTerm || undefined,
    sortBy,
    sortOrder,
  });
  const [deleteContribution, { isLoading: isDeleting }] =
    useDeleteContributionMutation();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<IContribution | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<IContribution>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.original.photoUrl}
                alt=""
                className="h-8 w-8 shrink-0 rounded object-cover"
              />
            ) : null}
            <span className="truncate font-medium">{row.original.title}</span>
          </div>
        ),
      },
      {
        accessorKey: "contributionFor",
        header: "Contribution for",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.contributionFor}</Badge>
        ),
      },
      {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) =>
          row.original.isFeatured ? (
            <Badge>Featured</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "priorityScore",
        header: "Priority",
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
              aria-label="Edit contribution"
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
              aria-label="Delete contribution"
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
      await deleteContribution(deletingId).unwrap();
      toast.success("Contribution deleted");
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
            Contributions
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the open-source and community contributions shown on your
            portfolio.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add contribution
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
        searchPlaceholder="Search contributions..."
        page={page}
        onPageChange={setPage}
        limit={LIMIT}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No contributions yet. Add your first one."
      />

      <ResourceSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editing ? "Edit contribution" : "Add contribution"}
        description={
          editing
            ? "Update this contribution's details below."
            : "Fill in the details to add a new contribution."
        }
      >
        <ContributionForm
          contribution={editing}
          onSuccess={() => setSheetOpen(false)}
        />
      </ResourceSheet>

      <ConfirmDelete
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete contribution?"
        description="This will permanently remove the contribution. This action cannot be undone."
      />
    </div>
  );
}
