import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  tone?: "default" | "attention";
}

export function SectionHeading({
  title,
  description,
  className,
  tone = "default",
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h2
        className={cn(
          "text-lg font-medium tracking-tight text-foreground",
          tone === "attention" && "text-amber-800 dark:text-amber-200"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
