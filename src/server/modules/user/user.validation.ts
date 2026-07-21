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
