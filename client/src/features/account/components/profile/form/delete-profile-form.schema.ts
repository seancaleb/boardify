import { z } from "zod";

export const deleteProfileFormSchema = z.object({
  password: z.string().min(1, "Please fill in your password."),
});

export type DeleteProfileFormValues = z.infer<typeof deleteProfileFormSchema>;
