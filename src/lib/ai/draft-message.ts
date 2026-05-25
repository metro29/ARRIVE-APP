import type { EventPlan } from "@/types/event-plan";

export function generateVenueMessage(
  plan: EventPlan,
  restaurantName: string
): string {
  const typeLabel = String(plan.event_type).replace(/_/g, " ");
  const cuisine =
    plan.cuisine_preferences.length > 0
      ? ` We are interested in ${plan.cuisine_preferences.join(" or ")}.`
      : "";
  const vibe =
    plan.vibe.length > 0
      ? ` We are looking for a ${plan.vibe.map((v) => v.replace(/-/g, " ")).join(", ")} atmosphere.`
      : "";

  return `Hello ${restaurantName} team,

I would like to inquire about hosting a ${typeLabel} for ${plan.guest_count} guests in the ${plan.location} area.${cuisine}${vibe}

Please let me know about availability, private dining options, and any event packages you recommend.

Thank you!`;
}
