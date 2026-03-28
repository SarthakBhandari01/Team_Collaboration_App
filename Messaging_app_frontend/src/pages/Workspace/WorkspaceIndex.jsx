import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetWorkspaceById } from "@/hooks/apis/workspaces/useGetWorkspaceById";

export const WorkspaceIndex = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { workspace, isFetching } = useGetWorkspaceById(workspaceId);

  useEffect(() => {
    if (isFetching || !workspace) return;

    const generalChannel = workspace?.channels?.find(
      (c) => c.name === "general",
    );
    const targetChannel = generalChannel || workspace?.channels?.[0];

    if (targetChannel) {
      navigate(`/workspaces/${workspaceId}/channels/${targetChannel._id}`, {
        replace: true,
      });
    }
  }, [isFetching, workspace, workspaceId, navigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-y-4 bg-white">
      <div className="flex gap-x-2">
        <span className="size-2.5 bg-slack-dark/40 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="size-2.5 bg-slack-dark/40 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="size-2.5 bg-slack-dark/40 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <p className="text-sm text-muted-foreground">Loading workspace...</p>
    </div>
  );
};
