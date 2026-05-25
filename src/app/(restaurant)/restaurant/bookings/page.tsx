import { Inbox } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { BOOKING_STATUS } from "@/lib/booking-status";
import {
  getOwnerRestaurant,
  listRestaurantBookings,
} from "@/lib/queries/bookings";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { RestaurantInboxCard } from "@/components/cards/restaurant-inbox-card";

export default async function RestaurantBookingsPage() {
  const profile = await requireRole("restaurant_owner");
  const restaurant = await getOwnerRestaurant(profile.id);
  const bookings = restaurant
    ? await listRestaurantBookings(restaurant.id)
    : [];

  const pending = bookings.filter((b) => b.status === BOOKING_STATUS.PENDING);
  const reviewed = bookings.filter((b) => b.status !== BOOKING_STATUS.PENDING);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Guest requests"
        description="Respond when you can — guests appreciate a quick, clear answer."
      />

      {!restaurant && (
        <div className="rounded-2xl bg-amber-500/8 px-5 py-4 text-sm leading-relaxed text-muted-foreground ring-1 ring-amber-500/15">
          Link your venue in Supabase with{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
            owner_id = {profile.id}
          </code>{" "}
          to receive inquiries.
        </div>
      )}

      {pending.length > 0 && (
        <section className="space-y-6">
          <SectionHeading
            title={`Needs your response (${pending.length})`}
            description="These guests are waiting to hear if you can host them."
            tone="attention"
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {pending.map((booking) => (
              <RestaurantInboxCard
                key={booking.id}
                booking={booking}
                needsAttention
              />
            ))}
          </div>
        </section>
      )}

      {reviewed.length > 0 ? (
        <section className="space-y-6">
          <SectionHeading
            title="Earlier requests"
            description="Requests you've already responded to."
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {reviewed.map((booking) => (
              <RestaurantInboxCard
                key={booking.id}
                booking={booking}
                showActions={false}
              />
            ))}
          </div>
        </section>
      ) : (
        restaurant &&
        pending.length === 0 && (
          <EmptyState
            icon={Inbox}
            title="Your inbox is quiet"
            description="When someone requests an event at your venue, you'll see it here first."
          />
        )
      )}
    </div>
  );
}
