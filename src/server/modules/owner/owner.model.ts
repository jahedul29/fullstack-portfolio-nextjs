import mongoose, { Model, Schema } from "mongoose";
import { IOwner } from "./owner.interface";

const ownerSchema = new Schema<IOwner>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    linkedInUrl: {
      type: String,
      required: true,
    },
    facebookUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    stackOverflowUrl: {
      type: String,
    },
    calanderlyUrl: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    summery: {
      type: String,
    },
    yearsOfExperience: {
      type: Number,
    },
    heroTagline: {
      type: String,
    },
    heroHighlight: {
      type: String,
    },
    aboutOwner: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: [String],
    },
    sections: [
      {
        key: { type: String, required: true },
        visible: { type: Boolean, required: true },
        _id: false,
      },
    ],
    heroSkills: {
      type: [String],
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Owner =
  (mongoose.models.Owner as Model<IOwner>) ||
  mongoose.model<IOwner>("Owner", ownerSchema);
