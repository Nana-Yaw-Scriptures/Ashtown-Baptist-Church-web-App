-- =============================================================
-- Ashtown Baptist Church App — database schema
-- Run this in the Supabase SQL editor (or via the CLI) on a new project.
-- It creates tables, relationships, row-level security, and the
-- trigger that gives every new auth user a profile row.
-- =============================================================

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";

-- ---------- Enums ----------
do $$ begin
  create type user_role as enum ('member', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_type as enum ('audio', 'video');
exception when duplicate_object then null; end $$;

do $$ begin
  create type prayer_status as enum ('open', 'answered', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type donation_status as enum ('pending', 'succeeded', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

-- =============================================================
-- profiles — one row per auth user
-- =============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role user_role not null default 'member',
  created_at timestamptz not null default now()
);

-- Auto-create a profile whenever a new auth user is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =============================================================
-- funds — categories money can be given to
-- =============================================================
create table if not exists public.funds (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =============================================================
-- sermons
-- =============================================================
create table if not exists public.sermons (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  speaker text not null,
  description text,
  scripture text,
  series text,
  media_type media_type not null default 'video',
  media_url text not null,
  thumbnail_url text,
  duration_seconds int,
  preached_on date not null default current_date,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- =============================================================
-- events
-- =============================================================
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  location text,
  category text,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity int,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- =============================================================
-- prayer requests
-- =============================================================
create table if not exists public.prayer_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  is_anonymous boolean not null default false,
  is_public boolean not null default true,
  status prayer_status not null default 'open',
  created_at timestamptz not null default now()
);

-- One row per person who taps "I prayed" on a request.
create table if not exists public.prayer_interactions (
  id uuid primary key default uuid_generate_v4(),
  prayer_request_id uuid not null references public.prayer_requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (prayer_request_id, user_id)
);

-- =============================================================
-- donations
-- =============================================================
create table if not exists public.donations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  fund_id uuid references public.funds(id) on delete set null,
  amount_cents int not null,
  currency text not null default 'cad',
  status donation_status not null default 'pending',
  stripe_session_id text,
  stripe_payment_intent text,
  donor_email text,
  created_at timestamptz not null default now()
);

-- =============================================================
-- Row-level security
-- =============================================================
alter table public.profiles enable row level security;
alter table public.funds enable row level security;
alter table public.sermons enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.prayer_interactions enable row level security;
alter table public.donations enable row level security;

-- ----- profiles -----
create policy "profiles are readable by their owner"
  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "users update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "admins update any profile"
  on public.profiles for update using (public.is_admin());

-- ----- funds (public read, admin write) -----
create policy "anyone can read active funds"
  on public.funds for select using (is_active or public.is_admin());
create policy "admins manage funds"
  on public.funds for all using (public.is_admin()) with check (public.is_admin());

-- ----- sermons (public read published, admin write) -----
create policy "anyone can read published sermons"
  on public.sermons for select using (published or public.is_admin());
create policy "admins manage sermons"
  on public.sermons for all using (public.is_admin()) with check (public.is_admin());

-- ----- events -----
create policy "anyone can read published events"
  on public.events for select using (published or public.is_admin());
create policy "admins manage events"
  on public.events for all using (public.is_admin()) with check (public.is_admin());

-- ----- event registrations -----
create policy "users see own registrations"
  on public.event_registrations for select
  using (auth.uid() = user_id or public.is_admin());
create policy "users register themselves"
  on public.event_registrations for insert with check (auth.uid() = user_id);
create policy "users cancel own registration"
  on public.event_registrations for delete using (auth.uid() = user_id);

-- ----- prayer requests -----
create policy "read public prayers or own or admin"
  on public.prayer_requests for select
  using (is_public or auth.uid() = user_id or public.is_admin());
create policy "members create prayers"
  on public.prayer_requests for insert with check (auth.uid() = user_id);
create policy "owner or admin update prayer"
  on public.prayer_requests for update
  using (auth.uid() = user_id or public.is_admin());
create policy "owner or admin delete prayer"
  on public.prayer_requests for delete
  using (auth.uid() = user_id or public.is_admin());

-- ----- prayer interactions -----
create policy "read prayer interactions"
  on public.prayer_interactions for select using (true);
create policy "members add prayer interaction"
  on public.prayer_interactions for insert with check (auth.uid() = user_id);
create policy "members remove own interaction"
  on public.prayer_interactions for delete using (auth.uid() = user_id);

-- ----- donations -----
create policy "users see own donations"
  on public.donations for select
  using (auth.uid() = user_id or public.is_admin());
-- Inserts/updates from Stripe come through the service-role key,
-- which bypasses RLS, so no public write policy is needed.

-- =============================================================
-- Views
-- security_invoker = true makes the view run with the querying
-- user's privileges, so the RLS on the underlying tables still
-- applies (without this, views bypass RLS and would leak private
-- prayer requests).
-- =============================================================

-- Prayer requests with a pray count.
create or replace view public.prayer_requests_with_counts
  with (security_invoker = true) as
  select
    p.*,
    coalesce(c.pray_count, 0) as pray_count
  from public.prayer_requests p
  left join (
    select prayer_request_id, count(*) as pray_count
    from public.prayer_interactions
    group by prayer_request_id
  ) c on c.prayer_request_id = p.id;

-- Names-only directory so the prayer wall can label non-anonymous
-- requests with their author. Deliberately runs as definer (no
-- security_invoker) so signed-in members can read each other's
-- display names — but nothing else. Restricted to authenticated users.
create or replace view public.author_directory as
  select id, full_name from public.profiles;

revoke all on public.author_directory from anon;
grant select on public.author_directory to authenticated;
