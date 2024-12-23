import { z } from "zod";

export const updatePasswordFormSchema = z
  .object({
    password: z.string().min(1, "Please fill in your password."),
    newPassword: z
      .string()
      .min(1, "Please fill in your new password.")
      .min(6, "Password should be at least 6 characters long.")
      .max(50, "Password cannot exceed 50 characters."),
    confirmPassword: z.string().min(1, "Please fill in your confirmation password."),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        path: ["mismatchPasswords"],
        code: "custom",
        message: "The new passwords provided do not match.",
      });
    }
  });

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordFormSchema>;
