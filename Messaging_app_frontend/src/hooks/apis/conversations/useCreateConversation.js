import { useMutation } from "@tanstack/react-query";

import { createConversation } from "@/api/conversations";
import { useAuth } from "@/hooks/context/useAuth";

export const useCreateConversation = () => {
  const { auth } = useAuth();

  const {
    isPending,
    isSuccess,
    error,
    data,
    mutateAsync: createConversationMutation,
  } = useMutation({
    mutationFn: (data) => createConversation({ ...data, token: auth?.token }),
    onSuccess: (data) => {
      console.log("Successfully created/retrieved conversation", data);
    },
    onError: (error) => {
      console.log("Failed to create conversation", error);
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    data,
    createConversationMutation,
  };
};
