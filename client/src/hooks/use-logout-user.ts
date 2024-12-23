/* eslint-disable react-hooks/exhaustive-deps */
import { useLogout } from "@/features/auth/api/use-logout";
import { useAppStore } from "@/stores";
import { useCallback } from "react";
import { toast } from "sonner";

type UseLoginUserProps = {
  mutation: ReturnType<typeof useLogout>;
};

export const useLogoutUser = ({ mutation }: UseLoginUserProps) => {
  const logoutUser = useAppStore.use.logoutUser();

  const handleLogoutUser = useCallback(() => {
    const logoutPromise = mutation.mutateAsync();

    toast.promise(logoutPromise, {
      loading: "Logging out your account...",
      success: () => {
        logoutUser();
        return "Logout successful";
      },
      error: "Something went wrong",
    });
  }, []);

  return {
    handleLogoutUser,
  };
};
