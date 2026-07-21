// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/skill/skill.validate.ts
// (renamed .validate.ts -> .validation.ts)
import { z } from "zod";

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: "Skill name is required",
    }),
    level: z.number({
      required_error: "Level of expertness is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    level: z.number().optional(),
  }),
});

export const SkillValidationSchema = {
  create,
  update,
};
