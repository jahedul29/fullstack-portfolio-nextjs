/* eslint-disable no-unused-vars */
export type IBlog = {
  title: string;
  category: string;
  photoUrl: string;
  blogUrl: string;
  platform: string;
  description: string;
  isFeatured: boolean;
  priorityScore: number;
};

export type IBlogMethods = object;

export type IBlogFilters = {
  searchTerm?: string;
  isFeatured?: boolean;
};
