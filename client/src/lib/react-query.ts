/* eslint-disable @typescript-eslint/no-explicit-any */
import { disableInteractions } from "@/utils/disable-interactions";
import { DefaultOptions, QueryClient, UseQueryOptions } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
  mutations: {
    onMutate: () => {
      disableInteractions(true);
    },
    onSettled: () => {
      disableInteractions(false);
    },
  },
};

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<ReturnType<FnType>>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn"
>;

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export const userKeys = {
  all: ["user"] as const,
  profile: (userId: string) => [...userKeys.all, userId] as const,
  profileDetails: (userId: string) => [...userKeys.profile(userId), "details"] as const,
  boards: (userId: string) => [...userKeys.profile(userId), "boards"] as const,
  board: (userId: string, boardId: string) => [...userKeys.boards(userId), boardId] as const,
  tasks: (userId: string, boardId?: string) =>
    [...(boardId ? userKeys.board(userId, boardId) : userKeys.profile(userId)), "tasks"] as const,
};
