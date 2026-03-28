import { useQuery } from "@tanstack/react-query";

import { getConversationMessages } from "@/api/conversations";
import { useAuth } from "@/hooks/context/useAuth";

export const useGetConversationMessages = (conversationId, page = 1) => {
  const { auth } = useAuth();
  const {
    isFetching,
    isError,
    error,
    data: messagesData,
  } = useQuery({
    queryFn: () =>
      getConversationMessages({
        conversationId,
        token: auth?.token,
        page,
        limit: 20,
      }),
    queryKey: [`get-conversation-messages-${conversationId}-${page}`],
    enabled: !!conversationId && !!auth?.token,
  });
  return {
    isFetching,
    isError,
    error,
    messages: messagesData?.messages || [],
    totalPages: messagesData?.totalPages || 0,
    currentPage: messagesData?.page || 1,
  };
};
