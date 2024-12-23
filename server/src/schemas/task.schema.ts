import { z } from "zod";

export const defaultStatuses = ["pending", "in progress", "completed"] as const;
export const defaultPriorites = ["minor", "important", "urgent"] as const;

const payload = {
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    description: z.string().optional(),
    status: z.enum(defaultStatuses, { message: "Invalid status value" }).optional(),
    priority: z.enum(defaultPriorites, { message: "Invalid priority value" }),
    boardId: z.string({ required_error: "Board ID is required" }),
  }),
};

const params = {
  params: z.object({
    taskId: z.string({ required_error: "Task ID is required" }),
  }),
};

const query = {
  query: z.object({
    boardId: z.string().optional(),
  }),
};

export const createTaskSchema = z.object({ ...payload });
export const updateTaskSchema = z.object({ body: payload.body.omit({ boardId: true }) });

export type BoardIdQuery = z.infer<typeof query.query>;
export type CreateTaskBody = z.infer<typeof createTaskSchema>["body"];
export type TaskIdParams = z.infer<typeof params.params>;
export type UpdateTaskBody = z.infer<typeof updateTaskSchema>["body"];
