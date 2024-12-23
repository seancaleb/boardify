import { AlertDialog, Spinner } from "@/components/elements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import _ from "lodash";
import { Folder, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteTask } from "../api/use-delete-task";
import { UpdateTaskForm } from "../components/form/update-task-form";
import { Task } from "../schema";

type TaskItemProps = {
  task: Task;
};

export const TaskItem = ({ task }: TaskItemProps) => {
  const { taskId, title, description, priority } = task;

  return (
    <Card key={taskId} className="shadow-none h-full">
      <CardHeader>
        <div className="flex items-start gap-4 justify-between">
          <Badge variant={priority} className="w-fit mb-1.5">
            {_.capitalize(priority)}
          </Badge>

          {/* Dropdown options  */}
          <TaskItemDropdownOptions task={task} />
        </div>
        <CardTitle className="pb-1">{title}</CardTitle>
        <CardDescription
          className={cn("whitespace-pre-wrap", !description && "text-muted-foreground/60 italic")}
        >
          {description ? description : "No description provided."}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

type TaskItemDropdownOptionsProps = {
  task: Task;
};

const TaskItemDropdownOptions = ({ task }: TaskItemDropdownOptionsProps) => {
  const { boardId } = useParams() as { boardId: string };
  const { isMobile } = useSidebar();
  const deleteTaskMutation = useDeleteTask();
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const handleSetIsOpenAlert = (value: boolean) => setIsOpenAlert(value);
  const handleSetIsOpenEdit = (value: boolean) => setIsOpenEdit(value);

  const handleCloseAlert = () => {
    deleteTaskMutation.mutate(
      { boardId, taskId: task.taskId },
      {
        onSuccess: ({ message }) => {
          const { title, description } = toastMessageFormatter(message);
          toast.success(title, { description });
        },
        onError: ({ message }) => {
          const { title, description } = toastMessageFormatter(message);
          toast.error(title, {
            description,
          });
        },
        onSettled: () => {
          setIsOpenAlert(false);
        },
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger role="button">
          <div className="hover:bg-sidebar rounded-sm p-.5">
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">More</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full sm:w-48"
          side={isMobile ? "bottom" : "bottom"}
          align={isMobile ? "start" : "start"}
        >
          {/* Edit button  */}
          <DropdownMenuItem role="button" onClick={() => handleSetIsOpenEdit(true)}>
            <Folder className="text-muted-foreground" />
            <span>Edit task</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Delete button  */}
          <DropdownMenuItem role="button" onClick={() => handleSetIsOpenAlert(true)}>
            <Trash2 className="text-muted-foreground" />
            <span>Delete task</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateTaskForm
        task={task}
        isOpen={isOpenEdit}
        handleCloseForm={() => handleSetIsOpenEdit(false)}
      />

      <AlertDialog
        isOpen={isOpenAlert || deleteTaskMutation.isPending}
        setIsOpen={handleSetIsOpenAlert}
        title="Delete task?"
        message={<>Are you sure you want to delete this task? This action cannot be undone.</>}
        actionButtons={[
          <Button
            variant="ghost"
            onClick={() => handleSetIsOpenAlert(false)}
            disabled={deleteTaskMutation.isPending}
          >
            Cancel
          </Button>,
          <Button type="submit" onClick={handleCloseAlert} disabled={deleteTaskMutation.isPending}>
            {deleteTaskMutation.isPending ? <Spinner /> : null}
            Confirm deletion
          </Button>,
        ]}
      />
    </>
  );
};
