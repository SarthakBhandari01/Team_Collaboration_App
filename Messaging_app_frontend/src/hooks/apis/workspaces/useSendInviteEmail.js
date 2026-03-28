import { useMutation } from "@tanstack/react-query";

import { sendInviteEmailRequest } from "@/api/workspaces";
import { useAuth } from "@/hooks/context/useAuth";

export const useSendInviteEmail = (workspaceId) => {
  const { auth } = useAuth();

  const {
    isSuccess,
    isPending,
    error,
    mutateAsync: sendInviteEmailMutation,
  } = useMutation({
    mutationFn: (email) =>
      sendInviteEmailRequest({ workspaceId, email, token: auth?.token }),
    onSuccess: () => {
      console.log("Invite email sent successfully");
    },
    onError: (error) => {
      console.log("Error in sending invite email", error);
    },
  });

  return {
    sendInviteEmailMutation,
    isSuccess,
    isPending,
    error,
  };
};
