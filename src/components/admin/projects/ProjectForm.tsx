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
import { projectCategories } from "@/server/modules/project/project.constant";
import { useGetSkillsQuery } from "@/redux/api/skillApi";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/redux/api/projectApi";
import { IProject } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

// Fields mirror src/server/modules/project/{project.interface,project.validation}.ts:
// title, category (enum), photoUrl, description, githubUrl, websiteUrl,
// videoUrl (optional), isFeatured (bool), technologies (Skill id[]),
// priorityScore (number, required by the model though not in the zod
// `create`/`update` schemas — see projects/route.ts's comment on why the raw
// body is passed through instead of the zod-stripped result).
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
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type ProjectFormProps = {
  project?: IProject | null;
  onSuccess: () => void;
};

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const isEditing = !!project;
  // limit:100 -> effectively "all skills" for the checkbox multi-select; the
  // portfolio's skill list is small by nature.
  const { data: skillsData } = useGetSkillsQuery({ page: 1, limit: 100 });
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
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      const payload = {
        ...values,
        videoUrl: values.videoUrl || undefined,
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
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
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
          render={() => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormDescription>
                Select the skills used in this project.
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
              : "Create project"}
        </Button>
      </form>
    </Form>
  );
}
