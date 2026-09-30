-- =============================================================
-- Membership directory
-- Run in the Supabase SQL editor AFTER schema.sql.
-- These are church membership records, separate from website
-- accounts (profiles). They have no login.
-- =============================================================

create table if not exists public.members (
  id uuid primary key default uuid_generate_v4(),
  -- photo
  photo_url text,
  photo_path text,
  -- personal
  name text not null,
  date_of_birth text,
  place_of_birth text,
  contact1 text,
  contact2 text,
  nationality text,
  language_spoken text,
  home_town text,
  region text,
  -- family
  marital_status text,
  marriage_date text,
  marriage_type text,
  spouse_name text,
  spouse_status text,
  father_name text,
  father_status text,
  father_membership text,
  father_contact text,
  mother_name text,
  mother_status text,
  mother_membership text,
  mother_contact text,
  -- residence
  postal_address text,
  email text,
  location_city text,
  locality_street text,
  gps_address text,
  -- work
  employment_type text,
  work_nature text,
  business_name_location text,
  school_name_location text,
  education_level text,
  -- baptism
  baptized text,
  baptism_date text,
  baptism_type text,
  tithe_card_no text,
  welfare_card_no text,
  -- groupings
  areas_of_ministry text[] default '{}',
  sunday_school text,
  house_fellowship text,
  committee text,
  committee_other text,
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;

-- Admin-only: the directory is not public and members cannot see it.
create policy "admins read members" on public.members for select using (public.is_admin());
create policy "admins insert members" on public.members for insert with check (public.is_admin());
create policy "admins update members" on public.members for update using (public.is_admin());
create policy "admins delete members" on public.members for delete using (public.is_admin());

-- Storage bucket for member photos.
insert into storage.buckets (id, name, public)
values ('members', 'members', true)
on conflict (id) do nothing;

create policy "admins upload member photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'members' and public.is_admin());
create policy "admins update member photos"
  on storage.objects for update to authenticated
  using (bucket_id = 'members' and public.is_admin());
create policy "admins delete member photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'members' and public.is_admin());
