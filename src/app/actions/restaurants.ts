"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from "@/lib/data/restaurants";
import type { RestaurantUpdateInput, RestaurantWriteInput } from "@/lib/data/restaurant-input";
import type { RestaurantStatus, SubscriptionStatus } from "@/types/restaurant-ops";
import type { CitySlug } from "@/types/geo";
import { normalizeCitySlug } from "@/lib/geo/cities";

function revalidateRestaurantPaths(id?: string) {
  revalidatePath("/admin/restaurants");
  revalidatePath("/discover");
  revalidatePath("/plan");
  if (id) {
    revalidatePath(`/admin/restaurants/${id}/edit`);
    revalidatePath(`/restaurant/${id}`);
  }
}

function parseRestaurantForm(formData: FormData): RestaurantWriteInput {
  const tagsRaw = String(formData.get("tags") ?? "");
  const eventsRaw = String(formData.get("event_types") ?? "");

  const ownerRaw = String(formData.get("owner_id") ?? "").trim();

  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    cuisine_type: String(formData.get("cuisine_type") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim(),
    capacity: Number(formData.get("capacity") ?? 50),
    is_featured: formData.get("is_featured") === "on",
    display_rank: Number(formData.get("display_rank") ?? 0),
    tags: tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    price_level: Number(formData.get("price_level") ?? 2),
    event_types: eventsRaw
      ? eventsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    latitude: formData.get("latitude")
      ? Number(formData.get("latitude"))
      : null,
    longitude: formData.get("longitude")
      ? Number(formData.get("longitude"))
      : null,
    city: normalizeCitySlug(String(formData.get("city") ?? "houston")) as CitySlug,
    status: (String(formData.get("status") ?? "pending_onboarding") ||
      "pending_onboarding") as RestaurantStatus,
    is_visible: formData.get("is_visible") === "on",
    subscription_status: (String(
      formData.get("subscription_status") ?? "none"
    ) || "none") as SubscriptionStatus,
    owner_id: ownerRaw || null,
  };
}

export async function createRestaurantAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  await requireRole("admin");

  const input = parseRestaurantForm(formData);
  if (!input.name || !input.location) {
    return actionError("Name and location are required.");
  }

  const result = await createRestaurant(input);
  if (!result) {
    return actionError("Could not create restaurant. Check permissions and try again.");
  }

  revalidateRestaurantPaths(result.id);
  redirect(`/admin/restaurants/${result.id}/edit?created=1`);
}

export async function updateRestaurantAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("admin");

  const input = parseRestaurantForm(formData) as RestaurantUpdateInput;
  if (!input.name || !input.location) {
    return actionError("Name and location are required.");
  }

  const ok = await updateRestaurant(id, input);
  if (!ok) {
    return actionError("Could not update restaurant.");
  }

  revalidateRestaurantPaths(id);
  return actionOk();
}

export async function deleteRestaurantAction(id: string): Promise<void> {
  await requireRole("admin");

  const ok = await deleteRestaurant(id);
  if (!ok) {
    throw new Error("Could not delete restaurant. It may have active bookings.");
  }

  revalidateRestaurantPaths();
  redirect("/admin/restaurants");
}

export async function quickUpdateRestaurantAction(
  id: string,
  patch: RestaurantUpdateInput
): Promise<ActionResult> {
  await requireRole("admin");

  const ok = await updateRestaurant(id, patch);
  if (!ok) return actionError("Update failed.");

  revalidateRestaurantPaths(id);
  return actionOk();
}
