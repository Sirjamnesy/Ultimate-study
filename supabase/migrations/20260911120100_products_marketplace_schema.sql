-- Digital products marketplace schema.
--
-- Adds: products, product_purchases, product_progress, updates tables, plus
-- two storage buckets (product-files private, product-covers public).
--
-- Deliberately does NOT touch purchases/invite_codes/mark_user_paid — the
-- existing whole-app entitlement path stays untouched. Per-product ownership
-- is checked directly against product_purchases at the point content is
-- served, not folded into JWT app_metadata (see product_purchases below).

create extension if not exists pgcrypto;

-- ============================================================
-- products
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null check (type in ('course', 'pdf')),
  title text not null,
  subtitle text,
  description text,
  cover_image_url text,
  price_ngn_kobo integer not null check (price_ngn_kobo >= 0),
  price_usd_cents integer not null check (price_usd_cents >= 0),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  content jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is
  'Purchasable courses/PDFs. content shape depends on type: pdf -> {storage_path, page_count?}, course -> {modules: [{id, title, resources: [{id, title, type, url?, body?, duration?}]}]}. Writes go through service-role admin API routes only — no insert/update/delete policy for anon/authenticated.';

alter table public.products enable row level security;

create policy "public can read published products"
  on public.products for select
  to anon, authenticated
  using (status = 'published');

-- ============================================================
-- product_purchases
-- ============================================================
create table if not exists public.product_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  product_id uuid not null references public.products(id),
  paystack_reference text not null unique,
  amount numeric not null,
  currency text not null,
  status text not null default 'completed',
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

comment on table public.product_purchases is
  'Per-product purchase records, separate from purchases (whole-app entitlement) to avoid a missed product_id filter silently granting the wrong access. Ownership is checked here directly (indexed query), not via JWT app_metadata. Written only by the webhook/verify-payment routes via the service-role client.';

alter table public.product_purchases enable row level security;

create policy "users can read own product purchases"
  on public.product_purchases for select
  to authenticated
  using (user_id = auth.uid());

-- ============================================================
-- product_progress
-- ============================================================
create table if not exists public.product_progress (
  user_id uuid not null references auth.users(id),
  product_id uuid not null references public.products(id),
  completed_resource_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

comment on table public.product_progress is
  'Per-user completion tracking for purchased courses, kept separate from user_progress (the free roadmap gamification data). Low-stakes, so unlike products/product_purchases the owning user may read/write directly under RLS.';

alter table public.product_progress enable row level security;

create policy "users manage own product progress"
  on public.product_progress for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- updates (changelog / announcements feed)
-- ============================================================
create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('ai-news', 'product-update', 'service-update')),
  body text not null,
  cover_image_url text,
  published_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.updates is
  'Public changelog/announcements feed. published_at null = draft, hidden from /updates. Writes go through service-role admin API routes only.';

alter table public.updates enable row level security;

create policy "public can read published updates"
  on public.updates for select
  to anon, authenticated
  using (published_at is not null and published_at <= now());

-- ============================================================
-- Storage buckets
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-files', 'product-files', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('product-covers', 'product-covers', true)
on conflict (id) do nothing;

-- product-covers: bucket is public, but storage.objects still needs an
-- explicit select policy for anon/authenticated to read via the API.
create policy "public can read product covers"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-covers');

-- product-files: intentionally NO policies for anon/authenticated on this
-- bucket. Access is exclusively via short-lived signed URLs created
-- server-side with the service-role key (which bypasses RLS), after an
-- explicit product_purchases ownership check.
