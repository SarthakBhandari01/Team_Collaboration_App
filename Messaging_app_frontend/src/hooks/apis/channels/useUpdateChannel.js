import { useMutation } from "@tanstack/react-query";

import { updateChannel } from "@/api/channels";
import { useAuth } from "@/hooks/context/useAuth";

export const useUpdateChannel = () => {
  const { auth } = useAuth();

  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: updateChannelMutation,
  } = useMutation({
    mutationFn: ({ channelId, channelData }) =>
      updateChannel({ channelId, channelData, token: auth?.token }),
    onSuccess: (data) => {
      console.log("Successfully updated channel", data);
    },
    onError: (error) => {
      console.log("Failed to update channel", error);
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    updateChannelMutation,
  };
};
