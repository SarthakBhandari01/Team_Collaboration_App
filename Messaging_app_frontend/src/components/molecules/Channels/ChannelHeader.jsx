import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteChannel } from "@/hooks/apis/channels/useDeleteChannel";
import { useUpdateChannel } from "@/hooks/apis/channels/useUpdateChannel";
import { useConfirm } from "@/hooks/context/useConfirm";
import { useToast } from "@/hooks/use-toast";

export const ChannelHeader = ({ name, channelId }) => {
  const [renameValue, setRenameValue] = useState(name);
  const [editOpen, setEditOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { updateChannelMutation, isPending: isUpdating } = useUpdateChannel();
  const { deleteChannelMutation, isPending: isDeleting } =
    useDeleteChannel(channelId);

  const { confirmation, ConfirmDialog } = useConfirm({
    title: "Delete Channel",
    message:
      "Are you sure you want to delete this channel? This action cannot be undone.",
  });

  const { confirmation: updateConfirmation, ConfirmDialog: UpdateDialog } =
    useConfirm({
      title: "Rename Channel",
      message: "Are you sure you want to rename this channel?",
    });

  async function handleDelete() {
    try {
      const ok = await confirmation();
      if (!ok) {
        return;
      }
      await deleteChannelMutation();
      setInfoOpen(false);
      queryClient.invalidateQueries([`get-workspace-${workspaceId}`]);
      navigate(`/workspaces/${workspaceId}`);
      toast({
        title: "Channel deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.log("Error in deleting channel", error);
      toast({
        title: "Failed to delete channel",
        description: error?.response?.data?.message || "An error occurred",
        type: "error",
      });
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (renameValue === name) {
      setEditOpen(false);
      return;
    }

    try {
      const ok = await updateConfirmation();
      if (!ok) {
        return;
      }
      await updateChannelMutation({
        channelId,
        channelData: { name: renameValue },
      });
      setEditOpen(false);
      setInfoOpen(false);
      queryClient.invalidateQueries([`get-workspace-${workspaceId}`]);
      queryClient.invalidateQueries([`get-channel-${channelId}`]);
      toast({
        title: "Channel renamed successfully",
        type: "success",
      });
    } catch (error) {
      console.log("Error in renaming channel", error);
      toast({
        title: "Failed to rename channel",
        description: error?.response?.data?.message || "An error occurred",
        type: "error",
      });
    }
  }

  return (
    <>
      <ConfirmDialog />
      <UpdateDialog />
      <div className="bg-white border-b h-[50px] flex items-center px-4 overflow-hidden">
        <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-lg font-semibold px-2 w-auto overflow-hidden text-ellipsis whitespace-nowrap"
            >
              <span># {name}</span>
              <FaChevronDown className="size-5 text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle># {name}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-5 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">
                    <div className="flex justify-between item center">
                      <div className="flex flex-col items-start gap-y-1">
                        <p className="font-semibold text-sm">Channel Name</p>
                        <p className="text-sm"># {name}</p>
                      </div>
                      <p className="font-semibold text-sm hover:underline">
                        Edit
                      </p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename Channel</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleFormSubmit}>
                    <input
                      type="text"
                      required
                      autoFocus
                      minLength={3}
                      maxLength={50}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      placeholder="Channel Name e.g Design Team"
                      className="w-full px-3 py-2 border rounded-md"
                      disabled={isUpdating}
                    />
                    <DialogFooter className="">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="font-semibold"
                          disabled={isUpdating}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-100 text-rose-600"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">
                  {isDeleting ? "Deleting..." : "Delete Channel"}
                </p>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
