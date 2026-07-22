"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCreateContributionMutation,
  useUpdateContributionMutation,
} from "@/redux/api/contributionApi";
import { IContribution } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SkillMultiSelect } from "@/components/admin/SkillMultiSelect";

const contributionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  contributionFor: z.string().min(1, "Contribution for is required"),
  description: z.string().min(1, "Description is required"),
  githubUrl: z.string().optional(),
  relatedUrl: z.string().min(1, "Related URL is required"),
  isFeatured: z.boolean(),
  priorityScore: z.coerce.number({
    invalid_type_error: "Priority score must be a number",
  }),
  technologies: z.array(z.string()).min(1, "Select at least one technology"),
});

type ContributionFormValues = z.infer<typeof contributionFormSchema>;

type ContributionFormProps = {
  contribution?: IContribution | null;
  onSuccess: () => void;
};

export function ContributionForm({
  contribution,
  onSuccess,
}: ContributionFormProps) {
  const isEditing = !!contribution;
  const [createContribution, { isLoading: isCreating }] =
    useCreateContributionMutation();
  const [updateContribution, { isLoading: isUpdating }] =
    useUpdateContributionMutation();

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      title: contribution?.title ?? "",
      photoUrl: contribution?.photoUrl ?? "",
      contributionFor: contribution?.contributionFor ?? "",
      description: contribution?.description ?? "",
      githubUrl: contribution?.githubUrl ?? "",
      relatedUrl: contribution?.relatedUrl ?? "",
      isFeatured: contribution?.isFeatured ?? false,
      priorityScore: contribution?.priorityScore ?? 0,
      technologies: contribution?.technologies?.map((t) => t.id) ?? [],
    },
  });

  const onSubmit = async (values: ContributionFormValues) => {
    try {
      const payload = {
        ...values,
        githubUrl: values.githubUrl || undefined,
      };
      if (isEditing && contribution) {
        await updateContribution({
          id: contribution.id,
          body: payload,
        }).unwrap();
        toast.success("Contribution updated");
      } else {
        await createContribution(payload).unwrap();
        toast.success("Contribution created");
      }
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contributionFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contribution for</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Open source project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL</FormLabel>
              <FormControl>
                <ImageUploadField
                  value={field.value}
                  onChange={field.onChange}
                  label="Photo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                GitHub URL{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relatedUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priorityScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority score</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border border-border p-3">
              <div className="space-y-0.5">
                <FormLabel>Featured</FormLabel>
                <FormDescription>
                  Show this contribution in the featured section.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormDescription>
                Select the skills used in this contribution.
              </FormDescription>
              <FormControl>
                <SkillMultiSelect
                  value={field.value ?? []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isEditing
            ? isUpdating
              ? "Saving…"
              : "Save changes"
            : isCreating
              ? "Creating…"
              : "Create contribution"}
        </Button>
      </form>
    </Form>
  );
}
