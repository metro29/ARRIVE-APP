import { getRestaurants } from "@/lib/queries/restaurants";
import { PageHeader } from "@/components/shared/page-header";
import { PlanExperience } from "@/components/plan/plan-experience";

export default async function PlanPage() {
  const restaurants = await getRestaurants();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Plan your event"
        description="Tell us what you're imagining — we'll help you shape it, find places, and send a thoughtful request when you're ready."
      />
      <PlanExperience restaurants={restaurants} />
    </div>
  );
}
