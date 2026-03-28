import { MoreHorizontal, SmileIcon } from "lucide-react";

import { MessageRenderer } from "@/components/atoms/MessageRenderer/MessageRenderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Message = ({ authorImage, authorName, createdAt, body }) => {
  return (
    <div className="group relative flex flex-col px-5 py-1.5 hover:bg-gray-100/60 transition-colors">
      {/* Message actions - appear on hover */}
      <div className="absolute right-5 -top-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-0.5 bg-white border rounded-md shadow-sm p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
          >
            <SmileIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>

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
