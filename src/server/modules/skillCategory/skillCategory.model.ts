import mongoose, { Model, Schema } from "mongoose";
import { ISkillCategory } from "./skillCategory.interface";

const skillCategorySchema = new Schema<ISkillCategory>(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const SkillCategory =
  (mongoose.models.SkillCategory as Model<ISkillCategory>) ||
  mongoose.model<ISkillCategory>("SkillCategory", skillCategorySchema);
