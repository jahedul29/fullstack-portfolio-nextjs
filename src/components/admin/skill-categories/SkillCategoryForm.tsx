"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCreateSkillCategoryMutation,
  useUpdateSkillCategoryMutation,
} from "@/redux/api/skillCategoryApi";
import { ISkillCategory } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const skillCategoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type SkillCategoryFormValues = z.infer<typeof skillCategoryFormSchema>;

type SkillCategoryFormProps = {
  category?: ISkillCategory | null;
  onSuccess: () => void;
};

export function SkillCategoryForm({
  category,
  onSuccess,
}: SkillCategoryFormProps) {
  const isEditing = !!category;
  const [createSkillCategory, { isLoading: isCreating }] =
    useCreateSkillCategoryMutation();
  const [updateSkillCategory, { isLoading: isUpdating }] =
    useUpdateSkillCategoryMutation();

  const form = useForm<SkillCategoryFormValues>({
    resolver: zodResolver(skillCategoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  const onSubmit = async (values: SkillCategoryFormValues) => {
    try {
      if (isEditing && category) {
        await updateSkillCategory({ id: category.id, body: values }).unwrap();
        toast.success("Category updated");
      } else {
        await createSkillCategory(values).unwrap();
        toast.success("Category created");
      }
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Frontend" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isCreating || isUpdating}
        >
          {isEditing
            ? isUpdating
              ? "Saving…"
              : "Save changes"
            : isCreating
              ? "Creating…"
              : "Create category"}
        </Button>
      </form>
    </Form>
  );
}
