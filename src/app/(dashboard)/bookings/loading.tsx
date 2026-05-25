import { BookingsListSkeleton } from "@/components/shared/bookings-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <BookingsListSkeleton count={4} />
    </div>
  );
}
