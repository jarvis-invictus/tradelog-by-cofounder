alter table public.users
  add column if not exists onboarding_complete boolean not null default false,
  add column if not exists language text not null default 'en',
  add column if not exists mt5_connected boolean not null default false;
