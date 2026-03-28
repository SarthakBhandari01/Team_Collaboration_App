import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, TriangleAlertIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { ChatInput } from "@/components/molecules/ChatInput/ChatInput";
import { Message } from "@/components/molecules/Messages/Message";
import { useGetConversationById } from "@/hooks/apis/conversations/useGetConversationById";
import { useGetConversationMessages } from "@/hooks/apis/conversations/useGetConversationMessages";
import { useAuth } from "@/hooks/context/useAuth";
import { useConversationMessages } from "@/hooks/context/useConversationMessages";
import { useSocket } from "@/hooks/context/useSocket";

export const DirectMessage = () => {
  const { conversationId } = useParams();
  const { auth } = useAuth();
  const { isFetching, isError, conversation } =
    useGetConversationById(conversationId);
  const { joinConversation } = useSocket();
  const { conversationMessageList, setConversationMessageList } =
    useConversationMessages();
  const { messages } = useGetConversationMessages(conversationId);
  const queryClient = useQueryClient();
  const messageContainerListRef = useRef(null);
  const hasJoinedRef = useRef(null);

  // Get the other member's details
  const otherMember = conversation?.members?.find(
    (member) => member._id !== auth?.user?._id,
  );

  useEffect(() => {
    if (messageContainerListRef.current) {
      messageContainerListRef.current.scrollTop =
        messageContainerListRef.current.scrollHeight;
    }
  }, [conversationMessageList]);

  useEffect(() => {
    queryClient.invalidateQueries("get-conversation-messages");
    hasJoinedRef.current = null;
  }, [conversationId, queryClient]);

  useEffect(() => {
    if (
      !isFetching &&
      !isError &&
      conversationId &&
      hasJoinedRef.current !== conversationId
    ) {
      joinConversation(conversationId);
      hasJoinedRef.current = conversationId;
    }
  }, [conversationId, isFetching, isError, joinConversation]);

  useEffect(() => {
    if (messages) {
      setConversationMessageList(messages);
    }
  }, [messages]);

  if (isFetching) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-1 flex-col items-center justify-center gap-y-2">
        <TriangleAlertIcon className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with other member's name */}
      <div className="flex items-center px-4 h-[49px] border-b">
        <div className="flex items-center gap-2">
          <img
            src={otherMember?.avatar}
            alt={otherMember?.username}
            className="size-8 rounded-md"
          />
          <span className="text-lg font-bold">{otherMember?.username}</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messageContainerListRef}
        className="flex-5 overflow-y-auto p-5 gap-y-2"
      >
        {conversationMessageList?.map((message) => {
          const formatedDate = new Date(message.createdAt).toLocaleString(
            "en-IN",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            },
          );
          return (
            <Message
              key={message._id}
              body={message.body}
              authorImage={message.senderId?.avatar}
              authorName={message.senderId?.username}
              createdAt={formatedDate}
            />
          );
        })}
      </div>

      <div className="flex-1" />
      <ChatInput conversationId={conversationId} type="dm" />
    </div>
  );
};
