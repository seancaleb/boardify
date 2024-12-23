import { getAllTasks } from "@/features/task/api/use-get-all-tasks";
import { axios } from "@/lib/axios";
import { userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { disableInteractions } from "@/utils/disable-interactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeletedTaskResponse } from "../schema";

type MutationFnParams = {
  taskId: string;
  boardId: string;
};

const deleteTask = async (taskId: string): Promise<DeletedTaskResponse> => {
  return await axios.delete(`/tasks/${taskId}`);
};

export const useDeleteTask = () => {
  const auth = useAppStore.use.auth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: MutationFnParams) => deleteTask(taskId),
    onSettled: async (_, __, { boardId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: userKeys.tasks(auth.userId!, boardId),
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
