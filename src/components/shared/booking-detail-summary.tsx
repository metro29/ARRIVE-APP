import { Calendar, MapPin, Users } from "lucide-react";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookingWithRelations } from "@/types";

interface BookingDetailSummaryProps {
  booking: BookingWithRelations;
  subtitle?: string;
}

export function BookingDetailSummary({
  booking,
  subtitle,
}: BookingDetailSummaryProps) {
  const title =
    booking.restaurant?.name ?? booking.guest?.name ?? "Event request";

  return (
    <Card className="border-0">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <BookingStatusBadge status={booking.status} />
      </CardHeader>
      <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0 opacity-70" />
          {new Date(booking.event_date).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4 shrink-0 opacity-70" />
          {booking.guest_count} guests ·{" "}
          <span className="capitalize">
            {booking.event_type.replace(/_/g, " ")}
          </span>
        </div>
        {booking.restaurant?.location && (
          <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
            <MapPin className="h-4 w-4 shrink-0 opacity-70" />
            {booking.restaurant.location}
          </div>
        )}
        {booking.guest?.name && (
          <p className="sm:col-span-2">
            <span className="text-muted-foreground">Guest </span>
            <span className="font-medium text-foreground">
              {booking.guest.name}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
