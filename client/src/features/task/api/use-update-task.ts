import { axios } from "@/lib/axios";
import { userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { disableInteractions } from "@/utils/disable-interactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskParams, UpdatedTaskResponse } from "../schema";
import { getAllTasks } from "./use-get-all-tasks";

type MutationFnParams = { taskId: string; boardId: string } & Omit<TaskParams, "boardId">;

const updateTask = async ({
  taskId,
  ...task
}: { taskId: string } & Omit<TaskParams, "boardId">): Promise<UpdatedTaskResponse> => {
  return axios.patch(`/tasks/${taskId}`, task);
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const auth = useAppStore.use.auth();

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: ({ taskId, boardId, ...task }: MutationFnParams) => updateTask({ taskId, ...task }),
    onSettled: async (_, __, { boardId }) => {
      await queryClient.prefetchQuery({
        queryKey: userKeys.tasks(auth.userId!, boardId),
        queryFn: () => getAllTasks(boardId),
      });
      disableInteractions(false);
    },
  });
};
