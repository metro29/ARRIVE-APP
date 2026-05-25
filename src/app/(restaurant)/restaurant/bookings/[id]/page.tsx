import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { assertRestaurantOwnsBooking } from "@/lib/booking-access";
import { requireRole } from "@/lib/auth";
import { BOOKING_STATUS } from "@/lib/booking-status";
import { getBookingById, listBookingMessages } from "@/lib/queries/bookings";
import { BookingStatusTimeline } from "@/components/bookings/booking-status-timeline";
import { RestaurantInboxCard } from "@/components/cards/restaurant-inbox-card";
import { BookingDetailSummary } from "@/components/shared/booking-detail-summary";
import { MessageThread } from "@/components/shared/message-thread";
import { PageHeader } from "@/components/shared/page-header";

export default async function RestaurantBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireRole("restaurant_owner");
  const access = await assertRestaurantOwnsBooking(id, profile.id);
  if ("error" in access) notFound();

  const booking = await getBookingById(id);
  if (!booking || booking.restaurant_id !== access.restaurantId) notFound();

  const messages = await listBookingMessages(id);
  const isPending = booking.status === BOOKING_STATUS.PENDING;
  return (
    <div className="space-y-8">
      <Link
        href="/restaurant/bookings"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to requests
      </Link>

      <PageHeader
        title="Guest request"
        description="Take your time — a clear yes or no is all they need right now."
      />

      {isPending ? (
        <RestaurantInboxCard booking={booking} />
      ) : (
        <BookingDetailSummary
          booking={booking}
          subtitle={`Request from ${booking.guest?.name ?? "guest"}`}
        />
      )}

      <section className="surface-soft p-6 sm:p-8">
        <h2 className="mb-6 text-sm font-medium text-muted-foreground">
          Where things stand
        </h2>
        <BookingStatusTimeline status={booking.status} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium tracking-tight">Messages</h2>
        <p className="text-sm text-muted-foreground">
          Coordinate details with your guest in one thread.
        </p>
        <MessageThread
          bookingId={id}
          messages={messages}
          currentUserId={profile.id}
        />
      </section>
    </div>
  );
}
