import type { RestaurantEnriched } from "@/types/restaurant";

export interface MarketSection {
  id: string;
  title: string;
  description: string;
  restaurants: RestaurantEnriched[];
}

function hasTag(
  restaurant: RestaurantEnriched,
  tag: string
): boolean {
  return restaurant.tags.includes(tag as RestaurantEnriched["tags"][number]);
}

/** Rule-based discover groupings for Houston metro marketplace */
export function buildHoustonMetroSections(
  restaurants: RestaurantEnriched[]
): MarketSection[] {
  const houston = restaurants.filter((r) => r.city === "houston");
  const cypress = restaurants.filter((r) => r.city === "cypress");

  const topHouston = [...houston]
    .filter((r) => r.is_featured || hasTag(r, "private-dining-focused"))
    .sort((a, b) => {
      if (Boolean(b.is_featured) !== Boolean(a.is_featured)) {
        return Number(b.is_featured) - Number(a.is_featured);
      }
      return (a.display_rank ?? 999) - (b.display_rank ?? 999);
    })
    .slice(0, 6);

  const corporate = restaurants
    .filter(
      (r) =>
        hasTag(r, "corporate") ||
        r.event_types.includes("corporate")
    )
    .sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0))
    .slice(0, 6);

  const cypressFavorites = [...cypress]
    .sort((a, b) => {
      if (Boolean(b.is_featured) !== Boolean(a.is_featured)) {
        return Number(b.is_featured) - Number(a.is_featured);
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, 6);

  const sections: MarketSection[] = [];

  if (topHouston.length > 0) {
    sections.push({
      id: "houston-events",
      title: "Top Houston Event Venues",
      description:
        "Featured steakhouses, rooftops, and private dining rooms across the city.",
      restaurants: topHouston,
    });
  }

  if (corporate.length > 0) {
    sections.push({
      id: "corporate",
      title: "Best for Corporate Events",
      description:
        "Boardroom-ready venues, hotel ballrooms, and team-friendly spaces.",
      restaurants: corporate,
    });
  }

  if (cypressFavorites.length > 0) {
    sections.push({
      id: "cypress",
      title: "Cypress Favorites",
      description:
        "Suburban steakhouses, BBQ, and family-friendly event spots northwest of Houston.",
      restaurants: cypressFavorites,
    });
  }

  return sections;
}
