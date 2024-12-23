import { axios } from "@/lib/axios";
import { userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { disableInteractions } from "@/utils/disable-interactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBoard } from "../api/use-get-board";
import { BoardParams, UpdatedBoardResponse } from "../schema";
import { getAllBoards } from "./use-get-all-boards";

type MutationFnParams = {
  boardId: string;
  board: BoardParams;
};

const updateBoard = async ({
  boardId,
  title,
  description,
}: { boardId: string } & BoardParams): Promise<UpdatedBoardResponse> => {
  return await axios.patch(`/boards/${boardId}`, { title, description });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  const auth = useAppStore.use.auth();

  return useMutation({
    mutationFn: ({ boardId, board }: MutationFnParams) => updateBoard({ boardId, ...board }),
    onSettled: async (_, __, { boardId }) => {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: userKeys.boards(auth.userId!),
          queryFn: getAllBoards,
        }),
        queryClient.prefetchQuery({
          queryKey: userKeys.board(auth.userId!, boardId),
          queryFn: () => getBoard(boardId),
        }),
      ]);

      disableInteractions(false);
    },
  });
};
