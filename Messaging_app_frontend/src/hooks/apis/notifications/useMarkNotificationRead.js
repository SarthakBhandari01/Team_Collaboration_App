import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markNotificationReadRequest } from "@/api/notifications";
import { useAuth } from "@/hooks/context/useAuth";

export const useMarkNotificationRead = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync: markReadMutation } = useMutation({
    mutationFn: (id) => markNotificationReadRequest({ id, token: auth?.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });

  return {
    markReadMutation,
    isPending,
  };
};
