import { Transition } from "@/components/animations";
import { DataLoader } from "@/components/elements";
import { ContentLayout } from "@/components/layout";
import { useGetProfile, UserProfile } from "@/features/account";
import { useGetAllBoards } from "@/features/board/api/use-get-all-boards";
import { useGetAllTasks } from "@/features/task/api/use-get-all-tasks";
import { useDocumentTitle } from "@mantine/hooks";

export const Profile = () => {
  const { data, isPending, isError, error } = useGetProfile();
  const boards = useGetAllBoards();
  const tasks = useGetAllTasks();

  useDocumentTitle("Profile - Boardify");

  if (isPending || boards.isPending || tasks.isPending) {
    return <DataLoader data="profile details" />;
  }

  if (isError) {
    throw new Error(error.message);
  }

  const headerSlot = (
    <div className="space-y-1">
      <h3>My Profile</h3>
      <div className="text-muted-foreground text-sm max-w-[75ch]">
        An overview of your personal information.
      </div>
    </div>
  );

  return (
    <ContentLayout header={headerSlot}>
      <Transition className="relative top-0 left-0 right-0 bottom-0 space-y-4">
        <div className="mx-auto max-w-3xl w-full mt-1 md:mt-4 space-y-8">
          <UserProfile user={data} />
        </div>
      </Transition>
    </ContentLayout>
  );
};
