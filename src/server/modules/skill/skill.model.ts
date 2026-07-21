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
