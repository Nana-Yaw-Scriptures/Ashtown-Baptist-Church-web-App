-- =============================================================
-- Media role + Gallery
-- Run this in the Supabase SQL editor AFTER schema.sql.
--
-- IMPORTANT: run STEP 1 on its own first (press Run), then run the
-- rest. Postgres will not let a brand-new enum value be used in the
-- same transaction it was created in.
-- =============================================================

-- ---------- STEP 1: add the media role (run this alone first) ----------
alter type user_role add value if not exists 'media';

-- ---------- STEP 2: everything below (run after step 1) ----------

-- Staff = admin or media. Media can manage content; admin can do all.
create or replace function public.is_staff()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'media')
  );
$$;

-- Sermons and events: allow staff (admin + media) to manage them.
drop policy if exists "admins manage sermons" on public.sermons;
create policy "staff manage sermons"
  on public.sermons for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists "admins manage events" on public.events;
create policy "staff manage events"
  on public.events for all
  using (public.is_staff()) with check (public.is_staff());

-- Giving, prayer, and members keep their existing admin-only policies.
-- Nothing to change there — media has no access by design.

-- ---------- Gallery ----------
create table if not exists public.gallery (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  caption text,
  category text not null default 'photo',  -- 'photo' | 'flyer'
  image_url text not null,
  storage_path text,
  created_by uuid references public.profiles(id) on delete set null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.gallery enable row level security;

create policy "anyone reads published gallery"
  on public.gallery for select
  using (published or public.is_staff());

create policy "staff manage gallery"
  on public.gallery for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- Storage bucket for gallery images ----------
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Public bucket = images are readable by their public URL.
-- Only staff may upload, change, or remove files.
create policy "staff upload gallery files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and public.is_staff());

create policy "staff update gallery files"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery' and public.is_staff());

create policy "staff delete gallery files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and public.is_staff());
