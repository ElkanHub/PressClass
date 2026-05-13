-- 10_credits_and_profile_extension.sql
-- Credit-based billing + extended profile for African market onboarding.
-- Run after 01-08. Idempotent where reasonable.

-- ============================================================================
-- 1. PROFILE EXTENSION — country, currency, locale, telephony, role detail
-- ============================================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS country_code TEXT,                -- ISO-3166 alpha-2 (e.g. 'GH', 'NG', 'KE')
  ADD COLUMN IF NOT EXISTS country_name TEXT,
  ADD COLUMN IF NOT EXISTS currency TEXT,                    -- ISO-4217 (e.g. 'GHS', 'NGN', 'KES', 'USD')
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS preferred_subjects TEXT[],        -- e.g. ['Mathematics','English']
  ADD COLUMN IF NOT EXISTS preferred_class_levels TEXT[],    -- e.g. ['JHS 1','SHS 2']
  ADD COLUMN IF NOT EXISTS teaching_experience TEXT,         -- 'less_than_1','1_3','3_7','7_plus'
  ADD COLUMN IF NOT EXISTS primary_use_case TEXT,            -- 'lesson_plans','notes','assessments','all'
  ADD COLUMN IF NOT EXISTS referral_source TEXT,             -- how they heard about us
  ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_step SMALLINT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_country_code ON profiles (country_code);
CREATE INDEX IF NOT EXISTS idx_profiles_currency ON profiles (currency);

-- ============================================================================
-- 2. CREDIT BALANCES — one row per user, fast lookup
-- ============================================================================

CREATE TABLE IF NOT EXISTS credit_balances (
  user_id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance        INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent  INTEGER NOT NULL DEFAULT 0,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE credit_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own balance" ON credit_balances
  FOR SELECT USING (auth.uid() = user_id);

-- Writes happen only via SECURITY DEFINER functions below; no direct write policy.

-- ============================================================================
-- 3. CREDIT TRANSACTIONS — immutable ledger
-- ============================================================================

CREATE TABLE IF NOT EXISTS credit_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta       INTEGER NOT NULL,                  -- + earned, - spent
  reason      TEXT NOT NULL,                     -- 'signup_bonus','purchase','generation:notes','refund','admin_grant'
  reference   TEXT,                              -- e.g. payment intent id, generation id
  metadata    JSONB,
  balance_after INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_user_created ON credit_transactions (user_id, created_at DESC);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- 4. CREDIT PACKAGES — sellable bundles, region-aware pricing
-- ============================================================================

CREATE TABLE IF NOT EXISTS credit_packages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT NOT NULL UNIQUE,             -- e.g. 'starter','popular','bulk'
  name         TEXT NOT NULL,
  credits      INTEGER NOT NULL CHECK (credits > 0),
  bonus_credits INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credit_package_prices (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES credit_packages(id) ON DELETE CASCADE,
  currency   TEXT NOT NULL,                       -- ISO-4217
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),  -- price in minor unit (kobo, pesewas, cents)
  UNIQUE (package_id, currency)
);

ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_package_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read packages" ON credit_packages FOR SELECT USING (is_active);
CREATE POLICY "Public read package prices" ON credit_package_prices FOR SELECT USING (true);

-- Seed: minimum-friction "feels like a cheat" pricing.
-- Adjust amounts as you tune the African market. Minor unit = smallest currency unit.
INSERT INTO credit_packages (code, name, credits, bonus_credits, sort_order) VALUES
  ('taste',    'Taste',    50,   5,  1),    -- entry point — should feel almost free
  ('starter',  'Starter',  150,  25, 2),
  ('popular',  'Popular',  500,  100,3),
  ('bulk',     'Power',    1500, 400,4)
ON CONFLICT (code) DO NOTHING;

