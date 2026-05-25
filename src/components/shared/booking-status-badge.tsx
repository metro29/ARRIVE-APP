import { cn } from "@/lib/utils";
import { BOOKING_STATUS_UX } from "@/lib/booking-status";
import type { BookingStatus } from "@/types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending:
    "bg-amber-500/10 text-amber-900 ring-amber-500/15 dark:text-amber-100",
  accepted:
    "bg-emerald-500/10 text-emerald-900 ring-emerald-500/15 dark:text-emerald-100",
  rejected:
    "bg-muted text-muted-foreground ring-foreground/5",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const meta = BOOKING_STATUS_UX[status];

  return (
    <span
      className={cn(
        "inline-flex flex-col items-end gap-0.5 rounded-full px-3 py-1.5 text-xs ring-1 transition-colors duration-300",
        STATUS_STYLES[status]
      )}
    >
      <span className="font-medium leading-none">{meta.label}</span>
      <span className="text-[0.625rem] leading-snug opacity-80">
        {meta.description}
      </span>
    </span>
  );
}
