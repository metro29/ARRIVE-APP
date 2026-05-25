import { Calendar } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { BOOKING_STATUS } from "@/lib/booking-status";
import { listUserBookings } from "@/lib/queries/bookings";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { UserBookingCard } from "@/components/cards/user-booking-card";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";

export default async function DashboardPage() {
  const profile = await requireRole("user");
  const bookings = await listUserBookings(profile.id);
  const firstName = profile.name?.split(" ")[0];

  const upcoming = bookings.filter(
    (b) => b.status === BOOKING_STATUS.ACCEPTED
  );
  const awaiting = bookings.filter(
    (b) => b.status === BOOKING_STATUS.PENDING
  );

  return (
    <div className="space-y-12">
      <PageHeader
        title={firstName ? `Hi ${firstName}` : "Welcome back"}
        description="Here's what's happening with your event plans."
      >
        <ButtonLink href="/plan" size="lg">
          Plan an event
        </ButtonLink>
      </PageHeader>

      {bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="You don't have any upcoming plans yet"
          description="When you find a place you love, send a request — we'll keep everything organized here."
          actionLabel="Explore places"
          actionHref="/discover"
        />
      ) : (
        <div className="space-y-12">
          {upcoming.length > 0 && (
            <section className="space-y-6">
              <SectionHeading
                title="Coming up"
                description="Confirmed events on your calendar."
              />
              <div className="grid gap-6 md:grid-cols-2">
                {upcoming.slice(0, 4).map((booking) => (
                  <UserBookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}

          {awaiting.length > 0 && (
            <section className="space-y-6">
              <SectionHeading
                title="Waiting to hear back"
                description={`${awaiting.length} request${awaiting.length === 1 ? "" : "s"} with venues.`}
              />
              <div className="grid gap-6 md:grid-cols-2">
                {awaiting.map((booking) => (
                  <UserBookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}

          <div className="flex justify-center pt-2">
            <ButtonLink href="/bookings" variant="outline">
              View all your plans
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
