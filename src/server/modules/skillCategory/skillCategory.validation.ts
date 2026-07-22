import { z } from "zod";

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: "Skill category name is required",
    }),
    position: z.number().optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    position: z.number().optional(),
  }),
});

const reorder = z.object({
  body: z.object({
    ids: z
      .array(z.string(), {
        required_error: "Ordered list of skill category ids is required",
      })
      .nonempty("Ordered list of skill category ids is required"),
  }),
});

export const SkillCategoryValidationSchema = {
  create,
  update,
  reorder,
};
