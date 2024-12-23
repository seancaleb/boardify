import { Spinner } from "@/components/elements";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLogout } from "@/features/auth/api/use-logout";

type SessionExpiredDialogProps = {
  isTokenExpired: boolean;
  handleSessionExpired: () => void;
};

export const SessionExpiredDialog = ({
  isTokenExpired,
  handleSessionExpired,
}: SessionExpiredDialogProps) => {
  const logoutMutation = useLogout();

  const title = "Session expired";
  const message =
    "Your session has expired. Please log in again to continue using the application.";

  const handleClickSessionExpired = () => handleSessionExpired();

  return (
    <AlertDialog open={isTokenExpired} onOpenChange={handleClickSessionExpired}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="tracking-[-.015em]">{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleClickSessionExpired}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? <Spinner /> : null}
            Ok
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
