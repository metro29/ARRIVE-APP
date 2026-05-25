import { Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { BookingCard } from "@/components/cards/booking-card";
import type { Booking } from "@/types";

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, restaurant:restaurants(name, image_url, location)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10">
      <PageHeader
        title="All event requests"
        description="A simple view of activity across the platform."
      />

      {bookings && bookings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(bookings as Booking[]).map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="Nothing here yet"
          description="When guests start reaching out to venues, requests will show up in this list."
        />
      )}
    </div>
  );
}