-- Sample prices. Tweak in the dashboard later.
WITH pkg AS (SELECT id, code FROM credit_packages)
INSERT INTO credit_package_prices (package_id, currency, amount_minor)
SELECT pkg.id, c.currency, c.amount_minor FROM pkg
JOIN (VALUES
  ('taste',   'GHS',  500),     -- GHS 5
  ('taste',   'NGN',  50000),   -- NGN 500
  ('taste',   'KES',  6500),    -- KES 65
  ('taste',   'USD',  50),      -- USD 0.50
  ('starter', 'GHS',  1500),
  ('starter', 'NGN',  150000),
  ('starter', 'KES',  19500),
  ('starter', 'USD',  150),
  ('popular', 'GHS',  4500),
  ('popular', 'NGN',  450000),
  ('popular', 'KES',  58500),
  ('popular', 'USD',  450),
  ('bulk',    'GHS',  12000),
  ('bulk',    'NGN',  1200000),
  ('bulk',    'KES',  156000),
  ('bulk',    'USD',  1200)
) AS c(code, currency, amount_minor) ON c.code = pkg.code
ON CONFLICT (package_id, currency) DO NOTHING;

-- ============================================================================
-- 5. GENERATION COSTS — config table, NOT hardcoded in app
-- ============================================================================

