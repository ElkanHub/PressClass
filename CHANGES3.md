# PressClass — Changes Log (Pass 3)

**Date:** 2026-05-13
**Theme:** Marketing pages rebuilt for SEO, performance, and conversion.

The old `/`, `/about`, `/features`, `/pricing`, `/faqs` were a `"use client"` landing page with hand-rolled components and inconsistent visual language. This pass moves them into a proper `(marketing)` route group with shared chrome, server-rendered everything, full SEO plumbing, and conversion-focused copy.

---

## 1. New route structure

```
app/
├── (marketing)/
│   ├── layout.tsx          # shared nav + footer + metadata
│   ├── page.tsx            # /  (landing)
│   ├── about/page.tsx      # /about
│   ├── features/page.tsx   # /features
│   ├── pricing/page.tsx    # /pricing
│   └── faqs/page.tsx       # /faqs
├── sitemap.ts              # generated /sitemap.xml
└── robots.ts               # generated /robots.txt
```

The `(marketing)` group keeps URLs flat (`/about` not `/marketing/about`) while sharing a layout with the marketing nav and footer.

**Removed**: `app/page.tsx`, `app/about/`, `app/features/`, `app/pricing/`, `app/faqs/`, all of `components/landing/` (replaced by `components/marketing/`).

---

## 2. Shared chrome

- `components/marketing/nav.tsx` — sticky top nav. Mobile sheet menu, active link highlighting, sign-in + Get-started CTAs. Single client island; nothing else on the page needs JS.
- `components/marketing/footer.tsx` — 4-column footer (brand, Product, Company, Get started), copyright row.
- `app/(marketing)/layout.tsx` — wraps everything, sets default OG / Twitter metadata, declares `robots: { index: true, follow: true }`.

---

## 3. Performance posture

- **Everything except the nav is a Server Component.** No hydration cost on the marketing flow except for the small mobile menu state in the navbar.
- **No image-heavy hero.** Hero preview is rendered with CSS — zero network cost.
- **Single font (Geist), `display: swap`** — no FOIT, fast LCP.
- **Inline accordions via `<details>`/`<summary>`** — no JS, no accordion library.
- **No third-party scripts.** No analytics or chat widgets added.

---

## 4. SEO

### Files
- `app/sitemap.ts` — emits a proper `sitemap.xml` covering /, /features, /pricing, /about, /faqs, /auth/login, /auth/signup with priorities and change frequencies.
- `app/robots.ts` — `Allow: /` for all, explicitly `Disallow:` every protected app route and `/api`. Points at the sitemap.
- `lib/seo.ts` — single source of truth for `siteUrl`, reading `NEXT_PUBLIC_SITE_URL` (falling back to `VERCEL_URL`, then localhost).

### Per-page
Every marketing page exports its own `metadata` with:
- Page-specific `title` (rendered via root template `%s · PressClass`)
- Page-specific `description`
- Canonical URL via `alternates.canonical`

### Structured data (JSON-LD)
- Landing page injects **SoftwareApplication** schema (audience: teacher; offer: free 25 credits).
- FAQ page injects **FAQPage** schema covering every Q&A on the page.
Both rendered server-side, so Google sees them on first paint.

### Root layout
- `metadataBase` now wired to `siteUrl`
- Keywords array tuned for African-curriculum search terms (GES, SBC, WAEC, NECO, KNEC)
- Proper `viewport` exported separately (Next.js 15 convention)

---

## 5. Conversion structure

Each marketing page has a clear funnel into `/auth/signup`.

### Landing (`/`)
1. **Hero** — punchy headline, sub-headline emphasizing African teachers + credit-only billing, two CTAs (primary: Get 25 free credits; secondary: See how it works), credibility line ("No credit card. 90-second setup.")
2. **Hero preview** — CSS mockup of generator output with credit-cost chip
3. **Trust strip** — 4 reasons to trust (Africa-first, seconds-to-draft, refund-on-failure, starts at GHS 5)
4. **Features** — 3 tools with bullets
5. **How it works** — 3 steps
6. **Curriculum note** — direct address of "trained on African curricula"
7. **Pricing teaser** — 4 trust bullets + cost-per-output card
8. **FAQ teaser** — 4 most-asked, linking to /faqs
9. **Final CTA** — solid primary-color CTA box

### Pricing (`/pricing`)
- Server-side **currency detection** via `x-vercel-ip-country` / `cf-ipcountry` headers; falls back to USD.
- Loads packages + per-currency prices live from Supabase (so price changes never require a deploy).
- "Most popular" highlight on the `popular` pack.
- Trust bullets section: no subscription, refund on failure, credits never expire, local currency support.
- Pricing-specific FAQ.

### Features (`/features`)
- Detailed deep-dive on each of the 3 generation tools, alternating left/right with mockup cards.
- "More than just generation" grid of 6 supporting features (brand colors, branded vs plain PDF, inline edit, refund on slip, curriculum awareness, speed).
- Workflow recap.

### About (`/about`)
- Mission statement, story copy, three beliefs (respect teachers, Africa-first, pay-for-output).
- Single CTA at the bottom.

### FAQs (`/faqs`)
- Grouped into 5 sections (Getting started, Credits & pricing, Generation quality, PDF exports, Account & data).
- JSON-LD FAQPage schema for rich snippets.
- Native `<details>` so it works without JS.

---

## 6. Copy positioning

Every page hammers the same core messages:

- **Africa first** — not Africa as an afterthought. Curriculum-aware (GES/SBC, WAEC, NECO, KNEC, IGCSE).
- **Pay only for output** — 25 free credits to start. No subscription. Refunded on failure.
- **Fast** — lesson plan in ~15s. Assessment in ~20s.
- **Branded** — your school colors on the PDF, or plain B&W. Your call at download time.

CTAs are consistent: primary points to `/auth/signup`, secondary to `/features` or `/pricing`.

---

## 7. Verified

- `npx tsc --noEmit` — clean.

---

## 8. Files touched

**Added**
- `app/(marketing)/layout.tsx`
- `app/(marketing)/page.tsx`
- `app/(marketing)/about/page.tsx`
- `app/(marketing)/features/page.tsx`
- `app/(marketing)/pricing/page.tsx`
- `app/(marketing)/faqs/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `components/marketing/nav.tsx`
- `components/marketing/footer.tsx`
- `lib/seo.ts`
- `CHANGES3.md`

**Modified**
- `app/layout.tsx` (metadataBase, default metadata, keywords, viewport export)
- `.env.example` (added `NEXT_PUBLIC_SITE_URL`)

**Removed**
- `app/page.tsx` (root landing — replaced by `(marketing)/page.tsx`)
- `app/about/`, `app/features/`, `app/pricing/`, `app/faqs/`
- `components/landing/` (all 9 files — replaced by `components/marketing/` + inline server components)

---

## 9. To configure before deploy

- Set `NEXT_PUBLIC_SITE_URL` to the production domain (e.g. `https://pressclass.app`). Without it, sitemap URLs use `VERCEL_URL` or `localhost`.
- On Vercel: header-based currency detection on `/pricing` works automatically via `x-vercel-ip-country`. On Cloudflare, `cf-ipcountry` is used. Elsewhere, falls back to USD — fine.
- Create an OG image at `/public/og.png` (1200×630) for nicer social shares. Optional but recommended.
