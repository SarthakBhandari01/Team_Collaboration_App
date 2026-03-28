import { useMutation } from "@tanstack/react-query";

import { deleteMessage } from "@/api/messages";
import { useAuth } from "@/hooks/context/useAuth";

export const useDeleteMessage = () => {
  const { auth } = useAuth();

  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: deleteMessageMutation,
  } = useMutation({
    mutationFn: (messageId) => deleteMessage({ messageId, token: auth?.token }),
    onSuccess: (data) => {
      console.log("Successfully deleted message", data);
    },
    onError: (error) => {
      console.log("Failed to delete message", error);
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    deleteMessageMutation,
  };
};
