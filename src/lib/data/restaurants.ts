import { createClient } from "@/lib/supabase/server";
import { cacheKey, getOrSetCache, invalidateCache } from "@/lib/cache/memory-cache";
import { DEFAULT_CITY, getMetroCitySlugs, normalizeCitySlug } from "@/lib/geo/cities";
import { enrichRestaurant } from "@/lib/discover/restaurant-discovery";
import {
  buildPaginatedResult,
  MAX_ADMIN_PAGE_SIZE,
  MAX_DISCOVER_PAGE_SIZE,
  normalizePagination,
  type PaginatedResult,
  type RestaurantByIdQuery,
  type RestaurantListQuery,
} from "@/lib/data/types";
import type {
  RestaurantUpdateInput,
  RestaurantWriteInput,
} from "@/lib/data/restaurant-input";
import type { DiscoverRestaurant } from "@/types";
import type { CitySlug } from "@/types/geo";
import type { RestaurantStatus } from "@/types/restaurant-ops";
import type { RestaurantEnriched } from "@/types/restaurant";

const RESTAURANT_CACHE_TTL_MS = 60_000;
const ACTIVE_STATUS: RestaurantStatus = "active";

function invalidateRestaurantCaches(): void {
  invalidateCache("restaurants:");
  invalidateCache("restaurant:");
}

function withDefaults(
  restaurant: DiscoverRestaurant
): DiscoverRestaurant {
  return {
    ...restaurant,
    city: normalizeCitySlug(restaurant.city ?? DEFAULT_CITY),
    status: restaurant.status ?? "active",
    is_visible: restaurant.is_visible ?? true,
    subscription_status: restaurant.subscription_status ?? "none",
  };
}


export async function getActiveRestaurants(
  query: RestaurantListQuery
): Promise<PaginatedResult<RestaurantEnriched>> {
  const citySlug = query.citySlug;
  const pagination = normalizePagination(query, {
    limit: MAX_DISCOVER_PAGE_SIZE,
    maxLimit: MAX_DISCOVER_PAGE_SIZE,
  });

  const key = cacheKey([
    "restaurants",
    "active",
    citySlug,
    pagination.limit,
    pagination.offset,
  ]);

  return getOrSetCache(
    key,
    async () => fetchActivePaginated(citySlug, pagination),
    RESTAURANT_CACHE_TTL_MS
  );
}

async function fetchActivePaginated(
  citySlug: CitySlug,
  pagination: { limit: number; offset: number }
): Promise<PaginatedResult<RestaurantEnriched>> {
  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("restaurants")
    .select("*", { count: "exact" })
    .eq("city", citySlug)
    .eq("status", ACTIVE_STATUS)
    .eq("is_visible", true)
    .order("is_featured", { ascending: false })
    .order("display_rank", { ascending: true })
    .order("created_at", { ascending: false })
    .range(pagination.offset, pagination.offset + pagination.limit - 1);

  if (error) {
    console.error("[data/restaurants.getActiveRestaurants]", error.message);
    return buildPaginatedResult([], 0, pagination);
  }

  const rows = (data ?? []).map((r) =>
    enrichRestaurant(withDefaults(r as DiscoverRestaurant))
  );
  return buildPaginatedResult(rows, count ?? rows.length, pagination);
}

