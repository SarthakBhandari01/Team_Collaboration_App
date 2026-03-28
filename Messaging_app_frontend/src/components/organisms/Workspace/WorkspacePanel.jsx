import {
  AlertTriangleIcon,
  HashIcon,
  MessageSquareTextIcon,
  SendHorizonalIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { SideBarItem } from "@/components/atoms/SideBarItem/SideBarItem";
import { UserItem } from "@/components/atoms/UserItem/userItem";
import { SidebarSkeleton } from "@/components/molecules/Skeletons/Skeletons";
import { WorkspacePannelHeader } from "@/components/molecules/Workspace/WorkspacePanelHeader";
import { WorkspacePanelSection } from "@/components/molecules/Workspace/WorkspacePanelSection";
import { useCreateConversation } from "@/hooks/apis/conversations/useCreateConversation";
import { useGetConversations } from "@/hooks/apis/conversations/useGetConversations";
import { useGetWorkspaceById } from "@/hooks/apis/workspaces/useGetWorkspaceById";
import { useAuth } from "@/hooks/context/useAuth";
import { useCreateChannelModal } from "@/hooks/context/useCreateChannelModal";

export const WorkspacePanel = () => {
  const { workspaceId } = useParams();
  const { workspace, isFetching, isSuccess } = useGetWorkspaceById(workspaceId);
  const { conversations, refetch: refetchConversations } =
    useGetConversations(workspaceId);
  const { createConversationMutation } = useCreateConversation();
  const { setOpenCreateChannelModal } = useCreateChannelModal();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleCreateConversation = async (memberId) => {
    try {
      const conversation = await createConversationMutation({
        workspaceId,
        memberId,
      });
      refetchConversations();
      navigate(`/workspaces/${workspaceId}/conversations/${conversation._id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleDMClick = () => {
    // For now, just refetch conversations
    // TODO: Add a proper modal for selecting users
    refetchConversations();
  };

  if (isFetching) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-[49px] border-b border-white/10 flex items-center px-4">
          <div className="h-6 w-32 bg-white/10 animate-pulse rounded" />
        </div>
        <SidebarSkeleton />
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center text-white">
        <AlertTriangleIcon className="size-6 text-white" /> something went wrong
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto dark-scrollbar">
      <WorkspacePannelHeader workspace={workspace} />
      <div className="flex flex-col px-2 mt-3">
        <WorkspacePanelSection
          label={"Channels"}
          onIconClick={() => {
            setOpenCreateChannelModal(true);
          }}
        >
          {workspace?.channels.map((channel) => {
            return (
              <SideBarItem
                key={channel._id}
                label={channel.name}
                channelId={channel._id}
                icon={HashIcon}
              />
            );
          })}
        </WorkspacePanelSection>
        <WorkspacePanelSection
          label={"Direct messages"}
          onIconClick={handleDMClick}
        >
          {conversations?.map((conversation) => {
            // Find the other member (not the current user)
            const otherMember = conversation.members?.find(
              (member) => member._id !== auth?.user?._id,
            );
            return (
              <UserItem
                key={conversation._id}
                image={otherMember?.avatar}
                label={otherMember?.username}
                id={otherMember?._id}
                conversationId={conversation._id}
                onClick={() =>
                  navigate(
                    `/workspaces/${workspaceId}/conversations/${conversation._id}`,
                  )
                }
              />
            );
          })}
          {/* Show workspace members who don't have conversations yet */}
          {workspace?.members
            ?.filter((member) => {
              // Don't show current user
              if (member.memberId?._id === auth?.user?._id) return false;
              // Don't show if conversation already exists
              return !conversations?.some((conv) =>
                conv.members?.some((m) => m._id === member.memberId?._id),
              );
            })
            .map((member) => {
              return (
                <UserItem
                  key={member?.memberId?._id}
                  image={member?.memberId?.avatar}
                  label={member?.memberId?.username}
                  id={member?.memberId?._id}
                  onClick={() =>
                    handleCreateConversation(member?.memberId?._id)
                  }
                />
              );
            })}
        </WorkspacePanelSection>
      </div>
    </div>
  );
};
