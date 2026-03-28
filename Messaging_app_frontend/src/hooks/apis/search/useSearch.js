import { useQuery } from "@tanstack/react-query";

import { searchWorkspace } from "@/api/search";
import { useAuth } from "@/hooks/context/useAuth";

export const useSearch = (workspaceId, query) => {
  const { auth } = useAuth();

  const {
    data: results,
    isFetching,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryFn: () =>
      searchWorkspace({ workspaceId, query: query.trim(), token: auth?.token }),
    queryKey: ["search", workspaceId, query],
    enabled:
      !!workspaceId && !!auth?.token && !!query && query.trim().length >= 2,
    staleTime: 30000,
  });

  return {
    results: results || { messages: [], dmMessages: [], channels: [] },
    isFetching,
    isError,
    error,
    isSuccess,
  };
};
