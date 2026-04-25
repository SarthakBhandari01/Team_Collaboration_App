import { FileIcon, ImageIcon, VideoIcon, X } from "lucide-react";
import { useRef, useState } from "react";

import { Editor } from "@/components/atoms/Editor/Editor";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/context/useAuth";
import { useCurrentWorkspace } from "@/hooks/context/useCurrentWorkspace";
import { useSocket } from "@/hooks/context/useSocket";
import { useUploadFile } from "@/hooks/apis/useUploadFile";
import { useToast } from "@/hooks/use-toast";

const getFileIcon = (fileType) => {
  if (fileType === "image") return ImageIcon;
  if (fileType === "video") return VideoIcon;
  return FileIcon;
};

export const ChatInput = ({ type = "channel", conversationId, channelId }) => {
  const { socket, currentChannel, currentConversation } = useSocket();
  const { auth } = useAuth();
  const { currentWorkspace } = useCurrentWorkspace();
  const { uploadFile, isUploading } = useUploadFile();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [attachment, setAttachment] = useState(null); // { url, fileType, fileName, preview }

  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const MAX_SIZE = 10 * 1024 * 1024;

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Allowed: images, videos, PDF, Word, text",
        variant: "destructive",
      });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum size is 10MB",
        variant: "destructive",
      });
      return;
    }
    try {
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
      const data = await uploadFile(file);
      setAttachment({
        url: data.url,
        fileType: data.fileType,
        fileName: data.fileName,
        preview,
      });
      toast({
        title: "✓ File attached",
        description: data.fileName,
      });
    } catch {
      toast({
        title: "Upload failed",
        description: "Could not upload file",
        variant: "destructive",
      });
    }
    e.target.value = "";
  }

  async function handleSubmit({ body }) {
    const payload = {
      body: body || "",
      senderId: auth?.user?._id,
      workspaceId: currentWorkspace?._id,
      ...(attachment
        ? {
            fileUrl: attachment.url,
            fileType: attachment.fileType,
            fileName: attachment.fileName,
          }
        : {}),
    };

    if (type === "dm") {
      socket.emit(
        "NewDMMessage",
        { conversationId: conversationId || currentConversation, ...payload },
        () => {},
      );
    } else {
      socket.emit(
        "NewMessage",
        { channelId: channelId || currentChannel, ...payload },
        () => {},
      );
    }
    setAttachment(null);
  }

  return (
    <div className="px-5 w-full">
      {/* Compact file attachment preview */}
      {attachment && (
        <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 text-sm max-w-xs">
          {attachment.preview ? (
            <img
              src={attachment.preview}
              alt={attachment.fileName}
              className="size-6 object-cover rounded"
            />
          ) : (
            (() => {
              const Icon = getFileIcon(attachment.fileType);
              return <Icon className="size-4 text-slate-500" />;
            })()
          )}
          <span className="truncate text-slate-700 text-xs font-medium max-w-[150px]">
            {attachment.fileName}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-5 shrink-0 hover:bg-slate-200 rounded-full p-0"
            onClick={() => setAttachment(null)}
          >
            <X className="size-3" />
          </Button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
      />

      {/* Editor with integrated attach button */}
      <Editor
        onSubmit={handleSubmit}
        hasAttachment={!!attachment}
        onAttachClick={() => fileInputRef.current?.click()}
        isUploading={isUploading}
      />
    </div>
  );
};
