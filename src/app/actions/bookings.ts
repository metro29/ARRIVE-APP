"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import {
  assertBookingAccess,
  assertRestaurantOwnsBooking,
} from "@/lib/booking-access";
import { BOOKING_STATUS } from "@/lib/booking-status";
import { getProfile, requireRole } from "@/lib/auth";
import { getOwnerRestaurant } from "@/lib/queries/bookings";
import { MESSAGES_CONTENT_COLUMN } from "@/lib/schema-contract";
import { createClient } from "@/lib/supabase/server";
import {
  getRestaurantByIdForBooking,
  isBookableRestaurant,
} from "@/lib/queries/restaurants";

export async function createBookingRequest(
  formData: FormData
): Promise<ActionResult> {
  const restaurantId = String(formData.get("restaurant_id") ?? "");
  const eventType = String(formData.get("event_type") ?? "private_dining");
  const guestCount = Number(formData.get("guest_count") ?? 1);
  const eventDate = String(formData.get("event_date") ?? "");

  if (!restaurantId || !eventDate) {
    return actionError("Restaurant and event date are required.");
  }

  const restaurant = await getRestaurantByIdForBooking(restaurantId);
  if (!restaurant) {
    return actionError("Restaurant not found.");
  }

  if (!isBookableRestaurant(restaurant)) {
    return actionError(
      "This venue is not currently accepting event requests."
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionError("You must be signed in to request an event.");
  }

  const { error } = await supabase.from("bookings").insert({
    user_id: user.id,
    restaurant_id: restaurantId,
    event_type: eventType,
    guest_count: guestCount,
    event_date: eventDate,
    status: BOOKING_STATUS.PENDING,
  });

  if (error) {
    return actionError(error.message);
  }

  revalidateBookingPaths();
  revalidatePath(`/restaurant/${restaurantId}`);
  return actionOk();
}

export async function respondToBooking(
  bookingId: string,
  status: typeof BOOKING_STATUS.ACCEPTED | typeof BOOKING_STATUS.REJECTED
): Promise<ActionResult> {
  await requireRole("restaurant_owner");
  const profile = await getProfile();
  if (!profile) return actionError("Unauthorized.");

  const access = await assertRestaurantOwnsBooking(bookingId, profile.id);
  if ("error" in access) return actionError(access.error);

  const { booking, restaurantId } = access;

  if (booking.status !== BOOKING_STATUS.PENDING) {
    return actionError("Only pending requests can be accepted or rejected.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .eq("restaurant_id", restaurantId)
    .eq("status", BOOKING_STATUS.PENDING)
    .select("id")
    .single();

  if (error) {
    return actionError(error.message);
  }

  if (!data) {
    return actionError("Booking update failed. It may have already been reviewed.");
  }

  revalidateBookingPaths(bookingId);
  return actionOk();
}

export async function sendBookingMessage(
  bookingId: string,
  messageText: string
): Promise<ActionResult> {
  const trimmed = messageText.trim();
  if (!trimmed) {
    return actionError("Message cannot be empty.");
  }

  const profile = await getProfile();
  if (!profile) {
    return actionError("You must be signed in.");
  }

  const access = await assertBookingAccess(bookingId, profile);
  if ("error" in access) return actionError(access.error);

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    booking_id: bookingId,
    sender_id: profile.id,
    [MESSAGES_CONTENT_COLUMN]: trimmed,
  });

  if (error) {
    return actionError(error.message);
  }

  revalidateBookingPaths(bookingId);
  return actionOk();
}

function revalidateBookingPaths(bookingId?: string) {
  revalidatePath("/bookings");
  revalidatePath("/dashboard");
  revalidatePath("/restaurant/bookings");
  revalidatePath("/restaurant/dashboard");
  revalidatePath("/admin/bookings");
  if (bookingId) {
    revalidatePath(`/bookings/${bookingId}`);
    revalidatePath(`/restaurant/bookings/${bookingId}`);
  }
}
