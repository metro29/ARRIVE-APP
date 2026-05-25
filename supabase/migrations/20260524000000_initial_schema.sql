-- Arrive Phase 1 schema + RLS (revised for scale-ready patterns)

create type public.user_role as enum ('user', 'restaurant_owner', 'admin');
create type public.booking_status as enum ('pending', 'accepted', 'rejected');

-- Profiles (authorization lives here, not user_metadata)
create table public.users_profile (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users_profile (id) on delete cascade,
  name text not null,
  description text not null default '',
  location text not null default '',
  cuisine_type text not null default '',
  image_url text not null default '',
  capacity integer not null default 50,
  is_featured boolean not null default false,
  display_rank integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users_profile (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  event_type text not null default 'private_dining',
  guest_count integer not null default 1,
  event_date date not null,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.event_packages (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  title text not null,
  description text not null default '',
  price_per_person numeric(10, 2) not null default 0
);

-- Messaging (structure for booking threads; UI ships later)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  sender_id uuid not null references public.users_profile (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index restaurants_owner_id_idx on public.restaurants (owner_id);
create index restaurants_featured_rank_idx on public.restaurants (is_featured desc, display_rank asc);
create index bookings_user_id_idx on public.bookings (user_id);
create index bookings_restaurant_id_idx on public.bookings (restaurant_id);
create index bookings_status_idx on public.bookings (status);
create index event_packages_restaurant_id_idx on public.event_packages (restaurant_id);
create index messages_booking_id_idx on public.messages (booking_id);
create index messages_created_at_idx on public.messages (booking_id, created_at);

-- RLS helpers
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users_profile
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users_profile where id = auth.uid();
$$;

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

-- Venue: pending → accepted | rejected (MVP)
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

  if old.status is not distinct from new.status then
    return new;
  end if;

  if public.owns_restaurant(old.restaurant_id) then
    if old.status = 'pending' and new.status in ('accepted', 'rejected') then
      return new;
    end if;
    raise exception 'Venue may only move pending → accepted or rejected';
  end if;

  raise exception 'Unauthorized booking status change';
end;
$$;

create trigger bookings_status_transition
  before update of status on public.bookings
  for each row execute function public.enforce_booking_status_transition();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profile (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    'user'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table public.users_profile enable row level security;
alter table public.restaurants enable row level security;
alter table public.bookings enable row level security;
alter table public.event_packages enable row level security;
alter table public.messages enable row level security;

-- users_profile
create policy "Users read own profile"
  on public.users_profile for select
  using (id = auth.uid() or public.is_admin());

create policy "Users update own profile"
  on public.users_profile for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "Users insert own profile"
  on public.users_profile for insert
  with check (id = auth.uid() or public.is_admin());

create policy "Admins delete profiles"
  on public.users_profile for delete
  using (public.is_admin());

-- restaurants: public read for discover/browse (anon + authenticated)
create policy "Public read restaurants"
  on public.restaurants for select
  using (true);

create policy "Owners insert own restaurants"
  on public.restaurants for insert
  with check (owner_id = auth.uid() or public.is_admin());

create policy "Owners update own restaurants"
  on public.restaurants for update
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

create policy "Owners delete own restaurants"
  on public.restaurants for delete
  using (owner_id = auth.uid() or public.is_admin());

-- bookings
create policy "Participants read bookings"
  on public.bookings for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.owns_restaurant(restaurant_id)
  );

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

create policy "Admins manage all bookings"
  on public.bookings for all
  using (public.is_admin())
  with check (public.is_admin());

-- event_packages: public read (venue marketing pages)
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
