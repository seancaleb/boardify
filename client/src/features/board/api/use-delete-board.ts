import { getAllTasks } from "@/features/task/api/use-get-all-tasks";
import { axios } from "@/lib/axios";
import { userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { disableInteractions } from "@/utils/disable-interactions";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeletedBoardResponse } from "../schema";

type MutationFnParams = {
  boardId: string;
};

const deleteBoard = async (boardId: string): Promise<DeletedBoardResponse> => {
  return await axios.delete(`/boards/${boardId}`);
};

export const useDeleteBoard = () => {
  const auth = useAppStore.use.auth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId }: MutationFnParams) => deleteBoard(boardId),
    onSettled: async (data, error) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: userKeys.boards(auth.userId!),
        }),
        queryClient.prefetchQuery({
          queryKey: userKeys.tasks(auth.userId!),
          queryFn: () => getAllTasks(),
        }),
      ]);

      disableInteractions(false);

      if (error) {
        const { title, description } = toastMessageFormatter(error.message);
        toast.success(title, { description });
      }

      if (data) {
        const { title, description } = toastMessageFormatter(data.message);
        toast.success(title, { description });
      }
    },
  });
};
