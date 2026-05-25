import Link from "next/link";
import { Calendar, ChevronRight, MessageSquare, Users } from "lucide-react";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookingWithRelations } from "@/types";

interface UserBookingCardProps {
  booking: BookingWithRelations;
}

export function UserBookingCard({ booking }: UserBookingCardProps) {
  const restaurantName = booking.restaurant?.name ?? "Restaurant";

  return (
    <Link href={`/bookings/${booking.id}`} className="group block">
      <Card className="hover-lift border-0 transition-colors duration-300 group-hover:ring-primary/15">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
          <CardTitle className="text-base font-medium transition-colors group-hover:text-primary">
            {restaurantName}
          </CardTitle>
          <BookingStatusBadge status={booking.status} />
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="capitalize text-muted-foreground">
            {booking.event_type.replace(/_/g, " ")}
          </p>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 opacity-70" />
              {new Date(booking.event_date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 opacity-70" />
              {booking.guest_count} guests
            </span>
          </div>
          {booking.venue_note && (
            <p className="flex items-start gap-2 rounded-xl bg-muted/40 px-3.5 py-2.5 text-xs leading-relaxed text-foreground/90">
              <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80" />
              <span className="line-clamp-2">{booking.venue_note}</span>
            </p>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
            View details
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
