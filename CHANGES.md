# PressClass — Changes Log (Pass 1)

**Date:** 2026-05-13
**Scope:** Foundation for credit-based billing, anti-abuse signup, DRY generation pipeline, rebuilt onboarding, middleware consolidation. Designed to support African-market focus and scale gracefully.

---

## 1. Cleanup

- Deleted `test_write.txt`
- Deleted duplicate signup route `app/auth/sign-up/` (kept `app/auth/signup/`)
- Deleted duplicate design docs: `Generator.md`, `Notes Generator.md`, `NotesGenerator.md` (kept `APP_DOCUMENTATION.md`)
- Deleted `lib/supabase/middleware.ts` (superseded — see §2)
- Removed `console.log` statements in `app/(protected)/layout.tsx` and `components/login-form.tsx` plus the cookie-debug `alert()` in the login form

---

## 2. Middleware — `proxy.ts` is now canonical

Next.js requires the middleware file to be `middleware.ts` at the project root, so:

- **Created `middleware.ts`** at root — a one-line re-export from `proxy.ts` (`export { proxy as middleware, config } from "./proxy"`). This means Next.js picks up your auth logic, but the implementation still lives in `proxy.ts` as you requested.
- **Rewrote `proxy.ts`** with:
  - Full protected-path list (`/dashboard`, `/generator`, `/notes`, `/lesson-plans`, `/assessments`, `/study-time`, `/whiteboard`, `/calendar`, `/results`, `/credits`, `/account`)
  - Unauthenticated users on protected routes → `/auth/login?next=<path>`
  - Authenticated users on `/auth/*` (except `/auth/logout`) → `/dashboard`
  - **Onboarding gate:** authenticated users on protected routes with `onboarding_completed = false` → `/onboarding`
  - Excluded `/api/*`, `/auth/callback`, `/auth/confirm`, and static assets from the matcher

---

## 3. Credit system — schema (`supabase/migrations/10_credits_and_profile_extension.sql`)

This is the keystone for monetization. Run after migrations 01–08 on the fresh DB.

**Profile extension** — adds to `profiles`:
- `country_code`, `country_name`, `currency`, `phone`
- `preferred_subjects` (text[]), `preferred_class_levels` (text[])
- `teaching_experience`, `primary_use_case`, `referral_source`
- `marketing_opt_in`, `onboarding_step`

**New tables**
- `credit_balances` — one row per user; balance + lifetime earned/spent. RLS: users read only their own.
- `credit_transactions` — immutable ledger of every grant/debit. RLS: users read only their own.
- `credit_packages` + `credit_package_prices` — sellable bundles with **per-currency pricing** (GHS, NGN, KES, ZAR, UGX, … USD). Seeded with 4 tiers (`taste`, `starter`, `popular`, `bulk`) starting at the equivalent of ~$0.50 — the "feels like a cheat" entry point you wanted.
- `generation_costs` — cost per generation type lives in DB, not code. Seeded: notes=3, lesson_plan=5, assessment=4.
- `signup_fingerprints` — anti-abuse (normalized email, hashed IP, device hash, country). RLS-locked to admin only.
- `payments` — provider-agnostic payment record, ready for Paystack/Flutterwave/Stripe wiring.
- `generation_rate_buckets` — backing table for per-user rolling-minute rate limiter.

**Atomic SQL functions** (`SECURITY DEFINER`)
- `grant_credits(user, amount, reason, reference?, metadata?)` — idempotent on `(reason, reference)`.
- `debit_credits(user, amount, reason, reference?, metadata?)` — single UPDATE with `balance >= amount` guard; raises `INSUFFICIENT_CREDITS` atomically (no race).
- `check_generation_rate_limit(user, max_per_minute)` — rolling 60s window.

**Trigger update** — `handle_new_user` now also provisions an empty `credit_balances` row. The signup bonus is NOT granted in the trigger — it's granted by `actions/onboarding.ts` AFTER fingerprint validation. This is deliberate: it stops attackers from harvesting credits by spawning auth users via the public anon key without ever completing onboarding.

