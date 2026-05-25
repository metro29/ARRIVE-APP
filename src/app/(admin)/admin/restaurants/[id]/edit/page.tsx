import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getRestaurantByIdAdmin } from "@/lib/data/restaurants";
import { listRestaurantOwners } from "@/lib/data/users";
import { deleteRestaurantAction } from "@/app/actions/restaurants";
import { PageHeader } from "@/components/shared/page-header";
import { RestaurantForm } from "@/components/admin/restaurant-form";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/shared/button-link";

export default async function AdminEditRestaurantPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const [restaurant, owners] = await Promise.all([
    getRestaurantByIdAdmin(id),
    listRestaurantOwners(),
  ]);

  if (!restaurant) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title={restaurant.name}
        description="Edit listing details, assign an owner, and control discover visibility."

      >
        <ButtonLink href="/admin/restaurants" variant="outline" size="sm">
          Back to list
        </ButtonLink>
      </PageHeader>

      {created === "1" && (
        <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm">
          Restaurant created. Activate the listing when onboarding is complete.
        </p>
      )}

      <div className="grid gap-4 rounded-2xl bg-muted/20 p-5 text-sm ring-1 ring-foreground/[0.04] sm:grid-cols-3">
        <div>
          <p className="text-muted-foreground">Bookings</p>
          <p className="font-medium text-foreground">—</p>
          <p className="text-xs text-muted-foreground">Stats coming soon</p>
        </div>
        <div>
          <p className="text-muted-foreground">Subscription</p>
          <p className="font-medium capitalize">
            {restaurant.subscription_status ?? "none"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Listing ID</p>
          <p className="truncate font-mono text-xs">{restaurant.id}</p>
        </div>
      </div>

      <RestaurantForm mode="edit" restaurant={restaurant} owners={owners} />

      <form action={deleteRestaurantAction.bind(null, id)} className="border-t pt-8">
        <Button type="submit" variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete restaurant
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Permanent. Fails if bookings exist for this venue.
        </p>
      </form>
    </div>
  );
}
