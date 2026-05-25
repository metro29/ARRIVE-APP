import { PlanExperienceSkeleton } from "@/components/plan/plan-experience";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlanLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <PlanExperienceSkeleton />
    </div>
  );
}
