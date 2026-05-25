import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOKING_STATUS } from "@/lib/booking-status";
import type { BookingStatus } from "@/types";

interface BookingStatusTimelineProps {
  status: BookingStatus;
}

export function BookingStatusTimeline({ status }: BookingStatusTimelineProps) {
  const isRejected = status === BOOKING_STATUS.REJECTED;
  const isAccepted = status === BOOKING_STATUS.ACCEPTED;
  const isPending = status === BOOKING_STATUS.PENDING;

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
      <TimelineStep
        active
        done={!isPending}
        tone="pending"
        label="Request sent"
        sub="We've shared your details with the venue"
      />
      <Connector done={!isPending} />
      {isRejected ? (
        <TimelineStep
          active
          done
          tone="muted"
          label="Venue unavailable"
          sub="They couldn't host this date — try another place"
        />
      ) : (
        <TimelineStep
          active={isAccepted}
          done={isAccepted}
          tone="success"
          label="Confirmed"
          sub="Your event is on the calendar"
        />
      )}
    </ol>
  );
}

function Connector({ done }: { done: boolean }) {
  return (
    <div
      className={cn(
        "mx-6 hidden h-px flex-1 transition-colors duration-500 sm:block",
        done ? "bg-primary/40" : "bg-border"
      )}
      aria-hidden
    />
  );
}

function TimelineStep({
  active,
  done,
  tone,
  label,
  sub,
}: {
  active: boolean;
  done: boolean;
  tone: "pending" | "success" | "muted";
  label: string;
  sub: string;
}) {
  const icon =
    done && tone === "success" ? (
      <Check className="h-4 w-4" />
    ) : (
      <Circle className="h-3.5 w-3.5" />
    );

  return (
    <li className="flex gap-4 pb-8 sm:flex-1 sm:flex-col sm:items-center sm:pb-0 sm:text-center">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500",
          tone === "success" &&
            done &&
            "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20",
          tone === "pending" &&
            active &&
            "bg-amber-500/12 text-amber-800 ring-1 ring-amber-500/20",
          tone === "pending" &&
            done &&
            "bg-primary/10 text-primary ring-1 ring-primary/15",
          tone === "muted" && "bg-muted text-muted-foreground",
          !active && !done && tone !== "muted" && "bg-muted/60 text-muted-foreground"
        )}
      >
        {icon}
      </div>
      <div className="sm:mt-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {sub}
        </p>
      </div>
    </li>
  );
}
