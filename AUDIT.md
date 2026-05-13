# PressClass — Project Audit

**Date:** 2026-05-13
**Goal:** Get this project sales-ready by end of May 2026.
**Context:** Repo has been dormant. Fresh Supabase DB being provisioned. This document is the source of truth for what exists, what's missing, and the punch list to launch.

---

## 1. Stack

- **Framework:** Next.js 15.5.7 (App Router) · React 19.2.1 · TypeScript 5
- **DB / Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **AI:** Groq SDK (primary, `gpt-oss-120b`), Gemini (fallback), OpenAI (embeddings only — `text-embedding-3-small`)
- **UI:** Radix UI + Tailwind + `class-variance-authority`, `framer-motion`, `lucide-react`, `next-themes`, `sonner`
- **Forms:** `react-hook-form` + `zod`
- **Specialty:** `reactflow` (whiteboard), `react-day-picker` + `date-fns` (calendar), `jspdf` + `html2canvas` (PDF export), `react-markdown` + `remark-gfm`

**Scripts:** `dev`, `build`, `start`, `lint`. No test runner, no type-check script, no `.env.example`.

---

## 2. Migrations — Reorganized

All SQL files moved to `supabase/migrations/` with numeric prefixes reflecting dependency order. Run top-to-bottom in the Supabase SQL editor on the new project.

| # | File | Creates | Notes |
|---|------|---------|-------|
| 01 | `01_base_users_profiles_schools.sql` | `user_type` enum, `schools`, `profiles`, `onboarding_responses`; `handle_new_user()` trigger | **Run first** — everything FKs to `profiles` / `auth.users` |
| 02 | `02_assessments.sql` | `assessments` + RLS | |
| 03 | `03_lesson_plans.sql` | `lesson_plans` + RLS | |
| 04 | `04_notes.sql` | `notes` + RLS | |
| 05 | `05_calendar_and_tasks.sql` | `calendar_events`, `tasks` + indexes + RLS | |
| 06 | `06_study_time.sql` | `study_sessions`, `study_pauses` + indexes + `updated_at` trigger + RLS | |
| 07 | `07_whiteboard.sql` | `boards`, `board_nodes` + RLS | No indexes — add `(user_id)` on `boards` before scale |
| 08 | `08_chatbot_rag.sql` | `documents_embeddings` (pgvector), `match_documents()` function, IVFFlat index | **Requires:** `CREATE EXTENSION IF NOT EXISTS vector;` first |
| 09 | `09_fix_notes_columns.sql` | Idempotent column renames/adds for `notes` | Optional — only relevant if old data exists. Safe to skip on fresh DB. |

**Action on fresh DB:** Run 01 → 08 in order. Skip 09.

---

## 3. Feature Inventory

### Implemented & looks complete

| Area | Path | Notes |
|---|---|---|
| Dashboard | `app/(protected)/dashboard/page.tsx` | Stats, recent items, quick-create. Clean. |
| Assessment generator | `app/(protected)/generator/assessment/` + `app/api/generate/` | Form → AI → results flow works. |
| Lesson plan generator | `app/(protected)/generator/lesson-plan/` + `app/api/generate/lesson-plan/` | Structured JSON output. |
| Notes generator | `app/(protected)/generator/notes/` + `app/api/generate/notes/` | Result page saves to DB. |
| Notes list + detail + edit | `app/(protected)/notes/` | Paginated, CRUD, PDF export. |
| Assessments list + detail | `app/(protected)/assessments/` | Show/hide answers, print, PDF, delete. |
| Lesson plans list + detail | `app/(protected)/lesson-plans/` | Edit inline, PDF, generate assessment from plan. |
| Study Time | `app/(protected)/study-time/page.tsx` (496 LOC) | Pomodoro / countdown / stopwatch + analytics + pause tracking. Solid. |
| Whiteboard | `app/(protected)/whiteboard/page.tsx` (224 LOC) | ReactFlow, save/load, PDF export. |
| Auth — login | `app/auth/login/` | Email/password + Google OAuth. |
| Auth — role signups | `app/auth/signup/{school,teacher,student,regular}/` | Teacher signup validates school + access key. |
| Auth — callback / forgot / update password | `app/auth/{callback,forgot-password,update-password}/` | Standard Supabase flows. |

### Partial / needs work

| Area | Issue |
|---|---|
| Calendar | Page is thin (29 LOC). Schema supports events + tasks but UI minimal. |
| Onboarding | `app/onboarding/page.tsx` exists, sets `onboarding_completed`, but **nothing redirects new users to it** and **nothing enforces the flag**. Dead route in practice. |
| RAG Chatbot | `/api/chat/route.ts` + `components/chatbot/chatbot.tsx` exist. **Not embedded on the landing page.** No embeddings seeded. Hardcoded namespace `pressclass_landing_bot`. |
| Pricing | `app/pricing/page.tsx` shows Free + Pro ($12/mo). **No Stripe, no plan column on `profiles`, no quota enforcement.** Selling = blocked. |
| Role-based access | Signup captures `user_type`, but no route/feature is actually gated by role. |

