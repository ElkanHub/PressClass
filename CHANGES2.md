# PressClass — Changes Log (Pass 2)

**Date:** 2026-05-13
**Theme:** Teacher-only product. New design system. Brand-aware PDF system. Generator UX hardened.

This pass moves the app from a generic vibe-coded look to a coherent, production-shaped UI, removes the student/regular paths, captures each teacher's current school + brand colors, and rebuilds PDF generation around those colors with a branded/unbranded choice at download time.

---

## 1. Teacher-only product

- Deleted `app/auth/signup/{student,regular,school,teacher}/` — role chooser is gone.
- `app/auth/signup/page.tsx` is now a single, polished teacher signup form (split layout, marketing panel, 8-char password minimum, redirects to `/onboarding`).
- DB default for `profiles.user_type` is now `'teacher'` (migration 11). Existing rows untouched.
- Onboarding copy is teacher-first throughout — no more "what do you study?" branch.

---

## 2. New schema — migration 11

`supabase/migrations/11_school_and_brand_colors.sql` (applied to live DB):

```
ALTER TABLE profiles ADD COLUMN current_school   TEXT;
ALTER TABLE profiles ADD COLUMN school_color     TEXT;  -- hex
ALTER TABLE profiles ADD COLUMN personal_color   TEXT;  -- hex
ALTER TABLE profiles ALTER COLUMN user_type SET DEFAULT 'teacher';
-- + CHECK constraints validating hex format
```

---

## 3. Onboarding gains two new steps

`app/onboarding/wizard.tsx` now runs **9 steps** instead of 7:

1. Welcome
2. Identity (name, country, phone)
3. **🆕 School** — name of their current school (required; appears on PDF footer)
4. **🆕 Colors** — two color pickers (school + personal) with curated swatch grid, custom hex fallback, and a live "Sample Lesson Plan" preview that previews their actual brand
5. Subjects + class levels
6. Experience
7. Primary use case
8. Referral source + marketing opt-in
9. Done — credits granted

The picker uses `components/ui/color-picker.tsx` (swatches + native `<input type=color>` fallback) and curated palettes from `lib/brand.ts`.

`actions/onboarding.ts` was extended to persist `current_school`, `school_color`, `personal_color` (validated server-side against the same hex regex as the DB CHECK).

---

## 4. Brand palette + PDF system

### `lib/brand.ts`

A small color utility that turns two hex values (school + personal) into a 9-color `BrandPalette` (primary, primarySoft, primaryInk, accent, accentSoft, text, muted, border, paper). Falls back to sensible defaults if either color is missing or invalid. Used by the PDF templates and the in-app onboarding preview.

### `lib/pdf/`

Complete rebuild — no more `html2canvas` screenshots, which produced fuzzy, non-selectable PDFs. Pure jsPDF for:
- Selectable text
- Proper page breaks
- Smaller file size
- Real headers, footers, page numbers

Structure:
- `lib/pdf/draw.ts` — low-level primitives: `drawDocumentTitle`, `drawSectionHeading`, `drawParagraph`, `drawBulletList`, `drawCallout`, `drawMetaBlock`, `ensureSpace`, page chrome (branded header bar + accent stripe + footer with teacher name and school).
- `lib/pdf/templates.ts` — three template functions: `renderNotes`, `renderLessonPlan`, `renderAssessment`. Each draws using only the primitives above (DRY).
- `lib/pdf/index.ts` — public `downloadPdf({ kind, data }, { branded, teacher })`. One entry point for the whole app.

### `components/pdf-download-button.tsx`

Reusable button that:
1. Opens a small dialog with two visual cards (Branded / Plain) — each shows a mini-preview of how the PDF will actually look.
2. Defaults to **Branded**.
3. Loads the teacher's colors from the profile via `useTeacherBrand()`.
4. Calls `downloadPdf()` and toasts success/failure.

If the user hasn't set colors, the dialog still works — defaults kick in and a friendly hint nudges them to add colors in onboarding.

### `hooks/use-teacher-brand.ts`

Client hook that fetches the teacher's name, school, and brand colors once for the session.

### Audit of old PDF code (now removed)

- `components/note-detail.tsx` — removed `html2canvas` + `jsPDF` import and `handleDownloadPDF` (replaced with `<PdfDownloadButton ...>`).
- `components/lesson-plan-detail.tsx` — same.
- `components/assessments/assessment-detail.tsx` — replaced hand-rolled jsPDF code with `<PdfDownloadButton kind="assessment" includeAnswers={showAnswers} />`.
- `app/(protected)/results/page.tsx` — full rebuild with new layout + `<PdfDownloadButton>`.
- `app/(protected)/generator/notes/result/page.tsx` — full rebuild with new layout + `<PdfDownloadButton>`. No more "Print" button (per direction: PDF-only).

**Print buttons removed everywhere.** Only PDF download remains.

---

## 5. UI primitive layer (the DRY foundation)

Every revamped page composes from this small set. Add a primitive here once, every page benefits.

| Primitive | Purpose |
|---|---|
| `components/ui/page-shell.tsx` — `PageShell` | Standard page header (title, description, actions) + spacing. |
| `components/ui/page-shell.tsx` — `Section` | Section heading (title, description, actions) used inside pages. |
| `components/ui/stat-card.tsx` | KPI tile (label, value, hint, icon, optional link, "primary" tone). |
| `components/ui/empty-state.tsx` | Dashed-border empty zone with icon, message, primary action. |
| `components/ui/item-card.tsx` | List row card (title, subtitle, badge, meta strip, optional footer actions). |
| `components/ui/color-picker.tsx` | Swatch grid + custom hex. |

