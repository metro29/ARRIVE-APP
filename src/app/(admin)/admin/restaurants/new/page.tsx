import { listRestaurantOwners } from "@/lib/data/users";
import { PageHeader } from "@/components/shared/page-header";
import { RestaurantForm } from "@/components/admin/restaurant-form";

export default async function AdminNewRestaurantPage() {
  const owners = await listRestaurantOwners();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Add restaurant"
        description="Create a new listing. Set status to Active and enable visibility when ready for discover."
      />
      <RestaurantForm mode="create" owners={owners} />
    </div>
  );
}
