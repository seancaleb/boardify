import { axios } from "@/lib/axios";
import { QueryConfig, userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { Boards, boardsSchema } from "../schema";

export const getAllBoards = async (): Promise<Boards> => {
  const data = await axios.get("/boards");
  return boardsSchema.parse(data);
};

type QueryFnType = typeof getAllBoards;

type UseGetAllBoardsOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useGetAllBoards = ({ config }: UseGetAllBoardsOptions = {}) => {
  const auth = useAppStore.use.auth();

  return useQuery({
    ...config,
    queryFn: getAllBoards,
    enabled: !!auth.isAuthenticated,
    queryKey: userKeys.boards(auth.userId!),
  });
};
