-- Phase 6: Production restaurant operations (Houston metro launch)

create type public.restaurant_status as enum (
  'active',
  'inactive',
  'pending_onboarding'
);

alter table public.restaurants
  add column if not exists status public.restaurant_status not null default 'active',
  add column if not exists is_visible boolean not null default true,
  add column if not exists subscription_status text not null default 'none';

-- Seed rows may exist before an owner is assigned
alter table public.restaurants
  alter column owner_id drop not null;

alter table public.restaurants
  drop constraint if exists restaurants_owner_id_fkey;

alter table public.restaurants
  add constraint restaurants_owner_id_fkey
  foreign key (owner_id) references public.users_profile (id) on delete set null;

create index if not exists restaurants_status_visible_idx
  on public.restaurants (status, is_visible)
  where status = 'active' and is_visible = true;

create index if not exists restaurants_city_status_idx
  on public.restaurants (city, status, is_visible);

create index if not exists restaurants_subscription_status_idx
  on public.restaurants (subscription_status);

-- Backfill existing rows
update public.restaurants
set status = 'active', is_visible = true
where status is null or is_visible is null;

-- Admin + owner write access (phase b migration left only insert)
drop policy if exists "Owners update own restaurants" on public.restaurants;
drop policy if exists "Owners delete own restaurants" on public.restaurants;
drop policy if exists "Admins manage restaurants" on public.restaurants;

create policy "Owners update own restaurants"
  on public.restaurants for update
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

create policy "Owners delete own restaurants"
  on public.restaurants for delete
  using (owner_id = auth.uid() or public.is_admin());

create policy "Admins manage restaurants"
  on public.restaurants for all
  using (public.is_admin())
  with check (public.is_admin());
