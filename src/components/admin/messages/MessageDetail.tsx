"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMarkMessageReadMutation } from "@/redux/api/messageApi";
import { IMessage } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

type MessageDetailProps = {
  message: IMessage;
  onDeleteRequest: () => void;
};

export function MessageDetail({ message, onDeleteRequest }: MessageDetailProps) {
  const [markMessageRead, { isLoading }] = useMarkMessageReadMutation();

  const handleToggleRead = async (checked: boolean) => {
    try {
      await markMessageRead({ id: message.id, isRead: checked }).unwrap();
      toast.success(checked ? "Marked as read" : "Marked as unread");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{message.name}</p>
          <p className="truncate text-sm text-muted-foreground">{message.email}</p>
        </div>
        <Badge variant={message.isRead ? "secondary" : "default"}>
          {message.isRead ? "Read" : "Unread"}
        </Badge>
      </div>

      <div className="rounded-md border border-border bg-muted/30 p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.message}
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Received {new Date(message.createdAt).toLocaleString()}
      </p>

      <div className="flex items-center justify-between rounded-md border border-border p-3">
        <Label htmlFor="message-mark-read" className="text-sm font-medium">
          Mark as read
        </Label>
        <Switch
          id="message-mark-read"
          checked={message.isRead}
          disabled={isLoading}
          onCheckedChange={handleToggleRead}
        />
      </div>

      <Button
        variant="outline"
        className="w-full text-destructive hover:text-destructive"
        onClick={onDeleteRequest}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete message
      </Button>
    </div>
  );
}
