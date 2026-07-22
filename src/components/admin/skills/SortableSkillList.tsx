"use client";

import * as React from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";

import { SortableSkillRow } from "@/components/admin/skills/SortableSkillRow";
import { useReorderSkillsMutation } from "@/redux/api/skillApi";
import { getErrorMessage } from "@/lib/get-error-message";
import { ISkill } from "@/types";

type SortableSkillListProps = {
  skills: ISkill[];
  onEdit: (skill: ISkill) => void;
  onDelete: (id: string) => void;
};

export function SortableSkillList({
  skills,
  onEdit,
  onDelete,
}: SortableSkillListProps) {
  const [items, setItems] = React.useState<ISkill[]>(skills);
  const isReordering = React.useRef(false);
  const [reorderSkills] = useReorderSkillsMutation();

  React.useEffect(() => {
    if (!isReordering.current) {
      setItems(skills);
    }
  }, [skills]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previousItems = items;
    const nextItems = arrayMove(items, oldIndex, newIndex);

    isReordering.current = true;
    setItems(nextItems);

    try {
      await reorderSkills({ ids: nextItems.map((item) => item.id) }).unwrap();
      toast.success("Skill order updated");
    } catch (error) {
      setItems(previousItems);
      toast.error(getErrorMessage(error, "Failed to reorder skills"));
    } finally {
      isReordering.current = false;
    }
  };

  if (!items.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        No skills yet. Add your first one.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {items.map((skill) => (
            <SortableSkillRow
              key={skill.id}
              skill={skill}
              onEdit={() => onEdit(skill)}
              onDelete={() => onDelete(skill.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
