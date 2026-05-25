"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Check, MessageSquare, Users } from "lucide-react";
import { respondToBooking } from "@/app/actions/bookings";
import { BOOKING_STATUS, isFinalBookingStatus } from "@/lib/booking-status";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

interface RestaurantInboxCardProps {
  booking: BookingWithRelations;
  showActions?: boolean;
  needsAttention?: boolean;
}

export function RestaurantInboxCard({
  booking,
  showActions = true,
  needsAttention = false,
}: RestaurantInboxCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const guestName = booking.guest?.name ?? "Guest";
  const canRespond =
    showActions && booking.status === BOOKING_STATUS.PENDING;

  function handleRespond(
    status: typeof BOOKING_STATUS.ACCEPTED | typeof BOOKING_STATUS.REJECTED
  ) {
    setError(null);
    startTransition(async () => {
      const result = await respondToBooking(booking.id, status);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Card
      className={cn(
        "hover-lift border-0 transition-all duration-300",
        needsAttention && "ring-1 ring-amber-500/20"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{guestName}</CardTitle>
          <p className="text-sm capitalize text-muted-foreground">
            {booking.event_type.replace(/_/g, " ")}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 opacity-70" />
            {new Date(booking.event_date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 opacity-70" />
            {booking.guest_count} guests
          </span>
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-2">
        {canRespond ? (
          <>
            <Button
              size="sm"
              disabled={pending}
              onClick={() => handleRespond(BOOKING_STATUS.ACCEPTED)}
              className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-600/90"
            >
              <Check className="mr-1.5 h-4 w-4" />
              {pending ? "Updating…" : "Confirm"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => handleRespond(BOOKING_STATUS.REJECTED)}
            >
              {pending ? "Updating…" : "Decline politely"}
            </Button>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {isFinalBookingStatus(booking.status)
              ? "This request is closed — message the guest if you need to follow up."
              : "Open the thread to coordinate details."}
          </p>
        )}
        <Link
          href={`/restaurant/bookings/${booking.id}`}
          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-primary transition-colors hover:bg-muted/60"
        >
          <MessageSquare className="h-4 w-4" />
          Messages
        </Link>
      </CardFooter>
    </Card>
  );
}
