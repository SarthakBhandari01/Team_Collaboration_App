import { Editor } from "@/components/atoms/Editor/Editor";
import { useAuth } from "@/hooks/context/useAuth";
import { useCurrentWorkspace } from "@/hooks/context/useCurrentWorkspace";
import { useSocket } from "@/hooks/context/useSocket";

export const ChatInput = ({ type = "channel", conversationId }) => {
  const { socket, currentChannel, currentConversation } = useSocket();
  const { auth } = useAuth();
  const { currentWorkspace } = useCurrentWorkspace();

  async function handleSubmit({ body }) {
    if (type === "dm") {
      // Send DM message
      socket.emit(
        "NewDMMessage",
        {
          conversationId: conversationId || currentConversation,
          body,
          senderId: auth?.user?._id,
          workspaceId: currentWorkspace?._id,
        },
        (data) => {
          console.log("DM sent ", data);
        },
      );
    } else {
      // Send channel message
      socket.emit(
        "NewMessage",
        {
          channelId: currentChannel,
          body,
          senderId: auth?.user?._id,
          workspaceId: currentWorkspace?._id,
        },
        (data) => {
          console.log("Message sent ", data);
        },
      );
    }
  }

  return (
    <div className="px-5 w-full">
      <Editor onSubmit={handleSubmit} />
    </div>
  );
};