/** Houston metro discover — active venues across Houston + Cypress */
export async function getActiveRestaurantsForMetro(
  primaryCity: CitySlug = DEFAULT_CITY
): Promise<RestaurantEnriched[]> {
  const cities = getMetroCitySlugs(primaryCity);
  const perCity = Math.ceil(MAX_DISCOVER_PAGE_SIZE / cities.length);
  const batches = await Promise.all(
    cities.map((citySlug) =>
      getActiveRestaurants({ citySlug, limit: perCity, offset: 0 })
    )
  );
  const merged = batches.flatMap((b) => b.items);
  const seen = new Set<string>();
  return merged.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

export async function getRestaurantsByCity(
  citySlug: CitySlug,
  params?: Partial<{ limit: number; offset: number; activeOnly: boolean }>
): Promise<PaginatedResult<RestaurantEnriched>> {
  if (params?.activeOnly !== false) {
    return getActiveRestaurants({ citySlug, ...params });
  }
  return listRestaurants({ citySlug, ...params });
}

/** @deprecated Prefer getActiveRestaurants — includes inactive for admin tooling */
export async function listRestaurants(
  query: RestaurantListQuery
): Promise<PaginatedResult<RestaurantEnriched>> {
  const citySlug = query.citySlug;
  const pagination = normalizePagination(query, {
    limit: MAX_DISCOVER_PAGE_SIZE,
    maxLimit: MAX_DISCOVER_PAGE_SIZE,
  });

  const key = cacheKey([
    "restaurants",
    "all",
    citySlug,
    pagination.limit,
    pagination.offset,
  ]);

  return getOrSetCache(
    key,
    async () => {
      const supabase = await createClient();
      const { data, error, count } = await supabase
        .from("restaurants")
        .select("*", { count: "exact" })
        .eq("city", citySlug)
        .order("created_at", { ascending: false })
        .range(pagination.offset, pagination.offset + pagination.limit - 1);

      if (error) {
        console.error("[data/restaurants.listRestaurants]", error.message);
        return buildPaginatedResult([], 0, pagination);
      }

      const rows = (data ?? []).map((r) =>
        enrichRestaurant(withDefaults(r as DiscoverRestaurant))
      );
      return buildPaginatedResult(rows, count ?? rows.length, pagination);
    },
    RESTAURANT_CACHE_TTL_MS
  );
}

export async function listRestaurantsForDiscover(
  citySlug: CitySlug
): Promise<RestaurantEnriched[]> {
  return getActiveRestaurantsForMetro(citySlug);
}

export async function getRestaurantById(
  query: RestaurantByIdQuery & { includeInactive?: boolean }
): Promise<RestaurantEnriched | null> {
  const key = cacheKey([
    "restaurant",
    query.id,
    query.citySlug ?? "",
    query.includeInactive ? "all" : "active",
  ]);
  return getOrSetCache(
    key,
    async () => fetchRestaurantById(query),
    RESTAURANT_CACHE_TTL_MS
  );
}

async function fetchRestaurantById(
  query: RestaurantByIdQuery & { includeInactive?: boolean }
): Promise<RestaurantEnriched | null> {
  const supabase = await createClient();
  let builder = supabase.from("restaurants").select("*").eq("id", query.id);

  if (query.citySlug) {
    builder = builder.eq("city", query.citySlug);
  }
  if (!query.includeInactive) {
    builder = builder.eq("status", ACTIVE_STATUS).eq("is_visible", true);
  }

  const { data, error } = await builder.maybeSingle();

  if (error) {
    console.error("[data/restaurants.getRestaurantById]", error.message);
    return null;
  }

  if (!data) return null;

  const row = withDefaults(data as DiscoverRestaurant);
  if (query.citySlug && normalizeCitySlug(row.city) !== query.citySlug) {
    return null;
  }
  return enrichRestaurant(row);
}

export async function getRestaurantByIdAdmin(
  id: string
): Promise<RestaurantEnriched | null> {
  return getRestaurantById({ id, includeInactive: true });
}

export async function getAllRestaurantsAdmin(
  params?: Partial<{ limit: number; offset: number; city?: CitySlug }>
): Promise<PaginatedResult<RestaurantEnriched>> {
  return listAllRestaurantsAdmin(params);
}

export async function listAllRestaurantsAdmin(
  params?: Partial<{ limit: number; offset: number; city?: CitySlug }>
): Promise<PaginatedResult<RestaurantEnriched>> {
  const pagination = normalizePagination(params, {
    limit: MAX_ADMIN_PAGE_SIZE,
    maxLimit: MAX_ADMIN_PAGE_SIZE,
  });

  const key = cacheKey([
    "restaurants",
    "admin",
    params?.city ?? "all",
    pagination.limit,
    pagination.offset,
  ]);

  return getOrSetCache(
    key,
    async () => {
      const supabase = await createClient();
      let builder = supabase
        .from("restaurants")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(pagination.offset, pagination.offset + pagination.limit - 1);

      if (params?.city) {
        builder = builder.eq("city", params.city);
      }

      const { data, error, count } = await builder;

      if (error) {
        console.error(
          "[data/restaurants.listAllRestaurantsAdmin]",
          error.message
        );
        return buildPaginatedResult([], 0, pagination);
      }

      const rows = (data ?? []).map((r) =>
        enrichRestaurant(withDefaults(r as DiscoverRestaurant))
      );
      return buildPaginatedResult(rows, count ?? rows.length, pagination);
    },
    RESTAURANT_CACHE_TTL_MS
  );
}

function toDbRow(input: RestaurantWriteInput | RestaurantUpdateInput) {
  return {
    name: input.name,
    description: input.description,
    location: input.location,
    cuisine_type: input.cuisine_type,
    image_url: input.image_url,
    capacity: input.capacity,
    is_featured: input.is_featured,
    display_rank: input.display_rank,
    tags: input.tags,
    price_level: input.price_level,
    event_types: input.event_types,
    latitude: input.latitude,
    longitude: input.longitude,
    city: input.city ? normalizeCitySlug(input.city) : undefined,
    status: input.status,
    is_visible: input.is_visible,
    subscription_status: input.subscription_status,
    owner_id: input.owner_id,
  };
}

export async function createRestaurant(
  input: RestaurantWriteInput
): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const row = {
    ...toDbRow({
      ...input,
      status: input.status ?? "pending_onboarding",
      is_visible: input.is_visible ?? false,
      subscription_status: input.subscription_status ?? "none",
      is_featured: input.is_featured ?? false,
      display_rank: input.display_rank ?? 0,
      tags: input.tags ?? [],
      price_level: input.price_level ?? 2,
      event_types: input.event_types ?? [],
    }),
    owner_id: input.owner_id ?? null,
  };

  const { data, error } = await supabase
    .from("restaurants")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("[data/restaurants.createRestaurant]", error.message);
    return null;
  }

  invalidateRestaurantCaches();
  return { id: data.id };
}

