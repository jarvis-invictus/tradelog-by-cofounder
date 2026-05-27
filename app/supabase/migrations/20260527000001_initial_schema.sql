-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase Auth)
-- ============================================================
create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text,
  avatar_url   text,
  mt5_account_id text,
  plan_tier    text not null default 'free' check (plan_tier in ('free', 'pro')),
  razorpay_customer_id text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TRADES
-- ============================================================
create table public.trades (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  pair          text not null,
  side          text not null check (side in ('buy', 'sell')),
  lot_size      numeric(10,2) not null,
  entry_price   numeric(12,5) not null,
  exit_price    numeric(12,5),
  stop_loss     numeric(12,5),
  take_profit   numeric(12,5),
  pnl_inr       numeric(12,2),
  pnl_pips      numeric(8,1),
  session       text check (session in ('asian', 'london', 'new_york', 'overlap')),
  opened_at     timestamptz not null,
  closed_at     timestamptz,
  mt5_trade_id  text,
  status        text not null default 'open' check (status in ('open', 'closed')),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index trades_user_id_idx on public.trades(user_id);
create index trades_opened_at_idx on public.trades(opened_at desc);
create unique index trades_mt5_trade_id_unique on public.trades(mt5_trade_id) where mt5_trade_id is not null;

alter table public.trades enable row level security;

create policy "Users can manage own trades"
  on public.trades for all
  using (auth.uid() = user_id);

-- ============================================================
-- RULES
-- ============================================================
create table public.rules (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  type       text not null check (type in (
    'max_trades_per_day',
    'max_daily_loss_inr',
    'min_risk_reward',
    'no_trading_after_loss',
    'max_lot_size',
    'allowed_pairs',
    'allowed_sessions'
  )),
  label      text not null,
  threshold  jsonb not null,
  enabled    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index rules_user_id_idx on public.rules(user_id);

alter table public.rules enable row level security;

create policy "Users can manage own rules"
  on public.rules for all
  using (auth.uid() = user_id);

-- ============================================================
-- RULE VIOLATIONS
-- ============================================================
create table public.rule_violations (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.users(id) on delete cascade,
  rule_id          uuid not null references public.rules(id) on delete cascade,
  trade_id         uuid references public.trades(id) on delete set null,
  override_reason  text,
  overridden       boolean not null default false,
  occurred_at      timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

create index rule_violations_user_id_idx on public.rule_violations(user_id);
create index rule_violations_occurred_at_idx on public.rule_violations(occurred_at desc);

alter table public.rule_violations enable row level security;

create policy "Users can manage own rule violations"
  on public.rule_violations for all
  using (auth.uid() = user_id);

-- ============================================================
-- JOURNALS
-- ============================================================
create table public.journals (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  trade_id   uuid references public.trades(id) on delete set null,
  content    text not null,
  sentiment  text check (sentiment in ('positive', 'negative', 'neutral')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index journals_user_id_idx on public.journals(user_id);

alter table public.journals enable row level security;

create policy "Users can manage own journals"
  on public.journals for all
  using (auth.uid() = user_id);

-- ============================================================
-- INSIGHTS
-- ============================================================
create table public.insights (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  trade_id     uuid references public.trades(id) on delete set null,
  type         text not null check (type in ('post_trade', 'weekly', 'behavioral')),
  content      text not null,
  patterns     jsonb,
  generated_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index insights_user_id_idx on public.insights(user_id);
create index insights_generated_at_idx on public.insights(generated_at desc);

alter table public.insights enable row level security;

create policy "Users can read own insights"
  on public.insights for select
  using (auth.uid() = user_id);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references public.users(id) on delete cascade,
  razorpay_subscription_id text,
  razorpay_plan_id        text,
  status                  text not null default 'pending' check (status in ('active', 'cancelled', 'expired', 'pending')),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions(user_id);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ============================================================
-- updated_at trigger helper
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_users_updated_at       before update on public.users       for each row execute procedure public.set_updated_at();
create trigger set_trades_updated_at      before update on public.trades      for each row execute procedure public.set_updated_at();
create trigger set_rules_updated_at       before update on public.rules       for each row execute procedure public.set_updated_at();
create trigger set_journals_updated_at    before update on public.journals    for each row execute procedure public.set_updated_at();
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute procedure public.set_updated_at();
