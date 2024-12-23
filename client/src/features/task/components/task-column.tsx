import { cn } from "@/lib/utils";
import { DEFAULT_STATUSES, Tasks } from "../schema";
import { CreateTaskButton } from "./create-task-button";
import { TaskList } from "./task-list";

type TaskColumnProps = {
  tasks: Tasks;
  status: (typeof DEFAULT_STATUSES)[number];
};

export const TaskColumn = ({ tasks, status }: TaskColumnProps) => {
  let columnName;

  switch (status) {
    case "pending":
      columnName = "To Do";
      break;
    case "in progress":
      columnName = "In Progress";

      break;
    case "completed":
      columnName = "Completed";
      break;
    default:
      throw new Error("Column type isn't supported");
  }

  const statusColors = {
    400: {
      pending: "bg-orange-400",
      "in progress": "bg-blue-400",
      completed: "bg-green-400",
    },
    500: {
      pending: "bg-orange-500",
      "in progress": "bg-blue-500",
      completed: "bg-green-500",
    },
  };

  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium flex items-center gap-3">
        <div className="flex gap-2 items-center">
          <span className="relative flex h-3 w-3">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                statusColors[400][status]
              )}
            ></span>
            <span
              className={cn("relative inline-flex rounded-full h-3 w-3", statusColors[500][status])}
            ></span>
          </span>
          <div>{columnName}</div>
        </div>

        <div className="leading-none py-1 px-4 rounded-full border bg-white border-border">
          {tasks.length}
        </div>
      </div>

      {/* Create task button  */}
      <CreateTaskButton status={status} />

      {/* Task list  */}
      <TaskList tasks={tasks} />
    </div>
  );
};
