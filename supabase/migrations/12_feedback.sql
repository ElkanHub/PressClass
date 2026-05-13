-- 12_feedback.sql
-- Two feedback channels:
--   1. generation_feedback — per-output thumbs up/down with reason chips,
--      tied to the specific generation so we can spot quality regressions
--      by subject / class / generation type.
--   2. feedback            — everything else: bugs, suggestions, praise,
--      app-rating responses, free-text answers to periodic prompts.
--
-- RLS: users can only INSERT and SELECT their own rows. Admin/analytics
-- reads happen server-side via the service role (Supabase SQL Editor).

-- ============================================================================
-- 1. generation_feedback
-- ============================================================================
CREATE TABLE IF NOT EXISTS generation_feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_type TEXT NOT NULL CHECK (generation_type IN ('notes', 'lesson_plan', 'assessment')),
  generation_id   UUID,                          -- nullable: result-pages aren't saved yet
  rating          SMALLINT NOT NULL CHECK (rating IN (-1, 1)),
  reasons         TEXT[]   NOT NULL DEFAULT '{}',
  note            TEXT,
  context         JSONB,                         -- {subject, class, strand, etc.}
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gen_fb_user      ON generation_feedback (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gen_fb_rating    ON generation_feedback (generation_type, rating, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gen_fb_gen_id    ON generation_feedback (generation_id);

-- One rating per (user, generation_id) so re-rating updates instead of duplicating.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_gen_fb_user_gen
  ON generation_feedback (user_id, generation_id)
  WHERE generation_id IS NOT NULL;

ALTER TABLE generation_feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gen_fb owner read" ON generation_feedback;
DROP POLICY IF EXISTS "gen_fb owner write" ON generation_feedback;
DROP POLICY IF EXISTS "gen_fb owner update" ON generation_feedback;

CREATE POLICY "gen_fb owner read" ON generation_feedback
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "gen_fb owner write" ON generation_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gen_fb owner update" ON generation_feedback
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- 2. feedback (everything else)
-- ============================================================================
CREATE TABLE IF NOT EXISTS feedback (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('bug', 'suggestion', 'praise', 'question', 'app_rating', 'prompt_response')),
  message     TEXT,                              -- nullable for app_rating-only submissions
  rating      SMALLINT,                          -- 1-5 for app_rating, NULL otherwise
  reasons     TEXT[] NOT NULL DEFAULT '{}',      -- reason chips for app_rating
  page_path   TEXT,
  user_agent  TEXT,
  viewport    TEXT,
  context     JSONB,                             -- e.g. {prompt_id, generation_type}
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'triaged', 'in_progress', 'shipped', 'declined')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fb_user        ON feedback (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fb_kind        ON feedback (kind, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fb_status      ON feedback (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fb_rating      ON feedback (rating) WHERE rating IS NOT NULL;

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "fb owner read" ON feedback;
DROP POLICY IF EXISTS "fb owner write" ON feedback;

CREATE POLICY "fb owner read" ON feedback
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "fb owner write" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
