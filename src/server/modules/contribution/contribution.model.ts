import mongoose, { Model, Schema } from "mongoose";
import { IContribution } from "./contribution.interface";

const contributionSchema = new Schema<IContribution>(
  {
    title: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    contributionFor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
    },
    relatedUrl: {
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

export const Contribution =
  (mongoose.models.Contribution as Model<IContribution>) ||
  mongoose.model<IContribution>("Contribution", contributionSchema);
