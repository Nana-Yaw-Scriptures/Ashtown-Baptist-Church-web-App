-- =============================================================
-- Batch 1: announcements + contact messages
-- Run in the Supabase SQL editor AFTER schema.sql.
-- (Fund management and sermon search need no database changes.)
-- =============================================================

-- ---------- Announcements ----------
create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  message text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "anyone reads active announcements"
  on public.announcements for select
  using (active or public.is_admin());

create policy "admins manage announcements"
  on public.announcements for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Contact messages ----------
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  body text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone (signed in or not) can send a message.
create policy "anyone can send a message"
  on public.contact_messages for insert
  with check (true);

-- Only admins can read, update, or remove messages.
create policy "admins read messages"
  on public.contact_messages for select using (public.is_admin());
create policy "admins update messages"
  on public.contact_messages for update using (public.is_admin());
create policy "admins delete messages"
  on public.contact_messages for delete using (public.is_admin());
