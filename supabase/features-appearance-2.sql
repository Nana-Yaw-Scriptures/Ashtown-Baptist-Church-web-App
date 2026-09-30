-- =============================================================
-- Appearance part 2: a second image slot — a "featured flyer"
-- shown on the About page, changeable like the background.
-- Run AFTER features-appearance.sql.
-- =============================================================
alter table public.site_settings add column if not exists feature_image_url text;
alter table public.site_settings add column if not exists feature_image_path text;
