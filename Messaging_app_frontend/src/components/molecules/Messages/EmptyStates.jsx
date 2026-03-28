import { HashIcon, MessageSquareIcon } from "lucide-react";

export const ChannelEmptyState = ({ channelName }) => {
  return (
    <div className="flex flex-col items-start px-5 py-8">
      <div className="flex items-center justify-center size-16 rounded-2xl bg-slack-medium/10 mb-4">
        <HashIcon className="size-8 text-slack-medium" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to #{channelName}
      </h2>
      <p className="text-muted-foreground text-sm max-w-md">
        This is the very beginning of the{" "}
        <span className="font-semibold">#{channelName}</span> channel. Send a
        message to start the conversation.
      </p>
    </div>
  );
};

export const DMEmptyState = ({ memberName }) => {
  return (
    <div className="flex flex-col items-start px-5 py-8">
      <div className="flex items-center justify-center size-16 rounded-2xl bg-blue-100 mb-4">
        <MessageSquareIcon className="size-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Start a conversation with {memberName}
      </h2>
      <p className="text-muted-foreground text-sm max-w-md">
        This is the beginning of your direct message history with{" "}
        <span className="font-semibold">{memberName}</span>. Send a message to
        say hello!
      </p>
    </div>
  );
};
