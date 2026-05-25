import type { CityDefinition, CitySlug } from "@/types/geo";
import { HOUSTON_METRO_CITIES } from "@/types/geo";

export const DEFAULT_CITY: CitySlug = "houston";

export const CITY_COOKIE_NAME = "arrive_active_city";

export const SUPPORTED_CITIES: Record<CitySlug, CityDefinition> = {
  houston: {
    slug: "houston",
    name: "Houston",
    region: "TX",
    center: { latitude: 29.7604, longitude: -95.3698 },
    timezone: "America/Chicago",
  },
  cypress: {
    slug: "cypress",
    name: "Cypress",
    region: "TX",
    center: { latitude: 29.9691, longitude: -95.6972 },
    timezone: "America/Chicago",
  },
  dallas: {
    slug: "dallas",
    name: "Dallas",
    region: "TX",
    center: { latitude: 32.7767, longitude: -96.797 },
    timezone: "America/Chicago",
  },
  nyc: {
    slug: "nyc",
    name: "New York City",
    region: "NY",
    center: { latitude: 40.7128, longitude: -74.006 },
    timezone: "America/New_York",
  },
  la: {
    slug: "la",
    name: "Los Angeles",
    region: "CA",
    center: { latitude: 34.0522, longitude: -118.2437 },
    timezone: "America/Los_Angeles",
  },
  miami: {
    slug: "miami",
    name: "Miami",
    region: "FL",
    center: { latitude: 25.7617, longitude: -80.1918 },
    timezone: "America/New_York",
  },
};

const SLUG_SET = new Set<string>(Object.keys(SUPPORTED_CITIES));

export function isCitySlug(value: string): value is CitySlug {
  return SLUG_SET.has(value);
}

export function normalizeCitySlug(value: string | null | undefined): CitySlug {
  if (!value) return DEFAULT_CITY;
  const normalized = value.toLowerCase().trim().replace(/\s+/g, "_");
  if (normalized === "new_york" || normalized === "new_york_city") return "nyc";
  if (normalized === "los_angeles") return "la";
  if (normalized === "houston_metro" || normalized === "greater_houston") {
    return "houston";
  }
  if (isCitySlug(normalized)) return normalized;
  return DEFAULT_CITY;
}

export function getCityDefinition(slug: CitySlug): CityDefinition {
  return SUPPORTED_CITIES[slug];
}

export function listSupportedCities(): CityDefinition[] {
  return Object.values(SUPPORTED_CITIES);
}

export function getMetroCitySlugs(primary: CitySlug): CitySlug[] {
  if (primary === "houston" || primary === "cypress") {
    return [...HOUSTON_METRO_CITIES];
  }
  return [primary];
}
