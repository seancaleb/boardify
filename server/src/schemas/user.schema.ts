import { z } from "zod";

const registerUserPayload = {
  body: z.object({
    firstName: z.string({
      required_error: "First name is required",
    }),
    lastName: z.string({
      required_error: "Last name is required",
    }),
    email: z.string({ required_error: "Email is required" }).email("Email is not valid"),
    role: z.enum(["user", "admin"]).optional(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password is too short - minimum of 6 characters")
      .max(50, "Password too long"),
  }),
};

const loginUserPayload = {
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Email is not valid"),
    password: z.string({ required_error: "Password is required" }),
  }),
};

const updateUserPayload = {
  body: registerUserPayload["body"].pick({
    firstName: true,
    lastName: true,
    email: true,
  }),
};

const deleteUserPayload = {
  body: z.object({
    password: z.string({ required_error: "Password is required" }),
  }),
};

const updatePasswordPayload = {
  body: z.object({
    password: z.string({ required_error: "Password is required" }),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "Password is too short - minimum of 6 characters")
      .max(50, "Password too long"),
  }),
};

export const registerUserSchema = z.object({ ...registerUserPayload });
export const loginUserSchema = z.object({ ...loginUserPayload });
export const updateUserSchema = z.object({ ...updateUserPayload });
export const deleteUserSchema = z.object({ ...deleteUserPayload });
export const updatePasswordSchema = z.object({ ...updatePasswordPayload });

export type RegisterBody = z.infer<typeof registerUserSchema>["body"];
export type LoginBody = z.infer<typeof loginUserSchema>["body"];
export type UpdateUserBody = z.infer<typeof updateUserSchema>["body"];
export type DeleteUserBody = z.infer<typeof deleteUserSchema>["body"];
export type UpdatePasswordBody = z.infer<typeof updatePasswordSchema>["body"];
