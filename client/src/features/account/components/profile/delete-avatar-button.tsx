import { Spinner } from "@/components/elements";
import { Button } from "@/components/ui/button";
import { useGetProfile } from "@/features/account/api/use-get-profile";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useDeleteAvatar } from "../../api/use-delete-avatar";

export const DeleteAvatarButton = () => {
  const deleteAvatarMutation = useDeleteAvatar();
  const profile = useGetProfile();

  const handleClickDeleteAvatar = () => {
    deleteAvatarMutation.mutate(undefined, {
      onSuccess: ({ message }) => {
        const { title, description } = toastMessageFormatter(message);

        toast.success(title, {
          description,
        });
      },
      onError: ({ message }) => {
        const { title, description } = toastMessageFormatter(message);
        toast.error(title, {
          description,
        });
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClickDeleteAvatar}
      disabled={profile.data ? !profile.data.avatar || deleteAvatarMutation.isPending : true}
    >
      {deleteAvatarMutation.isPending ? <Spinner className="mr-0" /> : <Trash />}
    </Button>
  );
};
