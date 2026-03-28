import { useContext } from "react";

import SocketContext from "@/context/SocketContext";

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return {
      socket: null,
      joinChannel: () => {},
      currentChannel: null,
      joinConversation: () => {},
      currentConversation: null,
    };
  }
  return context;
};
