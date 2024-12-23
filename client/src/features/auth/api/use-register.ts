import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { RegisterCredentials } from "../types";

type MutationFnParams = {
  credentials: RegisterCredentials;
};

const registerUserRequest = async (
  credentials: RegisterCredentials
): Promise<{ message: string }> => {
  return await axios.post("/auth/register", credentials);
};

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ credentials }: MutationFnParams) => registerUserRequest(credentials),
  });
};
