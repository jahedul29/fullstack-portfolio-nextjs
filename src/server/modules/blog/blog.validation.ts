import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    category: z.string({
      required_error: "Category is required",
    }),
    photoUrl: z.string({
      required_error: "Photo URL is required",
    }),
    blogUrl: z.string({
      required_error: "Blog URL is required",
    }),
    platform: z.string({
      required_error: "Platform  is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),

    isFeatured: z.boolean({
      required_error: "isFeatured is required and must be a boolean",
    }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    photoUrl: z.string().optional(),
    blogUrl: z.string().optional(),
    platform: z.string().optional(),
    description: z.string().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const BlogValidationSchema = {
  create,
  update,
};
