"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

// Fields mirror src/server/modules/owner/{owner.interface,owner.model}.ts.
// `metaKeywords` is a string[] on the model; edited here as a single
// comma-separated input and split/joined back into an array at the form
// boundary (onSubmit / defaultValues).
const ownerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  designation: z.string().min(1, "Designation is required"),
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
});

type OwnerFormValues = z.infer<typeof ownerFormSchema>;

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
    },
  });

  const onSubmit = async (values: OwnerFormValues) => {
    try {
      const payload = {
        ...values,
        facebookUrl: values.facebookUrl || undefined,
        stackOverflowUrl: values.stackOverflowUrl || undefined,
        calanderlyUrl: values.calanderlyUrl || undefined,
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
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
