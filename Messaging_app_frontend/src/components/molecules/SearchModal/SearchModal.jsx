import {
  HashIcon,
  MessageSquareIcon,
  SearchIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSearch } from "@/hooks/apis/search/useSearch";

export const SearchModal = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const { results, isFetching } = useSearch(workspaceId, debouncedQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset query when modal closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [open]);

  function handleChannelClick(channelId) {
    navigate(`/workspaces/${workspaceId}/channels/${channelId}`);
    onOpenChange(false);
  }

  function handleMessageClick(channelId) {
    navigate(`/workspaces/${workspaceId}/channels/${channelId}`);
    onOpenChange(false);
  }

  function handleDMClick(conversationId) {
    navigate(`/workspaces/${workspaceId}/conversations/${conversationId}`);
    onOpenChange(false);
  }

  const hasResults =
    results.channels.length > 0 ||
    results.messages.length > 0 ||
    results.dmMessages.length > 0;

  const showEmptyState =
    debouncedQuery.length >= 2 && !isFetching && !hasResults;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-4 pb-0 pt-6">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="flex items-center gap-x-2 px-3 py-2 border rounded-md bg-white">
            <SearchIcon className="size-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages, channels, and more..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              autoFocus
            />
            {isFetching && (
              <div className="size-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto p-4">
          {/* Initial state */}
          {debouncedQuery.length < 2 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <SearchIcon className="size-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Type at least 2 characters to search
              </p>
            </div>
          )}

          {/* Empty state */}
          {showEmptyState && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <SearchIcon className="size-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium">
                No results for &quot;{debouncedQuery}&quot;
              </p>
              <p className="text-sm text-muted-foreground">
                Try searching for something else
              </p>
            </div>
          )}

          {/* Results */}
          {hasResults && (
            <div className="space-y-4">
              {/* Channels */}
              {results.channels.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Channels
                  </h3>
                  <div className="space-y-1">
                    {results.channels.map((channel) => (
                      <button
                        key={channel._id}
                        onClick={() => handleChannelClick(channel._id)}
                        className="w-full flex items-center gap-x-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors text-left"
                      >
                        <HashIcon className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {channel.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Channel Messages */}
              {results.messages.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Messages
                  </h3>
                  <div className="space-y-1">
                    {results.messages.map((message) => (
                      <button
                        key={message._id}
                        onClick={() =>
                          handleMessageClick(message.channelId?._id)
                        }
                        className="w-full flex items-start gap-x-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors text-left"
                      >
                        <MessageSquareIcon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-x-2">
                            <span className="text-sm font-medium truncate">
                              {message.senderId?.username || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              in #{message.channelId?.name || "unknown"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {parseMessageBody(message.body)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DM Messages */}
              {results.dmMessages.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Direct Messages
                  </h3>
                  <div className="space-y-1">
                    {results.dmMessages.map((message) => {
                      const otherMember = message.conversationId?.members?.find(
                        (m) => m._id !== message.senderId?._id,
                      );
                      return (
                        <button
                          key={message._id}
                          onClick={() =>
                            handleDMClick(message.conversationId?._id)
                          }
                          className="w-full flex items-start gap-x-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors text-left"
                        >
                          <UserIcon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-x-2">
                              <span className="text-sm font-medium truncate">
                                {message.senderId?.username || "Unknown"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                to {otherMember?.username || "someone"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {parseMessageBody(message.body)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Close button centered at bottom */}
        <div className="px-4 py-3 border-t bg-muted/30 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="gap-x-2"
          >
            <XIcon className="size-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper to extract text from message body (handles Quill Delta JSON or plain text)
function parseMessageBody(body) {
  if (!body) return "";

  // Try to parse as Quill Delta JSON
  try {
    const parsed = typeof body === "string" ? JSON.parse(body) : body;
    if (parsed?.ops && Array.isArray(parsed.ops)) {
      // Extract text from Quill Delta ops
      return parsed.ops
        .map((op) => (typeof op.insert === "string" ? op.insert : ""))
        .join("")
        .trim();
    }
  } catch {
    // Not JSON, might be plain text or HTML
  }

  // Try to strip HTML tags if it looks like HTML
  if (body.includes("<") && body.includes(">")) {
    const doc = new DOMParser().parseFromString(body, "text/html");
    return doc.body.textContent || "";
  }

  return body;
}
