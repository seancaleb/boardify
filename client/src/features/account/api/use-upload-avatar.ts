import { axios } from "@/lib/axios";
import { userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { disableInteractions } from "@/utils/disable-interactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadAvatarParams, UploadAvatarResponse } from "../schema";

type MutationFnParams = UploadAvatarParams;

export const uploadAvatar = async ({
  avatar,
}: UploadAvatarParams): Promise<UploadAvatarResponse> => {
  const formData = new FormData();

  formData.append("avatar", avatar);

  return await axios.post("/users/profile/avatar", formData);
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const auth = useAppStore.use.auth();

  return useMutation({
    mutationFn: ({ avatar }: MutationFnParams) => uploadAvatar({ avatar }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: userKeys.profile(auth.userId!),
      });

      disableInteractions(false);
    },
  });
};
