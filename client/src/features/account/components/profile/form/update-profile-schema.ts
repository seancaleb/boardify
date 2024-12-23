import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "Please fill in your first name.")
    .min(2, "First name should be at least 2 characters long.")
    .max(50, "First name cannot exceed 50 characters.")
    .transform((str) => str.trim()),
  lastName: z
    .string()
    .min(1, "Please fill in your last name.")
    .min(2, "Last name should be at least 2 characters long.")
    .max(50, "Last name cannot exceed 50 characters.")
    .transform((str) => str.trim()),
  email: z
    .string()
    .min(1, "Please fill in your email.")
    .email("Please enter a valid email.")
    .transform((str) => str.trim()),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
