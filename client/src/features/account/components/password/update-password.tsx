import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { UpdatePasswordForm } from "../password/form/update-password-form";

export const UpdatePassword = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseForm = () => setIsOpen(false);
  const handleOpenForm = () => setIsOpen(true);

  return (
    <div>
      <h4 className="mb-4">Manage Password</h4>
      <Separator className="mb-6" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Enter a new password to update your account's security.
        </div>
        <Button onClick={handleOpenForm}>
          <KeyRound className="icon-start-btn" />
          Change password
        </Button>
      </div>

      <UpdatePasswordForm handleCloseForm={handleCloseForm} isOpen={isOpen} />
    </div>
  );
};