export async function updateRestaurant(
  id: string,
  input: RestaurantUpdateInput
): Promise<boolean> {
  const supabase = await createClient();
  const patch = toDbRow(input);
  Object.keys(patch).forEach((k) => {
    if (patch[k as keyof typeof patch] === undefined) {
      delete patch[k as keyof typeof patch];
    }
  });

  const { error } = await supabase
    .from("restaurants")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error("[data/restaurants.updateRestaurant]", error.message);
    return false;
  }

  invalidateRestaurantCaches();
  return true;
}

export async function deleteRestaurant(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("restaurants").delete().eq("id", id);

  if (error) {
    console.error("[data/restaurants.deleteRestaurant]", error.message);
    return false;
  }

  invalidateRestaurantCaches();
  return true;
}

export async function countRestaurants(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("restaurants")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[data/restaurants.countRestaurants]", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function countActiveRestaurants(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("restaurants")
    .select("*", { count: "exact", head: true })
    .eq("status", ACTIVE_STATUS)
    .eq("is_visible", true);

  if (error) {
    console.error("[data/restaurants.countActiveRestaurants]", error.message);
    return 0;
  }

  return count ?? 0;
}

export function isMockRestaurant(restaurant: DiscoverRestaurant): boolean {
  return Boolean(restaurant.isMock);
}

export function isBookableRestaurant(
  restaurant: Pick<DiscoverRestaurant, "status" | "is_visible" | "isMock">
): boolean {
  if (restaurant.isMock) return false;
  return (
    (restaurant.status ?? "active") === "active" &&
    restaurant.is_visible !== false
  );
}
