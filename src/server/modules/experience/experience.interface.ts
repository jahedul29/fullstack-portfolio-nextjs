// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/experience/experience.interface.ts
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
};

export type IExperienceMethods = object;

export type IExperienceFilters = {
  searchTerm?: string;
  isFeatured?: boolean;
};
