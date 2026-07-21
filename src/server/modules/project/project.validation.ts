import { z } from "zod";
import { projectCategories } from "./project.constant";

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    category: z.enum(projectCategories as [string, ...string[]], {
      required_error:
        "Category is required and must be one of the predefined categories",
    }),
    photoUrl: z.string({
      required_error: "Photo URL is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    githubUrl: z.string({
      required_error: "GitHub URL is required",
    }),
    websiteUrl: z.string({
      required_error: "Website URL is required",
    }),
    videoUrl: z.string().optional(),
    isFeatured: z.boolean({
      required_error: "isFeatured is required and must be a boolean",
    }),
    technologies: z.array(z.string(), {
      required_error:
        "Technologies array is required and must contain valid MongoDB ObjectIds",
    }),
    outcome: z.string().optional(),
    role: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    category: z.enum(projectCategories as [string, ...string[]]).optional(),
    photoUrl: z.string().optional(),
    description: z.string().optional(),
    githubUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    isFeatured: z.boolean().optional(),
    technologies: z.array(z.string()).optional(),
    outcome: z.string().optional(),
    role: z.string().optional(),
  }),
});

export const ProjectValidationSchema = {
  create,
  update,
};
