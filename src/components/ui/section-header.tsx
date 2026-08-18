import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-16", align === "center" && "text-center", className)}>
      <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
        {eyebrow}
      </p>
      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
