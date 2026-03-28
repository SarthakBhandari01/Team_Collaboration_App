import {
  AtSignIcon,
  BellIcon,
  CheckCheckIcon,
  HashIcon,
  MailIcon,
  UserPlusIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useGetNotifications } from "@/hooks/apis/notifications/useGetNotifications";
import { useMarkAllRead } from "@/hooks/apis/notifications/useMarkAllRead";
import { useMarkNotificationRead } from "@/hooks/apis/notifications/useMarkNotificationRead";

const getNotificationIcon = (type) => {
  switch (type) {
    case "workspace_invite":
      return <MailIcon className="size-5 text-blue-500" />;
    case "member_joined":
      return <UserPlusIcon className="size-5 text-green-500" />;
    case "message_mention":
      return <AtSignIcon className="size-5 text-purple-500" />;
    case "channel_created":
      return <HashIcon className="size-5 text-orange-500" />;
    default:
      return <BellIcon className="size-5 text-gray-500" />;
  }
};

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, isLoading, refetch } = useGetNotifications();
  const { markReadMutation } = useMarkNotificationRead();
  const { markAllReadMutation, isPending: isMarkingAll } = useMarkAllRead();

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markReadMutation(notification._id);
    }

    // Navigate based on notification type
    if (
      notification.type === "message_mention" &&
      notification.metadata?.channelId
    ) {
      navigate(
        `/workspaces/${notification.workspaceId._id || notification.workspaceId}/channels/${notification.metadata.channelId}`,
      );
    } else if (
      notification.type === "channel_created" &&
      notification.metadata?.channelName
    ) {
      navigate(
        `/workspaces/${notification.workspaceId._id || notification.workspaceId}`,
      );
    }
  };

  const handleMarkAllRead = async () => {
    await markAllReadMutation();
    refetch();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="h-[49px] border-b flex items-center justify-between px-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 p-3 animate-pulse">
              <div className="size-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-[49px] border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BellIcon className="size-5" />
          <span className="text-lg font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
          >
            <CheckCheckIcon className="size-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto messages-scrollbar">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <BellIcon className="size-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm">
              You&apos;ll see notifications here when someone mentions you or
              invites you to a workspace.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-gray-900">
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <span className="size-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                    {notification.workspaceId?.name && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {notification.workspaceId.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
