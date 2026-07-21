// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/user/user.model.ts
//
// Transforms: bcrypt -> bcryptjs; config.bcrypt_salt_rounds -> config.bcryptSaltRounds;
// default export -> named export with a mongoose.models recompile guard
// (required so Next.js hot-reload / serverless module reuse doesn't attempt
// to redefine the "User" model against the same mongoose connection).
import bcrypt from "bcryptjs";
import mongoose, { Schema, Types } from "mongoose";
import { config } from "@/server/lib/config";
import { userRoles, userStatus } from "./user.constant";
import { IUser, UserModel } from "./user.interface";

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: userRoles,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    address: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: userStatus,
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.isUserExist = async function (email: string): Promise<
  | (Pick<IUser, "email" | "role" | "password"> & {
      _id: Types.ObjectId;
    })
  | null
> {
  return await User.findOne(
    { email },
    {
      _id: 1,
      phoneNumber: 1,
      password: 1,
      role: 1,
    }
  );
};

userSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  currentPassword: string
) {
  return await bcrypt.compare(givenPassword, currentPassword);
};

//* You can use this if you want to do some operation before saving it in databse.
//* Below it's hashing the password before saving.
userSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcryptSaltRounds)
    );
  }
  next();
});

//* You can use this if you want to do some operation before updating it in databse.
//* Below it's hashing the password before updating.
userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update: any = this.getUpdate();
    if (update.password) {
      update.password = await bcrypt.hash(
        update.password,
        Number(config.bcryptSaltRounds)
      );
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User =
  (mongoose.models.User as UserModel) ||
  mongoose.model<IUser, UserModel>("User", userSchema);
