import { BookingsListSkeleton } from "@/components/shared/bookings-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboardLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <BookingsListSkeleton count={3} />
    </div>
  );
}
