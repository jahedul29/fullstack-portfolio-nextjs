import { z } from "zod";

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: "Skill name is required",
    }),
    level: z.number({
      required_error: "Level of expertness is required",
    }),
    category: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    level: z.number().optional(),
    category: z.string().optional(),
  }),
});

export const SkillValidationSchema = {
  create,
  update,
};
