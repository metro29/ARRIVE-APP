import Link from "next/link";
import { Inbox } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { BOOKING_STATUS } from "@/lib/booking-status";
import {
  getOwnerRestaurant,
  listRestaurantBookings,
} from "@/lib/queries/bookings";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { RestaurantInboxCard } from "@/components/cards/restaurant-inbox-card";
import { Card, CardContent } from "@/components/ui/card";

export default async function RestaurantDashboardPage() {
  const profile = await requireRole("restaurant_owner");
  const restaurant = await getOwnerRestaurant(profile.id);
  const bookings = restaurant
    ? await listRestaurantBookings(restaurant.id)
    : [];

  const needsAction = bookings.filter(
    (b) => b.status === BOOKING_STATUS.PENDING
  );

  return (
    <div className="space-y-12">
      <PageHeader
        title={restaurant?.name ?? "Your venue"}
        description={
          needsAction.length > 0
            ? `${needsAction.length} guest${needsAction.length === 1 ? "" : "s"} waiting to hear from you.`
            : "You're all caught up — enjoy the calm."
        }
      >
        <Link
          href="/restaurant/bookings"
          className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-transform active:scale-[0.98]"
        >
          Open inbox
        </Link>
      </PageHeader>

      {!restaurant && (
        <Card className="border-0 bg-amber-500/8 ring-1 ring-amber-500/15">
          <CardContent className="py-6 text-sm leading-relaxed text-muted-foreground">
            Link your venue in Supabase with{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
              owner_id = {profile.id}
            </code>{" "}
            to start receiving guest requests.
          </CardContent>
        </Card>
      )}

      <section className="space-y-6">
        <SectionHeading
          title={
            needsAction.length > 0
              ? "Needs your response"
              : "Inbox"
          }
          description={
            needsAction.length > 0
              ? "A thoughtful reply goes a long way — confirm or decline when you can."
              : "New requests will land here when guests reach out."
          }
          tone={needsAction.length > 0 ? "attention" : "default"}
        />

        {needsAction.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {needsAction.map((booking) => (
              <RestaurantInboxCard
                key={booking.id}
                booking={booking}
                needsAttention
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl bg-muted/20 px-8 py-16 text-center ring-1 ring-foreground/[0.04]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm">
              <Inbox className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {restaurant
                ? "No pending requests right now. We'll notify you when someone reaches out."
                : "Set up your venue to start receiving event inquiries."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
