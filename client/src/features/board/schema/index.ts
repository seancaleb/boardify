import { z } from "zod";

export const boardSchema = z.object({
  boardId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const boardsSchema = z.array(boardSchema);

export const boardParamsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const createdBoardSchema = z.object({
  message: z.string(),
});

export const deletedBoardSchema = z.object({
  message: z.string(),
});

export const updatedBoardSchema = boardSchema;

export type Board = z.infer<typeof boardSchema>;
export type Boards = z.infer<typeof boardsSchema>;
export type BoardParams = z.infer<typeof boardParamsSchema>;
export type CreatedBoardResponse = z.infer<typeof createdBoardSchema>;
export type DeletedBoardResponse = z.infer<typeof deletedBoardSchema>;
export type UpdatedBoardResponse = z.infer<typeof updatedBoardSchema>;
