import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { DeleteProfileForm } from "./form/delete-profile-form";

export const DeleteProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseForm = () => setIsOpen(false);
  const handleOpenForm = () => setIsOpen(true);

  return (
    <div>
      <div className="space-y-2 mb-4">
        <h4>Danger Zone</h4>
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Account Deletion Warning</AlertTitle>
          <AlertDescription>
            Once deleted, your account and all related data cannot be recovered.
          </AlertDescription>
        </Alert>
      </div>
      <Separator className="mb-6" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Permanently remove your account and all associated data. This action cannot be undone, so
          please proceed with caution.
        </div>
        <Button variant="destructive" onClick={handleOpenForm}>
          <Trash2 className="icon-start-btn" />
          Delete account
        </Button>
      </div>

      <DeleteProfileForm isOpen={isOpen} handleCloseForm={handleCloseForm} />
    </div>
  );
};
