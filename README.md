# Arrive — Phase 1 Foundation

Production-grade SaaS foundation for event venue discovery and booking requests.

## Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Auth + Postgres + RLS)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Database setup

1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/btiqweogszdlzlovrctm/sql/new).
2. Run migrations in order:
   - **Fresh project:** `supabase/migrations/20260524000000_initial_schema.sql` only
   - **Already ran the old schema:** run in order:
     1. `20260524100000a_booking_status_enum.sql`
     2. `20260524100000b_rls_and_lifecycle_improvements.sql`
3. (Optional) Seed restaurants after creating a `restaurant_owner` user — see `supabase/seed.sql`.

### Roles

New signups default to `user`. Promote roles in SQL:

```sql
update public.users_profile set role = 'restaurant_owner' where id = '<user-uuid>';
update public.users_profile set role = 'admin' where id = '<user-uuid>';
```

### Live bookings

Discover uses mock venues until rows exist in `restaurants`. To enable real booking requests, insert restaurants with a valid `owner_id` (see seed file). Mock venues show a clear error when requesting events.

## Naming conventions (do not mix)

| Concept | Canonical value |
|--------|------------------|
| Booking statuses | **`pending`**, **`accepted`**, **`rejected`** only |
| Message column | **`messages.message`** — not `body` |
| Constants | `src/lib/booking-status.ts`, `src/lib/schema-contract.ts` |

**Existing DB:** run `supabase/migrations/20260524120000_standardize_rejected_and_message.sql`

**Phase 2 prep:** `src/types/discover.ts`, `src/lib/ai/`, `src/components/discover/`

## Architecture

```
src/
  app/
    (public)/     Landing
    (auth)/       Login, signup
    (dashboard)/  User: dashboard, discover, restaurant/[id], bookings, settings
    (restaurant)/ Owner: /restaurant/dashboard, bookings, menu, settings
    (admin)/      Admin: /admin/*
  components/
    ui/           shadcn
    shared/       Layout, forms, empty states
    cards/        Restaurant, booking, stat cards
  lib/
    supabaseClient.ts
    supabase/server.ts
    auth.ts
    roleGuard.ts
  types/
    index.ts
  middleware.ts   Session + RBAC
```

## Auth redirects

| Role              | Home route              |
|-------------------|-------------------------|
| user              | `/dashboard`            |
| restaurant_owner  | `/restaurant/dashboard` |
| admin             | `/admin/dashboard`      |

## Phase 2 (not built yet)

- AI assistant, advanced filters, payments
- Booking accept/reject workflow
- Profile editing, messaging, event package CRUD
