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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  projectCategories,
  projectTypes,
} from "@/server/modules/project/project.constant";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/redux/api/projectApi";
import { IProject } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SkillMultiSelect } from "@/components/admin/SkillMultiSelect";

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(projectCategories as [string, ...string[]], {
    required_error: "Category is required",
  }),
  photoUrl: z.string().min(1, "Photo URL is required"),
  description: z.string().min(1, "Description is required"),
  githubUrl: z.string().min(1, "GitHub URL is required"),
  websiteUrl: z.string().min(1, "Website URL is required"),
  videoUrl: z.string().optional(),
  isFeatured: z.boolean(),
  priorityScore: z.coerce.number({
    invalid_type_error: "Priority score must be a number",
  }),
  technologies: z.array(z.string()).min(1, "Select at least one technology"),
  outcome: z.string().optional(),
  role: z.string().optional(),
  type: z.enum(projectTypes as [string, ...string[]]).optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const PROJECT_TYPE_LABELS: Record<string, string> = {
  professional: "Professional",
  personal: "Side project",
};

type ProjectFormProps = {
  project?: IProject | null;
  onSuccess: () => void;
};

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const isEditing = !!project;
  const [createProject, { isLoading: isCreating }] =
    useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] =
    useUpdateProjectMutation();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title ?? "",
      category: (project?.category as ProjectFormValues["category"]) ?? undefined,
      photoUrl: project?.photoUrl ?? "",
      description: project?.description ?? "",
      githubUrl: project?.githubUrl ?? "",
      websiteUrl: project?.websiteUrl ?? "",
      videoUrl: project?.videoUrl ?? "",
      isFeatured: project?.isFeatured ?? false,
      priorityScore: project?.priorityScore ?? 0,
      technologies: project?.technologies?.map((t) => t.id) ?? [],
      outcome: project?.outcome ?? "",
      role: project?.role ?? "",
      type: (project?.type as ProjectFormValues["type"]) ?? "professional",
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      const payload = {
        ...values,
        videoUrl: values.videoUrl || undefined,
        outcome: values.outcome || undefined,
        role: values.role || undefined,
      };
      if (isEditing && project) {
        await updateProject({ id: project.id, body: payload }).unwrap();
        toast.success("Project updated");
      } else {
        await createProject(payload).unwrap();
        toast.success("Project created");
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {PROJECT_TYPE_LABELS[type] ?? type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Professional projects show in the main Projects section; side
                projects show in the Side Projects section.
              </FormDescription>
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Role{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Lead engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Outcome{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="e.g. Cut checkout time by 30% and increased conversion."
                  {...field}
                />
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
              <FormLabel>GitHub URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Video URL{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
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
                  Show this project in the featured section.
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
                Select the skills used in this project.
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
              : "Create project"}
        </Button>
      </form>
    </Form>
  );
}
