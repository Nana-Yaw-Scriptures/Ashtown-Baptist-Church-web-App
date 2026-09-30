-- =============================================================
-- Appearance part 3: a caption/description for the featured flyer.
-- Run AFTER features-appearance-2.sql.
-- =============================================================
alter table public.site_settings add column if not exists feature_caption text;
