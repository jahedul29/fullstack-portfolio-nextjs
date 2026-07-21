import mongoose, { Model, Schema } from "mongoose";
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
    impact: {
      type: [String],
    },
    metrics: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    role: {
      type: String,
    },
    teamSize: {
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

export const Experience =
  (mongoose.models.Experience as Model<IExperience>) ||
  mongoose.model<IExperience>("Experience", experienceSchema);
