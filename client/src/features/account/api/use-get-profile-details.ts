import { axios } from "@/lib/axios";
import { QueryConfig, userKeys } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";
import { UserProfileDetailsResponse, userProfileDetailsSchema } from "../schema";

export const getProfileDetails = async (userId: string): Promise<UserProfileDetailsResponse> => {
  const data = await axios.get(`/users/profile/${userId}`);

  return userProfileDetailsSchema.parse(data);
};

type QueryFnType = typeof getProfileDetails;

type UseGetProfileDetailsOptions = {
  userId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useGetProfileDetails = ({ userId, config }: UseGetProfileDetailsOptions) => {
  return useQuery({
    ...config,
    queryFn: () => getProfileDetails(userId),
    queryKey: userKeys.profileDetails(userId),
  });
};
