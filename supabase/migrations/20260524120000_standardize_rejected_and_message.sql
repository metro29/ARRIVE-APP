-- Phase 1.5: unify status "rejected" + messages.message column
-- Run once in Supabase SQL Editor (after prior migrations).

-- 1. booking_status: declined → rejected
do $$
begin
  if exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'booking_status' and e.enumlabel = 'declined'
  ) then
    alter type public.booking_status rename value 'declined' to 'rejected';
  elsif not exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'booking_status' and e.enumlabel = 'rejected'
  ) then
    alter type public.booking_status add value 'rejected';
  end if;
end $$;

-- 2. messages.body → message (if legacy column exists)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'messages'
      and column_name = 'body'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'messages'
      and column_name = 'message'
  ) then
    alter table public.messages rename column body to message;
  end if;
end $$;

-- 3. Simplified status transition trigger (MVP: pending → accepted | rejected)
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
