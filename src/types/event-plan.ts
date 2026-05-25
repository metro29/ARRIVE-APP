import type { DiscoverEventType, RestaurantTag } from "@/types/restaurant";

/** Structured output from the event planner (rule-based / future LLM). */
export interface EventPlan {
  event_type: DiscoverEventType | string;
  guest_count: number;
  /** Price levels 1–4 for ranking integration */
  budget_range: [number, number];
  cuisine_preferences: string[];
  vibe: RestaurantTag[];
  location: string;
  urgency: "asap" | "soon" | "flexible" | string;
}

export type PlanStep =
  | "describe"
  | "review"
  | "venues"
  | "draft"
  | "confirmed";

/** In-memory draft before booking is submitted */
export interface EventDraft {
  restaurantId: string;
  restaurantName: string;
  plan: EventPlan;
  guestCount: number;
  eventType: string;
  eventDate: string;
  venueMessage: string;
}

export const DEFAULT_EVENT_PLAN: EventPlan = {
  event_type: "dinner",
  guest_count: 8,
  budget_range: [2, 3],
  cuisine_preferences: [],
  vibe: [],
  location: "Dallas, TX",
  urgency: "flexible",
};
