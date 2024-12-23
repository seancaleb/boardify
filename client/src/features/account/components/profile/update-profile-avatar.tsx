import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";
import { useGetProfile } from "../..";
import { DeleteAvatarButton } from "./delete-avatar-button";
import { UploadAvatarForm } from "./form/upload-avatar-form";
import { ProfileAvatar } from "./profile-avatar";

export const UpdateProfileAvatar = () => {
  const profile = useGetProfile();

  return (
    <div>
      <div className="space-y-2 mb-4">
        <h4>Profile Photo</h4>
        <Alert>
          <Upload className="h-4 w-4" />
          <AlertTitle>File Size Limit</AlertTitle>
          <AlertDescription>Please upload a photo that is 2MB or less.</AlertDescription>
        </Alert>
      </div>
      <Separator className="mb-6" />
      <div className="flex items-center gap-6">
        <ProfileAvatar
          user={profile.data}
          className="h-36 w-36 self-center sm:self-auto text-2xl"
        />
        <div className="flex items-center gap-2">
          {/* Upload photo  */}
          <UploadAvatarForm />
          {/* Delete photo  */}
          <DeleteAvatarButton />
        </div>
      </div>
    </div>
  );
};
