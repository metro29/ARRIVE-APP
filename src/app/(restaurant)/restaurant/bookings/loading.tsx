import { BookingsListSkeleton } from "@/components/shared/bookings-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantBookingsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <BookingsListSkeleton count={4} />
    </div>
  );
}
