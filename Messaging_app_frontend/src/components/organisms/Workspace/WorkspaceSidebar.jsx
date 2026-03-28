import {
  BellIcon,
  HomeIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { UserButton } from "@/components/atoms/UserButton/UserButton";
import { SidebarButton } from "@/components/molecules/SidebarButton/SidebarButton";
import { useGetConversations } from "@/hooks/apis/conversations/useGetConversations";
import { useGetWorkspaceById } from "@/hooks/apis/workspaces/useGetWorkspaceById";

import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export const WorkspaceSidebar = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { workspace } = useGetWorkspaceById(workspaceId);
  const { conversations } = useGetConversations(workspaceId);

  function handleHome() {
    const generalChannel = workspace?.channels?.find(
      (c) => c.name === "general",
    );
    const targetChannel = generalChannel || workspace?.channels?.[0];
    if (targetChannel) {
      navigate(`/workspaces/${workspaceId}/channels/${targetChannel._id}`);
    } else {
      navigate(`/workspaces/${workspaceId}`);
    }
  }

  function handleMessage() {
    if (conversations?.length > 0) {
      navigate(
        `/workspaces/${workspaceId}/conversations/${conversations[0]._id}`,
      );
    }
  }

  return (
    <aside className=" w-[80px] bg-slack-dark h-full flex flex-col gap-y-4 items-center pt-[10px] pb-[6px]">
      <WorkspaceSwitcher />
      <SidebarButton Icon={HomeIcon} label={"Home"} onClick={handleHome} />
      <SidebarButton
        Icon={MessageSquareIcon}
        label={"DMs"}
        onClick={handleMessage}
      />
      <div className="flex flex-col items-center justify-center mt-auto mb-5 gap-y-1">
        <UserButton />
      </div>
    </aside>
  );
};
