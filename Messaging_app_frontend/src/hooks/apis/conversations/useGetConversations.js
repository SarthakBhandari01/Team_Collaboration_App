import { useQuery } from "@tanstack/react-query";

import { getConversations } from "@/api/conversations";
import { useAuth } from "@/hooks/context/useAuth";

export const useGetConversations = (workspaceId) => {
  const { auth } = useAuth();
  const {
    isFetching,
    isError,
    error,
    data: conversations,
    refetch,
  } = useQuery({
    queryFn: () => getConversations({ workspaceId, token: auth?.token }),
    queryKey: [`get-conversations-${workspaceId}`],
    enabled: !!workspaceId && !!auth?.token,
  });
  return {
    isFetching,
    isError,
    error,
    conversations: conversations || [],
    refetch,
  };
};
