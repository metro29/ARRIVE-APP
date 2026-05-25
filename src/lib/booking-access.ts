import { getOwnerRestaurant } from "@/lib/queries/bookings";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";

type BookingRow = {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: string;
};

export async function assertBookingAccess(
  bookingId: string,
  profile: Pick<UserProfile, "id" | "role">
): Promise<{ booking: BookingRow } | { error: string }> {
  const supabase = await createClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, user_id, restaurant_id, status")
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !booking) {
    return { error: "Booking not found." };
  }

  const restaurant = await getOwnerRestaurant(profile.id);
  const ownerRestaurantId =
    profile.role === "restaurant_owner" ? restaurant?.id : null;

  if (canAccessBooking(booking, profile, ownerRestaurantId)) {
    return { booking };
  }

  return { error: "You do not have access to this booking." };
}

export function canAccessBooking(
  booking: Pick<BookingRow, "user_id" | "restaurant_id">,
  profile: Pick<UserProfile, "id" | "role">,
  ownerRestaurantId?: string | null
): boolean {
  if (profile.role === "admin") return true;
  if (profile.role === "user") return booking.user_id === profile.id;
  if (profile.role === "restaurant_owner") {
    return Boolean(
      ownerRestaurantId && booking.restaurant_id === ownerRestaurantId
    );
  }
  return false;
}

export async function assertRestaurantOwnsBooking(
  bookingId: string,
  ownerId: string
): Promise<{ booking: BookingRow; restaurantId: string } | { error: string }> {
  const restaurant = await getOwnerRestaurant(ownerId);
  if (!restaurant) {
    return { error: "No venue linked to your account." };
  }

  const supabase = await createClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, user_id, restaurant_id, status")
    .eq("id", bookingId)
    .eq("restaurant_id", restaurant.id)
    .maybeSingle();

  if (error || !booking) {
    return {
      error: "Booking not found or does not belong to your restaurant.",
    };
  }

  return { booking, restaurantId: restaurant.id };
}
