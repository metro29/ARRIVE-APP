import { getRestaurants } from "@/lib/queries/restaurants";
import { PageHeader } from "@/components/shared/page-header";
import { DiscoverExperience } from "@/components/discover/discover-experience";

export default async function DiscoverPage() {
  const restaurants = await getRestaurants();

  return (
    <div className="space-y-10">
      <PageHeader
        title="Find your place"
        description="Houston and Cypress venues for birthdays, team dinners, BBQ celebrations, and everything in between."
      />
      <DiscoverExperience initialRestaurants={restaurants} />
    </div>
  );
}
