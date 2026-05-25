import { Skeleton } from "@/components/ui/skeleton";

export function DiscoverGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <DiscoverCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DiscoverCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

export function DiscoverPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-full max-w-xs shrink-0 lg:block">
          <Skeleton className="h-[520px] w-full rounded-xl" />
        </div>
        <div className="min-w-0 flex-1 space-y-6">
          <Skeleton className="h-10 w-full rounded-lg" />
          <DiscoverGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
