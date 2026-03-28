import { MoreHorizontal, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { MessageRenderer } from "@/components/atoms/MessageRenderer/MessageRenderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/context/useAuth";

export const Message = ({
  messageId,
  authorId,
  authorImage,
  authorName,
  createdAt,
  body,
  onDelete,
}) => {
  const { auth } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnMessage = auth?.user?._id === authorId;

  async function handleDelete() {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
      setIsDeleting(false);
    }
  }

  return (
    <div className="group relative flex flex-col px-5 py-1.5 hover:bg-gray-100/60 transition-colors hover:z-20">
      {/* Message actions - appear on hover */}
      {isOwnMessage && (
        <div className="absolute right-5 top-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <div className="flex items-center gap-0.5 bg-white border rounded-md shadow-sm p-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <Trash2Icon className="size-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete message"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button className="shrink-0">
          <Avatar className="size-9 rounded-md">
            <AvatarImage className="rounded-md" src={authorImage} />
            <AvatarFallback className="rounded-md bg-sky-500 text-white text-sm font-medium">
              {authorName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <button className="font-semibold text-sm text-gray-900 hover:underline">
              {authorName}
            </button>
            <span className="text-xs text-muted-foreground">{createdAt}</span>
          </div>
          <div className="text-sm text-gray-800">
            <MessageRenderer value={body} />
          </div>
        </div>
      </div>
    </div>
  );
};
