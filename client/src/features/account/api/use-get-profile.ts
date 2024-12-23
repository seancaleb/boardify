import { axios } from "@/lib/axios";
import { QueryConfig, userKeys } from "@/lib/react-query";
import { useAppStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { User, userSchema } from "../schema";

export const getProfile = async (): Promise<User> => {
  const data = await axios.get("/users/profile");
  return userSchema.parse(data);
};

type QueryFnType = typeof getProfile;

type UseGetProfileOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useGetProfile = ({ config }: UseGetProfileOptions = {}) => {
  const auth = useAppStore.use.auth();

  return useQuery({
    ...config,
    queryFn: getProfile,
    enabled: !!auth.isAuthenticated,
    queryKey: userKeys.profile(auth.userId!),
  });
};