### Cruft / remove

| File | Why |
|---|---|
| `test_write.txt` | Six-byte test artifact. |
| `proxy.ts` | Old middleware pattern; `lib/supabase/middleware.ts` is the real one. Confirm before delete. |
| `app/auth/sign-up/` | Duplicates `app/auth/signup/`. Pick one. |
| `Notes Generator.md`, `NotesGenerator.md`, `Generator.md` | Older design docs superseded by `APP_DOCUMENTATION.md`. |
| `UI example.png` | Loose asset at repo root. Move to `/public` or delete. |

---

## 4. Docs vs Reality

| Doc | Reality |
|---|---|
| `APP_DOCUMENTATION.md` | Matches what's built. Keep as canonical reference. |
| `StudyTime.md` | Fully implemented. |
| `react_flow_whiteboard_press_class.md` | Fully implemented. |
| `Calender Scheduling.md` | Schema yes, UI partial. |
| `ChatbotRAG.md` | API + component built, **not wired up**. |
| `ImproveAuth.md` | Multi-role signup built; role-based gating not. |
| `Notes Generator.md` / `NotesGenerator.md` / `Generator.md` | Redundant — delete. |
| `Project outline.md` | Reference only. |
| `DOCS/PRESSCLASS/*.md` | Legal/policy content. Candidates to seed into RAG embeddings. |

---

## 5. Launch Blockers (must fix to sell)

1. **Payment integration.** No Stripe/Paddle. Pricing page is decorative. Without this you literally cannot charge.
2. **Plan column + quota enforcement.** Add `plan` (`free` | `pro`) to `profiles`. Wrap generators in a quota check. Free tier needs a clear limit (e.g. 5 notes/month).
3. **`.env.example`.** Required vars are only discoverable by grep:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   GROQ_API_KEY=
   GEMINI_API_KEY=           # optional fallback
   OPENAI_API_KEY=           # embeddings (only if RAG bot is on)
   ```
4. **Rate limiting on `/api/generate/*`.** Currently unthrottled — one malicious user burns the Groq/OpenAI budget. Use Upstash Redis or a Supabase-side counter.
5. **Middleware duplication.** Confirm `proxy.ts` vs `lib/supabase/middleware.ts`; delete the dead one. Auth bugs hide here.
6. **Duplicate signup routes** (`/auth/signup` and `/auth/sign-up`) — pick one, redirect the other.
7. **Console.logs in protected layout + login form.** Strip or gate on `NODE_ENV`.
8. **Onboarding decision.** Either redirect new users into it after signup and gate the dashboard on `onboarding_completed`, or delete the route.
9. **RAG bot decision.** Either embed `components/chatbot/chatbot.tsx` on the landing page + seed embeddings from `DOCS/PRESSCLASS/`, or remove the API route + component + migration 08 from the launch DB.
10. **AI error UX.** All generator routes return generic `{ error: "Failed to generate content" }`. Surface rate-limit / network / parse errors distinctly so users know whether to retry.

---

## 6. Nice-to-have (post-launch)

- TypeScript `strict: true` — currently `any` in several actions (e.g. `notes.ts` content field).
- Sentry or equivalent error monitoring.
- `whiteboard` indexes on `(user_id)`.
- Soft-delete / archive for completed `tasks`.
- Custom SMTP for Supabase emails (default sender hurts deliverability).
- Test suite — none exists.

---

## 7. End-of-Month Launch Punch List

**Week 1 (now → 2026-05-20)**
- [ ] Run migrations 01–08 against new Supabase DB
- [ ] Create `.env.example` and populate `.env.local`
- [ ] Delete `test_write.txt`, `proxy.ts` (after confirming unused), duplicate signup route, duplicate `*Generator.md` docs
- [ ] Strip console.logs
- [ ] Smoke-test full auth flow on fresh DB (signup all 4 roles → email confirm → login → dashboard)
- [ ] Smoke-test all 3 generators end-to-end

**Week 2 (2026-05-20 → 2026-05-27)**
- [ ] Add `plan` column to `profiles` (migration 10)
- [ ] Stripe Checkout integration + webhook → update `plan` on `profiles`
- [ ] Quota middleware on generator routes
- [ ] Rate limiting on `/api/generate/*`
- [ ] Onboarding decision (enforce or delete)
- [ ] RAG chatbot decision (wire up or remove)

**Week 3 (2026-05-27 → 2026-05-31)**
- [ ] Deploy to Vercel staging, full QA pass
- [ ] Configure custom SMTP for Supabase
- [ ] Production deploy
- [ ] Pricing page → real checkout links
- [ ] Launch
