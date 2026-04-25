import {
  DownloadIcon,
  FileIcon,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";
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

const FileAttachment = ({ fileUrl, fileType, fileName }) => {
  if (!fileUrl) return null;

  const handleDownload = async (e, url, name) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Failed to fetch");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name || "file";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: open in new tab if fetch/download fails
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (fileType === "image") {
    return (
      <div className="mt-2 relative group inline-block">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={fileUrl}
            alt={fileName || "Image"}
            className="max-w-xs max-h-60 rounded-lg border object-cover cursor-pointer hover:opacity-95 transition-opacity"
          />
        </a>
        <a
          href={fileUrl}
          onClick={(e) => handleDownload(e, fileUrl, fileName)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white rounded-md p-1.5"
          title="Download"
        >
          <DownloadIcon className="size-4" />
        </a>
      </div>
    );
  }

  if (fileType === "video") {
    return (
      <div className="mt-2">
        <video src={fileUrl} controls className="max-w-sm rounded-lg border" />
        <a
          href={fileUrl}
          onClick={(e) => handleDownload(e, fileUrl, fileName)}
          className="mt-1 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          <DownloadIcon className="size-3" />
          Download video
        </a>
      </div>
    );
  }

  // Document / other files
  return (
    <a
      href={fileUrl}
      onClick={(e) => handleDownload(e, fileUrl, fileName)}
      className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-sm transition-colors group"
    >
      <div className="size-8 rounded bg-slate-200 flex items-center justify-center">
        <FileIcon className="size-4 text-slate-600" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="truncate max-w-[180px] font-medium text-slate-700">
          {fileName || "File"}
        </span>
        <span className="text-xs text-slate-500">Click to download</span>
      </div>
      <DownloadIcon className="size-4 text-slate-400 group-hover:text-slate-600 ml-2" />
    </a>
  );
};

export const Message = ({
  messageId,
  authorId,
  authorImage,
  authorName,
  createdAt,
  body,
  fileUrl,
  fileType,
  fileName,
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
            {body && <MessageRenderer value={body} />}
            <FileAttachment
              fileUrl={fileUrl}
              fileType={fileType}
              fileName={fileName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
