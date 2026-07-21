// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/contribution/contribution.interface.ts
import { Types } from "mongoose";

/* eslint-disable no-unused-vars */
export type IContribution = {
  title: string;
  photoUrl: string;
  contributionFor: string;
  description: string;
  githubUrl?: string;
  relatedUrl: string;
  isFeatured: boolean;
  technologies: Types.ObjectId[];
  priorityScore: number;
};

export type IContributionMethods = object;

export type IContributionFilters = {
  searchTerm?: string;
  isFeatured?: boolean;
};
