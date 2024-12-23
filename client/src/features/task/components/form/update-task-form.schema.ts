import { z } from "zod";
import { DEFAULT_PRIORITIES, DEFAULT_STATUSES } from "../../schema";

export const updateTaskFormSchema = z.object({
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
  status: z.enum(DEFAULT_STATUSES, {
    errorMap: () => ({ message: "Please fill in status field." }),
  }),
});

export type UpdateTaskFormValues = z.infer<typeof updateTaskFormSchema>;
