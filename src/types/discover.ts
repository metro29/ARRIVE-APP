import type {
  DiscoverEventType,
  PriceLevel,
  RestaurantTag,
} from "@/types/restaurant";

export type GroupSizeRange = "1-5" | "6-12" | "13-25" | "25+";

/** Filter state for intelligent event discovery */
export interface DiscoverFilters {
  event_type: DiscoverEventType | null;
  group_size: GroupSizeRange | null;
  cuisine_type: string | null;
  price_level: PriceLevel | null;
  location_radius_km: number | null;
  vibe_tags: RestaurantTag[];
}

export const DEFAULT_DISCOVER_FILTERS: DiscoverFilters = {
  event_type: null,
  group_size: null,
  cuisine_type: null,
  price_level: null,
  location_radius_km: null,
  vibe_tags: [],
};

export interface DiscoverSearchState {
  query: string;
}

export const DEFAULT_DISCOVER_SEARCH: DiscoverSearchState = {
  query: "",
};

export const GROUP_SIZE_OPTIONS: { value: GroupSizeRange; label: string }[] = [
  { value: "1-5", label: "1–5 guests" },
  { value: "6-12", label: "6–12 guests" },
  { value: "13-25", label: "13–25 guests" },
  { value: "25+", label: "25+ guests" },
];

export const CUISINE_OPTIONS = [
  "Steakhouse",
  "American",
  "Tex-Mex",
  "Seafood",
  "Italian",
  "Wine Bar",
  "Southern",
  "Contemporary",
] as const;

export const EVENT_TYPE_OPTIONS: { value: DiscoverEventType; label: string }[] =
  [
    { value: "birthday", label: "Birthday" },
    { value: "corporate", label: "Corporate" },
    { value: "party", label: "Party" },
    { value: "date_night", label: "Date Night" },
    { value: "dinner", label: "Dinner" },
  ];

export function hasActiveFilters(filters: DiscoverFilters): boolean {
  return (
    filters.event_type !== null ||
    filters.group_size !== null ||
    filters.cuisine_type !== null ||
    filters.price_level !== null ||
    filters.location_radius_km !== null ||
    filters.vibe_tags.length > 0
  );
}

export function countActiveFilters(filters: DiscoverFilters): number {
  let count = 0;
  if (filters.event_type) count++;
  if (filters.group_size) count++;
  if (filters.cuisine_type) count++;
  if (filters.price_level) count++;
  if (filters.location_radius_km) count++;
  count += filters.vibe_tags.length;
  return count;
}
