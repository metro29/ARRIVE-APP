import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/25 px-8 py-20 text-center ring-1 ring-foreground/[0.04]">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-foreground/[0.05]">
        <Icon className="h-6 w-6 text-muted-foreground/80" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref && (
        <ButtonLink href={actionHref} className="mt-8" size="lg">
          {actionLabel}
        </ButtonLink>
      )}
    </div>
  );
}
