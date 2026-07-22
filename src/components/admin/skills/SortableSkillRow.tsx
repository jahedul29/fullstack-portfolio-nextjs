"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ISkill } from "@/types";

type SortableSkillRowProps = {
  skill: ISkill;
  onEdit: () => void;
  onDelete: () => void;
};

export function SortableSkillRow({
  skill,
  onEdit,
  onDelete,
}: SortableSkillRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5",
        isDragging && "relative z-10 shadow-md"
      )}
    >
      <button
        type="button"
        aria-label={`Reorder ${skill.name}`}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="min-w-0 flex-1 truncate font-medium">
        {skill.name}
      </span>

      {skill.category ? (
        <Badge variant="outline" className="shrink-0 text-muted-foreground">
          {skill.category}
        </Badge>
      ) : null}

      <span className="w-12 shrink-0 text-right text-sm text-muted-foreground">
        {skill.level}%
      </span>

      <div className="flex shrink-0 gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit skill"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete skill"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
