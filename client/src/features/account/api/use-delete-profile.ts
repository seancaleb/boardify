import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteProfileParams, DeleteProfileResponse } from "../schema";

type MutationFnParams = DeleteProfileParams;

export const deleteProfile = async (password: string): Promise<DeleteProfileResponse> => {
  return await axios.delete("/users/profile", {
    data: {
      password,
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ password }: MutationFnParams) => deleteProfile(password),
    onSuccess: () => {
      queryClient.removeQueries();
    },
  });
};
