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
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from "@/redux/api/blogApi";
import { IBlog } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

// Fields mirror src/server/modules/blog/{blog.interface,blog.validation}.ts:
// title, category (free-text string, no enum), photoUrl, blogUrl, platform,
// description, isFeatured (bool), priorityScore (number, required by the
// model though absent from the zod create/update schemas — see
// blogs/route.ts's comment on why the raw body is passed through instead of
// the zod-stripped result).
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  blogUrl: z.string().min(1, "Blog URL is required"),
  platform: z.string().min(1, "Platform is required"),
  description: z.string().min(1, "Description is required"),
  isFeatured: z.boolean(),
  priorityScore: z.coerce.number({
    invalid_type_error: "Priority score must be a number",
  }),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

type BlogFormProps = {
  blog?: IBlog | null;
  onSuccess: () => void;
};

export function BlogForm({ blog, onSuccess }: BlogFormProps) {
  const isEditing = !!blog;
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog?.title ?? "",
      category: blog?.category ?? "",
      photoUrl: blog?.photoUrl ?? "",
      blogUrl: blog?.blogUrl ?? "",
      platform: blog?.platform ?? "",
      description: blog?.description ?? "",
      isFeatured: blog?.isFeatured ?? false,
      priorityScore: blog?.priorityScore ?? 0,
    },
  });

  const onSubmit = async (values: BlogFormValues) => {
    try {
      if (isEditing && blog) {
        await updateBlog({ id: blog.id, body: values }).unwrap();
        toast.success("Blog updated");
      } else {
        await createBlog(values).unwrap();
        toast.success("Blog created");
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
              <FormControl>
                <Input placeholder="e.g. Web Development" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Medium, Dev.to" {...field} />
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

        <FormField
          control={form.control}
          name="blogUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog URL</FormLabel>
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
                  Show this blog in the featured section.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
              : "Create blog"}
        </Button>
      </form>
    </Form>
  );
}
