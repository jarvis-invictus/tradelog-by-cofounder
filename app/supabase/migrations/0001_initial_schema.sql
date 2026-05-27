create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text, email text, avatar_url text,
  plan text not null default 'free',
  language text not null default 'en',
  currency text not null default 'INR',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.mt5_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  account_id text not null, broker text, login text,
  is_active boolean default true,
  synced_at timestamptz, created_at timestamptz default now()
);

create table public.trades (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  mt5_account_id uuid references public.mt5_accounts(id),
  ticket bigint, symbol text not null, type text not null,
  lot_size numeric(10,2), open_price numeric(12,5), close_price numeric(12,5),
  open_time timestamptz, close_time timestamptz,
  pnl numeric(12,2), currency text default 'INR',
  notes text, tags text[], is_manual boolean default false,
  created_at timestamptz default now()
);

create table public.rules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  rule_type text not null,  -- 'max_trades_per_day' | 'max_daily_loss' | 'min_rr_ratio' | 'custom'
  threshold numeric, threshold_unit text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.rule_violations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  rule_id uuid references public.rules(id),
  trade_id uuid references public.trades(id),
  overridden boolean default false,
  override_reason text,
  triggered_at timestamptz default now()
);

create table public.insights (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,  -- 'post_trade' | 'weekly' | 'pattern'
  content text not null,
  trade_id uuid references public.trades(id),
  period_start timestamptz, period_end timestamptz,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.mt5_accounts enable row level security;
alter table public.trades enable row level security;
alter table public.rules enable row level security;
alter table public.rule_violations enable row level security;
alter table public.insights enable row level security;

create policy "profiles: own" on public.profiles for all using (auth.uid() = id);
create policy "mt5_accounts: own" on public.mt5_accounts for all using (auth.uid() = user_id);
create policy "trades: own" on public.trades for all using (auth.uid() = user_id);
create policy "rules: own" on public.rules for all using (auth.uid() = user_id);
create policy "rule_violations: own" on public.rule_violations for all using (auth.uid() = user_id);
create policy "insights: own" on public.insights for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
