import mongoose, { Model, Schema } from "mongoose";
import { projectCategories } from "./project.constant";
import { IProject } from "./project.interface";

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: projectCategories,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      required: true,
    },
    technologies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
      },
    ],
    priorityScore: {
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

export const Project =
  (mongoose.models.Project as Model<IProject>) ||
  mongoose.model<IProject>("Project", projectSchema);
