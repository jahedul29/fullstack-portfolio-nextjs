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
  useCreateSkillMutation,
  useUpdateSkillMutation,
} from "@/redux/api/skillApi";
import { ISkill } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const skillFormSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.coerce
    .number({ invalid_type_error: "Level must be a number" })
    .min(0, "Level must be 0 or greater")
    .max(100, "Level must be 100 or less"),
  category: z.string().optional(),
});

type SkillFormValues = z.infer<typeof skillFormSchema>;

type SkillFormProps = {
  skill?: ISkill | null;
  onSuccess: () => void;
};

export function SkillForm({ skill, onSuccess }: SkillFormProps) {
  const isEditing = !!skill;
  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: skill?.name ?? "",
      level: skill?.level ?? 0,
      category: skill?.category ?? "",
    },
  });

  const onSubmit = async (values: SkillFormValues) => {
    try {
      if (isEditing && skill) {
        await updateSkill({ id: skill.id, body: values }).unwrap();
        toast.success("Skill updated");
      } else {
        await createSkill(values).unwrap();
        toast.success("Skill created");
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
                <Input placeholder="e.g. TypeScript" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level (0-100)</FormLabel>
              <FormControl>
                <Input type="number" min={0} max={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Category{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Frontend, Backend, Infra" {...field} />
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
              : "Create skill"}
        </Button>
      </form>
    </Form>
  );
}
