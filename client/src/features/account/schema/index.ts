import { z } from "zod";

export const userBaseSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.enum(["user", "admin"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  avatar: z.string().nullable(),
});

export const userSchema = z.object({
  ...userBaseSchema.shape,
});

export const updateProfileParamsSchema = userBaseSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
});

export const deleteProfileParamsSchema = z.object({
  password: z.string(),
});

export const updatePasswordParamsSchema = z.object({
  password: z.string(),
  newPassword: z.string(),
});

export const updatedPasswordSchema = z.object({
  message: z.string(),
});

export const deleteProfileSchema = z.object({
  message: z.string(),
});

export const userProfileDetailsSchema = userBaseSchema.pick({
  firstName: true,
  lastName: true,
  avatar: true,
});

export const uploadAvatarParamsSchema = z.object({
  avatar: z.instanceof(File),
});

export const uploadAvatarSchema = z.object({
  message: z.string(),
});

export const deleteAvatarSchema = z.object({
  message: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type UpdateProfileParams = z.infer<typeof updateProfileParamsSchema>;
export type DeleteProfileParams = z.infer<typeof deleteProfileParamsSchema>;
export type UpdatePasswordParams = z.infer<typeof updatePasswordParamsSchema>;
export type DeleteProfileResponse = z.infer<typeof deleteProfileSchema>;
export type UpdatedPasswordResponse = z.infer<typeof updatedPasswordSchema>;
export type UserProfileDetailsResponse = z.infer<typeof userProfileDetailsSchema>;
export type UploadAvatarParams = z.infer<typeof uploadAvatarParamsSchema>;
export type UploadAvatarResponse = z.infer<typeof uploadAvatarSchema>;
export type DeleteAvatarResponse = z.infer<typeof deleteAvatarSchema>;
