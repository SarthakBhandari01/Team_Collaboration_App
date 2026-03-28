import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { useChannelMessages } from "@/hooks/context/useChannelMessages";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const { messageList, setMessageList } = useChannelMessages();

  useEffect(() => {
    // Create socket only once
    socketRef.current = io(import.meta.env.VITE_API_URL);

    // Listen for new messages
    socketRef.current.on("NewMessageReceived", (data) => {
      console.log("new message received ", data);
      setMessageList((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [setMessageList]);

  async function joinChannel(channelId) {
    socketRef.current.emit("JoinChannel", { channelId }, (data) => {
      console.log("Successfully joined channel", data);
      setCurrentChannel(data?.data);
    });
  }

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, joinChannel, currentChannel }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
