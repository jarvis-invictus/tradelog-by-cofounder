-- RLS policies for rules table to allow CRUD operations
alter table public.rules enable row level security;

-- Allow authenticated users to select their own rules
create policy if not exists "Users can view own rules"
  on public.rules
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Allow authenticated users to insert their own rules
create policy if not exists "Users can create own rules"
  on public.rules
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow authenticated users to update their own rules
create policy if not exists "Users can update own rules"
  on public.rules
  for update
  to authenticated
  using (auth.uid() = user_id);

-- Allow authenticated users to delete their own rules
create policy if not exists "Users can delete own rules"
  on public.rules
  for delete
  to authenticated
  using (auth.uid() = user_id);
