import { useMutation } from "@tanstack/react-query";

import { deleteDMMessage } from "@/api/messages";
import { useAuth } from "@/hooks/context/useAuth";

export const useDeleteDMMessage = () => {
  const { auth } = useAuth();

  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: deleteDMMessageMutation,
  } = useMutation({
    mutationFn: (messageId) =>
      deleteDMMessage({ messageId, token: auth?.token }),
    onSuccess: (data) => {
      console.log("Successfully deleted DM message", data);
    },
    onError: (error) => {
      console.log("Failed to delete DM message", error);
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    deleteDMMessageMutation,
  };
};
