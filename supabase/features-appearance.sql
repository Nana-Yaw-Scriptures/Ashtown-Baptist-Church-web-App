-- =============================================================
-- Appearance: a staff-editable hero background image.
-- Run in the Supabase SQL editor AFTER schema.sql and media-gallery.sql
-- (this uses the is_staff() helper created by media-gallery.sql).
-- =============================================================

create table if not exists public.site_settings (
  id text primary key default 'main',
  hero_image_url text,
  hero_image_path text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values ('main') on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "anyone reads site settings"
  on public.site_settings for select using (true);

create policy "staff update site settings"
  on public.site_settings for update
  using (public.is_staff()) with check (public.is_staff());

-- Storage bucket for site images (hero background, etc.)
insert into storage.buckets (id, name, public)
values ('site', 'site', true)
on conflict (id) do nothing;

create policy "staff upload site images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site' and public.is_staff());
create policy "staff update site images"
  on storage.objects for update to authenticated
  using (bucket_id = 'site' and public.is_staff());
create policy "staff delete site images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site' and public.is_staff());
