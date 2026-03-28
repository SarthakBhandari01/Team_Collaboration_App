import { InfoIcon, LucideLoader2, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SearchModal } from "@/components/molecules/SearchModal/SearchModal";
import { Button } from "@/components/ui/button";
import { useGetWorkspaceById } from "@/hooks/apis/workspaces/useGetWorkspaceById";
import { useAuth } from "@/hooks/context/useAuth";
import { useCurrentWorkspace } from "@/hooks/context/useCurrentWorkspace";

export const WorkspaceNavbar = () => {
  const { workspaceId } = useParams();
  const { isFetching, workspace, isSuccess, error } =
    useGetWorkspaceById(workspaceId);
  const { setCurrentWorkspace } = useCurrentWorkspace();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isSuccess && !isFetching && error) {
      if (error.status === 403) {
        logout();
        navigate("/auth/signin");
      } else {
        navigate("/home");
      }
    }
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
  }, [
    workspace,
    setCurrentWorkspace,
    isSuccess,
    error,
    isFetching,
    navigate,
    logout,
  ]);

  if (isFetching) {
    return <LucideLoader2 className="animate-spin ml-2" />;
  }

  return (
    <>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <nav className="flex items-center  justify-center h-10 p-1.5 bg-slack-dark ">
        <div className="flex-1" />
        <div className="flex-1">
          <Button
            size="sm"
            className="bg-accent/25 hover:bg-accent/15 w-full h-7 px-2 justify-between"
            onClick={() => setSearchOpen(true)}
          >
            <div className="flex items-center">
              <SearchIcon className="size-4 text-white mr-2" />
              <span className="text-white/70 text-xs">
                Search {workspace?.name || "workspace"}
              </span>
            </div>
            <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded text-white/50">
              ⌘K
            </kbd>
          </Button>
        </div>
        <div className="ml-auto flex flex-1 items-center justify-end">
          <Button variant="transparent" size="icon">
            <InfoIcon className="size-5 text-white" />
          </Button>
        </div>
      </nav>
    </>
  );
};
