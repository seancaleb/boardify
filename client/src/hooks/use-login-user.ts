/* eslint-disable react-hooks/exhaustive-deps */
import { useLogin } from "@/features/auth/api/use-login";
import { ParsedToken, parsedTokenSchema } from "@/features/auth/schema";
import { LoginCredentials } from "@/features/auth/types";
import { useAppStore } from "@/stores";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { jwtDecode } from "jwt-decode";
import { useCallback } from "react";
import { toast } from "sonner";

type UseLoginUserProps = {
  mutation: ReturnType<typeof useLogin>;
};

export const useLoginUser = ({ mutation }: UseLoginUserProps) => {
  const loginUser = useAppStore.use.loginUser();

  const handleLoginUser = useCallback((credentials: LoginCredentials) => {
    const loginPromise = mutation.mutateAsync(
      {
        credentials,
      },
      {
        onSuccess: ({ accessToken }) => {
          const decodedToken = jwtDecode<ParsedToken>(accessToken);
          const parsedUser = parsedTokenSchema.parse(decodedToken);
          const { role, exp, userId } = parsedUser;

          loginUser({
            userId,
            role,
            tokenExpiration: exp,
          });
        },
      }
    );

    toast.promise(loginPromise, {
      loading: "Logging in your account...",
      success: () => {
        return "Login successful";
      },
      error: ({ message }) => {
        const { title } = toastMessageFormatter(message);
        return title;
      },
      description: ({ message }) => {
        if (!message) {
          return;
        }

        const { description } = toastMessageFormatter(message);
        return description;
      },
    });
  }, []);

  return {
    handleLoginUser,
  };
};
