// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/user/user.validate.ts
// (renamed .validate.ts -> .validation.ts)
import { z } from "zod";
import { userStatus } from "./user.constant";

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z
      .string({
        required_error: "email is required",
      })
      .email({ message: "Enter valid email address" }),
    phoneNumber: z.string().optional(),
    password: z.string({
      required_error: "password is required",
    }),
    address: z.string().optional(),
    profileUrl: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z
      .string()
      .email({ message: "Enter valid email address" })
      .optional(),
    phoneNumber: z.string().optional(),
    // role: z.enum([...userRoles] as [string, ...string[]]).optional(),
    password: z.string(),
    address: z.string().optional(),
    profileUrl: z.string().optional(),
    status: z.enum([...userStatus] as [string, ...string[]]).optional(),
  }),
});

export const UserValidationSchema = {
  create,
  update,
};
