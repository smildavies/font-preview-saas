-- ============================================
-- FontPreview SaaS v2 - New Tables
-- Run this in your Supabase SQL editor
-- ============================================

-- Brand kits table
create table if not exists public.brand_kits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  heading_font text,
  body_font text,
  colors jsonb default '[]',
  created_at timestamptz default now()
);

alter table public.brand_kits enable row level security;

create policy "Users can read own brand kits"
  on public.brand_kits for select
  using (auth.uid() = user_id);

create policy "Users can insert own brand kits"
  on public.brand_kits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own brand kits"
  on public.brand_kits for update
  using (auth.uid() = user_id);

create policy "Users can delete own brand kits"
  on public.brand_kits for delete
  using (auth.uid() = user_id);

-- Shared collections
create table if not exists public.shared_collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text,
  fonts jsonb not null,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table public.shared_collections enable row level security;

create policy "Users can read own shared collections"
  on public.shared_collections for select
  using (auth.uid() = user_id);

create policy "Users can insert own shared collections"
  on public.shared_collections for insert
  with check (auth.uid() = user_id);

create policy "Anyone can read shared collections by id"
  on public.shared_collections for select
  using (true);

-- Votes on shared collections (public - no auth needed)
create table if not exists public.votes (
  id uuid default gen_random_uuid() primary key,
  collection_id uuid references public.shared_collections(id) on delete cascade,
  font_name text not null,
  vote int check (vote in (-1, 1)),
  voter_name text,
  created_at timestamptz default now()
);

alter table public.votes enable row level security;

create policy "Anyone can read votes"
  on public.votes for select
  using (true);

create policy "Anyone can insert votes"
  on public.votes for insert
  with check (true);