CREATE TABLE IF NOT EXISTS generation_costs (
  generation_type TEXT PRIMARY KEY,    -- 'notes','lesson_plan','assessment'
  cost            INTEGER NOT NULL CHECK (cost > 0),
  description     TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE generation_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read generation costs" ON generation_costs FOR SELECT USING (true);

INSERT INTO generation_costs (generation_type, cost, description) VALUES
  ('notes',       3, 'AI-generated lesson notes'),
  ('lesson_plan', 5, 'AI-generated full lesson plan'),
  ('assessment', 4, 'AI-generated assessment/quiz')
ON CONFLICT (generation_type) DO NOTHING;

-- ============================================================================
-- 6. ANTI-ABUSE — signup fingerprints
-- ============================================================================

CREATE TABLE IF NOT EXISTS signup_fingerprints (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email         TEXT,
  email_normalized TEXT,                   -- lowercased, gmail-dot-stripped
  ip_address    INET,
  ip_hash       TEXT,                      -- hashed in app layer for privacy
  user_agent    TEXT,
  device_hash   TEXT,                      -- client-side fingerprint hash
  country_code  TEXT,
  signup_bonus_granted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fp_email_norm ON signup_fingerprints (email_normalized);
CREATE INDEX IF NOT EXISTS idx_fp_ip_hash    ON signup_fingerprints (ip_hash);
CREATE INDEX IF NOT EXISTS idx_fp_device     ON signup_fingerprints (device_hash);
CREATE INDEX IF NOT EXISTS idx_fp_user       ON signup_fingerprints (user_id);

ALTER TABLE signup_fingerprints ENABLE ROW LEVEL SECURITY;
-- No SELECT/INSERT policies for end users; only SECURITY DEFINER functions touch this table.

-- ============================================================================
-- 7. ATOMIC CREDIT FUNCTIONS — single source of truth
-- ============================================================================

-- Grant credits (purchase, signup bonus, refund, admin).
-- Returns the new balance. Idempotent on (user_id, reference) when reference is supplied.
CREATE OR REPLACE FUNCTION grant_credits(
  p_user_id   UUID,
  p_amount    INTEGER,
  p_reason    TEXT,
  p_reference TEXT DEFAULT NULL,
  p_metadata  JSONB DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'grant_credits requires positive amount';
  END IF;

  -- Idempotency: if a transaction with same reason+reference exists, return current balance
  IF p_reference IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM credit_transactions
      WHERE user_id = p_user_id AND reason = p_reason AND reference = p_reference
    ) THEN
      SELECT balance INTO v_new_balance FROM credit_balances WHERE user_id = p_user_id;
      RETURN COALESCE(v_new_balance, 0);
    END IF;
  END IF;

  INSERT INTO credit_balances (user_id, balance, lifetime_earned, updated_at)
  VALUES (p_user_id, p_amount, p_amount, now())
  ON CONFLICT (user_id) DO UPDATE
    SET balance = credit_balances.balance + EXCLUDED.balance,
        lifetime_earned = credit_balances.lifetime_earned + EXCLUDED.lifetime_earned,
        updated_at = now()
  RETURNING balance INTO v_new_balance;

  INSERT INTO credit_transactions (user_id, delta, reason, reference, metadata, balance_after)
  VALUES (p_user_id, p_amount, p_reason, p_reference, p_metadata, v_new_balance);

  RETURN v_new_balance;
END;
$$;

-- Debit credits for a generation. Throws 'INSUFFICIENT_CREDITS' if balance would go negative.
CREATE OR REPLACE FUNCTION debit_credits(
  p_user_id   UUID,
  p_amount    INTEGER,
  p_reason    TEXT,
  p_reference TEXT DEFAULT NULL,
  p_metadata  JSONB DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'debit_credits requires positive amount';
  END IF;

  UPDATE credit_balances
    SET balance = balance - p_amount,
        lifetime_spent = lifetime_spent + p_amount,
        updated_at = now()
    WHERE user_id = p_user_id
      AND balance >= p_amount
    RETURNING balance INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO credit_transactions (user_id, delta, reason, reference, metadata, balance_after)
  VALUES (p_user_id, -p_amount, p_reason, p_reference, p_metadata, v_new_balance);

  RETURN v_new_balance;
END;
$$;

-- ============================================================================
-- 8. SIGNUP HOOK — extend handle_new_user to provision balance + grant bonus
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bonus INTEGER := 25;  -- starter credits for new users; tune in app config later
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'regular')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Provision balance row (no bonus here — bonus is granted from app layer
  -- AFTER fingerprint validation to prevent farming).
  INSERT INTO public.credit_balances (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Note: signup-bonus grant is performed in the app layer (server action) after
-- checking signup_fingerprints, then calling grant_credits(user, 25, 'signup_bonus', user_id::text).
-- Using user_id as reference makes the grant idempotent.

-- ============================================================================
-- 9. RATE LIMITING — generation-bucket per user
-- ============================================================================

CREATE TABLE IF NOT EXISTS generation_rate_buckets (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  count        INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE generation_rate_buckets ENABLE ROW LEVEL SECURITY;
-- No user policies; managed by SECURITY DEFINER fn below.

-- Returns TRUE if the call is within limit; FALSE if exceeded.
-- Rolling 60-second window, max p_max_per_minute.
CREATE OR REPLACE FUNCTION check_generation_rate_limit(
  p_user_id        UUID,
  p_max_per_minute INTEGER DEFAULT 6
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO generation_rate_buckets (user_id, window_start, count)
  VALUES (p_user_id, now(), 1)
  ON CONFLICT (user_id) DO UPDATE
    SET count = CASE
                  WHEN generation_rate_buckets.window_start < now() - INTERVAL '1 minute' THEN 1
                  ELSE generation_rate_buckets.count + 1
                END,
        window_start = CASE
                  WHEN generation_rate_buckets.window_start < now() - INTERVAL '1 minute' THEN now()
                  ELSE generation_rate_buckets.window_start
                END
  RETURNING count INTO v_count;

  RETURN v_count <= p_max_per_minute;
END;
$$;

-- ============================================================================
-- 10. PAYMENTS — provider-agnostic record (wire to Paystack/Flutterwave later)
-- ============================================================================

CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id      UUID REFERENCES credit_packages(id),
  provider        TEXT NOT NULL,            -- 'paystack','flutterwave','stripe','manual'
  provider_ref    TEXT NOT NULL,            -- transaction id from provider
  currency        TEXT NOT NULL,
  amount_minor    INTEGER NOT NULL,
  credits_granted INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'pending',  -- pending|success|failed|refunded
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_ref)
);

CREATE INDEX IF NOT EXISTS idx_payments_user_created ON payments (user_id, created_at DESC);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
