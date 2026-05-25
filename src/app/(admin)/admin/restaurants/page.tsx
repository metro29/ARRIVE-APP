import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import {
  listAllRestaurantsAdmin,
  countActiveRestaurants,
} from "@/lib/data/restaurants";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RestaurantAdminTable } from "@/components/admin/restaurant-admin-table";
import { ButtonLink } from "@/components/shared/button-link";
import { MAX_ADMIN_PAGE_SIZE } from "@/lib/data/types";

export default async function AdminRestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  const offset = (page - 1) * MAX_ADMIN_PAGE_SIZE;

  const [{ items: restaurants, total, hasMore }, activeCount] =
    await Promise.all([
      listAllRestaurantsAdmin({ limit: MAX_ADMIN_PAGE_SIZE, offset }),
      countActiveRestaurants(),
    ]);

  const totalPages = Math.max(1, Math.ceil(total / MAX_ADMIN_PAGE_SIZE));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Restaurant operations"
        description="Onboard venues, control marketplace quality, and assign owners across the Houston metro."
      >
        <ButtonLink href="/admin/restaurants/new" className="gap-2">
          <Plus className="h-4 w-4" />
          Add restaurant
        </ButtonLink>
      </PageHeader>

      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">{total}</span> total
          listings
        </span>
        <span>
          <span className="font-medium text-foreground">{activeCount}</span>{" "}
          live on discover
        </span>
      </div>

      {restaurants.length > 0 ? (
        <>
          <RestaurantAdminTable restaurants={restaurants} />
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/admin/restaurants?page=${page - 1}`}
                    className="rounded-lg px-3 py-1.5 ring-1 ring-border hover:bg-muted/50"
                  >
                    Previous
                  </Link>
                )}
                {hasMore && (
                  <Link
                    href={`/admin/restaurants?page=${page + 1}`}
                    className="rounded-lg px-3 py-1.5 ring-1 ring-border hover:bg-muted/50"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={Building2}
          title="No restaurants yet"
          description="Add your first venue or run supabase/seed_houston_cypress.sql to load the Houston metro dataset."
          actionLabel="Add restaurant"
          actionHref="/admin/restaurants/new"
        />
      )}
    </div>
  );
}