---

## 4. DRY generation pipeline (`lib/`)

The three generator API routes used to be ~80 lines each of duplicated prompt-building + parse-retry + error handling. Replaced with a single pipeline.

**New files**
- `lib/supabase/admin.ts` — service-role Supabase client (cached) for SECURITY DEFINER RPC calls. Server-only.
- `lib/errors.ts` — `ApiError` class + `errorResponse(err)` helper. Maps `INSUFFICIENT_CREDITS` → 402, `RATE_LIMITED` → 429, etc. Hides internal messages in production.
- `lib/credits.ts` — `getBalance`, `getGenerationCost`, `debitCredits`, `grantCredits`, `checkRateLimit`. Every credit operation in the app goes through here.
- `lib/ai/prompts.ts` — all generation prompts in one place, typed by generation type. African-curriculum aware (mentions GH/NG/KE/WAEC/GES).
- `lib/ai/generate.ts` — `runGeneration({ type, params })` does the whole flow: auth → rate-limit → debit → call AI → parse → auto-refund on AI or parse failure.

**Each route is now ~15 lines.** `app/api/generate/route.ts`, `app/api/generate/notes/route.ts`, `app/api/generate/lesson-plan/route.ts` are now thin adapters; they just shape the request and delegate.

Responses now include `_meta: { creditsSpent, balanceAfter }` so the UI can update the balance pill without a refetch.

---

## 5. Onboarding rebuild

`app/onboarding/page.tsx` is now a server component that delegates to a client wizard.

`app/onboarding/wizard.tsx` — **7-step wizard** with progress bar, fun copy, and toast feedback:

1. **Welcome** — warm intro mentioning the 25 free credits
2. **Identity** — full name, country (Africa-first dropdown w/ flags), auto-derived currency, optional phone with auto-set dial-code placeholder
3. **What you teach/study** — multi-select subject chips + class-level chips
4. **Experience** — radio (less than 1 / 1–3 / 3–7 / 7+ years)
5. **Primary use case** — radio with emojis (lesson plans / notes / assessments / all)
6. **Referral source** + marketing opt-in
7. **Done** — confirmation with credit count

**Anti-abuse on completion** — `actions/onboarding.ts → completeOnboarding`:
- Saves all profile fields
- Records signup fingerprint: normalized email (gmail-dot/plus-strip), salted SHA-256 IP hash (from `x-forwarded-for` / `x-real-ip` / `cf-connecting-ip`), client device hash, user agent, country
- Queries `signup_fingerprints` for a match on any of email-normalized / ip-hash / device-hash; if found, the signup bonus is **silently suppressed** (user sees a "welcome back" toast instead of the credit-grant celebration)
- If clean, calls `grant_credits(user, 25, 'signup_bonus', user_id)` — idempotent on user_id reference, so re-running onboarding cannot double-grant

`lib/countries.ts` — 27 African countries + "Other" with ISO codes, currencies, flags, dial codes.
`lib/fingerprint.ts` — `normalizeEmail`, `hashValue` (sha256 + salt), `extractClientIp`.

---

## 6. Credits UI

- `components/credits-pill.tsx` — header pill showing current balance. Turns amber when balance < 5. Refetches on tab focus.
- Wired into `components/layout/header.tsx`.
- New `/credits` route (`app/(protected)/credits/page.tsx` + `packages.tsx`):
  - Three KPI cards: current balance, lifetime earned, lifetime spent
  - 4 credit packages with per-currency pricing using `Intl.NumberFormat` against the user's profile currency
  - Recent transactions list (last 20)
  - Buy buttons currently show a toast — they're stubs awaiting payment-provider wiring (see §8)
- Added "Credits" entry to sidebar nav (`components/layout/nav-data.ts`).

---

## 7. Misc

- `.env.example` created — documents every required env var including `FINGERPRINT_SALT` (set this to something long & random in production).

---

## 8. What I deliberately deferred for your review

These are NOT done yet; flagging them so you don't get surprised:

