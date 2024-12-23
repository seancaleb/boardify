import { axios } from "@/lib/axios";
import { QueryConfig, userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { Tasks, tasksSchema } from "../schema";

export const getAllTasks = async (boardId?: string): Promise<Tasks> => {
  if (boardId) {
    const data = await axios.get(`/tasks?boardId=${boardId}`);
    return tasksSchema.parse(data);
  }

  const data = await axios.get("/tasks");
  return tasksSchema.parse(data);
};

type QueryFnType = typeof getAllTasks;

type UseGetAllTasksOptions = {
  config?: QueryConfig<QueryFnType>;
  boardId?: string;
};

export const useGetAllTasks = ({ config, boardId }: UseGetAllTasksOptions = {}) => {
  const auth = useAppStore.use.auth();

  return useQuery({
    ...config,
    queryFn: () => getAllTasks(boardId),
    enabled: !!auth.isAuthenticated || !!boardId,
    queryKey: boardId ? userKeys.tasks(auth.userId!, boardId) : userKeys.tasks(auth.userId!),
  });
};
