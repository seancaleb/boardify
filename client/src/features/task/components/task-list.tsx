import { Transition } from "@/components/animations";
import { AnimatePresence } from "framer-motion";
import { Tasks } from "../schema";
import { TaskItem } from "./task-item";

type TaskListProps = {
  tasks: Tasks;
};

export const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <AnimatePresence>
      {tasks.map((task) => (
        <Transition
          MotionProps={{ exit: { x: -6, opacity: 0 } }}
          key={task.taskId}
          className="relative top-0 left-0 right-0 bottom-0"
        >
          <TaskItem key={task.taskId} task={task} />
        </Transition>
      ))}
    </AnimatePresence>
  );
};
