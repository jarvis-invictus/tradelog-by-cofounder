alter table public.profiles
  add column if not exists onboarding_complete boolean not null default false,
  add column if not exists mt5_connected boolean not null default false;
