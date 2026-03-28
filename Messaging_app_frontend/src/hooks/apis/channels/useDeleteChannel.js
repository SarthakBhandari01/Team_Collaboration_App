import { useMutation } from "@tanstack/react-query";

import { deleteChannel } from "@/api/channels";
import { useAuth } from "@/hooks/context/useAuth";

export const useDeleteChannel = (channelId) => {
  const { auth } = useAuth();

  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: deleteChannelMutation,
  } = useMutation({
    mutationFn: () => deleteChannel({ channelId, token: auth?.token }),
    onSuccess: (data) => {
      console.log("Successfully deleted channel", data);
    },
    onError: (error) => {
      console.log("Failed to delete channel", error);
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    deleteChannelMutation,
  };
};
