import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteProfileForm } from "./form/delete-profile-form";

export const DeleteProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseForm = () => setIsOpen(false);
  const handleOpenForm = () => setIsOpen(true);

  return (
    <div className="w-full flex-col sm:flex-row flex justify-between gap-4 sm:gap-6">
      <div className="space-y-1 max-w-md">
        <div className="text-base font-medium tracking-tight">Account deletion</div>
        <div className="text-sm text-muted-foreground">
          Permanently remove your account and all associated data. This action cannot be undone, so
          please proceed with caution.
        </div>
      </div>
      <Button variant="destructive" onClick={handleOpenForm}>
        <Trash2 className="icon-start-btn" />
        Delete account
      </Button>

      <DeleteProfileForm isOpen={isOpen} handleCloseForm={handleCloseForm} />
    </div>
  );
};
