-- Phase 2: Intelligent Event Discovery — restaurant enrichment columns
-- Safe additive migration; existing rows receive defaults.

alter table public.restaurants
  add column if not exists tags text[] not null default '{}',
  add column if not exists price_level integer not null default 2,
  add column if not exists event_types text[] not null default '{}',
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'restaurants_price_level_check'
      and conrelid = 'public.restaurants'::regclass
  ) then
    alter table public.restaurants
      add constraint restaurants_price_level_check
      check (price_level between 1 and 4);
  end if;
end $$;

create index if not exists restaurants_tags_gin_idx
  on public.restaurants using gin (tags);

create index if not exists restaurants_event_types_gin_idx
  on public.restaurants using gin (event_types);

create index if not exists restaurants_cuisine_type_idx
  on public.restaurants (cuisine_type);

create index if not exists restaurants_price_level_idx
  on public.restaurants (price_level);
