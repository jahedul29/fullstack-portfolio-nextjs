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
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
} from "@/redux/api/experienceApi";
import { IExperience } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

// Fields mirror src/server/modules/experience/experience.interface.ts:
// companyName, position, startTime/endTime (Date), isWorkingCurrently (bool),
// show (bool), technologies (Skill id[]), description. `startTime`/`endTime`
// render as <input type="date"> and are converted to ISO strings on submit;
// `description` isn't in experience.validation.ts's zod schemas but the
// model requires it — the route passes the raw body through (see
// experiences/route.ts), so it must be included here regardless.
const experienceFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startTime: z.string().min(1, "Start date is required"),
  endTime: z.string().optional(),
  isWorkingCurrently: z.boolean(),
  show: z.boolean(),
  technologies: z.array(z.string()).min(1, "Select at least one technology"),
  description: z.string().min(1, "Description is required"),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

type ExperienceFormProps = {
  experience?: IExperience | null;
  onSuccess: () => void;
};

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function ExperienceForm({ experience, onSuccess }: ExperienceFormProps) {
  const isEditing = !!experience;
  const { data: skillsData } = useGetSkillsQuery({ page: 1, limit: 100 });
  const [createExperience, { isLoading: isCreating }] =
    useCreateExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] =
    useUpdateExperienceMutation();

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      companyName: experience?.companyName ?? "",
      position: experience?.position ?? "",
      startTime: toDateInputValue(experience?.startTime),
      endTime: toDateInputValue(experience?.endTime),
      isWorkingCurrently: experience?.isWorkingCurrently ?? false,
      show: experience?.show ?? false,
      technologies: experience?.technologies?.map((t) => t.id) ?? [],
      description: experience?.description ?? "",
    },
  });

  const isWorkingCurrently = form.watch("isWorkingCurrently");

  const onSubmit = async (values: ExperienceFormValues) => {
    try {
      const payload = {
        ...values,
        startTime: new Date(values.startTime).toISOString(),
        endTime:
          values.isWorkingCurrently || !values.endTime
            ? undefined
            : new Date(values.endTime).toISOString(),
      };
      if (isEditing && experience) {
        await updateExperience({ id: experience.id, body: payload }).unwrap();
        toast.success("Experience updated");
      } else {
        await createExperience(payload).unwrap();
        toast.success("Experience created");
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
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isWorkingCurrently} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="isWorkingCurrently"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border border-border p-3">
              <div className="space-y-0.5">
                <FormLabel>Currently working here</FormLabel>
                <FormDescription>
                  Leaves the end date blank.
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
          name="show"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border border-border p-3">
              <div className="space-y-0.5">
                <FormLabel>Show on portfolio</FormLabel>
                <FormDescription>
                  Display this experience on the public site.
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
                Select the skills used in this role.
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
              : "Create experience"}
        </Button>
      </form>
    </Form>
  );
}
