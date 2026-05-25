/**
 * Generates supabase/seed_houston_cypress.sql (~100 Houston metro venues).
 * Run: node scripts/generate-houston-seed.mjs
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "supabase", "seed_houston_cypress.sql");

const IMG = {
  steak: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
  bbq: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
  texmex: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
  seafood: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
  american: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  bar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
  rooftop: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
  banquet: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  burger: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
  family: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  wine: "https://images.unsplash.com/photo-1510812431401-41d2bd2724f3?w=800&q=80",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
};

function esc(s) {
  return String(s).replace(/'/g, "''");
}

function sqlArray(arr) {
  if (!arr.length) return "array[]::text[]";
  return `array[${arr.map((x) => `'${esc(x)}'`).join(", ")}]`;
}

/** @type {Array<Record<string, unknown>>} */
const HOUSTON = [
  // FINE DINING / UPSCALE (steak, seafood, modern)
  { name: "Killen's Steakhouse", desc: "Wood-fired steaks and Gulf seafood in Pearland—power lunches and celebration dinners with private dining coordination.", loc: "Pearland, Houston metro", cuisine: "Steakhouse", cap: 140, tags: ["luxury", "corporate", "private-dining-focused"], price: 4, events: ["corporate", "dinner", "birthday"], lat: 29.554, lng: -95.392, img: IMG.steak, feat: true, rank: 1 },
  { name: "Pappas Bros. Steakhouse", desc: "Houston's benchmark for dry-aged beef, extensive wine, and boardroom-ready private rooms downtown.", loc: "Galleria / Uptown, Houston", cuisine: "Steakhouse", cap: 160, tags: ["luxury", "corporate", "private-dining-focused"], price: 4, events: ["corporate", "dinner"], lat: 29.740, lng: -95.462, img: IMG.steak, feat: true, rank: 2 },
  { name: "Vic & Anthony's Steakhouse", desc: "Classic steakhouse elegance inside the Golden Nugget—ideal for client entertainment and milestone birthdays.", loc: "Downtown Houston", cuisine: "Steakhouse", cap: 120, tags: ["luxury", "corporate"], price: 4, events: ["corporate", "dinner", "birthday"], lat: 29.763, lng: -95.364, img: IMG.steak },
  { name: "Brenner's Steakhouse on the Bayou", desc: "River Oaks institution with bayou views, prime cuts, and semi-private rooms for executive gatherings.", loc: "River Oaks, Houston", cuisine: "Steakhouse", cap: 100, tags: ["luxury", "romantic", "private-dining-focused"], price: 4, events: ["date_night", "corporate", "dinner"], lat: 29.752, lng: -95.418, img: IMG.steak },
  { name: "Tony's", desc: "White-tablecloth Italian-American fine dining—holiday parties, rehearsal dinners, and VIP hospitality.", loc: "Greenway Plaza, Houston", cuisine: "Italian", cap: 90, tags: ["luxury", "private-dining-focused"], price: 4, events: ["corporate", "dinner", "birthday"], lat: 29.731, lng: -95.434, img: IMG.american },
  { name: "Davis Street at Hermann Park", desc: "Seasonal American from a veteran chef team—corporate buyouts and chef's table experiences.", loc: "Museum District, Houston", cuisine: "Modern American", cap: 85, tags: ["luxury", "corporate"], price: 4, events: ["corporate", "dinner"], lat: 29.722, lng: -95.389, img: IMG.american },
  { name: "March", desc: "Mediterranean fine dining with a wine program built for hosted tastings and intimate celebrations.", loc: "Montrose, Houston", cuisine: "Mediterranean", cap: 70, tags: ["luxury", "romantic"], price: 4, events: ["date_night", "dinner", "birthday"], lat: 29.742, lng: -95.402, img: IMG.wine },
  { name: "The Annie Café & Bar", desc: "Polished café-by-day, dinner destination by night—rooftop-adjacent energy for upscale social events.", loc: "Galleria, Houston", cuisine: "Modern American", cap: 110, tags: ["luxury", "nightlife"], price: 4, events: ["party", "corporate", "dinner"], lat: 29.738, lng: -95.461, img: IMG.rooftop },
  { name: "La Griglia", desc: "See-and-be-seen Italian steakhouse on West Gray—birthdays, engagements, and high-energy group dinners.", loc: "River Oaks, Houston", cuisine: "Italian", cap: 130, tags: ["luxury", "nightlife", "loud"], price: 4, events: ["birthday", "party", "dinner"], lat: 29.748, lng: -95.410, img: IMG.american },
  { name: "Masraff's", desc: "Upscale American with a loyal Uptown crowd—reliable for corporate anniversaries and client dinners.", loc: "Uptown, Houston", cuisine: "Modern American", cap: 95, tags: ["luxury", "corporate"], price: 4, events: ["corporate", "dinner"], lat: 29.745, lng: -95.456, img: IMG.american },
  { name: "Eddie V's Prime Seafood", desc: "Live jazz, prime seafood, and private dining for financial district entertainment.", loc: "River Oaks, Houston", cuisine: "Seafood", cap: 150, tags: ["luxury", "corporate", "nightlife"], price: 4, events: ["corporate", "date_night", "dinner"], lat: 29.754, lng: -95.415, img: IMG.seafood, feat: true, rank: 3 },
  { name: "Truluck's Ocean's Finest", desc: "Stone crab, lobster, and piano bar atmosphere—popular for hosted client appreciation nights.", loc: "Westheimer, Houston", cuisine: "Seafood", cap: 120, tags: ["luxury", "corporate"], price: 4, events: ["corporate", "dinner"], lat: 29.741, lng: -95.478, img: IMG.seafood },
  { name: "State of Grace", desc: "Gulf seafood and wood-fired steaks in a grand dining room—large-format celebrations welcome.", loc: "Tanglewood, Houston", cuisine: "Seafood", cap: 180, tags: ["luxury", "family-friendly", "corporate"], price: 4, events: ["birthday", "corporate", "dinner"], lat: 29.768, lng: -95.489, img: IMG.seafood },
  { name: "Xochi", desc: "Oaxacan-inspired James Beard spotlight—tasting menus and buyouts for discerning food-forward groups.", loc: "Downtown Houston", cuisine: "Mexican", cap: 75, tags: ["luxury"], price: 4, events: ["dinner", "birthday"], lat: 29.760, lng: -95.362, img: IMG.texmex },
  { name: "Spindletop Restaurant", desc: "Revolving rooftop views atop the Hyatt—iconic skyline dinners and cocktail receptions.", loc: "Downtown Houston", cuisine: "Modern American", cap: 200, tags: ["luxury", "romantic", "corporate"], price: 4, events: ["corporate", "date_night", "party"], lat: 29.758, lng: -95.365, img: IMG.rooftop, feat: true, rank: 4 },
  { name: "Z on 23 Rooftop", desc: "Pool deck dining with downtown panoramas—launch parties and sunset corporate mixers.", loc: "Downtown Houston", cuisine: "Contemporary", cap: 180, tags: ["luxury", "nightlife"], price: 4, events: ["party", "corporate"], lat: 29.755, lng: -95.368, img: IMG.rooftop },
  { name: "B&B Butchers & Restaurant", desc: "Steakhouse meets butcher shop—trophy room vibes for team wins and executive dinners.", loc: "Washington Ave, Houston", cuisine: "Steakhouse", cap: 160, tags: ["luxury", "loud", "corporate"], price: 4, events: ["corporate", "party", "dinner"], lat: 29.770, lng: -95.408, img: IMG.steak },
  { name: "Del Frisco's Double Eagle", desc: "Two-story steakhouse with wine vault—favored for holiday parties and large guest counts.", loc: "Galleria, Houston", cuisine: "Steakhouse", cap: 220, tags: ["luxury", "corporate", "private-dining-focused"], price: 4, events: ["corporate", "birthday", "dinner"], lat: 29.737, lng: -95.464, img: IMG.steak },
  { name: "Fleming's Prime Steakhouse", desc: "Consistent national luxury with private wine dinners—safe pick for corporate roadshows.", loc: "Uptown, Houston", cuisine: "Steakhouse", cap: 140, tags: ["luxury", "corporate"], price: 4, events: ["corporate", "dinner"], lat: 29.744, lng: -95.458, img: IMG.steak },
  { name: "Ruth's Chris Steak House", desc: "Sizzling plates and private rooms—banking and energy sector entertainment staple.", loc: "Galleria, Houston", cuisine: "Steakhouse", cap: 150, tags: ["luxury", "corporate"], price: 4, events: ["corporate", "dinner"], lat: 29.739, lng: -95.460, img: IMG.steak },
  // BBQ (critical for Texas)
  { name: "The Pit Room", desc: "Central Texas-style brisket and ribs—casual corporate offsites with catering trays.", loc: "Montrose, Houston", cuisine: "BBQ", cap: 90, tags: ["casual", "corporate"], price: 2, events: ["corporate", "party", "dinner"], lat: 29.743, lng: -95.398, img: IMG.bbq },
  { name: "Blood Bros BBQ", desc: "Houston Chronicle darling—bold flavors for team lunches and brewery-adjacent parties.", loc: "East Downtown, Houston", cuisine: "BBQ", cap: 70, tags: ["casual", "loud"], price: 2, events: ["party", "birthday"], lat: 29.748, lng: -95.352, img: IMG.bbq },
  { name: "Fainmoss BBQ", desc: "Neighborhood smokehouse with picnic-table energy—family reunions and casual celebrations.", loc: "Third Ward, Houston", cuisine: "BBQ", cap: 60, tags: ["casual", "family-friendly"], price: 2, events: ["birthday", "party"], lat: 29.728, lng: -95.355, img: IMG.bbq },
  { name: "CorkScrew BBQ", desc: "Spring-area legend worth the drive—whole-hog feasts and corporate picnic packages.", loc: "Spring, Houston metro", cuisine: "BBQ", cap: 100, tags: ["casual", "family-friendly", "corporate"], price: 2, events: ["corporate", "party"], lat: 30.079, lng: -95.417, img: IMG.bbq },
  { name: "Pitmaster BBQ", desc: "East End smoke with daily specials—budget-friendly team outings.", loc: "East End, Houston", cuisine: "BBQ", cap: 55, tags: ["casual"], price: 1, events: ["party", "dinner"], lat: 29.735, lng: -95.328, img: IMG.bbq },
  { name: "Ray's BBQ Shack", desc: "Third-generation pit—soulful Houston BBQ for community fundraisers and family events.", loc: "Southwest Houston", cuisine: "BBQ", cap: 65, tags: ["casual", "family-friendly"], price: 2, events: ["birthday", "party"], lat: 29.688, lng: -95.458, img: IMG.bbq },
  { name: "Hinze's Bar-B-Q", desc: "Wharton County heritage near the city—smoked meats for rehearsal dinners and reunions.", loc: "Wharton, Houston metro", cuisine: "BBQ", cap: 80, tags: ["casual", "family-friendly"], price: 2, events: ["birthday", "party"], lat: 29.311, lng: -96.095, img: IMG.bbq },
  { name: "Truth BBQ", desc: "Craft BBQ with natural wine—younger corporate teams and foodie birthdays.", loc: "Heights, Houston", cuisine: "BBQ", cap: 75, tags: ["casual"], price: 3, events: ["birthday", "dinner"], lat: 29.802, lng: -95.406, img: IMG.bbq },
  { name: "Feges BBQ", desc: "Brisket burnt ends and sides by the pound—tailgate-style company parties.", loc: "Spring Branch, Houston", cuisine: "BBQ", cap: 50, tags: ["casual", "loud"], price: 2, events: ["party"], lat: 29.788, lng: -95.528, img: IMG.bbq },
  { name: "Brooks Place BBQ", desc: "Tomball-area smoke ring—spacious lot for outdoor corporate cookouts.", loc: "Tomball, Houston metro", cuisine: "BBQ", cap: 120, tags: ["casual", "family-friendly", "corporate"], price: 2, events: ["corporate", "party"], lat: 30.097, lng: -95.616, img: IMG.bbq },
  // Tex-Mex & tacos
  { name: "Ninfa's on Navigation", desc: "Legendary fajitas on the original bluff—Houston hospitality for out-of-town guests.", loc: "East End, Houston", cuisine: "Tex-Mex", cap: 200, tags: ["casual", "family-friendly", "loud"], price: 2, events: ["birthday", "party", "dinner"], lat: 29.756, lng: -95.338, img: IMG.texmex, feat: true, rank: 5 },
  { name: "El Tiempo Cantina", desc: "Upscale Tex-Mex with margarita towers—group birthdays across multiple locations.", loc: "River Oaks, Houston", cuisine: "Tex-Mex", cap: 180, tags: ["casual", "nightlife", "family-friendly"], price: 3, events: ["birthday", "party"], lat: 29.750, lng: -95.412, img: IMG.texmex },
  { name: "Original Ninfa's", desc: "Mama Ninfa legacy—sizzling platters for multi-generational family gatherings.", loc: "Downtown Houston", cuisine: "Tex-Mex", cap: 150, tags: ["casual", "family-friendly"], price: 2, events: ["birthday", "dinner"], lat: 29.762, lng: -95.360, img: IMG.texmex },
  { name: "Torchy's Tacos", desc: "Austin transplant with damn-good tacos—casual team lunches and happy hours.", loc: "Heights, Houston", cuisine: "Tacos", cap: 80, tags: ["casual", "loud"], price: 2, events: ["party", "dinner"], lat: 29.800, lng: -95.402, img: IMG.texmex },
  { name: "Velvet Taco", desc: "Creative taco bar with late hours—marketing team launches and social mixers.", loc: "Uptown, Houston", cuisine: "Tacos", cap: 90, tags: ["casual", "nightlife"], price: 2, events: ["party"], lat: 29.746, lng: -95.454, img: IMG.texmex },
  { name: "Güero's Taco Garage", desc: "Airstream patio tacos—relaxed birthdays with live music weekends.", loc: "Washington Ave, Houston", cuisine: "Tacos", cap: 70, tags: ["casual", "nightlife"], price: 2, events: ["birthday", "party"], lat: 29.772, lng: -95.405, img: IMG.texmex },
  { name: "Tacos Tierra Caliente", desc: "West Alabama taco window—authentic street flavors for informal team meals.", loc: "Upper Kirby, Houston", cuisine: "Tacos", cap: 40, tags: ["casual"], price: 1, events: ["dinner"], lat: 29.731, lng: -95.428, img: IMG.texmex },
  { name: "Feggy's Taqueria", desc: "Neighborhood favorite with al pastor—late-night staff parties.", loc: "Northside, Houston", cuisine: "Tacos", cap: 45, tags: ["casual", "loud"], price: 1, events: ["party"], lat: 29.810, lng: -95.378, img: IMG.texmex },
  { name: "Lupe Tortilla", desc: "Giant margaritas and fajita combos—suburban Houston birthday default.", loc: "West Houston", cuisine: "Tex-Mex", cap: 220, tags: ["casual", "family-friendly"], price: 2, events: ["birthday", "party"], lat: 29.782, lng: -95.602, img: IMG.texmex },
  { name: "Chuy's", desc: "Retro Tex-Mex kitsch—fun corporate socials with predictable group menus.", loc: "Multiple, Houston", cuisine: "Tex-Mex", cap: 200, tags: ["casual", "family-friendly", "loud"], price: 2, events: ["party", "birthday"], lat: 29.760, lng: -95.450, img: IMG.texmex },
  // Casual burgers & diners
  { name: "The Burger Joint", desc: "Craft burgers and local beer—startup team dinners without the steakhouse bill.", loc: "Montrose, Houston", cuisine: "Burgers", cap: 65, tags: ["casual"], price: 2, events: ["dinner", "party"], lat: 29.741, lng: -95.400, img: IMG.burger },
  { name: "Bernie's Burger Bus", desc: "Award-winning patty melts—foodie casual birthdays.", loc: "Heights, Houston", cuisine: "Burgers", cap: 55, tags: ["casual"], price: 2, events: ["birthday"], lat: 29.798, lng: -95.408, img: IMG.burger },
  { name: "Hopdoddy Burger Bar", desc: "Shake program and burger lab—Gen-Z friendly team outings.", loc: "Rice Village, Houston", cuisine: "Burgers", cap: 75, tags: ["casual", "loud"], price: 2, events: ["party"], lat: 29.717, lng: -95.418, img: IMG.burger },
  { name: "Beck's Prime", desc: "Old-school Houston burger counter—quick team lunches.", loc: "Memorial, Houston", cuisine: "Burgers", cap: 50, tags: ["casual", "family-friendly"], price: 2, events: ["dinner"], lat: 29.781, lng: -95.545, img: IMG.burger },
  { name: "Lankford Grocery", desc: "Diner-style breakfast and burgers—morning corporate meetups.", loc: "Downtown Houston", cuisine: "Diner", cap: 40, tags: ["casual"], price: 1, events: ["dinner"], lat: 29.761, lng: -95.358, img: IMG.burger },
  { name: "Frank's Americana Revival", desc: "River Oaks diner classics—comfortable family celebrations.", loc: "River Oaks, Houston", cuisine: "Diner", cap: 90, tags: ["casual", "family-friendly"], price: 2, events: ["birthday", "dinner"], lat: 29.749, lng: -95.414, img: IMG.family },
  { name: "The Breakfast Klub", desc: "Wings and waffles institution—morning event fuel for volunteer days.", loc: "Midtown, Houston", cuisine: "Diner", cap: 60, tags: ["casual", "loud"], price: 2, events: ["party"], lat: 29.738, lng: -95.378, img: IMG.family },
  // Event / private dining / hotels
  { name: "Hotel ZaZa Houston Museum District", desc: "Boutique ballrooms and themed suites—weddings, galas, and executive retreats.", loc: "Museum District, Houston", cuisine: "Hotel Events", cap: 300, tags: ["luxury", "corporate", "private-dining-focused"], price: 4, events: ["corporate", "party", "birthday"], lat: 29.721, lng: -95.387, img: IMG.hotel, feat: true, rank: 6 },
  { name: "The Post Oak Hotel", desc: "Uptown luxury hotel with grand event spaces—black-tie corporate galas.", loc: "Uptown, Houston", cuisine: "Hotel Events", cap: 400, tags: ["luxury", "corporate", "private-dining-focused"], price: 4, events: ["corporate", "party"], lat: 29.736, lng: -95.465, img: IMG.hotel },
  { name: "Junior League of Houston", desc: "Historic mansion venue—philanthropic luncheons and seated fundraisers.", loc: "River Oaks, Houston", cuisine: "Event Venue", cap: 250, tags: ["corporate", "private-dining-focused"], price: 3, events: ["corporate", "party"], lat: 29.747, lng: -95.416, img: IMG.banquet },
  { name: "Avenida Houston Ballroom", desc: "Convention district ballroom—trade shows, awards nights, and large receptions.", loc: "Downtown Houston", cuisine: "Event Venue", cap: 500, tags: ["corporate", "private-dining-focused"], price: 3, events: ["corporate", "party"], lat: 29.752, lng: -95.359, img: IMG.banquet },
  { name: "Buffalo Bayou Park Cistern", desc: "Architectural icon for unforgettable brand activations and donor dinners.", loc: "Near Downtown, Houston", cuisine: "Event Venue", cap: 200, tags: ["luxury", "corporate"], price: 4, events: ["corporate", "party"], lat: 29.764, lng: -95.376, img: IMG.banquet },
  { name: "The Corinthian Houston", desc: "Rooftop event venue with skyline views—weddings and launch events.", loc: "Downtown Houston", cuisine: "Event Venue", cap: 350, tags: ["luxury", "corporate"], price: 4, events: ["party", "corporate", "birthday"], lat: 29.759, lng: -95.361, img: IMG.rooftop },
  { name: "Silver Street Events", desc: "Warehouse district blank canvas—brand experiences and tech company parties.", loc: "East End, Houston", cuisine: "Event Venue", cap: 400, tags: ["corporate", "nightlife"], price: 3, events: ["party", "corporate"], lat: 29.751, lng: -95.345, img: IMG.banquet },
  { name: "The Astorian", desc: "East River custom event house—coastal elegance for weddings and corporate mixers.", loc: "East End, Houston", cuisine: "Event Venue", cap: 280, tags: ["luxury", "corporate"], price: 4, events: ["party", "birthday", "corporate"], lat: 29.754, lng: -95.342, img: IMG.banquet },
  { name: "Majestic Metro", desc: "Restored theater venue—awards ceremonies and keynote dinners.", loc: "Downtown Houston", cuisine: "Event Venue", cap: 320, tags: ["corporate", "private-dining-focused"], price: 3, events: ["corporate", "party"], lat: 29.761, lng: -95.357, img: IMG.banquet },
  { name: "The Bell Tower on 34th", desc: "Garden estate weddings and corporate garden parties west of downtown.", loc: "Oak Forest, Houston", cuisine: "Event Venue", cap: 300, tags: ["luxury", "family-friendly"], price: 4, events: ["party", "birthday"], lat: 29.818, lng: -95.432, img: IMG.banquet },
  // Nightlife / lounges
  { name: "Spire 73", desc: "Highest rooftop bar in Texas—cocktail receptions and VIP brand nights.", loc: "Galleria, Houston", cuisine: "Rooftop Bar", cap: 150, tags: ["nightlife", "luxury"], price: 4, events: ["party", "corporate"], lat: 29.737, lng: -95.463, img: IMG.rooftop },
  { name: "Marquee Houston", desc: "River Oaks supper club energy—bottle service birthdays and late corporate mixers.", loc: "River Oaks, Houston", cuisine: "Lounge", cap: 120, tags: ["nightlife", "luxury", "loud"], price: 4, events: ["party", "birthday"], lat: 29.751, lng: -95.411, img: IMG.bar },
  { name: "Clé Houston", desc: "Memorial City nightclub with event buyouts—high-energy brand launches.", loc: "Memorial City, Houston", cuisine: "Nightclub", cap: 250, tags: ["nightlife", "loud"], price: 3, events: ["party"], lat: 29.780, lng: -95.540, img: IMG.bar },
  { name: "Bar 5015", desc: "Washington Ave patio bar—casual after-work team socials.", loc: "Washington Ave, Houston", cuisine: "Bar", cap: 100, tags: ["nightlife", "casual", "loud"], price: 2, events: ["party"], lat: 29.771, lng: -95.407, img: IMG.bar },
  { name: "Pete's Dueling Piano Bar", desc: "Interactive piano show—bachelorette parties and rowdy team celebrations.", loc: "Midtown, Houston", cuisine: "Bar", cap: 140, tags: ["nightlife", "loud"], price: 3, events: ["party", "birthday"], lat: 29.739, lng: -95.380, img: IMG.bar },
  { name: "Brasserie 19", desc: "French bistro meets wine bar—upscale but lively group dinners.", loc: "River Oaks, Houston", cuisine: "French", cap: 85, tags: ["romantic", "nightlife"], price: 3, events: ["date_night", "dinner"], lat: 29.750, lng: -95.413, img: IMG.wine },
  { name: "Julep", desc: "Southern cocktail oasis—mint julep-fueled hospitality events.", loc: "Heights, Houston", cuisine: "Cocktail Bar", cap: 70, tags: ["nightlife", "casual"], price: 3, events: ["party"], lat: 29.799, lng: -95.404, img: IMG.bar },
  { name: "Eighteen Twenty Lounge", desc: "Live music lounge on the Bayou—sponsor nights and donor receptions.", loc: "East End, Houston", cuisine: "Lounge", cap: 90, tags: ["nightlife", "corporate"], price: 3, events: ["corporate", "party"], lat: 29.753, lng: -95.340, img: IMG.bar },
  { name: "The Rustic", desc: "Texas-sized patio with live country—corporate summer parties.", loc: "Memorial, Houston", cuisine: "American", cap: 200, tags: ["casual", "nightlife", "family-friendly"], price: 2, events: ["party", "corporate"], lat: 29.778, lng: -95.548, img: IMG.bar },
  { name: "Axelrad Beer Garden", desc: "Houston's favorite beer garden—relaxed team happy hours under the trees.", loc: "Third Ward, Houston", cuisine: "Beer Garden", cap: 180, tags: ["casual", "nightlife"], price: 2, events: ["party"], lat: 29.729, lng: -95.358, img: IMG.bar },
  // More Houston variety to reach ~70
  { name: "Nancy's Hustle", desc: "Intimate natural wine bistro—chef-driven small groups and industry nights.", loc: "East Downtown, Houston", cuisine: "Contemporary", cap: 55, tags: ["romantic"], price: 3, events: ["date_night", "dinner"], lat: 29.747, lng: -95.350, img: IMG.wine },
  { name: "Coltivare Pizza & Garden", desc: "Garden-to-table pizza in the Heights—casual rehearsal dinners.", loc: "Heights, Houston", cuisine: "Italian", cap: 80, tags: ["casual", "family-friendly"], price: 2, events: ["birthday", "dinner"], lat: 29.797, lng: -95.401, img: IMG.american },
  { name: "Caracol", desc: "Coastal Mexican seafood—Houston Chronicle favorite for hosted tastings.", loc: "Galleria, Houston", cuisine: "Seafood", cap: 100, tags: ["luxury"], price: 3, events: ["dinner", "corporate"], lat: 29.736, lng: -95.467, img: IMG.seafood },
  { name: "Hugo's", desc: "Interior Mexican fine dining—Day of the Dead parties and cultural celebrations.", loc: "Montrose, Houston", cuisine: "Mexican", cap: 110, tags: ["family-friendly", "luxury"], price: 3, events: ["birthday", "party"], lat: 29.740, lng: -95.401, img: IMG.texmex },
  { name: "Georgia James", desc: "Chris Shepherd steakhouse—Houston food scene crown jewel for VIP dinners.", loc: "Heights, Houston", cuisine: "Steakhouse", cap: 95, tags: ["luxury", "corporate"], price: 4, events: ["corporate", "dinner"], lat: 29.796, lng: -95.407, img: IMG.steak },
  { name: "The Hay Merchant", desc: "Craft beer hall under Shepherd—sports watch parties and team events.", loc: "Montrose, Houston", cuisine: "American", cap: 150, tags: ["casual", "loud"], price: 2, events: ["party"], lat: 29.742, lng: -95.399, img: IMG.bar },
  { name: "Saint Arnold Brewing", desc: "Texas' oldest craft brewery—tours and event hall for company outings.", loc: "East Downtown, Houston", cuisine: "Brewery", cap: 250, tags: ["casual", "corporate"], price: 2, events: ["corporate", "party"], lat: 29.749, lng: -95.348, img: IMG.bar },
  { name: "Karbach Brewing", desc: "Memorial brewery biergarten—family-friendly corporate picnics.", loc: "Near Memorial, Houston", cuisine: "Brewery", cap: 200, tags: ["casual", "family-friendly"], price: 2, events: ["party", "corporate"], lat: 29.775, lng: -95.532, img: IMG.bar },
  { name: "Bloom & Bee", desc: "Hotel Alessandra restaurant—garden patio brunches and bridal showers.", loc: "Downtown Houston", cuisine: "American", cap: 85, tags: ["romantic", "corporate"], price: 3, events: ["birthday", "party"], lat: 29.757, lng: -95.366, img: IMG.american },
  { name: "The Grove", desc: "Discovery Green park restaurant—outdoor corporate picnics with skyline views.", loc: "Downtown Houston", cuisine: "American", cap: 120, tags: ["corporate", "family-friendly"], price: 3, events: ["corporate", "party"], lat: 29.753, lng: -95.371, img: IMG.american },
];

