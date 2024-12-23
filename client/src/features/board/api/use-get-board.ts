import { axios } from "@/lib/axios";
import { QueryConfig, userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { Board, boardSchema } from "../schema";

export const getBoard = async (boardId: string): Promise<Board> => {
  const data = await axios.get(`/boards/${boardId}`);
  return boardSchema.parse(data);
};

type QueryFnType = typeof getBoard;

type UseGetBoardOptions = {
  boardId?: string;
  config?: QueryConfig<QueryFnType>;
};

export const useGetBoard = ({ config, boardId }: UseGetBoardOptions = {}) => {
  const auth = useAppStore.use.auth();

  return useQuery({
    ...config,
    queryFn: () => getBoard(boardId!),
    enabled: !!auth.isAuthenticated && !!boardId,
    queryKey: userKeys.board(auth.userId!, boardId!),
  });
};
