// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/skill/skill.model.ts
//
// Transform: default export -> named export with a mongoose.models recompile
// guard (Next.js hot-reload / serverless module reuse safe).
import mongoose, { Model, Schema } from "mongoose";
import { ISkill } from "./skill.interface";

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Skill =
  (mongoose.models.Skill as Model<ISkill>) ||
  mongoose.model<ISkill>("Skill", skillSchema);
