-- GuitarPorn — Supabase schema
-- Safe to run multiple times: existing pieces are skipped or recreated.
-- Run in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

-- ============================================================
-- 1. Guitars table
-- ============================================================
create table if not exists public.guitars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  brand text not null check (
    brand in (
      'Gibson', 'Fender', 'PRS', 'ESP', 'Ibanez',
      'Miscellaneous', 'Boutique', 'Custom Made'
    )
  ),
  model text not null check (char_length(model) between 1 and 120),
  color text not null check (char_length(color) between 1 and 80),
  year int check (year between 1900 and 2100),
  image_url text not null,
  owner_name text,
  created_at timestamptz not null default now()
);

-- Migration for projects created before owner_name existed:
alter table public.guitars add column if not exists owner_name text;

create index if not exists guitars_brand_idx on public.guitars (brand);
create index if not exists guitars_created_idx on public.guitars (created_at desc);

-- ============================================================
-- 2. Base grants (visitors read, members write) + Row Level Security
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on public.guitars to anon, authenticated;
grant insert, update, delete on public.guitars to authenticated;

alter table public.guitars enable row level security;

drop policy if exists "Public read" on public.guitars;
create policy "Public read"
  on public.guitars for select
  using (true);

drop policy if exists "Members insert own" on public.guitars;
create policy "Members insert own"
  on public.guitars for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Members update own" on public.guitars;
create policy "Members update own"
  on public.guitars for update
  using (auth.uid() = owner_id);

drop policy if exists "Members delete own" on public.guitars;
create policy "Members delete own"
  on public.guitars for delete
  using (auth.uid() = owner_id);

-- ============================================================
-- 3. Storage bucket for guitar photos
--    (5 MB cap; the site also downscales images client-side before upload)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guitars', 'guitars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Public read guitar photos" on storage.objects;
create policy "Public read guitar photos"
  on storage.objects for select
  using (bucket_id = 'guitars');

drop policy if exists "Members upload own guitar photos" on storage.objects;
create policy "Members upload own guitar photos"
  on storage.objects for insert
  with check (
    bucket_id = 'guitars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Members delete own guitar photos" on storage.objects;
create policy "Members delete own guitar photos"
  on storage.objects for delete
  using (
    bucket_id = 'guitars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
