import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useFetchWorkspace } from "@/hooks/apis/workspaces/useFetchWorkspace";
import { useCreateWorkspaceModal } from "@/hooks/context/useCreateWorkspaceModal";

export const Home = () => {
  const { workspaces, isFetching } = useFetchWorkspace();
  const navigate = useNavigate();
  const { setOpenCreateWorkspaceModal } = useCreateWorkspaceModal();

  useEffect(() => {
    if (isFetching) return;

    if (!workspaces || workspaces.length === 0) {
      setOpenCreateWorkspaceModal(true);
    } else {
      navigate(`/workspaces/${workspaces[0]?._id}`);
    }
  }, [isFetching, workspaces, navigate, setOpenCreateWorkspaceModal]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slack-dark gap-y-6">
      <div className="flex flex-col items-center gap-y-4">
        <div className="size-20 bg-white/10 rounded-3xl flex items-center justify-center shadow-lg">
          <svg
            className="size-12 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold tracking-tight">
            Team Collaboration
          </h1>
          <p className="text-white/50 text-sm mt-2">
            {isFetching
              ? "Loading your workspaces..."
              : workspaces?.length === 0
                ? "Create your first workspace to get started"
                : "Redirecting to your workspace..."}
          </p>
        </div>
      </div>
      <div className="flex gap-x-2">
        <span className="size-2.5 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="size-2.5 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="size-2.5 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
};
