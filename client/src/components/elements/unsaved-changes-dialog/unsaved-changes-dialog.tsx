import { Button } from "@/components/ui/button";
import { AlertDialog } from "../";

type UnsavedChangesDialogProps = {
  title?: string;
  message?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
};

export const UnsavedChangesDialog = ({
  title,
  message,
  isOpen,
  setIsOpen,
  onClose,
}: UnsavedChangesDialogProps) => {
  const dialogTitle = title ? title : "Discard changes?";
  const dialogMessage = message
    ? message
    : "Are you sure you want to discard the changes you made?";

  const handleClickCancel = () => setIsOpen(false);

  return (
    <AlertDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={dialogTitle}
      message={dialogMessage}
      size="sm"
      actionButtons={[
        <Button variant="ghost" onClick={handleClickCancel}>
          Cancel
        </Button>,
        <Button onClick={onClose}>Discard</Button>,
      ]}
    />
  );
};
