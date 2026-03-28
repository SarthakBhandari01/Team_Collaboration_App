import { Building2Icon, PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useFetchWorkspace } from "@/hooks/apis/workspaces/useFetchWorkspace";
import { useCreateWorkspaceModal } from "@/hooks/context/useCreateWorkspaceModal";

export const Home = () => {
  const { workspaces, isFetching } = useFetchWorkspace();
  const navigate = useNavigate();
  const { setOpenCreateWorkspaceModal } = useCreateWorkspaceModal();

  useEffect(() => {
    if (isFetching) return;

    if (workspaces && workspaces.length > 0) {
      navigate(`/workspaces/${workspaces[0]?._id}`);
    }
  }, [isFetching, workspaces, navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slack-dark gap-y-6">
      <div className="flex flex-col items-center gap-y-4">
        <div className="size-20 bg-white/10 rounded-3xl flex items-center justify-center shadow-lg">
          <Building2Icon className="size-12 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold tracking-tight">
            Team Collaboration
          </h1>
          <p className="text-white/50 text-sm mt-2">
            {isFetching
              ? "Loading your workspaces..."
              : "Create your first workspace to get started"}
          </p>
        </div>
      </div>

      {isFetching ? (
        <div className="flex gap-x-2">
          <span className="size-2.5 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="size-2.5 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="size-2.5 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      ) : (
        <Button
          onClick={() => setOpenCreateWorkspaceModal(true)}
          size="lg"
          className="bg-white text-slack-dark hover:bg-white/90 font-semibold"
        >
          <PlusIcon className="size-5 mr-2" />
          Create Workspace
        </Button>
      )}
    </div>
  );
};
