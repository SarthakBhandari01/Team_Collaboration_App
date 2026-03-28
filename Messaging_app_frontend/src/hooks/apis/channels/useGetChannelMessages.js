import { useQuery } from "@tanstack/react-query";

import { getPaginatedMessages } from "@/api/channels";
import { useAuth } from "@/hooks/context/useAuth";

export const useGetChannelMessages = (channelId) => {
  const { auth } = useAuth();
  const { isFetched, isError, data, error, isSuccess } = useQuery({
    queryFn: () =>
      getPaginatedMessages({
        channelId,
        token: auth?.token,
        page: 1,
        limit: 50,
      }),
    queryKey: [`getPaginatedMessages-${channelId}`],
    enabled: !!channelId && !!auth?.token,
  });
  return {
    isFetched,
    isError,
    messages: data,
    error,
    isSuccess,
  };
};
