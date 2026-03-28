import { useContext } from "react";

import ConversationMessages from "@/context/ConversationMessages";

export const useConversationMessages = () => {
  return useContext(ConversationMessages);
};
