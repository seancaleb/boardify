import { axios } from "@/lib/axios";
import { userKeys } from "@/lib/react-query";
import { disableInteractions } from "@/utils/disable-interactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProfileParams, User, userSchema } from "../schema";

type MutationFnParams = {
  updatedUser: UpdateProfileParams;
};

export const updateProfile = async (updatedUser: UpdateProfileParams): Promise<User> => {
  const data = await axios.patch("/users/profile", updatedUser);

  return userSchema.parse(data);
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ updatedUser }: MutationFnParams) => updateProfile(updatedUser),
    onSettled: async (data) => {
      if (data) {
        const { userId } = data;

        await queryClient.invalidateQueries({
          queryKey: userKeys.profile(userId),
        });

        disableInteractions(false);
      }

      disableInteractions(false);
    },
  });
};
