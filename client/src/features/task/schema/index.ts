import { z } from "zod";

export const DEFAULT_STATUSES = ["pending", "in progress", "completed"] as const;
export const DEFAULT_PRIORITIES = ["minor", "important", "urgent"] as const;

export const taskSchema = z.object({
  taskId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["pending", "in progress", "completed"]),
  priority: z.enum(["minor", "important", "urgent"]),
  userId: z.string(),
  boardId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const tasksSchema = z.array(taskSchema);

export const taskParamsSchema = taskSchema.pick({
  title: true,
  description: true,
  priority: true,
  boardId: true,
  status: true,
});

export const createdTaskSchema = z.object({
  message: z.string(),
});

export const deletedTaskSchema = z.object({
  message: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
export type Tasks = z.infer<typeof tasksSchema>;
export type TaskParams = z.infer<typeof taskParamsSchema>;
export type CreatedTaskResponse = z.infer<typeof createdTaskSchema>;
export type DeletedTaskResponse = z.infer<typeof deletedTaskSchema>;
export type UpdatedTaskResponse = z.infer<typeof taskSchema>;
