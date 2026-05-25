"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import {
  createRestaurantAction,
  updateRestaurantAction,
} from "@/app/actions/restaurants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RestaurantEnriched } from "@/types/restaurant";
import {
  RESTAURANT_STATUS_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  type RestaurantStatus,
  type SubscriptionStatus,
} from "@/types/restaurant-ops";
import type { CitySlug } from "@/types/geo";

const TAG_OPTIONS = [
  "luxury",
  "romantic",
  "loud",
  "casual",
  "corporate",
  "nightlife",
  "family-friendly",
  "private-dining-focused",
] as const;

const EVENT_OPTIONS = [
  "birthday",
  "corporate",
  "party",
  "date_night",
  "dinner",
] as const;

interface OwnerOption {
  id: string;
  name: string;
}

interface RestaurantFormProps {
  mode: "create" | "edit";
  restaurant?: RestaurantEnriched;
  owners: OwnerOption[];
}

export function RestaurantForm({
  mode,
  restaurant,
  owners,
}: RestaurantFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      if (mode !== "edit" || !restaurant) return null;
      const result = await updateRestaurantAction(restaurant.id, formData);
      if (!result.success) {
        return { error: result.error };
      }
      return { error: undefined, saved: true };
    },
    null
  );

  const createAction = mode === "create" ? createRestaurantAction : undefined;

  const defaultTags = restaurant?.tags?.join(", ") ?? "";
  const defaultEvents = restaurant?.event_types?.join(", ") ?? "";

  return (
    <form
      action={createAction ?? formAction}
      className="space-y-8"
    >
      {state?.error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state && "saved" in state && state.saved && (
        <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-foreground">
          Changes saved.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Venue name</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={restaurant?.name}
            placeholder="Killen's Steakhouse"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={restaurant?.description}
            placeholder="What makes this venue great for events?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            required
            defaultValue={restaurant?.location}
            placeholder="Uptown, Houston"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cuisine_type">Cuisine</Label>
          <Input
            id="cuisine_type"
            name="cuisine_type"
            required
            defaultValue={restaurant?.cuisine_type}
            placeholder="Steakhouse"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Market</Label>
          <select
            id="city"
            name="city"
            defaultValue={restaurant?.city ?? "houston"}
            className="h-10 w-full rounded-xl border border-input/80 bg-background px-3.5 text-sm"
          >
            <option value="houston">Houston</option>
            <option value="cypress">Cypress</option>
            <option value="dallas">Dallas</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={20}
            max={500}
            required
            defaultValue={restaurant?.capacity ?? 80}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price_level">Price level (1–4)</Label>
          <Input
            id="price_level"
            name="price_level"
            type="number"
            min={1}
            max={4}
            defaultValue={restaurant?.price_level ?? 2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_rank">Display rank</Label>
          <Input
            id="display_rank"
            name="display_rank"
            type="number"
            min={0}
            defaultValue={restaurant?.display_rank ?? 0}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            name="image_url"
            type="url"
            defaultValue={restaurant?.image_url}
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            defaultValue={restaurant?.latitude ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            defaultValue={restaurant?.longitude ?? ""}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="tags">Vibe tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            defaultValue={defaultTags}
            placeholder={TAG_OPTIONS.join(", ")}
          />
          <p className="text-xs text-muted-foreground">
            Options: {TAG_OPTIONS.join(", ")}
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="event_types">Event types (comma-separated)</Label>
          <Input
            id="event_types"
            name="event_types"
            defaultValue={defaultEvents}
            placeholder={EVENT_OPTIONS.join(", ")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Listing status</Label>
          <select
            id="status"
            name="status"
            defaultValue={restaurant?.status ?? "pending_onboarding"}
            className="h-10 w-full rounded-xl border border-input/80 bg-background px-3.5 text-sm"
          >
            {(Object.keys(RESTAURANT_STATUS_LABELS) as RestaurantStatus[]).map(
              (s) => (
                <option key={s} value={s}>
                  {RESTAURANT_STATUS_LABELS[s]}
                </option>
              )
            )}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscription_status">Subscription</Label>
          <select
            id="subscription_status"
            name="subscription_status"
            defaultValue={restaurant?.subscription_status ?? "none"}
            className="h-10 w-full rounded-xl border border-input/80 bg-background px-3.5 text-sm"
          >
            {(
              Object.keys(SUBSCRIPTION_STATUS_LABELS) as SubscriptionStatus[]
            ).map((s) => (
              <option key={s} value={s}>
                {SUBSCRIPTION_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="owner_id">Restaurant owner (optional)</Label>
          <select
            id="owner_id"
            name="owner_id"
            defaultValue={restaurant?.owner_id ?? ""}
            className="h-10 w-full rounded-xl border border-input/80 bg-background px-3.5 text-sm"
          >
            <option value="">Unassigned — admin-managed</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={restaurant?.is_featured}
              className="rounded border-input"
            />
            Featured on discover
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_visible"
              defaultChecked={restaurant?.is_visible ?? false}
              className="rounded border-input"
            />
            Visible listing
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Add restaurant" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
