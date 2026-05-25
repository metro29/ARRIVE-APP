import type { DiscoverFilters } from "@/types/discover";
import type { CitySlug } from "@/types/geo";
import type {
  PriceLevel,
  RankedRestaurant,
  RestaurantEnriched,
  RestaurantTag,
} from "@/types/restaurant";
import { EVENT_TYPE_LABELS } from "@/types/restaurant";
import { groupSizeRangeMin } from "@/lib/discover/filter-utils";

export interface RankRestaurantsOptions {
  /** City scope for deterministic, partition-ready ranking (reserved for geo tie-breaks) */
  citySlug?: CitySlug;
  /** Cap ranked output size for pagination-safe pipelines */
  maxResults?: number;
}

function matchesGroupSize(
  restaurant: RestaurantEnriched,
  groupSize: DiscoverFilters["group_size"]
): boolean {
  if (!groupSize) return true;
  return restaurant.capacity >= groupSizeRangeMin(groupSize);
}

export function computeMatchScore(
  restaurant: RestaurantEnriched,
  filters: DiscoverFilters
): number {
  let score = 0;

  if (
    filters.event_type &&
    restaurant.event_types.includes(filters.event_type)
  ) {
    score += 3;
  }

  if (filters.vibe_tags.length > 0) {
    const vibeMatches = filters.vibe_tags.filter((tag) =>
      restaurant.tags.includes(tag)
    ).length;
    if (vibeMatches > 0) score += 2;
  }

  if (filters.group_size && matchesGroupSize(restaurant, filters.group_size)) {
    score += 2;
  }

  if (
    filters.cuisine_type &&
    restaurant.cuisine_type.toLowerCase() ===
      filters.cuisine_type.toLowerCase()
  ) {
    score += 1;
  }

  if (
    filters.price_level != null &&
    restaurant.price_level === filters.price_level
  ) {
    score += 1;
  }

  if (restaurant.is_featured) score += 0.5;
  if (restaurant.display_rank != null && restaurant.display_rank > 0) {
    score += Math.max(0, 1 - restaurant.display_rank * 0.1);
  }

  return score;
}

/** Rank filtered restaurants by deterministic match score */
export function rankRestaurants(
  restaurants: RestaurantEnriched[],
  filters: DiscoverFilters,
  options?: RankRestaurantsOptions
): RankedRestaurant[] {
  const ranked = restaurants
    .map((restaurant) => ({
      ...restaurant,
      matchScore: computeMatchScore(restaurant, filters),
    }))
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      if (Boolean(b.is_featured) !== Boolean(a.is_featured)) {
        return Number(b.is_featured) - Number(a.is_featured);
      }
      const rankA = a.display_rank ?? 999;
      const rankB = b.display_rank ?? 999;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name);
    });

  if (ranked.length === 0) return ranked;

  const topScore = ranked[0].matchScore;
  const hasMeaningfulFilters =
    filters.event_type !== null ||
    filters.group_size !== null ||
    filters.vibe_tags.length > 0 ||
    filters.cuisine_type !== null ||
    filters.price_level !== null;

  const withFlags = ranked.map((restaurant, index) => ({
    ...restaurant,
    isBestMatch: index === 0 && topScore > 0,
    isRecommended: hasMeaningfulFilters && index === 0 && topScore >= 3,
  }));

  if (options?.maxResults != null && options.maxResults > 0) {
    return withFlags.slice(0, options.maxResults);
  }

  return withFlags;
}

export function getPerfectForLabel(restaurant: RestaurantEnriched): string {
  if (restaurant.event_types.length === 0) return "Private events";
  const labels = restaurant.event_types
    .slice(0, 3)
    .map((type) => EVENT_TYPE_LABELS[type]);
  return labels.join(" · ");
}

/** Re-export for filter modules that need tag typing */
export type { RestaurantTag, PriceLevel };
