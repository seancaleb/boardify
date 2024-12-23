import { Transition } from "@/components/animations";
import { DataLoader } from "@/components/elements";
import { ContentLayout } from "@/components/layout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boards as TBoards } from "@/features/board/schema";
import { cn } from "@/lib/utils";
import { useDocumentTitle } from "@mantine/hooks";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useGetAllBoards } from "../api/use-get-all-boards";
import { CreateBoardButton } from "../components/create-board-button";

export const Boards = () => {
  const boards = useGetAllBoards();

  useDocumentTitle("Boards - Boardify");

  if (boards.isPending) {
    return <DataLoader data="boards" />;
  }

  if (boards.error) {
    throw new Error(boards.error.message);
  }

  return <>{boards.data.length > 0 ? <BoardsList boards={boards.data} /> : <EmptyBoards />}</>;
};

const EmptyBoards = () => {
  return (
    <Transition className="top-0">
      <div className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <div className="grid justify-items-center gap-1">
          <h3>You don't have any boards yet.</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create a new board to start organizing and adding tasks.
          </p>
          <CreateBoardButton />
        </div>
      </div>
    </Transition>
  );
};

const BoardsList = ({ boards }: { boards: TBoards }) => {
  const headerSlot = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="space-y-1">
        <h3>My Boards</h3>
        <div className="text-muted-foreground text-sm max-w-[75ch]">
          View and organize all your boards here.
        </div>
      </div>
      <CreateBoardButton />
    </div>
  );

  return (
    <ContentLayout header={headerSlot}>
      <Transition className="relative top-0 left-0 right-0 bottom-0 space-y-4">
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(256px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] xl:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence>
            {boards.map((board) => (
              <Transition
                MotionProps={{ exit: { x: -6, opacity: 0 } }}
                key={board.boardId}
                className="relative top-0 left-0 right-0 bottom-0"
              >
                <Link to={`/boards/${board.boardId}`} className="group">
                  <Card className="shadow-none h-full">
                    <CardHeader>
                      <CardTitle className="group-hover:underline">{board.title}</CardTitle>
                      <CardDescription
                        className={cn(
                          "whitespace-pre-wrap",
                          !board.description && "text-muted-foreground/60 italic"
                        )}
                      >
                        {board.description ? board.description : "No description provided."}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </Transition>
            ))}
          </AnimatePresence>
        </div>
      </Transition>
    </ContentLayout>
  );
};