/** @type {Array<Record<string, unknown>>} */
const CYPRESS = [
  { name: "Perry's Steakhouse Cypress", desc: "Suburban steakhouse standard—client dinners and graduation celebrations for west Houston families.", loc: "Cypress, TX", cuisine: "Steakhouse", cap: 160, tags: ["luxury", "family-friendly", "corporate"], price: 4, events: ["corporate", "birthday", "dinner"], lat: 29.969, lng: -95.697, img: IMG.steak, feat: true, rank: 1 },
  { name: "Mastro's Steakhouse", desc: "Upscale chain polish on Highway 6—reliable corporate entertainment north of the city.", loc: "Cypress, TX", cuisine: "Steakhouse", cap: 140, tags: ["luxury", "corporate"], price: 4, events: ["corporate", "dinner"], lat: 29.982, lng: -95.680, img: IMG.steak },
  { name: "Saltgrass Steak House", desc: "Texas steakhouse comfort—youth sports team banquets and family milestones.", loc: "Cypress, TX", cuisine: "Steakhouse", cap: 180, tags: ["family-friendly", "casual"], price: 3, events: ["birthday", "party"], lat: 29.955, lng: -95.710, img: IMG.steak },
  { name: "Rudy's Country Store and BBQ", desc: "Counter-service BBQ institution—affordable company picnics and block parties.", loc: "Cypress, TX", cuisine: "BBQ", cap: 100, tags: ["casual", "family-friendly"], price: 2, events: ["party", "corporate"], lat: 29.960, lng: -95.685, img: IMG.bbq, feat: true, rank: 2 },
  { name: "The Shack BBQ & Seafood", desc: "Cypress smoke and Gulf catches—casual rehearsal dinners.", loc: "Cypress, TX", cuisine: "BBQ", cap: 90, tags: ["casual", "family-friendly"], price: 2, events: ["birthday", "dinner"], lat: 29.973, lng: -95.705, img: IMG.bbq },
  { name: "CorkScrew BBQ Cypress", desc: "Satellite of the Spring legend—weekend smoke for suburban foodies.", loc: "Cypress, TX", cuisine: "BBQ", cap: 80, tags: ["casual"], price: 2, events: ["party"], lat: 29.968, lng: -95.692, img: IMG.bbq },
  { name: "Los Cucos Mexican Cafe", desc: "Huge portions and sizzling fajitas—multi-family birthday default in Cypress.", loc: "Cypress, TX", cuisine: "Tex-Mex", cap: 200, tags: ["family-friendly", "casual", "loud"], price: 2, events: ["birthday", "party"], lat: 29.962, lng: -95.688, img: IMG.texmex },
  { name: "Chuy's Cypress", desc: "Retro Tex-Mex party atmosphere—soccer team celebrations.", loc: "Cypress, TX", cuisine: "Tex-Mex", cap: 190, tags: ["casual", "family-friendly"], price: 2, events: ["birthday", "party"], lat: 29.975, lng: -95.715, img: IMG.texmex },
  { name: "Gringos Mexican Kitchen", desc: "Local chain with patio—corporate happy hours for energy corridor offices.", loc: "Cypress, TX", cuisine: "Tex-Mex", cap: 150, tags: ["casual", "corporate"], price: 2, events: ["corporate", "party"], lat: 29.958, lng: -95.672, img: IMG.texmex },
  { name: "Cheddar's Scratch Kitchen", desc: "Value-focused family dining—large tables for church and school events.", loc: "Cypress, TX", cuisine: "American", cap: 220, tags: ["family-friendly", "casual"], price: 2, events: ["birthday", "party"], lat: 29.951, lng: -95.698, img: IMG.family },
  { name: "BJ's Restaurant & Brewhouse", desc: "Brewhouse with private room—suburban corporate lunch meetings.", loc: "Cypress, TX", cuisine: "American", cap: 170, tags: ["casual", "corporate", "family-friendly"], price: 2, events: ["corporate", "birthday"], lat: 29.964, lng: -95.720, img: IMG.american },
  { name: "Mo's Irish Pub Cypress", desc: "Neighborhood pub with event space—watch parties and casual team nights.", loc: "Cypress, TX", cuisine: "Pub", cap: 110, tags: ["casual", "nightlife", "loud"], price: 2, events: ["party"], lat: 29.970, lng: -95.678, img: IMG.bar },
  { name: "The Shack Burger & Brew", desc: "Gourmet burgers and craft beer—teen birthday favorite.", loc: "Cypress, TX", cuisine: "Burgers", cap: 75, tags: ["casual", "family-friendly"], price: 2, events: ["birthday"], lat: 29.966, lng: -95.701, img: IMG.burger },
  { name: "Black Bear Diner", desc: "All-day diner comfort—breakfast meetings and family reunions.", loc: "Cypress, TX", cuisine: "Diner", cap: 95, tags: ["family-friendly", "casual"], price: 2, events: ["birthday", "dinner"], lat: 29.959, lng: -95.690, img: IMG.family },
  { name: "The Egg & I", desc: "Brunch-focused meetings—HOA boards and nonprofit breakfasts.", loc: "Cypress, TX", cuisine: "Brunch", cap: 70, tags: ["family-friendly", "casual"], price: 2, events: ["corporate", "birthday"], lat: 29.972, lng: -95.708, img: IMG.family },
  { name: "Antone's Famous Po' Boys", desc: "Quick corporate lunch trays—Cypress office park staple.", loc: "Cypress, TX", cuisine: "Sandwiches", cap: 45, tags: ["casual"], price: 1, events: ["corporate", "dinner"], lat: 29.957, lng: -95.683, img: IMG.american },
  { name: "Berryhill Baja Grill", desc: "Baja fish tacos and patio—relaxed suburban happy hours.", loc: "Cypress, TX", cuisine: "Mexican", cap: 85, tags: ["casual", "family-friendly"], price: 2, events: ["party"], lat: 29.961, lng: -95.714, img: IMG.texmex },
  { name: "Crust Pizza Co.", desc: "Wood-fired pizza party packages—kids' birthdays and team builders.", loc: "Cypress, TX", cuisine: "Pizza", cap: 100, tags: ["family-friendly", "casual"], price: 2, events: ["birthday", "party"], lat: 29.974, lng: -95.695, img: IMG.american },
  { name: "Wolfies Restaurant", desc: "Local Cypress favorite—Sunday lunch family gatherings.", loc: "Cypress, TX", cuisine: "American", cap: 80, tags: ["family-friendly", "casual"], price: 2, events: ["birthday", "dinner"], lat: 29.953, lng: -95.706, img: IMG.family },
  { name: "The Empty Glass Winery", desc: "Wine bar with private tasting room—book club and donor events.", loc: "Cypress, TX", cuisine: "Wine Bar", cap: 60, tags: ["romantic", "corporate"], price: 3, events: ["corporate", "date_night"], lat: 29.967, lng: -95.689, img: IMG.wine },
  { name: "North Cypress Banquet Hall", desc: "Dedicated event hall for quinceañeras, weddings, and corporate awards.", loc: "North Cypress, TX", cuisine: "Event Venue", cap: 350, tags: ["corporate", "private-dining-focused", "family-friendly"], price: 3, events: ["party", "birthday", "corporate"], lat: 30.010, lng: -95.720, img: IMG.banquet, feat: true, rank: 3 },
  { name: "Cypress Creek Christian Church Center", desc: "Large fellowship hall rentals—nonprofit galas and community dinners.", loc: "Cypress, TX", cuisine: "Event Venue", cap: 400, tags: ["family-friendly", "corporate"], price: 2, events: ["corporate", "party"], lat: 29.978, lng: -95.650, img: IMG.banquet },
  { name: "Lone Star Community Center", desc: "Municipal event space—affordable corporate trainings and town halls.", loc: "Cypress, TX", cuisine: "Event Venue", cap: 300, tags: ["corporate", "family-friendly"], price: 2, events: ["corporate", "party"], lat: 29.945, lng: -95.675, img: IMG.banquet },
  { name: "The Bell Tower Cypress", desc: "Garden estate satellite—suburban weddings with on-site catering.", loc: "Cypress, TX", cuisine: "Event Venue", cap: 280, tags: ["luxury", "family-friendly"], price: 4, events: ["party", "birthday"], lat: 29.990, lng: -95.730, img: IMG.banquet },
  { name: "Houston National Golf Club", desc: "Clubhouse dining and ballroom—golf outing dinners and sponsor events.", loc: "Cypress, TX", cuisine: "Club", cap: 200, tags: ["corporate", "luxury"], price: 4, events: ["corporate", "party"], lat: 29.988, lng: -95.740, img: IMG.hotel },
  { name: "Bridgeland Country Club", desc: "Master-planned community club—corporate member events and galas.", loc: "Cypress, TX", cuisine: "Club", cap: 220, tags: ["corporate", "luxury", "family-friendly"], price: 4, events: ["corporate", "party", "birthday"], lat: 29.935, lng: -95.660, img: IMG.hotel },
  { name: "Red Robin Cypress", desc: "Family chain with group menus—youth sports banquets.", loc: "Cypress, TX", cuisine: "American", cap: 160, tags: ["family-friendly", "casual"], price: 2, events: ["birthday", "party"], lat: 29.956, lng: -95.702, img: IMG.family },
  { name: "Olive Garden Cypress", desc: "Predictable Italian family dining—grandparent-friendly birthdays.", loc: "Cypress, TX", cuisine: "Italian", cap: 180, tags: ["family-friendly", "casual"], price: 2, events: ["birthday", "dinner"], lat: 29.963, lng: -95.717, img: IMG.american },
  { name: "Pappadeaux Seafood Kitchen", desc: "New Orleans seafood spectacle—multi-gen family celebrations.", loc: "Cypress, TX", cuisine: "Seafood", cap: 200, tags: ["family-friendly", "loud"], price: 3, events: ["birthday", "party"], lat: 29.971, lng: -95.712, img: IMG.seafood },
  { name: "Pappasito's Cantina", desc: "Upscale Tex-Mex for suburban entertaining—corporate family days.", loc: "Cypress, TX", cuisine: "Tex-Mex", cap: 210, tags: ["family-friendly", "corporate"], price: 3, events: ["corporate", "birthday"], lat: 29.965, lng: -95.686, img: IMG.texmex },
  { name: "Willie's Grill & Icehouse", desc: "Texas icehouse patio—beer and burger team socials.", loc: "Cypress, TX", cuisine: "American", cap: 130, tags: ["casual", "nightlife"], price: 2, events: ["party"], lat: 29.958, lng: -95.694, img: IMG.bar },
];

