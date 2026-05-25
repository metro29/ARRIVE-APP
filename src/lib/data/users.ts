import { createClient } from "@/lib/supabase/server";
import { normalizeCitySlug } from "@/lib/geo/cities";
import { cacheKey, getOrSetCache, invalidateCache } from "@/lib/cache/memory-cache";
import type { CitySlug } from "@/types/geo";
import type { UserProfile } from "@/types";

const PROFILE_SELECT = "id, name, role, preferred_city, created_at";

export async function getUserProfileById(
  userId: string
): Promise<UserProfile | null> {
  const key = cacheKey(["user", userId]);
  return getOrSetCache(key, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users_profile")
      .select(PROFILE_SELECT)
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("[data/users.getUserProfileById]", error.message);
      return null;
    }

    return data as UserProfile | null;
  });
}

export async function getSessionUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return getUserProfileById(user.id);
}

export async function countUserProfiles(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("users_profile")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[data/users.countUserProfiles]", error.message);
    return 0;
  }

  return count ?? 0;
}

/** Future onboarding — no UI in Phase 5 */
export async function updateUserPreferredCity(
  userId: string,
  city: CitySlug
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("users_profile")
    .update({ preferred_city: city })
    .eq("id", userId);

  if (error) {
    console.error("[data/users.updateUserPreferredCity]", error.message);
    return false;
  }

  invalidateCache(cacheKey(["user", userId]));
  return true;
}

export function getPreferredCitySlug(
  profile: UserProfile | null | undefined
): CitySlug | null {
  if (!profile?.preferred_city) return null;
  return normalizeCitySlug(profile.preferred_city);
}

export async function listRestaurantOwners(): Promise<
  Pick<UserProfile, "id" | "name">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users_profile")
    .select("id, name")
    .eq("role", "restaurant_owner")
    .order("name", { ascending: true })
    .limit(200);

  if (error) {
    console.error("[data/users.listRestaurantOwners]", error.message);
    return [];
  }

  return (data ?? []) as Pick<UserProfile, "id" | "name">[];
}
