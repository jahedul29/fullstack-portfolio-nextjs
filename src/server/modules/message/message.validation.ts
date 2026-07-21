import { z } from "zod";

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
    message: z
      .string({
        required_error: "message is required",
      })
      .min(10, { message: "message must be at least 10 characters" }),
  }),
});

const update = z.object({
  body: z.object({
    isRead: z.boolean({
      required_error: "isRead is required and must be a boolean",
    }),
  }),
});

export const MessageValidationSchema = {
  create,
  update,
};
