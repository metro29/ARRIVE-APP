import type { RestaurantStatus, SubscriptionStatus } from "@/types/restaurant-ops";
import type { CitySlug } from "@/types/geo";

export interface RestaurantWriteInput {
  name: string;
  description: string;
  location: string;
  cuisine_type: string;
  image_url: string;
  capacity: number;
  is_featured?: boolean;
  display_rank?: number;
  tags?: string[];
  price_level?: number;
  event_types?: string[];
  latitude?: number | null;
  longitude?: number | null;
  city: CitySlug;
  status?: RestaurantStatus;
  is_visible?: boolean;
  subscription_status?: SubscriptionStatus;
  owner_id?: string | null;
}

export type RestaurantUpdateInput = Partial<RestaurantWriteInput>;
