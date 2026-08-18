import { cn } from "@/lib/utils";

interface GlowContainerProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "amber" | "orange" | "yellow";
  size?: "sm" | "md" | "lg";
}

const glowColors = {
  amber: "bg-amber-500/10",
  orange: "bg-orange-500/10",
  yellow: "bg-yellow-500/10",
};

const glowSizes = {
  sm: "w-[300px] h-[200px]",
  md: "w-[600px] h-[400px]",
  lg: "w-[900px] h-[600px]",
};

export function GlowContainer({
  children,
  className,
  glowColor = "amber",
  size = "md",
}: GlowContainerProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none",
          glowColors[glowColor],
          glowSizes[size]
        )}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
