import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  default: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  const dot: Record<BadgeVariant, string> = {
    success: "bg-green-400",
    warning: "bg-yellow-400",
    error: "bg-red-400",
    info: "bg-blue-400",
    default: "bg-zinc-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
        variantStyles[variant],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dot[variant])} />
      {status}
    </span>
  );
}
