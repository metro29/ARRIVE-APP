import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { assertBookingAccess } from "@/lib/booking-access";
import { requireRole } from "@/lib/auth";
import { getBookingById, listBookingMessages } from "@/lib/queries/bookings";
import { BookingStatusTimeline } from "@/components/bookings/booking-status-timeline";
import { BookingDetailSummary } from "@/components/shared/booking-detail-summary";
import { MessageThread } from "@/components/shared/message-thread";
import { PageHeader } from "@/components/shared/page-header";

export default async function UserBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireRole("user");
  const access = await assertBookingAccess(id, profile);
  if ("error" in access) notFound();

  const booking = await getBookingById(id);
  if (!booking || booking.user_id !== profile.id) notFound();

  const messages = await listBookingMessages(id);
  return (
    <div className="space-y-8">
      <Link
        href="/bookings"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to your plans
      </Link>

      <PageHeader
        title="Your event"
        description="Here's where things stand with the venue."
      />

      <BookingDetailSummary booking={booking} subtitle="Your request" />

      <section className="surface-soft p-6 sm:p-8">
        <h2 className="mb-6 text-sm font-medium text-muted-foreground">
          Where things stand
        </h2>
        <BookingStatusTimeline status={booking.status} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium tracking-tight">Messages</h2>
        <p className="text-sm text-muted-foreground">
          Stay in touch with the venue about your event.
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
