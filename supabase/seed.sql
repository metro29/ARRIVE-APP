-- Arrive Phase 2 seed: Dallas, TX restaurant dataset
-- Run in Supabase SQL Editor AFTER migrations (including phase2_restaurant_discovery).
-- Requires at least one users_profile with role = 'restaurant_owner'.

do $$
declare
  v_owner uuid;
begin
  select id into v_owner
  from public.users_profile
  where role = 'restaurant_owner'
  limit 1;

  if v_owner is null then
    raise notice 'No restaurant_owner profile found. Sign up as a restaurant owner first, then re-run this seed.';
    return;
  end if;

  delete from public.restaurants
  where owner_id = v_owner
    and name in (
      'Pappas Bros. Steakhouse',
      'The Woolworth',
      'Rodeo Goat',
      'Al Biernat''s',
      'Haywire',
      'YO Ranch Steakhouse',
      'Celebration Restaurant',
      'Meso Maya',
      'Catch Dallas',
      'Sixty Vines',
      'Elm & Good',
      'Nick & Sam''s',
      'Mirador',
      'FT33',
      'The Statler Dallas'
    );

  insert into public.restaurants (
    owner_id, name, description, location, cuisine_type, image_url, capacity,
    is_featured, display_rank, tags, price_level, event_types, latitude, longitude, city
  ) values
  (
    v_owner,
    'Pappas Bros. Steakhouse',
    'Dallas institution for premium steaks, private dining rooms, and white-glove service for executive dinners and milestone celebrations.',
    'Uptown Dallas, TX',
    'Steakhouse',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    120, true, 1,
    array['luxury', 'corporate', 'private-dining-focused'],
    4,
    array['corporate', 'dinner', 'birthday'],
    32.8024, -96.8001, 'dallas'
  ),
  (
    v_owner,
    'The Woolworth',
    'Historic downtown venue blending craft cocktails, shareable plates, and a lively atmosphere ideal for after-work parties and social gatherings.',
    'Downtown Dallas, TX',
    'American',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    150, true, 2,
    array['nightlife', 'loud', 'casual'],
    3,
    array['party', 'birthday', 'dinner'],
    32.7808, -96.7974, 'dallas'
  ),
  (
    v_owner,
    'Rodeo Goat',
    'Award-winning burgers and craft beer in a relaxed Deep Ellum setting — perfect for casual group birthdays and team outings.',
    'Deep Ellum, Dallas, TX',
    'American',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
    80, false, 10,
    array['casual', 'loud', 'family-friendly'],
    2,
    array['birthday', 'party', 'dinner'],
    32.7845, -96.7812, 'dallas'
  ),
  (
    v_owner,
    'Al Biernat''s',
    'Upscale steakhouse known for prime cuts, extensive wine list, and semi-private dining for client entertainment and special occasions.',
    'Oak Lawn, Dallas, TX',
    'Steakhouse',
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    100, false, 5,
    array['luxury', 'private-dining-focused', 'corporate'],
    4,
    array['corporate', 'date_night', 'dinner'],
    32.8131, -96.8107, 'dallas'
  ),
  (
    v_owner,
    'Haywire',
    'Texas ranch-inspired dining with wood-fired fare, whiskey program, and flexible layouts for corporate lunches and large group dinners.',
    'Uptown Dallas, TX',
    'American',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    140, false, 6,
    array['casual', 'corporate', 'family-friendly'],
    3,
    array['corporate', 'dinner', 'party'],
    32.8012, -96.7998, 'dallas'
  ),
  (
    v_owner,
    'YO Ranch Steakhouse',
    'Western-themed steakhouse with private rooms and event packages tailored for corporate retreats and celebration dinners.',
    'Downtown Dallas, TX',
    'Steakhouse',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
    90, false, 7,
    array['corporate', 'private-dining-focused', 'casual'],
    3,
    array['corporate', 'birthday', 'dinner'],
    32.7791, -96.7995, 'dallas'
  ),
  (
    v_owner,
    'Celebration Restaurant',
    'Beloved Dallas spot for homestyle Southern cooking, generous portions, and family-friendly group dining at approachable prices.',
    'Preston Hollow, Dallas, TX',
    'Southern',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    110, false, 8,
    array['family-friendly', 'casual'],
    2,
    array['birthday', 'dinner', 'party'],
    32.8654, -96.7978, 'dallas'
  ),
  (
    v_owner,
    'Meso Maya',
    'Modern Mexican cuisine with vibrant flavors, tequila bar, and semi-private spaces for festive birthdays and team celebrations.',
    'Uptown Dallas, TX',
    'Tex-Mex',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    95, false, 9,
    array['casual', 'loud', 'family-friendly'],
    2,
    array['birthday', 'party', 'dinner'],
    32.8038, -96.8015, 'dallas'
  ),
  (
    v_owner,
    'Catch Dallas',
    'Upscale seafood and sushi destination with rooftop energy, ideal for date nights, client dinners, and upscale social events.',
    'Uptown Dallas, TX',
    'Seafood',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    130, false, 4,
    array['luxury', 'nightlife', 'romantic'],
    4,
    array['date_night', 'corporate', 'party'],
    32.8045, -96.8022, 'dallas'
  ),
  (
    v_owner,
    'Sixty Vines',
    'Wine-on-tap concept with shareable plates and a convivial patio — a go-to for date nights and intimate group gatherings.',
    'Plano, TX (Dallas area)',
    'Wine Bar',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2724f3?w=800&q=80',
    70, false, 11,
    array['romantic', 'casual'],
    3,
    array['date_night', 'dinner', 'birthday'],
    33.0198, -96.6989, 'dallas'
  ),
  (
    v_owner,
    'Elm & Good',
    'Hotel restaurant with polished service, seasonal menus, and dedicated event coordination for corporate meetings and executive dinners.',
    'Deep Ellum, Dallas, TX',
    'Contemporary',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
    85, false, 12,
    array['corporate', 'luxury', 'private-dining-focused'],
    4,
    array['corporate', 'dinner', 'date_night'],
    32.7856, -96.7825, 'dallas'
  ),
  (
    v_owner,
    'Nick & Sam''s',
    'Iconic Dallas steakhouse for power lunches, VIP celebrations, and private dining with an unmatched luxury atmosphere.',
    'Uptown Dallas, TX',
    'Steakhouse',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    100, true, 3,
    array['luxury', 'private-dining-focused', 'corporate'],
    4,
    array['corporate', 'birthday', 'dinner'],
    32.8051, -96.8033, 'dallas'
  ),
  (
    v_owner,
    'Mirador',
    'Rooftop pool club and restaurant with skyline views — designed for upscale parties, launch events, and nightlife experiences.',
    'Downtown Dallas, TX',
    'Contemporary',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80',
    200, false, 13,
    array['nightlife', 'luxury', 'loud'],
    4,
    array['party', 'corporate', 'birthday'],
    32.7815, -96.7968, 'dallas'
  ),
  (
    v_owner,
    'FT33',
    'Chef-driven contemporary American with tasting menus and private dining for discerning groups seeking a fine-dining experience.',
    'Design District, Dallas, TX',
    'Contemporary',
    'https://images.unsplash.com/photo-1424844516934-089a0b86baab?w=800&q=80',
    45, false, 14,
    array['luxury', 'romantic', 'private-dining-focused'],
    4,
    array['date_night', 'dinner', 'corporate'],
    32.7978, -96.8234, 'dallas'
  ),
  (
    v_owner,
    'The Statler Dallas',
    'Historic hotel with multiple event venues, ballrooms, and on-site catering for large corporate conferences and galas.',
    'Downtown Dallas, TX',
    'American',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    350, false, 15,
    array['corporate', 'luxury', 'private-dining-focused'],
    4,
    array['corporate', 'party', 'birthday'],
    32.7802, -96.7988, 'dallas'
  );

  raise notice 'Seeded 15 Dallas restaurants for owner %', v_owner;
end $$;