function toRow(r, city) {
  return {
    ...r,
    city,
    feat: r.feat ?? false,
    rank: r.rank ?? 0,
  };
}

const all = [
  ...HOUSTON.map((r) => toRow(r, "houston")),
  ...CYPRESS.map((r) => toRow(r, "cypress")),
];

if (all.length < 95) {
  console.warn(`Warning: only ${all.length} restaurants generated`);
}

const values = all
  .map((r) => {
    return `(
  null,
  '${esc(r.name)}',
  '${esc(r.desc)}',
  '${esc(r.loc)}',
  '${esc(r.cuisine)}',
  '${esc(r.img)}',
  ${r.cap},
  ${r.feat},
  ${r.rank},
  ${sqlArray(r.tags)},
  ${r.price},
  ${sqlArray(r.events)},
  ${r.lat},
  ${r.lng},
  '${r.city}',
  'active',
  true,
  'none'
)`;
  })
  .join(",\n");

const sql = `-- Arrive Phase 6: Houston + Cypress metro seed (${all.length} venues)
-- Run in Supabase SQL Editor AFTER migration 20260524160000_phase6_restaurant_operations.sql
-- owner_id is null until admin assigns a restaurant_owner

delete from public.restaurants
where city in ('houston', 'cypress')
  and owner_id is null;

insert into public.restaurants (
  owner_id,
  name,
  description,
  location,
  cuisine_type,
  image_url,
  capacity,
  is_featured,
  display_rank,
  tags,
  price_level,
  event_types,
  latitude,
  longitude,
  city,
  status,
  is_visible,
  subscription_status
) values
${values};

-- Verify: select city, count(*) from public.restaurants where city in ('houston','cypress') group by city;
`;

writeFileSync(OUT, sql, "utf8");
console.log(`Wrote ${all.length} restaurants to ${OUT}`);
