import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { useChannelMessages } from "@/hooks/context/useChannelMessages";
import { useConversationMessages } from "@/hooks/context/useConversationMessages";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const { messageList, setMessageList } = useChannelMessages();
  const { conversationMessageList, setConversationMessageList } =
    useConversationMessages();

  useEffect(() => {
    // Create socket only once
    socketRef.current = io(import.meta.env.VITE_API_URL);

    // Listen for new channel messages
    socketRef.current.on("NewMessageReceived", (data) => {
      console.log("new message received ", data);
      setMessageList((prev) => [...prev, data]);
    });

    // Listen for new DM messages
    socketRef.current.on("NewDMMessageReceived", (data) => {
      console.log("new DM message received ", data);
      setConversationMessageList((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [setMessageList, setConversationMessageList]);

  async function joinChannel(channelId) {
    socketRef.current.emit("JoinChannel", { channelId }, (data) => {
      console.log("Successfully joined channel", data);
      setCurrentChannel(data?.data);
    });
  }

  async function joinConversation(conversationId) {
    socketRef.current.emit("JoinConversation", { conversationId }, (data) => {
      console.log("Successfully joined conversation", data);
      setCurrentConversation(data?.data);
    });
  }

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        joinChannel,
        currentChannel,
        joinConversation,
        currentConversation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
