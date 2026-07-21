import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    photoUrl: z.string({
      required_error: "Photo URL is required",
    }),
    contributionFor: z.string({
      required_error: "ContributionFor  URL is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    githubUrl: z.string().optional(),
    relatedUrl: z.string({
      required_error: "Related URL is required",
    }),
    isFeatured: z.boolean({
      required_error: "isFeatured is required and must be a boolean",
    }),
    technologies: z.array(z.string(), {
      required_error:
        "Technologies array is required and must contain valid MongoDB ObjectIds",
    }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    photoUrl: z.string().optional(),
    contributionFor: z.string().optional(),
    description: z.string().optional(),
    githubUrl: z.string().optional(),
    relatedUrl: z.string().optional(),
    isFeatured: z.boolean().optional(),
    technologies: z.array(z.string()).optional(),
  }),
});

export const ContributionValidationSchema = {
  create,
  update,
};
