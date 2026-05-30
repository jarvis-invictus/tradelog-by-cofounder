-- ============================================================
-- TRADELOG — DEFINITIVE SCHEMA FIX
-- Safe to run on an existing DB. Idempotent.
-- ============================================================

-- 1. Add missing columns to profiles (if not already present)
alter table public.profiles
  add column if not exists onboarding_complete boolean not null default false,
  add column if not exists mt5_connected boolean not null default false,
  add column if not exists mt5_account_id text,
  add column if not exists currency text not null default 'INR',
  add column if not exists updated_at timestamptz default now();

-- 2. Fix trades table — rename old columns if they still exist, add new ones
do $$
begin
  -- symbol -> pair
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='trades' and column_name='symbol') then
    alter table public.trades rename column symbol to pair;
  end if;
  -- type -> side
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='trades' and column_name='type') then
    alter table public.trades rename column type to side;
  end if;
  -- open_price -> entry_price
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='trades' and column_name='open_price') then
    alter table public.trades rename column open_price to entry_price;
  end if;
  -- close_price -> exit_price
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='trades' and column_name='close_price') then
    alter table public.trades rename column close_price to exit_price;
  end if;
  -- pnl -> pnl_inr
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='trades' and column_name='pnl') then
    alter table public.trades rename column pnl to pnl_inr;
  end if;
  -- open_time -> opened_at
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='trades' and column_name='open_time') then
    alter table public.trades rename column open_time to opened_at;
  end if;
  -- close_time -> closed_at
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='trades' and column_name='close_time') then
    alter table public.trades rename column close_time to closed_at;
  end if;
end $$;

-- Add missing trades columns if not present
alter table public.trades
  add column if not exists pnl_pips numeric,
  add column if not exists session text,
  add column if not exists status text not null default 'open',
  add column if not exists mt5_trade_id text,
  add column if not exists stop_loss numeric,
  add column if not exists take_profit numeric;

-- 3. Fix rules table — rename old columns if they still exist
do $$
begin
  -- rule_type -> type
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='rules' and column_name='rule_type') then
    alter table public.rules rename column rule_type to type;
  end if;
  -- name -> label
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='rules' and column_name='name') then
    alter table public.rules rename column name to label;
  end if;
  -- is_active -> enabled
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='rules' and column_name='is_active') then
    alter table public.rules rename column is_active to enabled;
  end if;
end $$;

-- Add missing rules columns
alter table public.rules
  add column if not exists updated_at timestamptz default now();

-- Convert threshold to jsonb if it is not already
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='rules'
    and column_name='threshold' and data_type != 'jsonb'
  ) then
    alter table public.rules alter column threshold type jsonb using to_jsonb(threshold);
  end if;
end $$;

alter table public.rules drop column if exists threshold_unit;

-- 4. Fix rule_violations — rename triggered_at -> occurred_at if needed
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='rule_violations' and column_name='triggered_at') then
    alter table public.rule_violations rename column triggered_at to occurred_at;
  end if;
end $$;

alter table public.rule_violations
  add column if not exists created_at timestamptz default now();

-- 5. Create journals table if missing
create table if not exists public.journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  trade_id uuid references public.trades(id) on delete set null,
  content text not null,
  sentiment text not null check (sentiment in ('positive','negative','neutral')),
  created_at timestamptz default now()
);

-- 6. Recreate insights table with correct schema
-- (drop and recreate only if it has wrong foreign key to users)
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu on tc.constraint_name = kcu.constraint_name
    join information_schema.referential_constraints rc on tc.constraint_name = rc.constraint_name
    join information_schema.table_constraints tc2 on rc.unique_constraint_name = tc2.constraint_name
    where tc.table_name = 'insights' and tc2.table_name = 'users'
  ) then
    drop table if exists public.insights cascade;
  end if;
end $$;

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  trade_id uuid references public.trades(id) on delete set null,
  type text not null check (type in ('post_trade','weekly','behavioral')),
  content text not null,
  patterns jsonb default '{}',
  generated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 7. RLS — enable on all tables and create clean policies

-- profiles
alter table public.profiles enable row level security;
drop policy if exists "profiles: own" on public.profiles;
create policy "profiles_all" on public.profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- trades
alter table public.trades enable row level security;
drop policy if exists "trades: own" on public.trades;
drop policy if exists "trades_all" on public.trades;
create policy "trades_all" on public.trades for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- rules
alter table public.rules enable row level security;
drop policy if exists "rules: own" on public.rules;
drop policy if exists "Users can view own rules" on public.rules;
drop policy if exists "Users can create own rules" on public.rules;
drop policy if exists "Users can update own rules" on public.rules;
drop policy if exists "Users can delete own rules" on public.rules;
drop policy if exists "rules_select" on public.rules;
drop policy if exists "rules_insert" on public.rules;
drop policy if exists "rules_update" on public.rules;
drop policy if exists "rules_delete" on public.rules;
create policy "rules_select" on public.rules for select to authenticated using (auth.uid() = user_id);
create policy "rules_insert" on public.rules for insert to authenticated with check (auth.uid() = user_id);
create policy "rules_update" on public.rules for update to authenticated using (auth.uid() = user_id);
create policy "rules_delete" on public.rules for delete to authenticated using (auth.uid() = user_id);

-- rule_violations
alter table public.rule_violations enable row level security;
drop policy if exists "rule_violations: own" on public.rule_violations;
drop policy if exists "rule_violations_all" on public.rule_violations;
create policy "rule_violations_all" on public.rule_violations for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- journals
alter table public.journals enable row level security;
drop policy if exists "journals_all" on public.journals;
create policy "journals_all" on public.journals for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- insights
alter table public.insights enable row level security;
drop policy if exists "insights_all" on public.insights;
create policy "insights_all" on public.insights for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 8. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
