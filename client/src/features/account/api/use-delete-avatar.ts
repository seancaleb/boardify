import { axios } from "@/lib/axios";
import { userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { disableInteractions } from "@/utils/disable-interactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAvatarResponse } from "../schema";

export const deleteAvatar = async (): Promise<DeleteAvatarResponse> => {
  return await axios.delete("/users/profile/avatar");
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  const auth = useAppStore.use.auth();

  return useMutation({
    mutationFn: deleteAvatar,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: userKeys.profile(auth.userId!),
      });

      disableInteractions(false);
    },
  });
};
