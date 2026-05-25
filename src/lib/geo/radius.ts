import { getCityDefinition } from "@/lib/geo/cities";
import type { CitySlug } from "@/types/geo";

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface RadiusFilterOptions<T extends GeoPoint> {
  center: GeoPoint;
  radiusKm: number;
  /** Include items without coordinates (default true for backward compatibility) */
  includeMissingCoords?: boolean;
}

/**
 * Haversine distance in kilometers — utility-ready for proximity ranking.
 */
export function calculateDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Filter points within radius of a center. Structure ready for "near me" flows.
 */
export function filterByRadius<T extends GeoPoint>(
  items: T[],
  options: RadiusFilterOptions<T>
): T[] {
  const { center, radiusKm, includeMissingCoords = true } = options;
  return items.filter((item) => {
    if (item.latitude == null || item.longitude == null) {
      return includeMissingCoords;
    }
    return (
      calculateDistanceKm(center, {
        latitude: item.latitude,
        longitude: item.longitude,
      }) <= radiusKm
    );
  });
}

/** Resolve search center from city slug (used by discovery radius filter). */
export function getCityCenter(slug: CitySlug): GeoPoint {
  const def = getCityDefinition(slug);
  return def.center;
}
