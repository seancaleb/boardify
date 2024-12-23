import { Transition } from "@/components/animations";
import { DataLoader } from "@/components/elements";
import { ContentLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { TaskBoard } from "@/features/task";
import { useGetAllTasks } from "@/features/task/api/use-get-all-tasks";
import { useDocumentTitle } from "@mantine/hooks";
import { MoveLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useGetBoard } from "../api/use-get-board";

export const Board = () => {
  const { boardId } = useParams() as { boardId: string };
  const board = useGetBoard({ boardId });
  const tasks = useGetAllTasks({ boardId });
  const error = board.error || tasks.error;

  useDocumentTitle(`${board.isPending ? "Boards" : `${board.data?.title}`} - Boardify`);

  if (board.isPending || tasks.isPending) {
    return <DataLoader data="board" />;
  }

  if (error) {
    return <Navigate to="/boards" replace />;
  }

  const { title, description } = board.data;

  const headerSlot = (
    <div className="space-y-1">
      <Button asChild variant="link" className="p-0">
        <Link to="/boards">
          <MoveLeft className="icon-start-btn" />
          Back to boards
        </Link>
      </Button>
      <h3>{title}</h3>
      <div className="text-muted-foreground text-sm max-w-[75ch] whitespace-pre-wrap">
        {description}
      </div>
    </div>
  );

  return (
    <ContentLayout header={headerSlot}>
      <Transition className="relative top-0 left-0 right-0 bottom-0">
        {tasks.data ? <TaskBoard tasks={tasks.data} /> : null}
      </Transition>
    </ContentLayout>
  );
};
