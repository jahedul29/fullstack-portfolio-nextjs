// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/skill/skill.interface.ts
/* eslint-disable no-unused-vars */
export type ISkill = {
  name: string;
  level: number;
};

export type ISkillMethods = object;

export type ISkillFilters = {
  searchTerm?: string;
};
