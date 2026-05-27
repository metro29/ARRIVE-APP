import { getRestaurants } from "@/lib/queries/restaurants";
import { PageHeader } from "@/components/shared/page-header";
import { DiscoverExperience } from "@/components/discover/discover-experience";

export default async function DiscoverPage() {
  const restaurants = await getRestaurants();

  return (
    <div className="relative space-y-10">
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" aria-hidden />
      <PageHeader
        title="Find your place"
        description="Houston and Cypress venues for birthdays, team dinners, BBQ celebrations, and everything in between."
      />
      <DiscoverExperience initialRestaurants={restaurants} />
    </div>
  );
}
