import { Types } from "mongoose";

/* eslint-disable no-unused-vars */
export type IExperience = {
  companyName: string;
  position: string;
  startTime: Date;
  endTime?: Date;
  isWorkingCurrently?: boolean;
  show: boolean;
  technologies: Types.ObjectId[];
  description: string;
  impact?: string[];
  metrics?: { label: string; value: string }[];
  role?: string;
  teamSize?: number;
};

export type IExperienceMethods = object;

export type IExperienceFilters = {
  searchTerm?: string;
  isFeatured?: boolean;
};
