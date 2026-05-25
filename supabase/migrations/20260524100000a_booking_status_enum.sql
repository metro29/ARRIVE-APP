-- STEP A — Run this FIRST in Supabase SQL Editor, then run 20260524100000b_...
-- Postgres requires new enum values to commit before use in the same session.

-- If your old schema used "rejected", rename it (no new value needed)
do $$
begin
  if exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'booking_status'
      and e.enumlabel = 'rejected'
  ) then
    alter type public.booking_status rename value 'rejected' to 'declined';
  end if;
end $$;

-- Add "declined" only when "rejected" was never present
do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'booking_status'
      and e.enumlabel = 'declined'
  ) then
    alter type public.booking_status add value 'declined';
  end if;
end $$;

alter type public.booking_status add value if not exists 'confirmed';
alter type public.booking_status add value if not exists 'cancelled';
alter type public.booking_status add value if not exists 'completed';
