import { axios } from "@/lib/axios";
import { userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { disableInteractions } from "@/utils/disable-interactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTasks } from "../api/use-get-all-tasks";
import { CreatedTaskResponse, TaskParams } from "../schema";

type MutationFnParams = TaskParams;

const createTask = async (task: TaskParams): Promise<CreatedTaskResponse> => {
  return await axios.post("/tasks", task);
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const auth = useAppStore.use.auth();

  return useMutation({
    mutationFn: (task: MutationFnParams) => createTask(task),
    onSettled: async (_, __, { boardId }) => {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: userKeys.tasks(auth.userId!, boardId),
          queryFn: () => getAllTasks(boardId),
        }),

        queryClient.prefetchQuery({
          queryKey: userKeys.tasks(auth.userId!),
          queryFn: () => getAllTasks(),
        }),
      ]);

      disableInteractions(false);
    },
  });
};
