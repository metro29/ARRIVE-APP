import { createClient } from "@/lib/supabase/server";
import { cacheKey, getOrSetCache } from "@/lib/cache/memory-cache";
import { MESSAGES_CONTENT_COLUMN } from "@/lib/schema-contract";
import type { Booking, BookingWithRelations, Message } from "@/types";

const BOOKING_SELECT = `
  *,
  restaurant:restaurants (name, image_url, location)
`;

const BOOKING_CACHE_TTL_MS = 30_000;

function mapGuests(
  bookings: Booking[],
  profiles: { id: string; name: string }[]
): BookingWithRelations[] {
  const byId = new Map(profiles.map((p) => [p.id, p]));
  return bookings.map((b) => ({
    ...b,
    guest: byId.get(b.user_id) ?? { id: b.user_id, name: "Guest" },
  }));
}

async function loadBookings(filter: {
  column: "user_id" | "restaurant_id";
  value: string;
}) {
  const key = cacheKey(["bookings", filter.column, filter.value]);
  return getOrSetCache(
    key,
    async () => fetchBookings(filter),
    BOOKING_CACHE_TTL_MS
  );
}

async function fetchBookings(filter: {
  column: "user_id" | "restaurant_id";
  value: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq(filter.column, filter.value)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[data/bookings.loadBookings]", error.message);
    return [];
  }

  if (!data?.length) return [];

  const userIds = [...new Set(data.map((b) => b.user_id))];
  const { data: profiles } = await supabase
    .from("users_profile")
    .select("id, name")
    .in("id", userIds);

  const withGuests = mapGuests(data as Booking[], profiles ?? []);
  return attachLatestNotes(
    withGuests,
    filter.column === "user_id" ? filter.value : null
  );
}

export async function getOwnerRestaurant(ownerId: string) {
  const key = cacheKey(["owner-restaurant", ownerId]);
  return getOrSetCache(
    key,
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, name")
        .eq("owner_id", ownerId)
        .maybeSingle();

      if (error) {
        console.error("[data/bookings.getOwnerRestaurant]", error.message);
      }
      return data;
    },
    BOOKING_CACHE_TTL_MS
  );
}

export async function listUserBookings(userId: string) {
  return loadBookings({ column: "user_id", value: userId });
}

export async function listRestaurantBookings(restaurantId: string) {
  return loadBookings({ column: "restaurant_id", value: restaurantId });
}

export async function getBookingById(bookingId: string) {
  const key = cacheKey(["booking", bookingId]);
  return getOrSetCache(
    key,
    async () => fetchBookingById(bookingId),
    BOOKING_CACHE_TTL_MS
  );
}

async function fetchBookingById(bookingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[data/bookings.getBookingById]", error.message);
    return null;
  }

  const { data: profile } = await supabase
    .from("users_profile")
    .select("id, name")
    .eq("id", data.user_id)
    .single();

  const [enriched] = mapGuests([data as Booking], profile ? [profile] : []);
  const [withNote] = await attachLatestNotes([enriched], null);
  return withNote ?? null;
}

export async function listBookingMessages(bookingId: string) {
  const key = cacheKey(["messages", bookingId]);
  return getOrSetCache(
    key,
    async () => fetchBookingMessages(bookingId),
    BOOKING_CACHE_TTL_MS
  );
}

async function fetchBookingMessages(bookingId: string) {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("messages")
    .select(`id, booking_id, sender_id, ${MESSAGES_CONTENT_COLUMN}, created_at`)
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) {
    console.error("[data/bookings.listBookingMessages]", error.message);
    return [];
  }

  if (!messages?.length) return [];

  const senderIds = [...new Set(messages.map((m) => m.sender_id))];
  const { data: profiles } = await supabase
    .from("users_profile")
    .select("id, name")
    .in("id", senderIds);

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  return messages.map((row) => ({
    id: row.id,
    booking_id: row.booking_id,
    sender_id: row.sender_id,
    message: row[MESSAGES_CONTENT_COLUMN] as string,
    created_at: row.created_at,
    sender: byId.get(row.sender_id),
  })) as (Message & { sender?: { id: string; name: string } })[];
}

async function attachLatestNotes(
  bookings: BookingWithRelations[],
  currentUserId: string | null
) {
  if (!bookings.length) return bookings;

  const supabase = await createClient();
  const ids = bookings.map((b) => b.id);
  const { data: messages, error } = await supabase
    .from("messages")
    .select(`booking_id, ${MESSAGES_CONTENT_COLUMN}, sender_id, created_at`)
    .in("booking_id", ids)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[data/bookings.attachLatestNotes]", error.message);
    return bookings;
  }

  const latestByBooking = new Map<
    string,
    { message: string; sender_id: string }
  >();
  for (const msg of messages ?? []) {
    if (!latestByBooking.has(msg.booking_id)) {
      latestByBooking.set(msg.booking_id, {
        message: msg[MESSAGES_CONTENT_COLUMN] as string,
        sender_id: msg.sender_id,
      });
    }
  }

  return bookings.map((booking) => {
    const latest = latestByBooking.get(booking.id);
    if (!latest) return booking;

    const fromOther = currentUserId
      ? latest.sender_id !== currentUserId
      : latest.sender_id !== booking.user_id;

    return {
      ...booking,
      venue_note: fromOther ? latest.message : null,
    };
  });
}

export function countBookingsByStatus(
  bookings: Booking[],
  status: Booking["status"]
) {
  return bookings.filter((b) => b.status === status).length;
}

export async function countBookings(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[data/bookings.countBookings]", error.message);
    return 0;
  }

  return count ?? 0;
}
