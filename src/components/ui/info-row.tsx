import { cn } from "@/lib/utils";

interface InfoRowProps {
  label: string;
  value: string;
  className?: string;
  isHighlight?: boolean;
}

export function InfoRow({ label, value, className, isHighlight }: InfoRowProps) {
  return (
    <div
      className={cn(
        "py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2 border-b border-[#1e1e2e]",
        className
      )}
    >
      <span className="text-[#8b8b9e] text-base">{label}</span>
      <span
        className={cn(
          "text-white text-base",
          isHighlight ? "font-bold text-amber-500" : "font-medium",
        )}
        style={isHighlight ? { fontFamily: "'Clash Display', sans-serif" } : {}}
      >
        {value}
      </span>
    </div>
  );
}
