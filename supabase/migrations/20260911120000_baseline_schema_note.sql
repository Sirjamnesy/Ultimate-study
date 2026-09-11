-- Baseline reference migration.
--
-- This is the first migration tracked in git for this project. Prior schema
-- changes (user_progress, purchases, invite_codes tables; mark_user_paid and
-- mark_user_admin functions; RLS policies on those tables) were applied ad hoc
-- via the Supabase dashboard/MCP and are NOT captured as migrations here.
--
-- This migration is intentionally non-destructive (COMMENT ON only) — it just
-- gives future migrations a documented starting point. A full retrofit of the
-- pre-existing tables' RLS policies into version-controlled migrations is
-- recommended future work, not done here.

comment on table public.user_progress is
  'Hybrid localStorage+Supabase progress store. One row per user_id, RLS restricts access to the owning user (policy defined outside of migration history).';

comment on table public.purchases is
  'Single global "unlock whole app" purchase record. One row per completed Paystack transaction for the ₦20,000/$15 whole-app product. Do not add a product_id column here — per-product purchases live in product_purchases instead, to avoid touching this revenue-critical path.';

comment on table public.invite_codes is
  'Manually managed invite codes granting whole-app access via mark_user_paid. Managed via the Supabase Table Editor.';
