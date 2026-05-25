import type { DiscoverFilters, GroupSizeRange } from "@/types/discover";
import type { EventPlan } from "@/types/event-plan";
import type { DiscoverEventType, PriceLevel } from "@/types/restaurant";

export function guestCountToGroupSize(count: number): GroupSizeRange {
  if (count <= 5) return "1-5";
  if (count <= 12) return "6-12";
  if (count <= 25) return "13-25";
  return "25+";
}

export function eventPlanToDiscoverFilters(plan: EventPlan): DiscoverFilters {
  const [budgetMin, budgetMax] = plan.budget_range;
  const price_level = Math.round(
    (budgetMin + budgetMax) / 2
  ) as PriceLevel;

  const event_type = [
    "birthday",
    "corporate",
    "party",
    "date_night",
    "dinner",
  ].includes(String(plan.event_type))
    ? (plan.event_type as DiscoverEventType)
    : "dinner";

  return {
    event_type,
    group_size: guestCountToGroupSize(plan.guest_count),
    cuisine_type: plan.cuisine_preferences[0] ?? null,
    price_level,
    location_radius_km: plan.location.toLowerCase().includes("plano") ? 50 : 25,
    vibe_tags: plan.vibe,
  };
}
