import { userSchema } from "@/features/account/schema";
import { z } from "zod";

export const parsedTokenSchema = z.object({
  ...userSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    userId: true,
  }).shape,
  exp: z.number(),
});

export type ParsedToken = z.infer<typeof parsedTokenSchema>;
