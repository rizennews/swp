import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="text-3xl md:text-4xl font-black text-amber-400">{value}</div>
      <div className="text-xs text-zinc-500 mt-1 leading-tight">{label}</div>
    </div>
  );
}

interface StatRowProps {
  stats: StatCardProps[];
  className?: string;
}

export function StatRow({ stats, className }: StatRowProps) {
  return (
    <div
      className={cn(
        "grid gap-8 border-t border-zinc-800 pt-10",
        `grid-cols-${stats.length}`,
        className
      )}
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
