-- ============================================
-- FontPreview SaaS Database Schema
-- Run this in your Supabase SQL editor
-- ============================================

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan text default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  font_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fonts table
create table public.fonts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  filename text not null,
  storage_path text not null,
  file_size int default 0,
  format text,
  collection text default 'Default',
  created_at timestamptz default now()
);

alter table public.fonts enable row level security;

create policy "Users can read own fonts"
  on public.fonts for select
  using (auth.uid() = user_id);

create policy "Users can insert own fonts"
  on public.fonts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own fonts"
  on public.fonts for delete
  using (auth.uid() = user_id);

create policy "Users can update own fonts"
  on public.fonts for update
  using (auth.uid() = user_id);

-- Update font_count on insert/delete
create or replace function public.update_font_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.profiles set font_count = font_count + 1 where id = NEW.user_id;
  elsif TG_OP = 'DELETE' then
    update public.profiles set font_count = font_count - 1 where id = OLD.user_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_font_change
  after insert or delete on public.fonts
  for each row execute function public.update_font_count();

-- Storage bucket for fonts (create via Supabase dashboard or API)
-- insert into storage.buckets (id, name, public) values ('fonts', 'fonts', false);
