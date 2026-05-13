# Feedback System

Two channels, both writing to Supabase under RLS so users only see their own rows but you (service role / SQL editor) see everything.

---

## Channels

### 1. `generation_feedback` — per-output 👍/👎

Inline widget at the bottom of every notes / lesson plan / assessment detail page **and** at the bottom of the immediate result pages (`/results`, `/generator/notes/result`). The widget shows:

- Thumbs up / down
- Reason chips (pre-defined per direction)
- Optional one-line note

Re-rating overwrites (unique on `user_id, generation_id`). Result pages save without `generation_id` since the generation isn't persisted yet — that's by design; we still capture the rating + reasons + context.

Schema highlights:

```sql
generation_feedback (
  user_id, generation_type, generation_id, rating (-1|+1),
  reasons text[], note text, context jsonb, created_at
)
```

### 2. `feedback` — general (bug / suggestion / praise / question / app rating / prompt response)

- Avatar dropdown → **Send feedback**
- Periodic toast prompts (handled by `<FeedbackPrompts>`)

`kind` distinguishes message type. `rating` (1–5) is set only for `app_rating` rows.

Schema highlights:

```sql
feedback (
  user_id, kind, message, rating (1-5 for app_rating),
  reasons text[], page_path, user_agent, context jsonb,
  status (new|triaged|in_progress|shipped|declined),
  created_at
)
```

---

## Periodic prompts

`<FeedbackPrompts>` is mounted in the protected layout (so marketing pages stay quiet). On mount:

- Waits 60 seconds after page load
- 60% of the time → contextual question toast (rotates through 4 prompts)
- 40% of the time (if eligible) → app-rating toast

Cool-down rules (`localStorage`):
- ≥ 5 days between any prompts
- ≥ 14 days between app-rating prompts
- After 2 dismissals → back off for 14 days

Update the question rotation in `components/feedback/feedback-prompts.tsx` (`QUESTIONS` array).

---

## SQL queries you'll actually use

### Top-level health

```sql
-- Thumbs ratio per generation type (last 30 days)
SELECT
  generation_type,
  count(*) FILTER (WHERE rating =  1) AS thumbs_up,
  count(*) FILTER (WHERE rating = -1) AS thumbs_down,
  round(100.0 * count(*) FILTER (WHERE rating = 1) / nullif(count(*), 0), 1) AS pct_positive
FROM generation_feedback
WHERE created_at >= now() - interval '30 days'
GROUP BY generation_type
ORDER BY generation_type;

-- App-rating distribution (last 30 days)
SELECT rating, count(*) FROM feedback
WHERE kind = 'app_rating' AND created_at >= now() - interval '30 days'
GROUP BY rating ORDER BY rating DESC;
```

### Pinpoint quality issues

```sql
-- Subjects with the lowest 👍 rate (notes / lesson plans / assessments)
SELECT
  context->>'subject' AS subject,
  generation_type,
  count(*) AS total_ratings,
  count(*) FILTER (WHERE rating = -1) AS thumbs_down,
  round(100.0 * count(*) FILTER (WHERE rating = 1) / nullif(count(*), 0), 1) AS pct_positive
FROM generation_feedback
WHERE created_at >= now() - interval '60 days'
  AND context ? 'subject'
GROUP BY 1, 2
HAVING count(*) >= 5
ORDER BY pct_positive ASC NULLS LAST
LIMIT 20;

-- Most common 👎 reasons
SELECT
  generation_type,
  unnest(reasons) AS reason,
  count(*) AS n
FROM generation_feedback
WHERE rating = -1
GROUP BY 1, 2
ORDER BY n DESC
LIMIT 20;

-- 👎 notes/plans with free-text comments (the most actionable feedback)
SELECT
  user_id, generation_type, context, reasons, note, created_at
FROM generation_feedback
WHERE rating = -1 AND note IS NOT NULL AND length(trim(note)) > 0
ORDER BY created_at DESC
LIMIT 50;
```

### General feedback triage

```sql
-- New stuff to triage
SELECT id, kind, rating, left(message, 200) AS preview, page_path, created_at
FROM feedback
WHERE status = 'new'
ORDER BY created_at DESC
LIMIT 50;

-- Bugs in the last week
SELECT id, user_id, left(message, 300) AS preview, page_path, user_agent, created_at
FROM feedback
WHERE kind = 'bug' AND created_at >= now() - interval '7 days'
ORDER BY created_at DESC;

-- Feature wish-list aggregated (rough)
SELECT id, left(message, 300) AS preview, created_at
FROM feedback
WHERE kind = 'suggestion' AND status IN ('new', 'triaged')
ORDER BY created_at DESC;

-- Promoters / detractors (NPS-style 1-5 mapping)
SELECT
  CASE
    WHEN rating >= 4 THEN 'promoter'
    WHEN rating  = 3 THEN 'passive'
    ELSE                  'detractor'
  END AS segment,
  count(*) AS n
FROM feedback
WHERE kind = 'app_rating'
  AND rating IS NOT NULL
  AND created_at >= now() - interval '60 days'
GROUP BY 1
ORDER BY 1;
```

### Update status as you work through feedback

```sql
-- Mark a feedback row as in progress / shipped / declined
UPDATE feedback SET status = 'shipped'  WHERE id = '...';
UPDATE feedback SET status = 'in_progress' WHERE id = '...';
UPDATE feedback SET status = 'declined' WHERE id = '...';
```

---

## What's deliberately NOT here (yet)

- **In-app admin view.** You read via Supabase SQL Editor. If you want a `/admin/feedback` page inside PressClass, ask and I'll build it — it's straightforward now that the data is structured.
- **Anonymous feedback.** All feedback is tied to `user_id` so you can follow up. Public/unauthenticated feedback would need an additional endpoint and a captcha.
- **Email digest of new feedback.** Once Paystack lands, the same email infra can email you a weekly digest.
- **Behavioral telemetry (Layer 3).** Events like `generation.created`, `pdf.downloaded`, `generation.edited` aren't yet captured. That's the natural follow-up — tells you *how* people use the app without asking.

---

## Files added

| File | Role |
|---|---|
| `supabase/migrations/12_feedback.sql` | Both tables + RLS + indexes |
| `actions/feedback.ts` | `submitGenerationFeedback`, `submitFeedback`, `submitAppRating` |
| `components/feedback/generation-feedback.tsx` | Inline 👍/👎 widget |
| `components/feedback/feedback-dialog.tsx` | Reusable feedback form (kind chooser, reason chips, etc.) |
| `components/feedback/app-rating-dialog.tsx` | 1–5 stars + reasons |
| `components/feedback/feedback-prompts.tsx` | Periodic-prompt manager (toasts) |

Mounted in:
- `app/(protected)/layout.tsx` (FeedbackPrompts)
- `components/layout/header.tsx` (avatar menu → Send feedback)
- `components/note-detail.tsx`, `lesson-plan-detail.tsx`, `assessments/assessment-detail.tsx` (inline rating)
- `app/(protected)/results/page.tsx`, `app/(protected)/generator/notes/result/page.tsx` (inline rating)
