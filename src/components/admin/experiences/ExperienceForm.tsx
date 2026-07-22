"use client";

import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

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
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
} from "@/redux/api/experienceApi";
import { IExperience } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { SkillMultiSelect } from "@/components/admin/SkillMultiSelect";

const experienceFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startTime: z.string().min(1, "Start date is required"),
  endTime: z.string().optional(),
  isWorkingCurrently: z.boolean(),
  show: z.boolean(),
  technologies: z.array(z.string()).min(1, "Select at least one technology"),
  description: z.string().min(1, "Description is required"),
  role: z.string().optional(),
  teamSize: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Team size must be a number" }).optional()
  ),
  impact: z
    .array(z.object({ value: z.string().min(1, "Bullet cannot be empty") }))
    .optional(),
  metrics: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .optional(),
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
      role: experience?.role ?? "",
      teamSize: experience?.teamSize,
      impact: experience?.impact?.map((value) => ({ value })) ?? [],
      metrics: experience?.metrics ?? [],
    },
  });

  const isWorkingCurrently = form.watch("isWorkingCurrently");

  const {
    fields: impactFields,
    append: appendImpact,
    remove: removeImpact,
  } = useFieldArray({ control: form.control, name: "impact" });

  const {
    fields: metricFields,
    append: appendMetric,
    remove: removeMetric,
  } = useFieldArray({ control: form.control, name: "metrics" });

  const onSubmit = async (values: ExperienceFormValues) => {
    try {
      const payload = {
        ...values,
        startTime: new Date(values.startTime).toISOString(),
        endTime:
          values.isWorkingCurrently || !values.endTime
            ? undefined
            : new Date(values.endTime).toISOString(),
        impact: values.impact?.map((item) => item.value),
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

        <div className="grid grid-cols-2 gap-4">
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
                  <Input placeholder="e.g. Tech Lead" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Team size{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3 rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Impact</FormLabel>
              <FormDescription>
                Bullet points describing quantified impact in this role.
              </FormDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendImpact({ value: "" })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add bullet
            </Button>
          </div>

          {impactFields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No impact bullets yet.
            </p>
          )}

          {impactFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`impact.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="e.g. Reduced API latency by 40%"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeImpact(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Metrics</FormLabel>
              <FormDescription>
                Label/value pairs, e.g. &quot;Uptime&quot; / &quot;99.99%&quot;.
              </FormDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendMetric({ label: "", value: "" })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add metric
            </Button>
          </div>

          {metricFields.length === 0 && (
            <p className="text-sm text-muted-foreground">No metrics yet.</p>
          )}

          {metricFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`metrics.${index}.label`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Label, e.g. Uptime" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`metrics.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Value, e.g. 99.99%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMetric(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormDescription>
                Select the skills used in this role.
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
              : "Create experience"}
        </Button>
      </form>
    </Form>
  );
}
