import { Transition } from "@/components/animations";
import { ContentLayout } from "@/components/layout";
import { Separator } from "@/components/ui/separator";
import { UpdateProfileAvatar, UpdateProfileForm } from "@/features/account";
import { useDocumentTitle } from "@mantine/hooks";

export const AccountDetails = () => {
  const headerSlot = (
    <div className="space-y-1">
      <h3>Account Details</h3>
      <div className="text-muted-foreground text-sm max-w-[75ch]">
        View and manage your account details.
      </div>
    </div>
  );

  useDocumentTitle("Account Details - Boardify");

  return (
    <ContentLayout header={headerSlot}>
      <Transition className="relative top-0 left-0 right-0 bottom-0 space-y-4">
        <div className="mx-auto max-w-lg w-full mt-1 md:mt-4 space-y-8">
          <UpdateProfileAvatar />
          <div>
            <h4 className="mb-4">Personal Information</h4>
            <Separator className="mb-6" />
            <UpdateProfileForm />
          </div>
        </div>
      </Transition>
    </ContentLayout>
  );
};
