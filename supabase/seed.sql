-- =============================================================
-- Sample data so the app looks alive on first run.
-- Run after schema.sql. Safe to re-run (uses fixed ids).
-- To make yourself an admin, sign up in the app first, then run:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- =============================================================

insert into public.funds (id, name, description) values
  ('11111111-1111-1111-1111-111111111111', 'General Fund', 'Supports the day-to-day ministry of the church.'),
  ('22222222-2222-2222-2222-222222222222', 'Missions', 'Supports our local and global mission partners.'),
  ('33333333-3333-3333-3333-333333333333', 'Building Fund', 'Toward the care and growth of our building.')
on conflict (id) do nothing;

insert into public.sermons (title, speaker, description, scripture, series, media_type, media_url, thumbnail_url, duration_seconds, preached_on) values
  ('Rooted in Ashtown Baptist', 'Pastor Simon Yirenkyi', 'What it means to build a life on Ashtown Baptist rather than performance.', 'Ephesians 2:1-10', 'Foundations', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, 2340, current_date - 7),
  ('The Quiet Work of Faith', 'Pastor Simon Yirenkyi', 'Faith is often built in the Christand unseen moments.', 'James 2:14-26', 'Foundations', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, 1980, current_date - 14),
  ('A Table for Everyone', 'Rev. Simon Yirenkyi', 'The welcome of God has room for people the world overlooks.', 'Luke 14:15-24', 'The Kingdom', 'audio', 'https://example.com/audio/table.mp3', null, 2100, current_date - 21)
on conflict do nothing;

insert into public.events (title, description, location, category, starts_at, ends_at, capacity) values
  ('Sunday Worship', 'Our weekly gathering for worship, teaching, and communion.', 'Main Sanctuary', 'Worship', (date_trunc('week', now()) + interval '6 days 10 hours'), (date_trunc('week', now()) + interval '6 days 12 hours'), 300),
  ('Midweek Prayer', 'A quiet hour of shared prayer for the church and city.', 'Chapel', 'Prayer', (now() + interval '3 days 19 hours'), (now() + interval '3 days 20 hours'), 60),
  ('Community Meal', 'A free meal open to the neighborhood. All are welcome.', 'Fellowship Hall', 'Community', (now() + interval '10 days 18 hours'), (now() + interval '10 days 20 hours'), 120)
on conflict do nothing;
