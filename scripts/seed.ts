/**
 * Phase 2 seed script — populates Dallas restaurant dataset via Supabase service role.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed.ts
 *
 * Requires at least one restaurant_owner in users_profile (or set SEED_OWNER_ID).
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SEED_OWNER_ID = process.env.SEED_OWNER_ID;

interface SeedRestaurant {
  name: string;
  description: string;
  location: string;
  cuisine_type: string;
  image_url: string;
  capacity: number;
  is_featured: boolean;
  display_rank: number;
  tags: string[];
  price_level: number;
  event_types: string[];
  latitude: number;
  longitude: number;
}

const DALLAS_RESTAURANTS: SeedRestaurant[] = [
  {
    name: "Pappas Bros. Steakhouse",
    description:
      "Dallas institution for premium steaks, private dining rooms, and white-glove service for executive dinners and milestone celebrations.",
    location: "Uptown Dallas, TX",
    cuisine_type: "Steakhouse",
    image_url:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    capacity: 120,
    is_featured: true,
    display_rank: 1,
    tags: ["luxury", "corporate", "private-dining-focused"],
    price_level: 4,
    event_types: ["corporate", "dinner", "birthday"],
    latitude: 32.8024,
    longitude: -96.8001,
  },
  {
    name: "The Woolworth",
    description:
      "Historic downtown venue blending craft cocktails, shareable plates, and a lively atmosphere ideal for after-work parties and social gatherings.",
    location: "Downtown Dallas, TX",
    cuisine_type: "American",
    image_url:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
    capacity: 150,
    is_featured: true,
    display_rank: 2,
    tags: ["nightlife", "loud", "casual"],
    price_level: 3,
    event_types: ["party", "birthday", "dinner"],
    latitude: 32.7808,
    longitude: -96.7974,
  },
  {
    name: "Rodeo Goat",
    description:
      "Award-winning burgers and craft beer in a relaxed Deep Ellum setting — perfect for casual group birthdays and team outings.",
    location: "Deep Ellum, Dallas, TX",
    cuisine_type: "American",
    image_url:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    capacity: 80,
    is_featured: false,
    display_rank: 10,
    tags: ["casual", "loud", "family-friendly"],
    price_level: 2,
    event_types: ["birthday", "party", "dinner"],
    latitude: 32.7845,
    longitude: -96.7812,
  },
  {
    name: "Al Biernat's",
    description:
      "Upscale steakhouse known for prime cuts, extensive wine list, and semi-private dining for client entertainment and special occasions.",
    location: "Oak Lawn, Dallas, TX",
    cuisine_type: "Steakhouse",
    image_url:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
    capacity: 100,
    is_featured: false,
    display_rank: 5,
    tags: ["luxury", "private-dining-focused", "corporate"],
    price_level: 4,
    event_types: ["corporate", "date_night", "dinner"],
    latitude: 32.8131,
    longitude: -96.8107,
  },
  {
    name: "Haywire",
    description:
      "Texas ranch-inspired dining with wood-fired fare, whiskey program, and flexible layouts for corporate lunches and large group dinners.",
    location: "Uptown Dallas, TX",
    cuisine_type: "American",
    image_url:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    capacity: 140,
    is_featured: false,
    display_rank: 6,
    tags: ["casual", "corporate", "family-friendly"],
    price_level: 3,
    event_types: ["corporate", "dinner", "party"],
    latitude: 32.8012,
    longitude: -96.7998,
  },
  {
    name: "YO Ranch Steakhouse",
    description:
      "Western-themed steakhouse with private rooms and event packages tailored for corporate retreats and celebration dinners.",
    location: "Downtown Dallas, TX",
    cuisine_type: "Steakhouse",
    image_url:
      "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    capacity: 90,
    is_featured: false,
    display_rank: 7,
    tags: ["corporate", "private-dining-focused", "casual"],
    price_level: 3,
    event_types: ["corporate", "birthday", "dinner"],
    latitude: 32.7791,
    longitude: -96.7995,
  },
  {
    name: "Celebration Restaurant",
    description:
      "Beloved Dallas spot for homestyle Southern cooking, generous portions, and family-friendly group dining at approachable prices.",
    location: "Preston Hollow, Dallas, TX",
    cuisine_type: "Southern",
    image_url:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    capacity: 110,
    is_featured: false,
    display_rank: 8,
    tags: ["family-friendly", "casual"],
    price_level: 2,
    event_types: ["birthday", "dinner", "party"],
    latitude: 32.8654,
    longitude: -96.7978,
  },
  {
    name: "Meso Maya",
    description:
      "Modern Mexican cuisine with vibrant flavors, tequila bar, and semi-private spaces for festive birthdays and team celebrations.",
    location: "Uptown Dallas, TX",
    cuisine_type: "Tex-Mex",
    image_url:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    capacity: 95,
    is_featured: false,
    display_rank: 9,
    tags: ["casual", "loud", "family-friendly"],
    price_level: 2,
    event_types: ["birthday", "party", "dinner"],
    latitude: 32.8038,
    longitude: -96.8015,
  },
  {
    name: "Catch Dallas",
    description:
      "Upscale seafood and sushi destination with rooftop energy, ideal for date nights, client dinners, and upscale social events.",
    location: "Uptown Dallas, TX",
    cuisine_type: "Seafood",
    image_url:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    capacity: 130,
    is_featured: false,
    display_rank: 4,
    tags: ["luxury", "nightlife", "romantic"],
    price_level: 4,
    event_types: ["date_night", "corporate", "party"],
    latitude: 32.8045,
    longitude: -96.8022,
  },
  {
    name: "Sixty Vines",
    description:
      "Wine-on-tap concept with shareable plates and a convivial patio — a go-to for date nights and intimate group gatherings.",
    location: "Plano, TX (Dallas area)",
    cuisine_type: "Wine Bar",
    image_url:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2724f3?w=800&q=80",
    capacity: 70,
    is_featured: false,
    display_rank: 11,
    tags: ["romantic", "casual"],
    price_level: 3,
    event_types: ["date_night", "dinner", "birthday"],
    latitude: 33.0198,
    longitude: -96.6989,
  },
  {
    name: "Elm & Good",
    description:
      "Hotel restaurant with polished service, seasonal menus, and dedicated event coordination for corporate meetings and executive dinners.",
    location: "Deep Ellum, Dallas, TX",
    cuisine_type: "Contemporary",
    image_url:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    capacity: 85,
    is_featured: false,
    display_rank: 12,
    tags: ["corporate", "luxury", "private-dining-focused"],
    price_level: 4,
    event_types: ["corporate", "dinner", "date_night"],
    latitude: 32.7856,
    longitude: -96.7825,
  },
  {
    name: "Nick & Sam's",
    description:
      "Iconic Dallas steakhouse for power lunches, VIP celebrations, and private dining with an unmatched luxury atmosphere.",
    location: "Uptown Dallas, TX",
    cuisine_type: "Steakhouse",
    image_url:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    capacity: 100,
    is_featured: true,
    display_rank: 3,
    tags: ["luxury", "private-dining-focused", "corporate"],
    price_level: 4,
    event_types: ["corporate", "birthday", "dinner"],
    latitude: 32.8051,
    longitude: -96.8033,
  },
  {
    name: "Mirador",
    description:
      "Rooftop pool club and restaurant with skyline views — designed for upscale parties, launch events, and nightlife experiences.",
    location: "Downtown Dallas, TX",
    cuisine_type: "Contemporary",
    image_url:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
    capacity: 200,
    is_featured: false,
    display_rank: 13,
    tags: ["nightlife", "luxury", "loud"],
    price_level: 4,
    event_types: ["party", "corporate", "birthday"],
    latitude: 32.7815,
    longitude: -96.7968,
  },
  {
    name: "FT33",
    description:
      "Chef-driven contemporary American with tasting menus and private dining for discerning groups seeking a fine-dining experience.",
    location: "Design District, Dallas, TX",
    cuisine_type: "Contemporary",
    image_url:
      "https://images.unsplash.com/photo-1424844516934-089a0b86baab?w=800&q=80",
    capacity: 45,
    is_featured: false,
    display_rank: 14,
    tags: ["luxury", "romantic", "private-dining-focused"],
    price_level: 4,
    event_types: ["date_night", "dinner", "corporate"],
    latitude: 32.7978,
    longitude: -96.8234,
  },
  {
    name: "The Statler Dallas",
    description:
      "Historic hotel with multiple event venues, ballrooms, and on-site catering for large corporate conferences and galas.",
    location: "Downtown Dallas, TX",
    cuisine_type: "American",
    image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    capacity: 350,
    is_featured: false,
    display_rank: 15,
    tags: ["corporate", "luxury", "private-dining-focused"],
    price_level: 4,
    event_types: ["corporate", "party", "birthday"],
    latitude: 32.7802,
    longitude: -96.7988,
  },
];

async function resolveOwnerId(
  supabase: ReturnType<typeof createClient>
): Promise<string> {
  if (SEED_OWNER_ID) return SEED_OWNER_ID;

  const { data, error } = await supabase
    .from("users_profile")
    .select("id")
    .eq("role", "restaurant_owner")
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Failed to resolve owner: ${error.message}`);
  if (!data?.id) {
    throw new Error(
      "No restaurant_owner found. Sign up as a restaurant owner or set SEED_OWNER_ID."
    );
  }
  return data.id;
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const ownerId = await resolveOwnerId(supabase);
  const names = DALLAS_RESTAURANTS.map((r) => r.name);

  await supabase.from("restaurants").delete().eq("owner_id", ownerId).in("name", names);

  const rows = DALLAS_RESTAURANTS.map((r) => ({
    owner_id: ownerId,
    ...r,
  }));

  const { error } = await supabase.from("restaurants").insert(rows);
  if (error) throw new Error(`Seed insert failed: ${error.message}`);

  console.log(`Seeded ${rows.length} Dallas restaurants for owner ${ownerId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
