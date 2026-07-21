// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/experience/experience.validate.ts
// (renamed .validate.ts -> .validation.ts)
import mongoose from "mongoose";
import { z } from "zod";
import { monthList } from "./experience.constant";

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
  }),
});

const update = z.object({
  body: z.object({
    companyName: z.string().optional(),
    position: z.string().optional(),
    startMonth: z.enum(monthList as [string, ...string[]]).optional(),
    startYear: z.string().optional(),
    endMonth: z.enum(monthList as [string, ...string[]]).optional(),
    endYear: z.string().optional(),
    isWorkingCurrently: z.boolean().optional(),
    show: z.boolean().optional(),
    technologies: z.array(z.instanceof(mongoose.Types.ObjectId)).optional(),
  }),
});

export const ExperienceValidationSchema = {
  create,
  update,
};
