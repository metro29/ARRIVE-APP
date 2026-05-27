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
      className={`group flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight ${className ?? ""}`}
    >
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[oklch(0.55_0.18_265)] to-[oklch(0.42_0.14_300)] text-primary-foreground shadow-[0_0_24px_oklch(0.5_0.2_265/0.5)] transition-transform duration-300 group-hover:scale-105">
        <Sparkles className="h-4 w-4" />
      </span>
      <span>Arrive</span>
    </Link>
  );
}
