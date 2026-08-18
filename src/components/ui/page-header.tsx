import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  badge?: string;
  className?: string;
}

export function PageHeader({ title, description, badge, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-10", className)}>
      {badge && (
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest">
          {badge}
        </span>
      )}
      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
        {title}
      </h1>
      {description && (
        <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">{description}</p>
      )}
    </div>
  );
}
