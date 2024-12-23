import { useMemo } from "react";
import { Tasks } from "../schema";
import { TaskColumn } from "./task-column";

type TaskBoardProps = {
  tasks: Tasks;
};

export const TaskBoard = ({ tasks }: TaskBoardProps) => {
  const groupedTasks = useMemo(
    () => ({
      pending: tasks.filter((task) => task.status === "pending"),
      "in progress": tasks.filter((task) => task.status === "in progress"),
      completed: tasks.filter((task) => task.status === "completed"),
    }),
    [tasks]
  );

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 items-start">
      <TaskColumn tasks={groupedTasks.pending} status="pending" />
      <TaskColumn tasks={groupedTasks["in progress"]} status="in progress" />
      <TaskColumn tasks={groupedTasks.completed} status="completed" />
    </div>
  );
};
