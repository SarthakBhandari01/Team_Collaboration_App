import { useQueryClient } from "@tanstack/react-query";
import { TriangleAlertIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { ChannelHeader } from "@/components/molecules/Channels/ChannelHeader";
import { ChatInput } from "@/components/molecules/ChatInput/ChatInput";
import { DateDivider } from "@/components/molecules/Messages/DateDivider";
import { ChannelEmptyState } from "@/components/molecules/Messages/EmptyStates";
import { Message } from "@/components/molecules/Messages/Message";
import { MessageListSkeleton } from "@/components/molecules/Skeletons/Skeletons";
import { useGetChannelById } from "@/hooks/apis/channels/useGetChannelById";
import { useGetChannelMessages } from "@/hooks/apis/channels/useGetChannelMessages";
import { useDeleteMessage } from "@/hooks/apis/messages/useDeleteMessage";
import { useGetWorkspaceById } from "@/hooks/apis/workspaces/useGetWorkspaceById";
import { useAuth } from "@/hooks/context/useAuth";
import { useChannelMessages } from "@/hooks/context/useChannelMessages";
import { useSocket } from "@/hooks/context/useSocket";
import {
  formatDateDivider,
  formatRelativeTime,
  getDateKey,
} from "@/utils/dateUtils";

export const Channel = () => {
  const { channelId, workspaceId } = useParams();
  const { isFetching, isError, channelDetails } = useGetChannelById(channelId);
  const { workspace } = useGetWorkspaceById(workspaceId);
  const { auth } = useAuth();
  const { joinChannel } = useSocket();
  const { messageList, setMessageList } = useChannelMessages();
  const { isSuccess, messages } = useGetChannelMessages(channelId);
  const { deleteMessageMutation } = useDeleteMessage();
  const queryClient = useQueryClient();
  const messageContainerListRef = useRef(null);
  const hasJoinedRef = useRef(null);

  // Check if current user is an admin
  const isAdmin = workspace?.members?.some(
    (member) =>
      member.memberId?._id === auth?.user?._id && member.role === "admin",
  );

  useEffect(() => {
    if (messageContainerListRef.current) {
      messageContainerListRef.current.scrollTop =
        messageContainerListRef.current.scrollHeight;
    }
  }, [messageList]);

  useEffect(() => {
    queryClient.invalidateQueries("getPaginatedMessages");
    hasJoinedRef.current = null;
  }, [channelId, queryClient]);

  useEffect(() => {
    if (
      !isFetching &&
      !isError &&
      channelId &&
      hasJoinedRef.current !== channelId
    ) {
      joinChannel(channelId);
      hasJoinedRef.current = channelId;
    }
  }, [channelId, isFetching, isError, joinChannel]);

  useEffect(() => {
    if (isSuccess && messages) {
      setMessageList(messages);
    }
  }, [isSuccess, messages]);

  if (isFetching) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-[50px] border-b flex items-center px-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </div>
        <MessageListSkeleton count={6} />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="h-full flex flex-1 flex-col items-center justify-center gap-y-2">
        <TriangleAlertIcon className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  async function handleDeleteMessage(messageId) {
    await deleteMessageMutation(messageId);
    setMessageList((prev) => prev.filter((msg) => msg._id !== messageId));
  }

  // Group messages by date for dividers
  const groupedMessages = messageList?.reduce((groups, message) => {
    const dateKey = getDateKey(message.createdAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full bg-white">
      <ChannelHeader name={channelDetails?.name} channelId={channelId} isAdmin={isAdmin} />
      <div
        ref={messageContainerListRef}
        className="flex-1 overflow-y-auto messages-scrollbar"
      >
        {messageList?.length === 0 ? (
          <ChannelEmptyState channelName={channelDetails?.name} />
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
      <ChatInput />
    </div>
  );
};
