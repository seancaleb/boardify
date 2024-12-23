import { z } from "zod";

const MAX_FILE_SIZE = 2097152;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const uploadAvatarFormSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length >= 1, { message: "Image is required." })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "Only .jpg, .jpeg, .png and .webp files are accepted.",
    })
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `Maximum file size of 2MB is allowed.`,
    }),
});

export type UploadAvatarFormValues = z.infer<typeof uploadAvatarFormSchema>;
