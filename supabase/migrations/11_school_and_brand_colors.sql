-- 11_school_and_brand_colors.sql
-- Capture the teacher's current school and the colors used to brand their PDFs.
-- Run after migration 10. Safe to re-run.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS current_school   TEXT,
  ADD COLUMN IF NOT EXISTS school_color     TEXT,   -- hex, e.g. '#0F766E'
  ADD COLUMN IF NOT EXISTS personal_color   TEXT;   -- hex

-- Light sanity check — basic 7-char hex with leading '#'. NULLs are allowed.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_school_color_hex;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_personal_color_hex;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_school_color_hex
    CHECK (school_color   IS NULL OR school_color   ~ '^#[0-9A-Fa-f]{6}$'),
  ADD CONSTRAINT profiles_personal_color_hex
    CHECK (personal_color IS NULL OR personal_color ~ '^#[0-9A-Fa-f]{6}$');

-- The product is teacher-first. We still keep the `user_type` enum so existing
-- rows don't break, but we no longer route students through signup; new users
-- default to 'teacher'.
ALTER TABLE profiles ALTER COLUMN user_type SET DEFAULT 'teacher';
