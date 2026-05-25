import type {
  RestaurantStatus,
  SubscriptionStatus,
} from "@/types/restaurant-ops";

export type UserRole = "user" | "restaurant_owner" | "admin";

/** Must match public.booking_status enum values exactly */
export type BookingStatus = "pending" | "accepted" | "rejected";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  preferred_city?: string | null;
  created_at: string;
}

export interface Restaurant {
  id: string;
  owner_id: string | null;
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
  /** Partition key for multi-city scale (e.g. houston, cypress) */
  city?: string;
  status?: RestaurantStatus;
  is_visible?: boolean;
  subscription_status?: SubscriptionStatus;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  restaurant_id: string;
  event_type: string;
  guest_count: number;
  event_date: string;
  status: BookingStatus;
  created_at: string;
  restaurant?: Pick<Restaurant, "name" | "image_url" | "location">;
}

export interface BookingWithRelations extends Booking {
  guest?: Pick<UserProfile, "id" | "name">;
  /** Latest message preview from the other party */
  venue_note?: string | null;
}

export interface EventPackage {
  id: string;
  restaurant_id: string;
  title: string;
  description: string;
  price_per_person: number;
}

/** Matches public.messages.message */
export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface DiscoverRestaurant extends Restaurant {
  isMock?: boolean;
}

export const ROLE_HOME_PATH: Record<UserRole, string> = {
  user: "/dashboard",
  restaurant_owner: "/restaurant/dashboard",
  admin: "/admin/dashboard",
};
