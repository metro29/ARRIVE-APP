import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-foreground ${className ?? ""}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_oklch(0.45_0.14_265/0.5)] transition-transform duration-300 group-hover:scale-105">
        <Sparkles className="h-4 w-4" />
      </span>
      <span>Arrive</span>
    </Link>
  );
}
