-- Create archived_clients table
-- نفّذ هذا الملف في Supabase → SQL Editor

-- Create the archived_clients table
create table if not exists public.archived_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null,
  archived_at timestamptz not null default now(),
  final_payment_id uuid null,
  notes text null,
  created_at timestamptz not null default now(),
  
  -- Ensure unique client per user
  unique(user_id, client_name)
);

-- Enable RLS
alter table public.archived_clients enable row level security;

-- Create RLS policies
create policy "Users can view their own archived clients"
  on public.archived_clients
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own archived clients"
  on public.archived_clients
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own archived clients"
  on public.archived_clients
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own archived clients"
  on public.archived_clients
  for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists archived_clients_user_id_idx 
  on public.archived_clients(user_id);

create index if not exists archived_clients_client_name_idx 
  on public.archived_clients(user_id, client_name);
