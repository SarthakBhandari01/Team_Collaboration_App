import { useQuery } from "@tanstack/react-query";

import { getConversationById } from "@/api/conversations";
import { useAuth } from "@/hooks/context/useAuth";

export const useGetConversationById = (conversationId) => {
  const { auth } = useAuth();
  const {
    isFetching,
    isError,
    error,
    data: conversation,
  } = useQuery({
    queryFn: () => getConversationById({ conversationId, token: auth?.token }),
    queryKey: [`get-conversation-${conversationId}`],
    enabled: !!conversationId && !!auth?.token,
  });
  return {
    isFetching,
    isError,
    error,
    conversation,
  };
};
