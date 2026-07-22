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

import { SortableSkillCategoryRow } from "@/components/admin/skill-categories/SortableSkillCategoryRow";
import { useReorderSkillCategoriesMutation } from "@/redux/api/skillCategoryApi";
import { getErrorMessage } from "@/lib/get-error-message";
import { ISkillCategory } from "@/types";

type SortableSkillCategoryListProps = {
  categories: ISkillCategory[];
  onEdit: (category: ISkillCategory) => void;
  onDelete: (id: string) => void;
};

export function SortableSkillCategoryList({
  categories,
  onEdit,
  onDelete,
}: SortableSkillCategoryListProps) {
  const [items, setItems] = React.useState<ISkillCategory[]>(categories);
  const isReordering = React.useRef(false);
  const [reorderSkillCategories] = useReorderSkillCategoriesMutation();

  React.useEffect(() => {
    if (!isReordering.current) {
      setItems(categories);
    }
  }, [categories]);

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
      await reorderSkillCategories({
        ids: nextItems.map((item) => item.id),
      }).unwrap();
      toast.success("Category order updated");
    } catch (error) {
      setItems(previousItems);
      toast.error(getErrorMessage(error, "Failed to reorder categories"));
    } finally {
      isReordering.current = false;
    }
  };

  if (!items.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        No skill categories yet. Add your first one.
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
          {items.map((category) => (
            <SortableSkillCategoryRow
              key={category.id}
              category={category}
              onEdit={() => onEdit(category)}
              onDelete={() => onDelete(category.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
