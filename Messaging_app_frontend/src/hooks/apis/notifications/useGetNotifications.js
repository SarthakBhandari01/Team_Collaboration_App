import { useQuery } from "@tanstack/react-query";

import { getNotificationsRequest } from "@/api/notifications";
import { useAuth } from "@/hooks/context/useAuth";

export const useGetNotifications = () => {
  const { auth } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotificationsRequest({ token: auth?.token }),
    enabled: !!auth?.token,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    notifications: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
