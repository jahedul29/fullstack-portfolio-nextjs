// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/user/user.constant.ts
// fullstack-portfolio-server/src/shared/enum/common.ts
//
// USER_ROLE / USER_STATUS live here (single home) so every module that needs
// them imports from this file instead of a separate shared/enum module.
/* eslint-disable no-unused-vars */
export enum USER_ROLE {
  ADMIN = "admin",
  MANAGER = "manager",
}

export enum USER_STATUS {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export const userRoles = ["admin", "manager"];
export const userStatus = ["active", "blocked"];

export const userFilterableFields = ["searchTerm", "id"];

export const userSearchableFields = ["id"];
