import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { UpdatePasswordParams, UpdatedPasswordResponse } from "../schema";

type MutationFnParams = UpdatePasswordParams;

export const updatePassword = async ({
  password,
  newPassword,
}: UpdatePasswordParams): Promise<UpdatedPasswordResponse> => {
  return await axios.patch("/users/password", { password, newPassword });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: ({ password, newPassword }: MutationFnParams) =>
      updatePassword({ password, newPassword }),
  });
};
