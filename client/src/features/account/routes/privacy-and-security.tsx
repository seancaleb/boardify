import { Transition } from "@/components/animations";
import { ContentLayout } from "@/components/layout";
import { useDocumentTitle } from "@mantine/hooks";
import { UpdatePassword } from "../components/password/update-password";
import { DeleteProfile } from "../components/profile/delete-profile";

export const PrivacyAndSecurity = () => {
  const headerSlot = (
    <div className="space-y-1">
      <h3>Privacy & Security</h3>
      <div className="text-muted-foreground text-sm max-w-[75ch]">
        Manage your profile security.
      </div>
    </div>
  );

  useDocumentTitle("Account Security - Boardify");

  return (
    <ContentLayout header={headerSlot}>
      <Transition className="relative top-0 left-0 right-0 bottom-0 space-y-4">
        <div className="mx-auto max-w-2xl w-full mt-1 md:mt-4 space-y-8">
          <UpdatePassword />
          <DeleteProfile />
        </div>
      </Transition>
    </ContentLayout>
  );
};
