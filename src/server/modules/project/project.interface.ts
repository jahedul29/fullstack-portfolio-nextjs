/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export type IProjectCategory = "frontend" | "fullstack" | "backend";

export type IProjectType = "professional" | "personal";

export type IProject = {
  title: string;
  category: IProjectCategory;
  photoUrl: string;
  description: string;
  githubUrl: string;
  websiteUrl: string;
  videoUrl?: string;
  isFeatured: boolean;
  technologies: Types.ObjectId[];
  priorityScore: number;
  outcome?: string;
  role?: string;
  type?: IProjectType;
};

export type IProjectMethods = object;

export type IProjectFilters = {
  searchTerm?: string;
  id?: string;
  category?: IProjectCategory;
  isFeatured?: boolean;
  type?: IProjectType;
};
