-- STEP B — Run AFTER 20260524100000a_booking_status_enum.sql succeeds.
-- Run this ONLY if you already applied the original initial_schema (old version).

-- ---------------------------------------------------------------------------
-- 1. Restaurants: featured + public discover fields
-- ---------------------------------------------------------------------------
alter table public.restaurants
  add column if not exists is_featured boolean not null default false,
  add column if not exists display_rank integer not null default 0;

create index if not exists restaurants_featured_rank_idx
  on public.restaurants (is_featured desc, display_rank asc);

-- ---------------------------------------------------------------------------
-- 2. Messages table
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  sender_id uuid not null references public.users_profile (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_booking_id_idx on public.messages (booking_id);
create index if not exists messages_created_at_idx on public.messages (booking_id, created_at);

alter table public.messages enable row level security;

-- ---------------------------------------------------------------------------
-- 3. Helper functions + booking status trigger
-- ---------------------------------------------------------------------------
create or replace function public.owns_restaurant(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.restaurants
    where id = p_restaurant_id and owner_id = auth.uid()
  );
$$;

create or replace function public.can_access_booking(p_booking_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.bookings b
    where b.id = p_booking_id
      and (
        public.is_admin()
        or b.user_id = auth.uid()
        or public.owns_restaurant(b.restaurant_id)
      )
  );
$$;

create or replace function public.enforce_booking_status_transition()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if auth.uid() = old.user_id and not public.owns_restaurant(old.restaurant_id) then
    if row(
      new.user_id, new.restaurant_id, new.event_type, new.guest_count, new.event_date
    ) is distinct from row(
      old.user_id, old.restaurant_id, old.event_type, old.guest_count, old.event_date
    ) then
      raise exception 'Guests may not edit event details after submission';
    end if;
  end if;

  if old.status is not distinct from new.status then
    return new;
  end if;

  if auth.uid() = old.user_id then
    if new.status = 'cancelled'
      and old.status in ('pending', 'accepted', 'confirmed') then
      return new;
    end if;
    raise exception 'Guests may only cancel their booking (pending/accepted/confirmed → cancelled)';
  end if;

  if public.owns_restaurant(old.restaurant_id) then
    if old.status = 'pending' and new.status in ('accepted', 'declined') then
      return new;
    end if;
    if old.status = 'accepted' and new.status = 'confirmed' then
      return new;
    end if;
    if old.status = 'confirmed' and new.status = 'completed' then
      return new;
    end if;
    raise exception 'Invalid venue status transition from % to %', old.status, new.status;
  end if;

  raise exception 'Unauthorized booking status change';
end;
$$;

drop trigger if exists bookings_status_transition on public.bookings;
create trigger bookings_status_transition
  before update of status on public.bookings
  for each row execute function public.enforce_booking_status_transition();

-- ---------------------------------------------------------------------------
-- 4. Replace sloppy / overlapping policies
-- ---------------------------------------------------------------------------

-- restaurants
drop policy if exists "Anyone authenticated can view restaurants" on public.restaurants;
drop policy if exists "Public read restaurants" on public.restaurants;
drop policy if exists "Admins full restaurants" on public.restaurants;
drop policy if exists "Owners manage own restaurants" on public.restaurants;

create policy "Public read restaurants"
  on public.restaurants for select
  using (true);

drop policy if exists "Owners insert own restaurants" on public.restaurants;
create policy "Owners insert own restaurants"
  on public.restaurants for insert
  with check (owner_id = auth.uid() or public.is_admin());

-- bookings
drop policy if exists "Users view own bookings" on public.bookings;
drop policy if exists "Users update own bookings" on public.bookings;
drop policy if exists "Restaurant owners update restaurant bookings" on public.bookings;
drop policy if exists "Participants read bookings" on public.bookings;
drop policy if exists "Guests cancel own bookings" on public.bookings;
drop policy if exists "Owners update restaurant bookings" on public.bookings;

create policy "Participants read bookings"
  on public.bookings for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.owns_restaurant(restaurant_id)
  );

drop policy if exists "Users create own bookings" on public.bookings;
create policy "Users create own bookings"
  on public.bookings for insert
  with check (
    (user_id = auth.uid() and status = 'pending')
    or public.is_admin()
  );

create policy "Guests cancel own bookings"
  on public.bookings for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Owners update restaurant bookings"
  on public.bookings for update
  using (public.owns_restaurant(restaurant_id))
  with check (public.owns_restaurant(restaurant_id));

drop policy if exists "Admins delete bookings" on public.bookings;
drop policy if exists "Admins manage all bookings" on public.bookings;
create policy "Admins manage all bookings"
  on public.bookings for all
  using (public.is_admin())
  with check (public.is_admin());

-- event_packages
drop policy if exists "Authenticated view packages" on public.event_packages;
drop policy if exists "Public read event packages" on public.event_packages;
drop policy if exists "Owners manage packages" on public.event_packages;
drop policy if exists "Owners insert packages" on public.event_packages;
drop policy if exists "Owners update packages" on public.event_packages;
drop policy if exists "Owners delete packages" on public.event_packages;
drop policy if exists "Admins manage all packages" on public.event_packages;

create policy "Public read event packages"
  on public.event_packages for select
  using (true);

create policy "Owners insert packages"
  on public.event_packages for insert
  with check (public.owns_restaurant(restaurant_id) or public.is_admin());

create policy "Owners update packages"
  on public.event_packages for update
  using (public.owns_restaurant(restaurant_id) or public.is_admin())
  with check (public.owns_restaurant(restaurant_id) or public.is_admin());

create policy "Owners delete packages"
  on public.event_packages for delete
  using (public.owns_restaurant(restaurant_id) or public.is_admin());

create policy "Admins manage all packages"
  on public.event_packages for all
  using (public.is_admin())
  with check (public.is_admin());

-- messages
drop policy if exists "Participants read messages" on public.messages;
drop policy if exists "Participants send messages" on public.messages;
drop policy if exists "Admins manage messages" on public.messages;

create policy "Participants read messages"
  on public.messages for select
  using (public.can_access_booking(booking_id));

create policy "Participants send messages"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and public.can_access_booking(booking_id)
  );

create policy "Admins manage messages"
  on public.messages for all
  using (public.is_admin())
  with check (public.is_admin());
