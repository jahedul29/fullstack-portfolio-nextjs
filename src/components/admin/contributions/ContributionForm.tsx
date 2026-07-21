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
import { useGetSkillsQuery } from "@/redux/api/skillApi";
import {
  useCreateContributionMutation,
  useUpdateContributionMutation,
} from "@/redux/api/contributionApi";
import { IContribution } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

// Fields mirror src/server/modules/contribution/{contribution.interface,
// contribution.validation}.ts: title, photoUrl, contributionFor,
// description, githubUrl (optional), relatedUrl, isFeatured (bool),
// technologies (Skill id[]), priorityScore (number, required by the model
// though not in the zod create/update schemas - see contributions/route.ts's
// comment on why the raw body is passed through instead of the zod-stripped
// result).
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
  // limit:100 -> effectively "all skills" for the checkbox multi-select; the
  // portfolio's skill list is small by nature (see ProjectForm).
  const { data: skillsData } = useGetSkillsQuery({ page: 1, limit: 100 });
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

  const skills = skillsData?.data ?? [];
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
          render={() => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormDescription>
                Select the skills used in this contribution.
              </FormDescription>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-border p-3">
                {skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No skills yet — add some on the Skills page first.
                  </p>
                )}
                {skills.map((skill) => (
                  <FormField
                    key={skill.id}
                    control={form.control}
                    name="technologies"
                    render={({ field }) => {
                      const checked = field.value?.includes(skill.id);
                      return (
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-input"
                            checked={checked}
                            onChange={(event) => {
                              const next = event.target.checked
                                ? [...(field.value ?? []), skill.id]
                                : (field.value ?? []).filter(
                                    (value) => value !== skill.id
                                  );
                              field.onChange(next);
                            }}
                          />
                          {skill.name}
                        </label>
                      );
                    }}
                  />
                ))}
              </div>
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
