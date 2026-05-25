import { cookies } from "next/headers";
import {
  CITY_COOKIE_NAME,
  DEFAULT_CITY,
  listSupportedCities,
  isCitySlug,
  normalizeCitySlug,
} from "@/lib/geo/cities";
import { calculateDistanceKm } from "@/lib/geo/radius";
import { getSessionUserProfile } from "@/lib/data/users";
import type { CityContext, CitySlug } from "@/types/geo";

/**
 * Read session city override from cookie (server-only).
 */
export async function getActiveCity(): Promise<CitySlug | null> {
  const jar = await cookies();
  const raw = jar.get(CITY_COOKIE_NAME)?.value;
  if (!raw || !isCitySlug(raw)) return null;
  return raw;
}

/**
 * Persist session city override (server actions / route handlers).
 */
export async function setActiveCity(city: CitySlug): Promise<void> {
  const jar = await cookies();
  jar.set(CITY_COOKIE_NAME, city, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export async function clearActiveCity(): Promise<void> {
  const jar = await cookies();
  jar.delete(CITY_COOKIE_NAME);
}

/**
 * Mock geolocation → nearest supported city by center distance.
 */
export function resolveCityFromUserLocation(
  latitude: number,
  longitude: number
): CitySlug {
  let nearest: CitySlug = DEFAULT_CITY;
  let minDist = Infinity;

  for (const def of listSupportedCities()) {
    const d = calculateDistanceKm({ latitude, longitude }, def.center);
    if (d < minDist) {
      minDist = d;
      nearest = def.slug;
    }
  }

  return nearest;
}

/**
 * Resolve effective city for the current request:
 * session cookie → user preferred_city → default.
 */
export async function resolveCityContextForRequest(): Promise<CityContext> {
  const sessionCity = await getActiveCity();
  if (sessionCity) {
    return { city: sessionCity, source: "session" };
  }

  const profile = await getSessionUserProfile();
  if (profile?.preferred_city) {
    return {
      city: normalizeCitySlug(profile.preferred_city),
      source: "preference",
    };
  }

  return { city: DEFAULT_CITY, source: "default" };
}

export function resolveCityForProfile(
  preferredCity: string | null | undefined,
  sessionCity: CitySlug | null = null
): CityContext {
  if (sessionCity) {
    return { city: sessionCity, source: "session" };
  }
  if (preferredCity) {
    return {
      city: normalizeCitySlug(preferredCity),
      source: "preference",
    };
  }
  return { city: DEFAULT_CITY, source: "default" };
}
