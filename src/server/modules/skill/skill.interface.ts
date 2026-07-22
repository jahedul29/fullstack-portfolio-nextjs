/* eslint-disable no-unused-vars */
export type ISkill = {
  name: string;
  level: number;
  category?: string;
  position?: number;
};

export type ISkillMethods = object;

export type ISkillFilters = {
  searchTerm?: string;
};
