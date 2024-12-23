import { AlertDialog, Spinner } from "@/components/elements";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteBoard } from "../api/use-delete-board";

type DeleteBoardButtonProps = {
  boardId: string;
  handleSetIsOpen: (value: boolean) => void;
};

export const DeleteBoardButton = ({ boardId, handleSetIsOpen }: DeleteBoardButtonProps) => {
  const deleteBoardMutation = useDeleteBoard();
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const handleSetIsOpenAlert = () => setIsOpenAlert(true);
  const handleIsOpenAlert = (value: boolean) => setIsOpenAlert(value);
  const handleCancelAlert = () => setIsOpenAlert(false);

  const handleCloseAlert = () => {
    deleteBoardMutation.mutate(
      { boardId: boardId },
      {
        onSuccess: ({ message }) => {
          const { title, description } = toastMessageFormatter(message);
          toast.success(title, { description });
        },
        onError: ({ message }) => {
          const { title, description } = toastMessageFormatter(message);
          toast.error(title, {
            description,
          });
        },
        onSettled: () => {
          handleSetIsOpen(false);
          setIsOpenAlert(false);
        },
      }
    );
  };

  console.log({ isOpenAlert });

  return (
    <>
      <DropdownMenuItem onClick={handleSetIsOpenAlert}>
        <Trash2 className="text-muted-foreground" />
        <span>Delete board</span>
      </DropdownMenuItem>

      <AlertDialog
        isOpen={isOpenAlert || deleteBoardMutation.isPending}
        setIsOpen={handleIsOpenAlert}
        title="Delete board?"
        message={<>Are you sure you want to delete this board? This action cannot be undone.</>}
        actionButtons={[
          <Button
            variant="ghost"
            onClick={handleCancelAlert}
            disabled={deleteBoardMutation.isPending}
          >
            Cancel
          </Button>,
          <Button type="submit" onClick={handleCloseAlert} disabled={deleteBoardMutation.isPending}>
            {deleteBoardMutation.isPending ? <Spinner /> : null}
            Confirm deletion
          </Button>,
        ]}
      />
    </>
  );
};
