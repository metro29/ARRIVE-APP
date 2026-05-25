import type { DiscoverFilters } from "@/types/discover";
import type { DiscoverRestaurant } from "@/types";
import type { CitySlug } from "@/types/geo";
import type {
  DiscoverEventType,
  PriceLevel,
  RankedRestaurant,
  RestaurantEnriched,
  RestaurantTag,
} from "@/types/restaurant";
import { DEFAULT_CITY } from "@/lib/geo/cities";
import { calculateDistanceKm, getCityCenter } from "@/lib/geo/radius";
import { groupSizeRangeMin } from "@/lib/discover/filter-utils";
import {
  rankRestaurants,
  type RankRestaurantsOptions,
} from "@/lib/discover/ranking";

export { groupSizeRangeMin } from "@/lib/discover/filter-utils";
export {
  computeMatchScore,
  rankRestaurants,
  getPerfectForLabel,
  type RankRestaurantsOptions,
} from "@/lib/discover/ranking";

const VALID_TAGS = new Set<string>([
  "luxury",
  "romantic",
  "loud",
  "casual",
  "corporate",
  "nightlife",
  "family-friendly",
  "private-dining-focused",
]);

const VALID_EVENT_TYPES = new Set<string>([
  "birthday",
  "corporate",
  "party",
  "date_night",
  "dinner",
]);

function normalizeTags(raw: string[] | undefined | null): RestaurantTag[] {
  if (!raw?.length) return [];
  return raw.filter((tag): tag is RestaurantTag => VALID_TAGS.has(tag));
}

function normalizeEventTypes(
  raw: string[] | undefined | null
): DiscoverEventType[] {
  if (!raw?.length) return [];
  return raw.filter((type): type is DiscoverEventType =>
    VALID_EVENT_TYPES.has(type)
  );
}

function clampPriceLevel(value: number | undefined | null): PriceLevel {
  if (value == null || value < 1) return 2;
  if (value > 4) return 4;
  return value as PriceLevel;
}

export function enrichRestaurant(
  restaurant: DiscoverRestaurant
): RestaurantEnriched {
  return {
    ...restaurant,
    tags: normalizeTags(restaurant.tags),
    price_level: clampPriceLevel(restaurant.price_level),
    event_types: normalizeEventTypes(restaurant.event_types),
    latitude: restaurant.latitude ?? null,
    longitude: restaurant.longitude ?? null,
    amenities: [],
    rating: null,
  };
}

function matchesSearch(
  restaurant: RestaurantEnriched,
  searchQuery: string
): boolean {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return true;
  return (
    restaurant.name.toLowerCase().includes(q) ||
    restaurant.location.toLowerCase().includes(q) ||
    restaurant.description.toLowerCase().includes(q) ||
    restaurant.cuisine_type.toLowerCase().includes(q) ||
    restaurant.tags.some((tag) => tag.replace(/-/g, " ").includes(q))
  );
}

function matchesLocationRadius(
  restaurant: RestaurantEnriched,
  radiusKm: number | null,
  citySlug: CitySlug = DEFAULT_CITY
): boolean {
  if (!radiusKm) return true;
  if (restaurant.latitude == null || restaurant.longitude == null) return true;

  const center = getCityCenter(citySlug);
  const distance = calculateDistanceKm(center, {
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
  });
  return distance <= radiusKm;
}

function matchesVibeTags(
  restaurant: RestaurantEnriched,
  vibeTags: RestaurantTag[]
): boolean {
  if (vibeTags.length === 0) return true;
  return vibeTags.some((tag) => restaurant.tags.includes(tag));
}

function matchesGroupSize(
  restaurant: RestaurantEnriched,
  groupSize: DiscoverFilters["group_size"]
): boolean {
  if (!groupSize) return true;
  return restaurant.capacity >= groupSizeRangeMin(groupSize);
}

export interface FilterRestaurantsOptions {
  citySlug?: CitySlug;
}

/** Filter restaurants by active discovery criteria */
export function getFilteredRestaurants(
  restaurants: RestaurantEnriched[],
  filters: DiscoverFilters,
  searchQuery = "",
  options?: FilterRestaurantsOptions
): RestaurantEnriched[] {
  const citySlug = options?.citySlug ?? DEFAULT_CITY;

  return restaurants.filter((restaurant) => {
    if (!matchesSearch(restaurant, searchQuery)) return false;
    if (
      filters.cuisine_type &&
      restaurant.cuisine_type.toLowerCase() !==
        filters.cuisine_type.toLowerCase()
    ) {
      return false;
    }
    if (
      filters.price_level != null &&
      restaurant.price_level !== filters.price_level
    ) {
      return false;
    }
    if (!matchesGroupSize(restaurant, filters.group_size)) return false;
    if (!matchesVibeTags(restaurant, filters.vibe_tags)) return false;
    if (
      !matchesLocationRadius(
        restaurant,
        filters.location_radius_km,
        citySlug
      )
    ) {
      return false;
    }
    if (
      filters.event_type &&
      !restaurant.event_types.includes(filters.event_type)
    ) {
      return false;
    }
    return true;
  });
}

export function discoverRestaurants(
  restaurants: RestaurantEnriched[],
  filters: DiscoverFilters,
  searchQuery = "",
  options?: FilterRestaurantsOptions & RankRestaurantsOptions
): RankedRestaurant[] {
  const filtered = getFilteredRestaurants(
    restaurants,
    filters,
    searchQuery,
    options
  );
  return rankRestaurants(filtered, filters, options);
}
