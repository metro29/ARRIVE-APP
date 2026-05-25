"use client";

import { useMemo, useState } from "react";
import { Compass, SlidersHorizontal } from "lucide-react";
import {
  DEFAULT_DISCOVER_FILTERS,
  DEFAULT_DISCOVER_SEARCH,
  hasActiveFilters,
} from "@/types/discover";
import { discoverRestaurants } from "@/lib/discover/restaurant-discovery";
import { enrichRestaurant } from "@/lib/discover/restaurant-discovery";
import { buildHoustonMetroSections } from "@/lib/discover/market-sections";
import { RestaurantCard } from "@/components/cards/restaurant-card";
import { DiscoverFilterChips } from "@/components/discover/discover-filter-chips";
import { DiscoverFiltersPanel } from "@/components/discover/discover-filters";
import { RestaurantSearch } from "@/components/discover/restaurant-search";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { RestaurantEnriched } from "@/types/restaurant";
import type { DiscoverRestaurant } from "@/types";

interface DiscoverExperienceProps {
  initialRestaurants: (DiscoverRestaurant | RestaurantEnriched)[];
}

export function DiscoverExperience({
  initialRestaurants,
}: DiscoverExperienceProps) {
  const [filters, setFilters] = useState(DEFAULT_DISCOVER_FILTERS);
  const [search, setSearch] = useState(DEFAULT_DISCOVER_SEARCH.query);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const enriched = useMemo(
    () => initialRestaurants.map(enrichRestaurant),
    [initialRestaurants]
  );

  const visible = useMemo(
    () => discoverRestaurants(enriched, filters, search),
    [enriched, filters, search]
  );

  const marketSections = useMemo(
    () => buildHoustonMetroSections(enriched),
    [enriched]
  );

  const filtersActive = hasActiveFilters(filters);
  const featured = visible.find((r) => r.isRecommended) ?? visible[0];
  const rest = featured
    ? visible.filter((r) => r.id !== featured.id)
    : visible.slice(1);

  const exploreAll = filtersActive ? visible : enriched;

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
      <aside className="hidden w-full max-w-[17.5rem] shrink-0 lg:block">
        <div className="sticky top-24">
          <DiscoverFiltersPanel
            filters={filters}
            onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
            variant="sidebar"
          />
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-10">
        <div className="surface-soft space-y-5 p-5 sm:p-6">
          <RestaurantSearch value={search} onChange={setSearch} />

          <DiscoverFilterChips
            filters={filters}
            onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
            onOpenFilters={() => setMobileFiltersOpen(true)}
          />

          <Button
            variant="outline"
            size="sm"
            className="gap-2 lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Refine search
          </Button>

          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetContent
              side="bottom"
              className="max-h-[85vh] overflow-y-auto rounded-t-2xl border-border/60"
            >
              <SheetHeader>
                <SheetTitle>Refine your search</SheetTitle>
              </SheetHeader>
              <div className="mt-6 pb-8">
                <DiscoverFiltersPanel
                  filters={filters}
                  onChange={(patch) =>
                    setFilters((f) => ({ ...f, ...patch }))
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <p className="text-sm text-muted-foreground">
          {visible.length === 0
            ? "No matches yet"
            : `${visible.length} place${visible.length === 1 ? "" : "s"} ${
                filtersActive
                  ? "fit your event"
                  : "in the Houston metro"
              }`}
        </p>

        {visible.length > 0 ? (
          <div
            key={`${JSON.stringify(filters)}-${search}`}
            className="space-y-12 transition-opacity duration-300"
          >
            {!filtersActive &&
              marketSections.map((section) => (
                <section key={section.id} className="space-y-6">
                  <SectionHeading
                    title={section.title}
                    description={section.description}
                  />
                  <div className="grid gap-8 sm:grid-cols-2">
                    {section.restaurants.map((restaurant, index) => (
                      <div
                        key={restaurant.id}
                        className="page-enter"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <RestaurantCard restaurant={restaurant} />
                      </div>
                    ))}
                  </div>
                </section>
              ))}

            {featured && filtersActive && (
              <section className="space-y-5">
                <SectionHeading
                  title="Recommended for you"
                  description="Our top pick based on your filters and group size."
                />
                <div className="max-w-xl">
                  <RestaurantCard restaurant={featured} featured />
                </div>
              </section>
            )}

            {(filtersActive ? rest.length > 0 : exploreAll.length > 0) && (
              <section className="space-y-6">
                {filtersActive && rest.length > 0 && (
                  <SectionHeading
                    title="More great options"
                    description="Other venues that could work well for your event."
                  />
                )}
                {!filtersActive && (
                  <SectionHeading
                    title="Explore all venues"
                    description="Every active listing across Houston and Cypress."
                  />
                )}
                <div className="grid gap-8 sm:grid-cols-2 2xl:grid-cols-2">
                  {(filtersActive ? rest : exploreAll).map((restaurant, index) => (
                    <div
                      key={restaurant.id}
                      className="page-enter"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <RestaurantCard restaurant={restaurant} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="Nothing quite matches yet"
            description="Try loosening your vibe tags or group size — the Houston metro has steakhouses, BBQ halls, and event venues waiting."
          />
        )}
      </div>
    </div>
  );
}
