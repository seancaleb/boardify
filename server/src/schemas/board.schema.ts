import { z } from "zod";

const payload = {
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string().optional(),
  }),
};

const params = {
  params: z.object({
    boardId: z.string({ required_error: "Board ID is required" }),
  }),
};

export const createBoardSchema = z.object({ ...payload });
export const updateBoardSchema = z.object({ ...payload });

export type CreateBoardBody = z.infer<typeof createBoardSchema>["body"];
export type BoardIdParams = z.infer<typeof params.params>;
export type UpdateBoardBody = z.infer<typeof updateBoardSchema>["body"];