---

## 6. Revamped pages

Each now uses the primitives above for a consistent visual language — no more page-by-page styling improvisation. Gradient-text titles, ad-hoc cards and inconsistent paddings are gone.

| Page | What changed |
|---|---|
| `app/(protected)/dashboard/page.tsx` | Personal welcome ("Welcome back, Ama. Teaching at Accra Academy."). 4 stat cards (Credits is primary-toned and clickable). 3 sections (lesson plans / notes / assessments) with proper empty states. Removed gradient-text headline. |
| `app/(protected)/generator/page.tsx` | Three tool cards with credit-cost chips, feature bullets, and consistent hover. |
| `app/(protected)/notes/page.tsx` | Subject groupings via `Section` + uniform `ItemCard` grid. Real empty state. |
| `app/(protected)/lesson-plans/page.tsx` | Same pattern. |
| `app/(protected)/assessments/page.tsx` | Same pattern. |
| `app/(protected)/results/page.tsx` | Built on `PageShell`. PDF-only export with branded toggle. Print button removed. |
| `app/(protected)/generator/notes/result/page.tsx` | `PageShell`-based; detail block + sections; PDF-only export with branded toggle. |
| `app/auth/signup/page.tsx` | Split-screen marketing + form layout, no more role chooser. |

The three generator forms (assessment, lesson plan, notes) keep their existing form layouts in this pass — they're functional and well-validated; revamping their form chrome is a low-impact follow-up.

---

## 7. Generator error UX — proper 402 handling

### `lib/api/generate-client.ts`

New shared client with:
- `callGenerate(endpoint, body)` — typed fetch wrapper that throws `GenerateApiError` with `code` + `status`.
- `reportGenerateError(err)` — toasts the right message per code, including an actionable "Top up" CTA when credits are exhausted.

Wired into:
- `components/assessment-form.tsx`
- `components/lesson-plan-form.tsx`
- `app/(protected)/generator/notes/page.tsx`
- `components/note-detail.tsx` ("Generate Assessment from notes")
- `components/lesson-plan-detail.tsx` ("Generate Assessment from plan")

What users see now instead of "Something went wrong":
- 402 → toast: "You're out of credits — Top up" (with click-to-credits action)
- 429 → "Generating too quickly. Wait a moment."
- AI provider or parse error → "We refunded your credits, try again."
- Network → "Couldn't reach the server."

---

## 8. Verified

- `npx tsc --noEmit` — clean (no errors)
- Migrations 11 applied to live DB via the management API
- All credit operations remain race-free + idempotent (no changes to migration 10)

---

## 9. What's still pending (deferred — see CHANGES.md §8 too)

These are unchanged from pass 1, listed for clarity:

1. **Paystack / Flutterwave wiring** — credit-purchase plumbing complete; needs API keys to finish the checkout + webhook.
2. **PWA** — manifest, icons, service worker. Recommended to land after payments are live.
3. **RAG chatbot decision** — still in limbo (built, not wired up).
4. **Generator form visual polish** — functional, but the form chrome still has gradient titles. Low priority.
5. **Type-generation for Supabase tables** — currently the admin client is `any`-typed; running `supabase gen types typescript` would give real autocomplete and catch schema drift at compile time.

---

## 10. Files touched this pass

**Added**
- `supabase/migrations/11_school_and_brand_colors.sql`
- `lib/brand.ts`
- `lib/pdf/draw.ts`
- `lib/pdf/templates.ts`
- `lib/pdf/index.ts`
- `lib/api/generate-client.ts`
- `hooks/use-teacher-brand.ts`
- `components/ui/page-shell.tsx`
- `components/ui/stat-card.tsx`
- `components/ui/empty-state.tsx`
- `components/ui/item-card.tsx`
- `components/ui/color-picker.tsx`
- `components/pdf-download-button.tsx`
- `CHANGES2.md`

**Modified**
- `app/auth/signup/page.tsx` (rewritten)
- `app/onboarding/wizard.tsx` (added school + colors steps)
- `actions/onboarding.ts` (persist new profile fields)
- `app/(protected)/dashboard/page.tsx` (rewritten)
- `app/(protected)/generator/page.tsx` (rewritten)
- `app/(protected)/notes/page.tsx` (rewritten)
- `app/(protected)/lesson-plans/page.tsx` (rewritten)
- `app/(protected)/assessments/page.tsx` (rewritten)
- `app/(protected)/results/page.tsx` (rewritten)
- `app/(protected)/generator/notes/result/page.tsx` (rewritten)
- `app/(protected)/generator/notes/page.tsx` (error handling)
- `components/assessment-form.tsx` (error handling)
- `components/lesson-plan-form.tsx` (error handling)
- `components/note-detail.tsx` (PDF + error handling)
- `components/lesson-plan-detail.tsx` (PDF + error handling)
- `components/assessments/assessment-detail.tsx` (PDF)
- `lib/supabase/admin.ts` (untyped client clarification)

**Removed**
- `app/auth/signup/student/`
- `app/auth/signup/regular/`
- `app/auth/signup/school/`
- `app/auth/signup/teacher/`
