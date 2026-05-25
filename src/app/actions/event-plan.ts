"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { sendBookingMessage } from "@/app/actions/bookings";
import { validateEventPlan } from "@/lib/ai/parse-event-plan";
import { BOOKING_STATUS } from "@/lib/booking-status";
import {
  getRestaurantByIdForBooking,
  isBookableRestaurant,
} from "@/lib/queries/restaurants";
import { createClient } from "@/lib/supabase/server";
import type { EventDraft } from "@/types/event-plan";

export type ConfirmDraftResult = ActionResult<{ bookingId: string }>;

export async function confirmEventDraft(
  draft: EventDraft
): Promise<ConfirmDraftResult> {
  if (!draft.restaurantId || !draft.eventDate) {
    return actionError("Restaurant and event date are required.");
  }

  const plan = validateEventPlan(draft.plan);
  const guestCount = Math.min(
    500,
    Math.max(1, Math.round(draft.guestCount) || plan.guest_count)
  );

  const restaurant = await getRestaurantByIdForBooking(draft.restaurantId);
  if (!restaurant) {
    return actionError("Restaurant not found.");
  }

  if (!isBookableRestaurant(restaurant)) {
    return actionError("This venue is not currently accepting event requests.");
  }

  if (guestCount > restaurant.capacity) {
    return actionError(
      `This venue supports up to ${restaurant.capacity} guests. Adjust your group size.`
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionError("You must be signed in to confirm your event.");
  }

  const eventType = String(draft.eventType || plan.event_type).replace(/\s+/g, "_");

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      restaurant_id: draft.restaurantId,
      event_type: eventType,
      guest_count: guestCount,
      event_date: draft.eventDate,
      status: BOOKING_STATUS.PENDING,
    })
    .select("id")
    .single();

  if (error) {
    return actionError(error.message);
  }

  const message = draft.venueMessage?.trim();
  if (message && booking?.id) {
    await sendBookingMessage(booking.id, message);
  }

  revalidatePath("/bookings");
  revalidatePath("/dashboard");
  revalidatePath("/plan");
  revalidatePath(`/bookings/${booking.id}`);
  revalidatePath(`/restaurant/${draft.restaurantId}`);

  return actionOk({ bookingId: booking.id });
}
