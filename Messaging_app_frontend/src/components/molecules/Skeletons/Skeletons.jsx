import { Skeleton } from "@/components/ui/skeleton";

export const MessageSkeleton = () => {
  return (
    <div className="flex gap-3 px-5 py-2">
      <Skeleton className="size-10 rounded-md shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};

export const MessageListSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <MessageSkeleton key={i} />
      ))}
    </div>
  );
};

export const ChannelItemSkeleton = () => {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <div className="size-4 rounded bg-white/10 animate-pulse" />
      <div className="h-4 flex-1 rounded bg-white/10 animate-pulse" />
    </div>
  );
};

export const UserItemSkeleton = () => {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <div className="size-6 rounded-md bg-white/10 animate-pulse" />
      <div className="h-4 flex-1 rounded bg-white/10 animate-pulse" />
    </div>
  );
};

export const SidebarSkeleton = () => {
  return (
    <div className="space-y-4 p-2 mt-3">
      <div className="space-y-1">
        <div className="h-5 w-20 mb-2 rounded bg-white/10 animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <ChannelItemSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-1">
        <div className="h-5 w-28 mb-2 rounded bg-white/10 animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <UserItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
