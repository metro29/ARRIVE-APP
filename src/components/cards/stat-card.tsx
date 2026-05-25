import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-2xl bg-card px-5 py-4 ring-1 ring-foreground/[0.04]",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-medium tracking-tight tabular-nums text-foreground">
          {value}
        </p>
        {description && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>
    </div>
  );
}
