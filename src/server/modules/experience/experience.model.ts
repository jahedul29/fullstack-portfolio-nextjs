// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/experience/experience.model.ts
//
// Transform: default export -> named export with a mongoose.models recompile
// guard (Next.js hot-reload / serverless module reuse safe).
import mongoose, { Model, Schema } from "mongoose";
import { monthList } from "./experience.constant";
import { IExperience } from "./experience.interface";

const experienceSchema = new Schema<IExperience>(
  {
    companyName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      enum: monthList,
      required: true,
    },
    endTime: {
      type: Date,
    },
    isWorkingCurrently: {
      type: Boolean,
      required: true,
      default: false,
    },
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    technologies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
      },
    ],
    description: {
      type: String,
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

export const Experience =
  (mongoose.models.Experience as Model<IExperience>) ||
  mongoose.model<IExperience>("Experience", experienceSchema);
