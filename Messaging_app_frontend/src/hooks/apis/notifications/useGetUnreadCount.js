import { useQuery } from "@tanstack/react-query";

import { getUnreadCountRequest } from "@/api/notifications";
import { useAuth } from "@/hooks/context/useAuth";

export const useGetUnreadCount = () => {
  const { auth } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: () => getUnreadCountRequest({ token: auth?.token }),
    enabled: !!auth?.token,
    staleTime: 15000, // 15 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    unreadCount: data?.count || 0,
    isLoading,
    isError,
    error,
    refetch,
  };
};
