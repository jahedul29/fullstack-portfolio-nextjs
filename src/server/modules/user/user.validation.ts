// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/user/user.validate.ts
// (renamed .validate.ts -> .validation.ts)
import { z } from "zod";
import { userRoles, userStatus } from "./user.constant";

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
    // FU-F: the User model requires phoneNumber/address (no default) - the
    // zod schema previously marked them optional, letting invalid docs
    // through validation only to fail at the mongoose layer.
    phoneNumber: z.string({
      required_error: "phoneNumber is required",
    }),
    password: z.string({
      required_error: "password is required",
    }),
    address: z.string({
      required_error: "address is required",
    }),
    profileUrl: z.string().optional(),
    role: z.enum([...userRoles] as [string, ...string[]], {
      required_error: "role is required",
    }),
    status: z.enum([...userStatus] as [string, ...string[]]).optional(),
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
    role: z.enum([...userRoles] as [string, ...string[]]).optional(),
    // FU-E: admin edits shouldn't have to resend the current password.
    password: z.string().optional(),
    address: z.string().optional(),
    profileUrl: z.string().optional(),
    status: z.enum([...userStatus] as [string, ...string[]]).optional(),
  }),
});

export const UserValidationSchema = {
  create,
  update,
};
