import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllReadRequest } from "@/api/notifications";
import { useAuth } from "@/hooks/context/useAuth";

export const useMarkAllRead = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync: markAllReadMutation } = useMutation({
    mutationFn: () => markAllReadRequest({ token: auth?.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });

  return {
    markAllReadMutation,
    isPending,
  };
};
