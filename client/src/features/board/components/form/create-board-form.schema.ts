import { z } from "zod";

export const createBoardFormSchema = z.object({
  title: z
    .string()
    .min(1, "Please fill in title field.")
    .transform((str) => str.trim()),
  description: z.string().optional(),
});

export type CreateBoardFormValues = z.infer<typeof createBoardFormSchema>;
