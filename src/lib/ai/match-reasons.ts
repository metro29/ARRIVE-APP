import type { DiscoverFilters } from "@/types/discover";
import type { EventPlan } from "@/types/event-plan";
import type { RestaurantEnriched } from "@/types/restaurant";
import { EVENT_TYPE_LABELS } from "@/types/restaurant";
import { guestCountToGroupSize } from "@/lib/ai/event-plan-filters";

export function getMatchReasons(
  restaurant: RestaurantEnriched,
  plan: EventPlan,
  filters: DiscoverFilters
): string[] {
  const reasons: string[] = [];
  const groupRange = guestCountToGroupSize(plan.guest_count);

  if (
    filters.event_type &&
    restaurant.event_types.includes(filters.event_type)
  ) {
    reasons.push(
      `Well-suited for ${EVENT_TYPE_LABELS[filters.event_type].toLowerCase()} events`
    );
  }

  if (restaurant.capacity >= plan.guest_count) {
    reasons.push(`Fits your group of ${plan.guest_count} guests`);
  } else if (restaurant.capacity >= plan.guest_count * 0.8) {
    reasons.push(`Capacity up to ${restaurant.capacity} — close to your group size`);
  }

  const vibeOverlap = plan.vibe.filter((v) => restaurant.tags.includes(v));
  if (vibeOverlap.length > 0) {
    const labels = vibeOverlap.map((v) => v.replace(/-/g, " ")).join(", ");
    reasons.push(`Matches your preferred vibe: ${labels}`);
  }

  if (
    plan.cuisine_preferences.length > 0 &&
    plan.cuisine_preferences.some(
      (c) => c.toLowerCase() === restaurant.cuisine_type.toLowerCase()
    )
  ) {
    reasons.push(`Serves ${restaurant.cuisine_type}, matching your cuisine preference`);
  }

  if (
    filters.price_level != null &&
    restaurant.price_level === filters.price_level
  ) {
    reasons.push("Aligns with your budget range");
  }

  if (restaurant.tags.includes("private-dining-focused")) {
    reasons.push("Private dining and event spaces available");
  }

  if (groupRange === "25+" && restaurant.capacity >= 100) {
    reasons.push("High capacity for large group events");
  }

  if (reasons.length === 0) {
    reasons.push("A strong overall match for your event criteria");
  }

  return reasons.slice(0, 3);
}
