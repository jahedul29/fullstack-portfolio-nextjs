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
