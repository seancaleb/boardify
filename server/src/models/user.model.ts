import { User } from "@/types";
import { generateUniqueId } from "@/utils";
import bcrypt from "bcrypt";
import config from "config";
import mongoose, { Document, Query, Schema } from "mongoose";

interface UserDocument extends User, Document {
  comparePassword(candidatePassword: string): Promise<Error | boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    userId: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre<UserDocument>("save", async function (next) {
  if (this.isNew) {
    this.userId = generateUniqueId(this.role);
  }

  if (!this.isModified("password")) {
    return next();
  }

  const SALT_WORK_FACTOR = config.get<number>("saltWorkFactor");

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = bcrypt.hashSync(this.password, salt);

  this.password = hash;

  return next();
});

userSchema.pre<Query<any, UserDocument>>("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as { password: string };

  if (update.password) {
    const SALT_WORK_FACTOR = config.get<number>("saltWorkFactor");

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = bcrypt.hashSync(update.password, salt);

    this.set("password", hash);
    next();
  }

  next();
});

userSchema.methods.comparePassword = async function (
  this: UserDocument,
  candidatePassword: string
): Promise<Error | boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<UserDocument>("User", userSchema);
