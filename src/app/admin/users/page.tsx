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
import { UserForm } from "@/components/admin/users/UserForm";
import { useDeleteUserMutation, useGetUsersQuery } from "@/redux/api/userApi";
import { IUser } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const LIMIT = 10;

export default function UsersPage() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const sortBy = sorting[0]?.id;
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { data, isLoading, isFetching } = useGetUsersQuery({
    page,
    limit: LIMIT,
    searchTerm: searchTerm || undefined,
    sortBy,
    sortOrder,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<IUser | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="truncate font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="truncate text-muted-foreground">
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge
            variant={row.original.role === "admin" ? "default" : "secondary"}
            className="capitalize"
          >
            {row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === "active" ? "secondary" : "destructive"
            }
            className="capitalize"
          >
            {row.original.status}
          </Badge>
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
              aria-label="Edit user"
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
              aria-label="Delete user"
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
      await deleteUser(deletingId).unwrap();
      toast.success("User deleted");
      setDeletingId(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage admin panel access for your team.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add user
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
        searchPlaceholder="Search users..."
        page={page}
        onPageChange={setPage}
        limit={LIMIT}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No users yet. Add your first one."
      />

      <ResourceSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editing ? "Edit user" : "Add user"}
        description={
          editing
            ? "Update this user's details below."
            : "Fill in the details to add a new admin user."
        }
      >
        <UserForm user={editing} onSuccess={() => setSheetOpen(false)} />
      </ResourceSheet>

      <ConfirmDelete
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete user?"
        description="This will permanently remove the user. This action cannot be undone."
      />
    </div>
  );
}
