// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/auth/auth.validation.ts
import { z } from "zod";

const loginValidation = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const refreshTokenValidation = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});

const changePasswordValidation = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required",
    }),
    newPassword: z.string({
      required_error: "New password is required",
    }),
  }),
});

export const AuthZodValidation = {
  loginValidation,
  refreshTokenValidation,
  changePasswordValidation,
};
