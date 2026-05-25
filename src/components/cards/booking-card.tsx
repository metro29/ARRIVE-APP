import { Calendar, Users } from "lucide-react";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Booking } from "@/types";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const restaurantName = booking.restaurant?.name ?? "Restaurant";

  return (
    <Card className="border-0">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{restaurantName}</CardTitle>
        <BookingStatusBadge status={booking.status} />
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p className="capitalize">{booking.event_type.replace(/_/g, " ")}</p>
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 opacity-70" />
            {new Date(booking.event_date).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 opacity-70" />
            {booking.guest_count} guests
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
