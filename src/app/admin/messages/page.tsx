"use client";

import * as React from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/DataTable";
import { ResourceSheet } from "@/components/admin/ResourceSheet";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { MessageDetail } from "@/components/admin/messages/MessageDetail";
import {
  useDeleteMessageMutation,
  useGetMessagesQuery,
} from "@/redux/api/messageApi";
import { IMessage } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const LIMIT = 10;

export default function MessagesPage() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const sortBy = sorting[0]?.id;
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { data, isLoading, isFetching } = useGetMessagesQuery({
    page,
    limit: LIMIT,
    searchTerm: searchTerm || undefined,
    sortBy,
    sortOrder,
  });
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

  const [viewingId, setViewingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const viewing = React.useMemo<IMessage | null>(
    () => data?.data.find((message) => message.id === viewingId) ?? null,
    [data, viewingId]
  );

  const columns = React.useMemo<ColumnDef<IMessage>[]>(
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
        accessorKey: "message",
        header: "Message",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="block max-w-xs truncate text-muted-foreground">
            {row.original.message}
          </span>
        ),
      },
      {
        accessorKey: "isRead",
        header: "Status",
        cell: ({ row }) =>
          row.original.isRead ? (
            <Badge variant="secondary">Read</Badge>
          ) : (
            <Badge>Unread</Badge>
          ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
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
              aria-label="View message"
              onClick={() => setViewingId(row.original.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete message"
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
      await deleteMessage(deletingId).unwrap();
      toast.success("Message deleted");
      if (viewingId === deletingId) {
        setViewingId(null);
      }
      setDeletingId(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground">
            Read and manage messages submitted through your contact form.
          </p>
        </div>
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
        searchPlaceholder="Search messages..."
        page={page}
        onPageChange={setPage}
        limit={LIMIT}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No messages yet."
      />

      <ResourceSheet
        open={!!viewingId}
        onOpenChange={(open) => !open && setViewingId(null)}
        title="Message"
        description="View the full message submitted through the contact form."
      >
        {viewing ? (
          <MessageDetail
            message={viewing}
            onDeleteRequest={() => setDeletingId(viewing.id)}
          />
        ) : null}
      </ResourceSheet>

      <ConfirmDelete
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete message?"
        description="This will permanently remove the message. This action cannot be undone."
      />
    </div>
  );
}