1. **Payment provider wiring (Paystack / Flutterwave).** The credit-purchase plumbing (packages, payments table, ledger, currency-aware pricing) is all in place. What's missing is:
   - `POST /api/payments/initialize` — server action that creates a Paystack/Flutterwave transaction, returns the redirect URL
   - `POST /api/payments/webhook/paystack` and `/flutterwave` — verify signature, call `grant_credits(...)` with the package's `credits + bonus_credits` and `reference = provider_ref` (idempotency)
   - Wire the "Buy now" button to `/api/payments/initialize`
   - I recommend **Paystack first** (covers GH, NG, KE, ZA out of the box, simplest dev experience) and **Flutterwave second** (broader Africa coverage). Stripe for non-Africa is one extra adapter.
   - I'd need you to give me the API keys before I can finish this end-to-end.

2. **Generator UI error handling.** The forms currently expect a 200 JSON. With the new pipeline, they'll receive a 402 with `{ error: "INSUFFICIENT_CREDITS" }` when balance is depleted. The forms should show a "Top up your credits" CTA in that case. I'll do this pass next if you give the go-ahead.

3. **PWA.** Manifest, icons, service worker (caching strategy: stale-while-revalidate for static assets, network-first for API). Slated for after the payment wiring lands so we don't ship a PWA that promises features users can't pay for.

4. **RAG chatbot decision.** Still in limbo. The `/api/chat` route + `documents_embeddings` table are present but the chatbot isn't on the landing page and no embeddings are seeded. Cheapest path: comment the import out of the landing for launch, revisit post-launch.

5. **Role-based gating.** `user_type` is captured but not enforced anywhere. Probably fine for v1 — flag for later.

---

## 9. Apply this pass (fresh-DB checklist)

1. `cp .env.example .env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, and a long random `FINGERPRINT_SALT`.
2. In the Supabase SQL editor, run migrations in order:
   - `CREATE EXTENSION IF NOT EXISTS vector;` (only if you'll activate the RAG bot)
   - `supabase/migrations/01_base_users_profiles_schools.sql` through `08_chatbot_rag.sql`
   - `supabase/migrations/10_credits_and_profile_extension.sql`
3. `npm install` (no new deps were added in this pass).
4. `npm run dev` and smoke-test:
   - Sign up new account → should land on `/onboarding`
   - Complete the wizard → 25 credits granted, redirect to `/dashboard`
   - Header shows credit pill with `25`
   - Generate notes → balance drops to `22`, transactions row appears
   - Visit `/credits` → KPIs + packages + history all populate

---

## 10. Files touched

**Added**
- `middleware.ts`
- `supabase/migrations/10_credits_and_profile_extension.sql`
- `lib/supabase/admin.ts`
- `lib/errors.ts`
- `lib/credits.ts`
- `lib/ai/prompts.ts`
- `lib/ai/generate.ts`
- `lib/countries.ts`
- `lib/fingerprint.ts`
- `actions/onboarding.ts`
- `app/onboarding/wizard.tsx`
- `app/(protected)/credits/page.tsx`
- `app/(protected)/credits/packages.tsx`
- `components/credits-pill.tsx`
- `.env.example`
- `CHANGES.md`

**Modified**
- `proxy.ts` (rewritten)
- `app/onboarding/page.tsx` (now a thin server component delegating to wizard)
- `app/(protected)/layout.tsx` (stripped console.log)
- `app/api/generate/route.ts` (now ~15 lines, uses `runGeneration`)
- `app/api/generate/notes/route.ts` (same)
- `app/api/generate/lesson-plan/route.ts` (same)
- `components/login-form.tsx` (stripped debug logs + alert)
- `components/layout/header.tsx` (added CreditsPill)
- `components/layout/nav-data.ts` (added Credits link)

**Removed**
- `test_write.txt`
- `lib/supabase/middleware.ts`
- `app/auth/sign-up/` (whole folder)
- `Generator.md`, `Notes Generator.md`, `NotesGenerator.md`
