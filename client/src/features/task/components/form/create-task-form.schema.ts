import { z } from "zod";
import { DEFAULT_PRIORITIES } from "../../schema";

export const createTaskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Please fill in title field.")
    .transform((str) => str.trim()),
  description: z
    .string()
    .transform((str) => str.trim())
    .optional(),
  priority: z.enum(DEFAULT_PRIORITIES, {
    errorMap: () => ({ message: "Please fill in priority field." }),
  }),
});

export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>;
