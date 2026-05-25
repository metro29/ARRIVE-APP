import { Calendar } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { BOOKING_STATUS } from "@/lib/booking-status";
import { listUserBookings } from "@/lib/queries/bookings";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { UserBookingCard } from "@/components/cards/user-booking-card";
import { ButtonLink } from "@/components/shared/button-link";

export default async function BookingsPage() {
  const profile = await requireRole("user");
  const bookings = await listUserBookings(profile.id);

  const confirmed = bookings.filter((b) => b.status === BOOKING_STATUS.ACCEPTED);
  const waiting = bookings.filter((b) => b.status === BOOKING_STATUS.PENDING);
  const closed = bookings.filter((b) => b.status === BOOKING_STATUS.REJECTED);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Your plans"
        description="Every request you've sent, and how each venue responded."
      >
        <ButtonLink href="/discover" variant="outline">
          Find a venue
        </ButtonLink>
      </PageHeader>

      {bookings.length > 0 ? (
        <div className="space-y-12">
          {confirmed.length > 0 && (
            <BookingSection
              title="Confirmed"
              description="These events are on the calendar."
            >
              {confirmed.map((b) => (
                <UserBookingCard key={b.id} booking={b} />
              ))}
            </BookingSection>
          )}
          {waiting.length > 0 && (
            <BookingSection
              title="Waiting for response"
              description="Venues are reviewing these requests."
            >
              {waiting.map((b) => (
                <UserBookingCard key={b.id} booking={b} />
              ))}
            </BookingSection>
          )}
          {closed.length > 0 && (
            <BookingSection
              title="Couldn't accommodate"
              description="You can always try another date or venue."
            >
              {closed.map((b) => (
                <UserBookingCard key={b.id} booking={b} />
              ))}
            </BookingSection>
          )}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="You don't have any upcoming plans yet"
          description="When you send a request to a venue, it'll show up here so you can track the conversation."
          actionLabel="Explore places"
          actionHref="/discover"
        />
      )}
    </div>
  );
}

function BookingSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <SectionHeading title={title} description={description} />
      <div className="grid gap-6 md:grid-cols-2">{children}</div>
    </section>
  );
}
