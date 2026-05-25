import type { Restaurant } from "@/types";

/** Vibe tags for event-aware discovery and future AI matching */
export type RestaurantTag =
  | "luxury"
  | "romantic"
  | "loud"
  | "casual"
  | "corporate"
  | "nightlife"
  | "family-friendly"
  | "private-dining-focused";

export type PriceLevel = 1 | 2 | 3 | 4;

export type DiscoverEventType =
  | "birthday"
  | "corporate"
  | "party"
  | "date_night"
  | "dinner";

export type RestaurantAmenity =
  | "private_room"
  | "outdoor_seating"
  | "catering"
  | "full_bar"
  | "av_equipment";

/**
 * Enriched restaurant model for filters, ranking, AI, and recommendations.
 */
export interface RestaurantEnriched extends Restaurant {
  tags: RestaurantTag[];
  price_level: PriceLevel;
  event_types: DiscoverEventType[];
  amenities?: RestaurantAmenity[];
  latitude?: number | null;
  longitude?: number | null;
  rating?: number | null;
}

export interface RankedRestaurant extends RestaurantEnriched {
  matchScore: number;
  isBestMatch?: boolean;
  isRecommended?: boolean;
  /** Rule-based explanations for /plan recommendations */
  matchReasons?: string[];
}

export const ALL_VIBE_TAGS: RestaurantTag[] = [
  "luxury",
  "romantic",
  "loud",
  "casual",
  "corporate",
  "nightlife",
  "family-friendly",
  "private-dining-focused",
];

export const EVENT_TYPE_LABELS: Record<DiscoverEventType, string> = {
  birthday: "Birthday",
  corporate: "Corporate",
  party: "Party",
  date_night: "Date Night",
  dinner: "Dinner",
};

export const PRICE_LEVEL_LABELS: Record<PriceLevel, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};
