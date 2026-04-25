import { useQueryClient } from "@tanstack/react-query";
import { TriangleAlertIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { ChatInput } from "@/components/molecules/ChatInput/ChatInput";
import { DateDivider } from "@/components/molecules/Messages/DateDivider";
import { DMEmptyState } from "@/components/molecules/Messages/EmptyStates";
import { Message } from "@/components/molecules/Messages/Message";
import { MessageListSkeleton } from "@/components/molecules/Skeletons/Skeletons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetConversationById } from "@/hooks/apis/conversations/useGetConversationById";
import { useGetConversationMessages } from "@/hooks/apis/conversations/useGetConversationMessages";
import { useDeleteDMMessage } from "@/hooks/apis/messages/useDeleteDMMessage";
import { useAuth } from "@/hooks/context/useAuth";
import { useConversationMessages } from "@/hooks/context/useConversationMessages";
import { useSocket } from "@/hooks/context/useSocket";
import {
  formatDateDivider,
  formatRelativeTime,
  getDateKey,
} from "@/utils/dateUtils";

export const DirectMessage = () => {
  const { conversationId } = useParams();
  const { auth } = useAuth();
  const { isFetching, isError, conversation } =
    useGetConversationById(conversationId);
  const { joinConversation } = useSocket();
  const { conversationMessageList, setConversationMessageList } =
    useConversationMessages();
  const { messages } = useGetConversationMessages(conversationId);
  const { deleteDMMessageMutation } = useDeleteDMMessage();
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
  }, [messages, setConversationMessageList]);

  if (isFetching) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-[49px] border-b flex items-center px-4 gap-2">
          <div className="size-8 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-24 bg-muted animate-pulse rounded" />
        </div>
        <MessageListSkeleton count={6} />
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

  // Group messages by date for dividers
  const groupedMessages = conversationMessageList?.reduce((groups, message) => {
    const dateKey = getDateKey(message.createdAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  async function handleDeleteMessage(messageId) {
    await deleteDMMessageMutation(messageId);
    setConversationMessageList((prev) =>
      prev.filter((msg) => msg._id !== messageId),
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with other member's name */}
      <div className="flex items-center px-4 h-[49px] border-b">
        <div className="flex items-center gap-2">
          <Avatar className="size-8 rounded-md">
            <AvatarImage
              src={otherMember?.avatar}
              alt={otherMember?.username}
              className="rounded-md"
            />
            <AvatarFallback className="rounded-md bg-blue-500 text-white font-medium">
              {otherMember?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-lg font-bold">{otherMember?.username}</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messageContainerListRef}
        className="flex-1 overflow-y-auto messages-scrollbar"
      >
        {conversationMessageList?.length === 0 ? (
          <DMEmptyState memberName={otherMember?.username} />
        ) : (
          Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
            <div key={dateKey}>
              <DateDivider date={formatDateDivider(dateKey)} />
              {messages.map((message) => (
                <Message
                  key={message._id}
                  messageId={message._id}
                  authorId={message.senderId?._id}
                  body={message.body}
                  fileUrl={message.fileUrl}
                  fileType={message.fileType}
                  fileName={message.fileName}
                  authorImage={message.senderId?.avatar}
                  authorName={message.senderId?.username}
                  createdAt={formatRelativeTime(message.createdAt)}
                  onDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ))
        )}
      </div>

      <ChatInput conversationId={conversationId} type="dm" />
    </div>
  );
};
