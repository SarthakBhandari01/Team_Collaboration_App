export const DateDivider = ({ date }) => {
  return (
    <div className="flex items-center gap-3 my-4 px-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs font-medium text-muted-foreground bg-white px-3 py-1 rounded-full border">
        {date}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
};
