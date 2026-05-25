-- Phase 5: Multi-city expansion readiness (additive, non-breaking)

alter table public.restaurants
  add column if not exists city text not null default 'dallas';

alter table public.users_profile
  add column if not exists preferred_city text;

create index if not exists restaurants_city_idx
  on public.restaurants (city);

create index if not exists restaurants_city_featured_rank_idx
  on public.restaurants (city, is_featured desc, display_rank asc);

create index if not exists users_profile_preferred_city_idx
  on public.users_profile (preferred_city)
  where preferred_city is not null;
