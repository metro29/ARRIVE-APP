/** Canonical city slugs for partitioning and context */
export type CitySlug =
  | "houston"
  | "cypress"
  | "dallas"
  | "nyc"
  | "la"
  | "miami";

/** Cities shown together on Houston metro discover */
export const HOUSTON_METRO_CITIES: CitySlug[] = ["houston", "cypress"];

export interface CityDefinition {
  slug: CitySlug;
  name: string;
  region: string;
  /** Reference point for proximity / radius (future) */
  center: { latitude: number; longitude: number };
  timezone: string;
}

export interface CityContext {
  city: CitySlug;
  source: "session" | "preference" | "default" | "location";
}
