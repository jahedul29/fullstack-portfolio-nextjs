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
    phoneNumber: z.string({
      required_error: "phone number is required",
    }),
    linkedInUrl: z.string({
      required_error: "linkedIn Url is required",
    }),
    facebookUrl: z.string({
      required_error: "facebook Url is required",
    }),
    githubUrl: z.string({
      required_error: "github Url is required",
    }),
    resumeUrl: z.string({
      required_error: "resume Url is required",
    }),
    stackOverflowUrl: z.string().optional(),
    calanderlyUrl: z.string().optional(),
    address: z.string({
      required_error: "address is required",
    }),
    photoUrl: z.string({
      required_error: "photoUrl is required",
    }),
    designation: z.string({
      required_error: "designation is required",
    }),
    summery: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    heroTagline: z.string().optional(),
    heroHighlight: z.string().optional(),
    aboutOwner: z.string({
      required_error: "aboutOwner is required",
    }),
    metaKeywords: z.array(z.string()).optional(),
    sections: z
      .array(
        z.object({
          key: z.string(),
          visible: z.boolean(),
        })
      )
      .optional(),
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
    linkedInUrl: z.string().optional(),
    facebookUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    resumeUrl: z.string().optional(),
    stackOverflowUrl: z.string().optional(),
    calanderlyUrl: z.string().optional(),
    address: z.string().optional(),
    photoUrl: z.string().optional(),
    designation: z.string().optional(),
    summery: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    heroTagline: z.string().optional(),
    heroHighlight: z.string().optional(),
    aboutOwner: z.string().optional(),
    metaKeywords: z.array(z.string()).optional(),
    sections: z
      .array(
        z.object({
          key: z.string(),
          visible: z.boolean(),
        })
      )
      .optional(),
  }),
});

export const OwnerValidationSchema = {
  create,
  update,
};
