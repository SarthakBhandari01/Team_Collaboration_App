import { Button } from "@/components/ui/button";

export const SidebarButton = ({ Icon, label, onClick, isActive = false }) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer"
      onClick={onClick}
    >
      <Button
        variant="transparent"
        className={`size-9 p-2 ${
          isActive ? "bg-accent/30" : "hover:bg-accent/20"
        }`}
      >
        <Icon
          className={`size-5 transition-all ${
            isActive ? "text-white scale-110" : "text-white"
          }`}
        />
      </Button>
      <span
        className={`text-[10px] ${
          isActive ? "text-white font-semibold" : "text-white"
        }`}
      >
        {label}
      </span>
    </div>
  );
};
