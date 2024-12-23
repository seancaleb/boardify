import { axios } from "@/lib/axios";
import { userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { disableInteractions } from "@/utils/disable-interactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoardParams, CreatedBoardResponse } from "../schema";
import { getAllBoards } from "./use-get-all-boards";

type MutationFnParams = {
  board: BoardParams;
};

const createBoard = async (board: BoardParams): Promise<CreatedBoardResponse> => {
  return await axios.post("/boards", board);
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  const auth = useAppStore.use.auth();

  return useMutation({
    mutationFn: ({ board }: MutationFnParams) => createBoard(board),
    onSettled: async () => {
      await queryClient.prefetchQuery({
        queryKey: userKeys.boards(auth.userId!),
        queryFn: getAllBoards,
      });

      disableInteractions(false);
    },
  });
};
