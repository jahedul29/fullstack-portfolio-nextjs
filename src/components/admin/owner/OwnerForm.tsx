"use client";

import * as React from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { GripVertical } from "lucide-react";
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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateOwnerMutation } from "@/redux/api/ownerApi";
import { IOwner } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { normalizeSections } from "@/lib/sections";
import { SECTION_LABELS } from "@/server/modules/owner/owner.constant";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SkillMultiSelect } from "@/components/admin/SkillMultiSelect";

const ownerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  designation: z.string().min(1, "Designation is required"),
  summery: z.string().optional(),
  heroTagline: z.string().optional(),
  heroHighlight: z.string().optional(),
  yearsOfExperience: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z
      .number({ invalid_type_error: "Years of experience must be a number" })
      .optional()
  ),
  aboutOwner: z.string().min(1, "About is required"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  linkedInUrl: z.string().min(1, "LinkedIn URL is required"),
  facebookUrl: z.string().optional(),
  githubUrl: z.string().min(1, "GitHub URL is required"),
  resumeUrl: z.string().min(1, "Resume URL is required"),
  stackOverflowUrl: z.string().optional(),
  calanderlyUrl: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  metaKeywords: z.string().optional(),
  heroSkills: z.array(z.string()).optional(),
  sections: z.array(
    z.object({
      key: z.string(),
      visible: z.boolean(),
    })
  ),
});

type OwnerFormValues = z.infer<typeof ownerFormSchema>;

type SortableSectionRowProps = {
  id: string;
  label: string;
  control: Control<OwnerFormValues>;
  index: number;
};

function SortableSectionRow({
  id,
  label,
  control,
  index,
}: SortableSectionRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-row items-center justify-between gap-4 rounded-lg border border-border bg-card p-3",
        isDragging && "relative z-10 shadow-md"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Reorder ${label}`}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="font-medium">{label}</span>
      </div>
      <FormField
        control={control}
        name={`sections.${index}.visible`}
        render={({ field: visibleField }) => (
          <FormItem className="flex items-center">
            <FormControl>
              <Switch
                checked={visibleField.value}
                onCheckedChange={visibleField.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

type OwnerFormProps = {
  owner: IOwner;
};

export function OwnerForm({ owner }: OwnerFormProps) {
  const [updateOwner, { isLoading: isUpdating }] = useUpdateOwnerMutation();

  const form = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerFormSchema),
    defaultValues: {
      name: owner.name ?? "",
      email: owner.email ?? "",
      phoneNumber: owner.phoneNumber ?? "",
      designation: owner.designation ?? "",
      summery: owner.summery ?? "",
      heroTagline: owner.heroTagline ?? "",
      heroHighlight: owner.heroHighlight ?? "",
      yearsOfExperience: owner.yearsOfExperience,
      aboutOwner: owner.aboutOwner ?? "",
      photoUrl: owner.photoUrl ?? "",
      linkedInUrl: owner.linkedInUrl ?? "",
      facebookUrl: owner.facebookUrl ?? "",
      githubUrl: owner.githubUrl ?? "",
      resumeUrl: owner.resumeUrl ?? "",
      stackOverflowUrl: owner.stackOverflowUrl ?? "",
      calanderlyUrl: owner.calanderlyUrl ?? "",
      address: owner.address ?? "",
      metaKeywords: owner.metaKeywords?.join(", ") ?? "",
      heroSkills: owner.heroSkills ?? [],
      sections: normalizeSections(owner.sections),
    },
  });

  const { fields, move } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const sectionSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field.key === active.id);
    const newIndex = fields.findIndex((field) => field.key === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    move(oldIndex, newIndex);
  };

  const onSubmit = async (values: OwnerFormValues) => {
    try {
      const payload = {
        ...values,
        facebookUrl: values.facebookUrl || undefined,
        stackOverflowUrl: values.stackOverflowUrl || undefined,
        calanderlyUrl: values.calanderlyUrl || undefined,
        summery: values.summery || undefined,
        heroTagline: values.heroTagline || undefined,
        heroHighlight: values.heroHighlight || undefined,
        heroSkills: values.heroSkills ?? [],
        metaKeywords: values.metaKeywords
          ? values.metaKeywords
              .split(",")
              .map((keyword) => keyword.trim())
              .filter(Boolean)
          : [],
      };
      await updateOwner({ id: owner._id, body: payload }).unwrap();
      toast.success("Owner profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Full Stack Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Years of experience{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormDescription>
                  Shown next to the designation in the hero eyebrow, e.g.
                  &quot;Senior Software Engineer · 5+ years&quot;.
                </FormDescription>
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

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
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
        </div>

        <FormField
          control={form.control}
          name="heroTagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Hero tagline{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormDescription>
                The role line shown under the name. Falls back to &quot;I
                work as a {"{designation}"}.&quot; when left empty.
              </FormDescription>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="e.g. I build and scale fullstack products — from API design to production UI."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heroHighlight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Highlight phrase{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormDescription>
                Part of the tagline shown in the accent color, e.g.
                &quot;fullstack products&quot;. Must match text in the
                tagline exactly to take effect.
              </FormDescription>
              <FormControl>
                <Input placeholder="e.g. fullstack products" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Hero pitch{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormDescription>
                A one-line summary used for the hero section.
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="e.g. Senior full-stack engineer building reliable web products."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aboutOwner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="linkedInUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/..." {...field} />
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
            name="facebookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Facebook URL{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://facebook.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stackOverflowUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Stack Overflow URL{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://stackoverflow.com/users/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resumeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="calanderlyUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Calendly URL{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://calendly.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="metaKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta keywords</FormLabel>
              <FormDescription>
                Comma-separated SEO keywords, e.g. &quot;full stack, react,
                node&quot;.
              </FormDescription>
              <FormControl>
                <Input placeholder="full stack, react, node" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heroSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero skills</FormLabel>
              <FormDescription>
                Skills shown in the hero. Leave empty to auto-show your top
                skills.
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

        <Card>
          <CardHeader>
            <CardTitle>Landing sections</CardTitle>
            <CardDescription>
              Toggle and reorder which sections appear on the public landing
              page. The header is always shown first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <DndContext
              sensors={sectionSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSectionDragEnd}
            >
              <SortableContext
                items={fields.map((field) => field.key)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <SortableSectionRow
                      key={field.id}
                      id={field.key}
                      label={
                        SECTION_LABELS[
                          field.key as keyof typeof SECTION_LABELS
                        ] ?? field.key
                      }
                      control={form.control}
                      index={index}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
