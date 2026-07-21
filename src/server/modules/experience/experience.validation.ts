import { z } from "zod";

const create = z.object({
  body: z.object({
    companyName: z.string({
      required_error: "Company name is required",
    }),
    position: z.string({
      required_error: "Position is required",
    }),
    startTime: z.string({
      required_error: "Start time is required",
    }),
    endTime: z.string().optional(),
    isWorkingCurrently: z.boolean().optional(),
    show: z.boolean({
      required_error: "Show is required and must be a boolean",
    }),
    technologies: z.array(z.string(), {
      required_error:
        "Technologies array is required and must contain valid MongoDB ObjectIds",
    }),
    impact: z.array(z.string()).optional(),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    role: z.string().optional(),
    teamSize: z.number().optional(),
  }),
});

const update = z.object({
  body: z.object({
    companyName: z.string().optional(),
    position: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    isWorkingCurrently: z.boolean().optional(),
    show: z.boolean().optional(),
    technologies: z.array(z.string()).optional(),
    impact: z.array(z.string()).optional(),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    role: z.string().optional(),
    teamSize: z.number().optional(),
  }),
});

export const ExperienceValidationSchema = {
  create,
  update,
};
